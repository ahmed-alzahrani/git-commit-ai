import * as fs from 'fs';
import { VertexAI } from '@google-cloud/vertexai';
import { PATHS, AI_CONFIG, ERROR_MESSAGES } from '../config/constants';

const credentials = JSON.parse(fs.readFileSync(PATHS.SERVICE_ACCOUNT_KEY, 'utf8'));

const vertexAI = new VertexAI({
    project: credentials.project_id,
    location: AI_CONFIG.LOCATION,
    googleAuthOptions: {
        credentials: credentials,
    },
});


export async function generateCommitMessage(prompt: string): Promise<string> {
    const model = vertexAI.getGenerativeModel({ 
        model: AI_CONFIG.MODEL 
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt}] }],
        generationConfig: {
            maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
            temperature: AI_CONFIG.TEMPERATURE,
        }
      });

      const candidate = result.response.candidates?.[0];
      if (!candidate?.content?.parts?.[0]?.text) {
        throw new Error(ERROR_MESSAGES.NO_COMMIT_MESSAGE_GENERATED);
      }

      const commitMessage = candidate.content.parts[0].text;
      return commitMessage.trim(); 
}