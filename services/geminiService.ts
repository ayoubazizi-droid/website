import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductAssistantResponse = async (
  history: { role: string; text: string }[],
  currentProduct: Product | null,
  userMessage: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "I'm sorry, I can't connect to my olfactory sensors right now (Missing API Key).";

  const productContext = currentProduct
    ? `The user is currently examining the fragrance "${currentProduct.name}". 
       Price: $${currentProduct.price}. 
       Notes: ${currentProduct.notes}.
       Description: ${currentProduct.description}.`
    : "The user is browsing the main fragrance collection.";

  const systemInstruction = `You are "EssenceBot", a world-class perfume sommelier for a luxury digital boutique called Luxe Essence. 
  Your tone is elegant, sophisticated, and sensory-focused. Use vocabulary related to scent, memory, and emotion.
  Keep answers concise (under 100 words) unless asked for detailed notes.
  ${productContext}
  If the user asks about the perfume, describe its notes and the mood it evokes.
  If the user asks about pricing, mention it is in "USD".
  `;

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "The scent trail has faded. I could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My connection to the fragrance database is momentarily interrupted.";
  }
};