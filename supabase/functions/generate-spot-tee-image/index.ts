import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid options for validation
const VALID_COLORS = [
  'White', 'Coral', 'Mauve', 'Sunset', 'Tan', 'Army',
  'Dark Heather', 'Olive', 'Ice Blue', 'Blue Jean', 'Grey',
  'Sky', 'Brown Savana', 'Espresso', 'Black', 'Navy',
  'Pink', 'Peachy', 'Red'
];
const VALID_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const MAX_BASE64_SIZE = 14000000; // ~10MB as base64
const MAX_PROMPT_LENGTH = 500;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Auth verification failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Validate Content-Type
    const contentType = req.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userImageBase64, color, size, customPrompt } = await req.json();

    // Validate required image field
    if (!userImageBase64) {
      return new Response(
        JSON.stringify({ error: 'User image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 image format
    if (typeof userImageBase64 !== 'string' || !userImageBase64.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({ error: 'Invalid image format. Must be a base64 data URL.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 image size (prevent DoS)
    if (userImageBase64.length > MAX_BASE64_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Image too large. Maximum 10MB allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate color parameter
    if (!color || typeof color !== 'string' || !VALID_COLORS.includes(color)) {
      return new Response(
        JSON.stringify({ error: `Invalid color. Must be one of: ${VALID_COLORS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate size parameter
    if (!size || typeof size !== 'string' || !VALID_SIZES.includes(size)) {
      return new Response(
        JSON.stringify({ error: `Invalid size. Must be one of: ${VALID_SIZES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize custom prompt
    let sanitizedPrompt = '';
    if (customPrompt) {
      if (typeof customPrompt !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Custom prompt must be a string' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (customPrompt.length > MAX_PROMPT_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Custom prompt must be less than ${MAX_PROMPT_LENGTH} characters` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Remove potentially harmful characters
      sanitizedPrompt = customPrompt.replace(/[<>\"'`\\]/g, '').trim();
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('Service configuration error');
    }

    const colorDescriptions: Record<string, string> = {
      'White': 'pure white',
      'Coral': 'coral orange',
      'Mauve': 'soft mauve pink',
      'Sunset': 'warm sunset orange',
      'Tan': 'light tan beige',
      'Army': 'army green olive',
      'Dark Heather': 'dark heather charcoal gray',
      'Olive': 'olive green',
      'Ice Blue': 'light ice blue',
      'Blue Jean': 'faded blue jean denim blue',
      'Grey': 'medium grey',
      'Sky': 'light sky blue',
      'Brown Savana': 'brown savana earthy brown',
      'Espresso': 'dark espresso brown',
      'Black': 'solid black',
      'Navy': 'navy blue',
      'Pink': 'soft pink',
      'Peachy': 'peachy coral pink',
      'Red': 'vibrant red',
    };

    const colorDesc = colorDescriptions[color];
    const defaultPromptSuffix = 'Keep the person in the same pose and setting, but change their top to this t-shirt.';
    
    const prompt = `Transform this person's photo to show them wearing a ${colorDesc} colored t-shirt with a small black Labrador dog embroidered logo on the upper left chest area. The t-shirt should be a casual crew-neck style, size ${size}. ${sanitizedPrompt || defaultPromptSuffix} The image should look natural and realistic, like a professional product photo. The black Labrador logo should be small and subtle, positioned on the upper left chest.`;

    console.log('Generating image for color:', color, 'size:', size);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: userImageBase64
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI service error');
    }

    const data = await response.json();
    console.log('AI response received successfully');

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!generatedImageUrl) {
      console.error('No image in response');
      throw new Error('Failed to generate image');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: generatedImageUrl,
        message: textContent || 'Image generated successfully!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-spot-tee-image:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while generating the image. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
