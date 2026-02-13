
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export async function generateHeadshot(base64Image: string, stylePrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: `Please transform this casual photo into a professional headshot. Use the following style description: ${stylePrompt}. 
            
            IMPORTANT:
            - Maintain the person's exact facial features and likeness (identity preservation is critical).
            - Upgrade clothing, lighting, and background to look like a high-end studio photo (8k resolution, photorealistic).
            - Ensure natural skin texture (avoid plastic/smooth skin).
            - NO cartoons, NO illustrations, NO distorted features, NO artifacts.
            - Only return the image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    handleGeminiError(error);
  }

  throw new Error("No image data returned from Gemini");
}

export async function editHeadshot(base64Image: string, editPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: `Based on this professional headshot, perform the following modification: ${editPrompt}. Ensure the person's facial likeness remains consistent. Only return the modified image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    handleGeminiError(error);
  }

  throw new Error("No image data returned from Gemini");
}

function handleGeminiError(error: any): never {
  console.error("Gemini API Error Detail:", error);
  const errorMessage = error?.message || String(error);

  if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
    if (errorMessage.includes('limit: 0')) {
      throw new Error("Model Availability Error: This specific AI model (Gemini 2.5 Flash Image) appears to be restricted for your API key or region. Please check your Google AI Studio project settings or try a different key.");
    }
    throw new Error("Rate Limit Exceeded: You've hit the free tier quota. Please wait about 60 seconds and try your request again.");
  }

  if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
    throw new Error("AI Studio is currently experiencing heavy load. Please try again in a few moments.");
  }

  if (errorMessage.includes('API_KEY_INVALID')) {
    throw new Error("Invalid API Key: Please check your configuration and ensure your API key is correct.");
  }

  throw new Error(`AI Generation Error: ${errorMessage.split('\n')[0]}`);
}
