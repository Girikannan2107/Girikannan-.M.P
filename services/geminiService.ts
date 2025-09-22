
import { GoogleGenAI, Type } from "@google/genai";
import type { DetectionResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const systemInstruction = `You are an AI assistant for a blind person. Your task is to analyze an image from their wearable camera and identify potential obstacles and hazards. Provide a concise, clear description of the immediate environment. Prioritize safety and immediate threats. Describe objects with their name, estimated distance, and position. Keep the summary very brief. Respond ONLY with a JSON object.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        objects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: 'The name of the detected object (e.g., "car", "person", "curb").'
                    },
                    distance: {
                        type: Type.STRING,
                        enum: ['immediate', 'near', 'medium', 'far'],
                        description: 'Estimated distance: immediate (0-2 ft), near (2-10 ft), medium (10-30 ft), far (30+ ft).'
                    },
                    position: {
                        type: Type.STRING,
                        enum: ['left', 'center', 'right', 'full'],
                        description: 'The object\'s position in the user\'s field of view.'
                    },
                    urgency: {
                        type: Type.STRING,
                        enum: ['low', 'medium', 'high'],
                        description: 'Urgency level. High for moving objects or immediate obstacles.'
                    }
                },
                required: ['name', 'distance', 'position', 'urgency']
            }
        },
        summary: {
            type: Type.STRING,
            description: 'A very brief overall summary of the scene, like "Path clear" or "Obstacle ahead".'
        }
    },
    required: ['objects', 'summary']
};

export async function analyzeImage(base64ImageData: string): Promise<DetectionResponse> {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData.split(',')[1],
        },
    };
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                // Disable thinking for lower latency
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as DetectionResponse;

        // Sort objects by urgency and distance
        parsedResult.objects.sort((a, b) => {
            const urgencyOrder = { high: 0, medium: 1, low: 2 };
            const distanceOrder = { immediate: 0, near: 1, medium: 2, far: 3 };

            if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
            }
            return distanceOrder[a.distance] - distanceOrder[b.distance];
        });
        
        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
}
