import OpenAI from "openai";

// Groq exposes an OpenAI-compatible API, so we just point the same SDK
// at Groq's base URL and use a Groq model name + a Groq API key.
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst and technical recruiter.
You compare a candidate's resume against a job description and produce a strict, honest, structured analysis.
Be precise and critical — do not inflate scores. Base the score on real overlap of skills, tools,
responsibilities, and qualifications, not on vague similarity.

Respond ONLY with valid JSON. No markdown fences, no preamble, no explanation outside the JSON object.

JSON shape:
{
  "matchScore": <integer 0-100>,
  "scoreLabel": "<one of: Poor Match, Weak Match, Moderate Match, Strong Match, Excellent Match>",
  "summary": "<2-3 sentence honest summary of how well the resume fits the JD>",
  "matchedKeywords": ["<keyword present in both resume and JD>", ...],
  "missingKeywords": ["<important keyword/skill from JD missing in resume>", ...],
  "keywordSuggestions": [
    {
      "keyword": "<missing keyword>",
      "whereToAdd": "<short suggestion of which resume section to add it to, e.g. Skills, Experience bullet>",
      "exampleBulletPoint": "<a realistic, specific resume bullet point the candidate could add or adapt, incorporating this keyword truthfully — phrase it as a template they should only use if it reflects real experience>"
    }
  ],
  "sectionFeedback": {
    "skills": "<short feedback>",
    "experience": "<short feedback>",
    "formatting": "<short feedback on ATS-friendliness>"
  },
  "topImprovements": ["<actionable improvement 1>", "<actionable improvement 2>", "<actionable improvement 3>"]
}

Limit matchedKeywords and missingKeywords to the most important 8-12 each.
Limit keywordSuggestions to the 5 highest-impact missing keywords.`;

export async function analyzeResumeMatch(resumeText, jobDescription) {
  const userPrompt = `RESUME:
"""
${resumeText.slice(0, 12000)}
"""

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 8000)}
"""

Analyze the match between this resume and job description following the JSON schema exactly.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0].message.content;
  return JSON.parse(raw);
}
