/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const sendBtn = document.getElementById("sendBtn");

/*
  System prompt:
  - Keeps the chatbot focused on L'Oreal topics.
  - Politely refuses unrelated topics.
*/
const SYSTEM_PROMPT = `You are the L'Oreal Beauty Assistant.

Only answer questions about L'Oreal products, routines, beauty recommendations, ingredient basics, and beauty-related topics.
If a question is unrelated, politely refuse in one sentence and redirect the user to ask about L'Oreal beauty topics.
Keep answers clear, concise, and beginner-friendly.
When helpful, suggest product categories (for example: cleanser, serum, moisturizer, sunscreen, shampoo, conditioner, styling product, lipstick).
Do not invent medical claims or guaranteed outcomes.`;

// Conversation history for natural multi-turn chat.
const conversationHistory = [];

appendMessage(
  "assistant",
  "Hello! I can help with L'Oreal skincare, makeup, haircare, and routines. What are your beauty goals?",
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  latestQuestion.textContent = `Latest question: ${question}`;
  appendMessage("user", question);
  userInput.value = "";
  sendBtn.disabled = true;

  try {
    // Add the latest user message to history.
    conversationHistory.push({ role: "user", content: question });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
    ];

    const data = await getChatCompletion(messages);
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("No assistant message found in API response.");
    }

    appendMessage("assistant", answer);
    conversationHistory.push({ role: "assistant", content: answer });
  } catch (error) {
    appendMessage(
      "assistant",
      "Sorry, I couldn't get a response right now. Please check your API key or Cloudflare Worker URL and try again.",
    );
    console.error("Chat error:", error);
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
});

function appendMessage(role, text) {
  const messageElement = document.createElement("div");
  messageElement.className = role === "user" ? "msg user" : "msg ai";
  messageElement.textContent = text;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getChatCompletion(messages) {
  // Recommended mode: send requests to your Cloudflare Worker.
  if (window.CLOUDFLARE_WORKER_URL) {
    const response = await fetch(window.CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Worker request failed: ${response.status}`);
    }

    return await response.json();
  }

  // Temporary fallback mode for local testing only.
  if (window.OPENAI_API_KEY) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    return await response.json();
  }

  throw new Error(
    "Missing configuration. Add CLOUDFLARE_WORKER_URL (recommended) or OPENAI_API_KEY in secrets.js.",
  );
}
