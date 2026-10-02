import { AIProvider, OrderRiskContext } from './provider';
import { GeminiProvider } from './gemini';
import { ClaudeProvider } from './claude';
import { AIRecommendationOutput, StoreIntelligenceOutput } from './schemas';

export class AIRouter {
  private gemini = new GeminiProvider();
  private claude = new ClaudeProvider();

  async recommendRescue(context: OrderRiskContext): Promise<{
    output: AIRecommendationOutput;
    provider: string;
    latencyMs: number;
  }> {
    const start = Date.now();
    try {
      const output = await this.gemini.recommendRescue(context);
      return {
        output,
        provider: this.gemini.name,
        latencyMs: Date.now() - start
      };
    } catch (err: any) {
      console.warn(`[AIRouter] Gemini failed (${err.message}), falling back to ClaudeProvider`);
      const output = await this.claude.recommendRescue(context);
      return {
        output,
        provider: this.claude.name,
        latencyMs: Date.now() - start
      };
    }
  }

  async generateStoreIntelligence(storeContext: any): Promise<{
    output: StoreIntelligenceOutput;
    provider: string;
    latencyMs: number;
  }> {
    const start = Date.now();
    try {
      const output = await this.gemini.generateStoreIntelligence(storeContext);
      return {
        output,
        provider: this.gemini.name,
        latencyMs: Date.now() - start
      };
    } catch (err: any) {
      console.warn(`[AIRouter] Gemini failed for store intelligence, falling back to ClaudeProvider`);
      const output = await this.claude.generateStoreIntelligence(storeContext);
      return {
        output,
        provider: this.claude.name,
        latencyMs: Date.now() - start
      };
    }
  }
}

export const aiRouter = new AIRouter();
