import { GoogleGenAI } from '@google/genai';
import { AIProvider, OrderRiskContext } from './provider';
import { AIRecommendationSchema, AIRecommendationOutput, StoreIntelligenceSchema, StoreIntelligenceOutput } from './schemas';
import { buildRescuePrompt, buildStoreIntelligencePrompt } from './prompts';

export class GeminiProvider implements AIProvider {
  name = 'GeminiProvider (gemini-3.8-flash)';

  private hasValidKey(): boolean {
    const k = process.env.GEMINI_API_KEY;
    return Boolean(k && k.trim() !== '' && k !== 'MY_GEMINI_API_KEY');
  }

  async recommendRescue(context: OrderRiskContext): Promise<AIRecommendationOutput> {
    if (!this.hasValidKey()) {
      throw new Error('GEMINI_API_KEY not configured for GeminiProvider');
    }

    const ai = new GoogleGenAI({});
    const prompt = buildRescuePrompt(context);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const rawText = response.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      throw new Error(`Invalid JSON returned by Gemini: ${rawText.slice(0, 100)}`);
    }

    // Strict Zod validation
    const validated = AIRecommendationSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('[GeminiProvider] Zod schema validation failed:', validated.error.format());
      throw new Error('AI output failed schema validation constraint');
    }

    return validated.data;
  }

  async generateStoreIntelligence(storeContext: any): Promise<StoreIntelligenceOutput> {
    if (!this.hasValidKey()) {
      throw new Error('GEMINI_API_KEY not configured for GeminiProvider');
    }

    const ai = new GoogleGenAI({});
    const prompt = buildStoreIntelligencePrompt(storeContext);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const rawText = response.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanJson);
    const validated = StoreIntelligenceSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error('Store intelligence output failed schema validation');
    }

    return validated.data;
  }
}
