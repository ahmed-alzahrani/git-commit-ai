import * as fs from 'fs';
import * as path from 'path';
import { VertexAI } from '@google-cloud/vertexai';

const keyPath = path.join(__dirname, '../../config/keys/committer-service-account-key.json');
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const vertexAI = new VertexAI({
    project: credentials.project_id,
    location: 'us-central1',
    googleAuthOptions: {
        credentials: credentials,
    },
});


export async function generateCommitMessage(prompt: string): Promise<string> {
    const model = vertexAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash' 
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt}] }],
        generationConfig: {
            maxOutputTokens: 5000,
            temperature: 0.7,
        }
      });

      const candidate = result.response.candidates?.[0];
      if (!candidate?.content?.parts?.[0]?.text) {
        throw new Error('No commit message generated from AI response');
      }

      const commitMessage = candidate.content.parts[0].text;
      return commitMessage.trim(); 
}