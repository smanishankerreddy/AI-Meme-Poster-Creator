
import { GoogleGenAI } from '@google/genai';
import { ContentType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCaptions(topic: string, type: ContentType): Promise<string[]> {
  let prompt: string;

  if (type === ContentType.Meme) {
    prompt = `You are a witty meme generator. Create two short, funny meme captions for a meme about "${topic}". The first caption is for the top text, the second is for the bottom text. Use all caps. Separate the two captions with a newline character. Do not include any other text or explanation.`;
  } else {
    prompt = `You are a creative copywriter. Generate one catchy, impactful, and concise headline for a poster about "${topic}". Keep it under 10 words. Do not include any other text, explanation, or quotation marks.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });

    const text = response.text.trim();
    if (type === ContentType.Meme) {
      return text.split('\n').map(t => t.trim());
    }
    return [text];
  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}


export async function generateImage(prompt: string): Promise<string> {
    const fullPrompt = `A vibrant, high-quality poster illustration representing the concept of "${prompt}". Minimalist, modern, graphic design style. Centered subject, clean background.`;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to communicate with the image generation model.");
    }
}
