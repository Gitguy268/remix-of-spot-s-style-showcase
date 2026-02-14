import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HTML escape function to prevent injection attacks
const escapeHtml = (str: string): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (match) => htmlEntities[match] || match);
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const IP_RATE_LIMIT = 5; // Max requests per IP per window
const EMAIL_RATE_LIMIT = 3; // Max requests per email per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

const isRateLimited = (key: string, limit: number): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= limit) {
    return true;
  }
  
  entry.count++;
  return false;
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Spam protection
  turnstileToken?: string; // Cloudflare Turnstile token
}

// Verify Turnstile token with Cloudflare
const verifyTurnstileToken = async (token: string, ip: string): Promise<boolean> => {
  const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check IP rate limit
    if (isRateLimited(`ip:${clientIp}`, IP_RATE_LIMIT)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get("resend");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Unable to send message. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const body: ContactRequest = await req.json();
    const { name, email, subject, message, honeypot, turnstileToken } = body;

    // Honeypot spam check - if filled, it's a bot
    if (honeypot) {
      console.log("Honeypot triggered - spam detected");
      // Return success to not alert the bot
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Verification required. Please complete the CAPTCHA." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isValidToken) {
      console.warn(`Invalid Turnstile token from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ success: false, error: "Verification failed. Please try again." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Server-side validation
    if (!name || name.length < 1 || name.length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide a valid name." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide a valid email address." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check email-based rate limit (prevents abuse from same sender)
    const normalizedEmail = email.toLowerCase().trim();
    if (isRateLimited(`email:${normalizedEmail}`, EMAIL_RATE_LIMIT)) {
      console.warn(`Email rate limit exceeded for: ${normalizedEmail}`);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests from this email. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    if (!subject || subject.length < 1 || subject.length > 200) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide a valid subject." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    if (!message || message.length < 10 || message.length > 1000) {
      return new Response(
        JSON.stringify({ success: false, error: "Message must be between 10 and 1000 characters." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape all user inputs to prevent HTML injection
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // Send email to site owner
    const ownerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Blacklabspotsshop <onboarding@resend.dev>",
        to: ["hitlijsten_demping_7b@icloud.com"],
        reply_to: email,
        subject: `[Contact Form] ${safeSubject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${safeSubject}</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Message:</h3>
              <p style="white-space: pre-wrap; color: #333;">${safeMessage}</p>
            </div>
            
            <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
              This email was sent from the Blacklabspotsshop contact form.
            </p>
          </div>
        `,
      }),
    });

    if (!ownerEmailResponse.ok) {
      const errorData = await ownerEmailResponse.json();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ success: false, error: "Unable to send message. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Contact email sent successfully to owner");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Unable to send message. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
