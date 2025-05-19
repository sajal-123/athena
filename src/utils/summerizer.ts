import { UserInterface } from './scrapper';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UserWithSummaryInterface extends UserInterface {
  summary: {
    primary_skills: string[];
    tech_stack: string[];
    notable_contributions: string[];
  };
}

async function summarizer(users: UserInterface[]): Promise<UserWithSummaryInterface[]> {
  console.log("🔍 Generating summary from Gemini...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-04-17',
    systemInstruction: {
      role: 'system',
      parts: [
        {
          text: `You are a data-analysis assistant. When given GitHub user profiles, produce a concise JSON summary for each user containing:
• primary_skills   — up to 5 bullet-pointed skills the user most likely excels at
• tech_stack       — the main languages/frameworks/tools the user works with
• notable_contributions — key open-source projects or achievements they’ve made

Be strict about JSON validity: output a top-level array of user objects with only a 'summary' key in each. No commentary or markdown.`
        }
      ]
    }
  });

  const prompt = `Below is a list of GitHub users and their details. For each one, extract the requested insights:\n\n${JSON.stringify(users, null, 2)}`;

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (err) {
    console.error("🛑 Failed to generate content:", err);
    throw err;
  }

  const response = await result.response;
  let fullText = response.text().trim();

  // 🔧 Clean up markdown code block if Gemini wraps it
  if (fullText.startsWith("```")) {
    fullText = fullText.replace(/```json|```/g, '').trim();
  }

  let summariesRaw: { summary: UserWithSummaryInterface["summary"] }[] = [];
  try {
    summariesRaw = JSON.parse(fullText);
  } catch (e) {
    console.error('🛑 Failed to parse summary JSON:', e);
    throw new Error('AI response was not valid JSON');
  }

  // ✅ Merge summaries with users
  const merged: UserWithSummaryInterface[] = users.map((user, index) => ({
    ...user,
    summary: summariesRaw[index]?.summary || {
      primary_skills: [],
      tech_stack: [],
      notable_contributions: []
    }
  }));

  return merged;
}

export { summarizer };
