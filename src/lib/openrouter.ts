import { Message } from "../types/chatbot";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FALLBACK_MODEL_CHAIN = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-32b:free",
  "qwen/qwen3-coder:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  // Backup models in case of typos/deprecations on the free API tier
  "qwen/qwen-2.5-72b-instruct:free",
  "qwen/qwen-2.5-coder-32b:free",
  "google/gemma-2-9b-it:free",
];

export async function getOpenRouterChatResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY is not defined. Falling back to local offline responses.");
    // Return mock response based on latest message
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
    if (lastUserMsg.includes("haircut") || lastUserMsg.includes("style")) {
      return "Hi there! I would highly recommend a textured crop or a soft fade for a clean modern look. Since you are looking at haircut styles, would you like to book a slot with our expert stylist Preethi? Click the 'Book Appointment' option at the top to secure your time!";
    }
    if (lastUserMsg.includes("color") || lastUserMsg.includes("dye")) {
      return "For hair colors, we recommend warm honey highlights or rich mocha tones that look natural and premium. We use top quality organic dyes. Let's get you set up for a personal style mapping session. Click 'Book Appointment' to confirm your slot!";
    }
    return "Welcome! I'm SalonSense AI, your personal stylist at Binary Brains. I can suggest custom haircuts, beard grooming shapes, and premium skincare therapies tailored for you. To experience our expert care, feel free to book a direct appointment with our team!";
  }

  // Prepend preferred model from environment variables if defined
  const preferredModel = process.env.OPENROUTER_MODEL;
  const modelsToTry = preferredModel
    ? [preferredModel, ...FALLBACK_MODEL_CHAIN]
    : FALLBACK_MODEL_CHAIN;

  let lastError: any = null;

  for (const currentModel of modelsToTry) {
    try {
      console.log(`[SalonSense AI] Attempting completions query with model: ${currentModel}`);
      
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://binarybrains-familysalon.com",
          "X-Title": "Binary Brains SalonSense AI",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: messages,
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[SalonSense AI] Model ${currentModel} returned status ${response.status}`, errorData);
        lastError = new Error(`OpenRouter API error: ${response.status} using model ${currentModel}`);
        continue; // Try next model in chain
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) {
        console.warn(`[SalonSense AI] Model ${currentModel} returned empty or invalid choices list`);
        lastError = new Error(`Invalid response format from model ${currentModel}`);
        continue; // Try next model in chain
      }

      console.log(`[SalonSense AI] Success generating response using model: ${currentModel}`);
      return reply;
    } catch (error) {
      console.warn(`[SalonSense AI] Exception during fetch call using model ${currentModel}:`, error);
      lastError = error;
      // Continue to next model in chain
    }
  }

  // If we exhaust all models in the fallback chain
  console.error("[SalonSense AI] All models in the fallback chain failed.");
  throw lastError || new Error("Failed to generate response from OpenRouter API.");
}
