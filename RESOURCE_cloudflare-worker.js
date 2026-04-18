// Copy this code into your Cloudflare Worker script
// This version uses addEventListener style to stay beginner-friendly.

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // Cloudflare secret binding (create secret named OPENAI_API_KEY).
  const apiKey = OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing OPENAI_API_KEY secret" }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (!payload.messages || !Array.isArray(payload.messages)) {
    return new Response(
      JSON.stringify({ error: "Body must include messages array" }),
      {
        status: 400,
        headers: corsHeaders,
      },
    );
  }

  const openAIResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: payload.messages,
        max_completion_tokens: 300,
      }),
    },
  );

  const data = await openAIResponse.json();

  return new Response(JSON.stringify(data), {
    status: openAIResponse.status,
    headers: corsHeaders,
  });
}
