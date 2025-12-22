import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userImageBase64, color, size, customPrompt } = await req.json();

    if (!userImageBase64) {
      return new Response(
        JSON.stringify({ error: 'User image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
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

    const colorDesc = colorDescriptions[color] || color.toLowerCase();

    const prompt = `Transform this person's photo to show them wearing a ${colorDesc} colored t-shirt with a small black Labrador dog embroidered logo on the upper left chest area. The t-shirt should be a casual crew-neck style, size ${size}. ${customPrompt ? customPrompt : 'Keep the person in the same pose and setting, but change their top to this t-shirt.'} The image should look natural and realistic, like a professional product photo. The black Labrador logo should be small and subtle, positioned on the upper left chest.`;

    console.log('Generating image with prompt:', prompt);

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
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!generatedImageUrl) {
      console.error('No image in response:', JSON.stringify(data));
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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
