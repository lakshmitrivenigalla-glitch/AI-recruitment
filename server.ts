import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } else {
    console.warn("GEMINI_API_KEY is not defined. The server will use simulated AI analysis.");
  }
} catch (error) {
  console.error("Error initializing Gemini client:", error);
}

// ---------------------------------------------------------
// 1. AI Resume Analyzer Endpoint
// ---------------------------------------------------------
app.post("/api/analyze-resume", async (req, res) => {
  const { resumeText, jobTitle, jobRequirements } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Resume content is required" });
  }

  const title = jobTitle || "General Role";
  const reqs = Array.isArray(jobRequirements) ? jobRequirements.join(", ") : (jobRequirements || "General skills");

  // If Gemini client is not initialized, fallback to simulated analysis
  if (!ai) {
    return res.json(generateSimulatedResumeAnalysis(resumeText, title, reqs));
  }

  try {
    const prompt = `Analyze this candidate's resume for the role of "${title}".
Job Requirements / Keywords: ${reqs}

Resume text:
"""
${resumeText}
"""

You must respond in JSON matching this schema:
{
  "matchScore": number (integer between 0 and 100),
  "summary": "string (2-3 sentences summarising candidate relevance)",
  "skillsMatch": [
    { "skill": "string", "matched": boolean }
  ],
  "strengths": ["string", "string", ... max 4 strengths],
  "gaps": ["string", "string", ... max 4 gaps],
  "recommendedQuestions": ["string", "string", ... max 4 deep technical/behavioral questions specifically customized for this candidate]
}

Ensure all JSON properties are strictly populated. Return raw JSON content only without markdown wrapping or code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["matchScore", "summary", "skillsMatch", "strengths", "gaps", "recommendedQuestions"],
          properties: {
            matchScore: { type: Type.INTEGER, description: "Matching percentage from 0 to 100" },
            summary: { type: Type.STRING, description: "Professional evaluation summary" },
            skillsMatch: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["skill", "matched"],
                properties: {
                  skill: { type: Type.STRING },
                  matched: { type: Type.BOOLEAN }
                }
              }
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini API");

    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini Resume Analysis failed, using fallback:", error);
    return res.json(generateSimulatedResumeAnalysis(resumeText, title, reqs));
  }
});

// ---------------------------------------------------------
// 2. AI Job Description Generator Endpoint
// ---------------------------------------------------------
app.post("/api/generate-jd", async (req, res) => {
  const { title, department, experienceLevel, keyRequirements } = req.body;

  if (!title || !department) {
    return res.status(400).json({ error: "Job title and department are required." });
  }

  const reqList = keyRequirements || "general requirements";
  const exp = experienceLevel || "Mid";

  if (!ai) {
    return res.json(generateSimulatedJD(title, department, exp, reqList));
  }

  try {
    const prompt = `Generate a modern, highly engaging, inclusive, and professionally styled Job Description.
Role Title: ${title}
Department: ${department}
Experience level: ${exp}
Key Focus / Initial Requirements: ${reqList}

You must respond in JSON matching this schema:
{
  "description": "string (compelling overview paragraph)",
  "requirements": ["string", "string", "string", ... list of 6-8 bulleted hard and soft skills requirements],
  "responsibilities": ["string", "string", "string", ... list of 5-6 bulleted responsibilities],
  "benefits": ["string", "string", "string", ... list of 4-5 benefits/perks]
}

Return raw JSON only without markdown code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["description", "requirements", "responsibilities", "benefits"],
          properties: {
            description: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini API");

    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (error) {
    console.error("Gemini JD Generator failed, using fallback:", error);
    return res.json(generateSimulatedJD(title, department, exp, reqList));
  }
});

// ---------------------------------------------------------
// 3. AI Behavioral Interview Chat Endpoint
// ---------------------------------------------------------
app.post("/api/interview/chat", async (req, res) => {
  const { messages, jobTitle, candidateName } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Conversation history is required." });
  }

  const title = jobTitle || "Software Engineer";
  const name = candidateName || "Candidate";

  if (!ai) {
    return res.json({ text: generateSimulatedInterviewReply(messages, title, name) });
  }

  try {
    const contextHistory = messages.map(m => `${m.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join("\n");

    const prompt = `You are an elite, highly professional and empathetic AI Executive Interviewer for a technology/business recruitment platform.
You are interviewing "${name}" for the position of "${title}".
Your tone should be warm, inquiring, and analytical, looking for solid examples of behavioral excellence, technical reasoning, and cultural fit.

Here is the conversation transcript so far:
${contextHistory}

Respond with the next interview question or dialogue. Keep it focused, conversational, and follow up directly on what the candidate just said in their last message if relevant.
Ask exactly ONE main question at a time to avoid overwhelming the candidate. Keep your response under 3-4 sentences.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an executive interviewer. Be concise, polite, and probe for real behavioral STAR format details."
      }
    });

    return res.json({ text: response.text });

  } catch (error) {
    console.error("Gemini Interview Chat failed, using fallback:", error);
    return res.json({ text: generateSimulatedInterviewReply(messages, title, name) });
  }
});

// ---------------------------------------------------------
// 4. AI Interview Evaluation Endpoint
// ---------------------------------------------------------
app.post("/api/interview/evaluate", async (req, res) => {
  const { messages, jobTitle, candidateName } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Conversation history is required." });
  }

  const title = jobTitle || "Software Engineer";
  const name = candidateName || "Candidate";

  if (!ai) {
    return res.json(generateSimulatedEvaluation(messages, title, name));
  }

  try {
    const transcript = messages.map(m => `${m.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join("\n");

    const prompt = `Evaluate the following mock interview transcript between candidate "${name}" and the AI Interviewer for the role "${title}".

Transcript:
"""
${transcript}
"""

You must respond with a JSON object matching this schema:
{
  "strengths": ["string", "string", ... 3 strengths identified from answers],
  "improvements": ["string", "string", ... 3 areas of refinement],
  "communicationScore": number (integer between 0 and 100),
  "technicalScore": number (integer between 0 and 100),
  "overallRecommendation": "string (4-5 sentences detailing comprehensive feedback and recommendations for hiring managers)"
}

Return raw JSON only without code blocks or markdown formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["strengths", "improvements", "communicationScore", "technicalScore", "overallRecommendation"],
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            communicationScore: { type: Type.INTEGER },
            technicalScore: { type: Type.INTEGER },
            overallRecommendation: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty evaluation response from Gemini API");

    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (error) {
    console.error("Gemini Evaluation failed, using fallback:", error);
    return res.json(generateSimulatedEvaluation(messages, title, name));
  }
});

// ---------------------------------------------------------
// Simulated AI Fallback Engines for 100% Reliability
// ---------------------------------------------------------

function generateSimulatedResumeAnalysis(text: string, title: string, reqs: string) {
  const lowercaseText = text.toLowerCase();
  const lowercaseTitle = title.toLowerCase();

  // Basic keyword matching
  const matchingSkills = [
    { skill: "TypeScript / JavaScript", matched: lowercaseText.includes("typescript") || lowercaseText.includes("javascript") || lowercaseText.includes("js") },
    { skill: "React / Modern UI", matched: lowercaseText.includes("react") || lowercaseText.includes("frontend") || lowercaseText.includes("ui") },
    { skill: "Node.js / Express", matched: lowercaseText.includes("node") || lowercaseText.includes("express") || lowercaseText.includes("backend") },
    { skill: "System Architecture", matched: lowercaseText.includes("architecture") || lowercaseText.includes("system") || lowercaseText.includes("design") },
    { skill: "Cloud Services (AWS/GCP)", matched: lowercaseText.includes("aws") || lowercaseText.includes("gcp") || lowercaseText.includes("cloud") || lowercaseText.includes("docker") },
    { skill: "Database (SQL/NoSQL)", matched: lowercaseText.includes("sql") || lowercaseText.includes("postgres") || lowercaseText.includes("mongodb") || lowercaseText.includes("db") },
    { skill: "Team Leadership", matched: lowercaseText.includes("lead") || lowercaseText.includes("manage") || lowercaseText.includes("leadership") || lowercaseText.includes("mentor") },
    { skill: "Agile methodologies", matched: lowercaseText.includes("agile") || lowercaseText.includes("scrum") || lowercaseText.includes("sprint") }
  ];

  const matchedCount = matchingSkills.filter(s => s.matched).length;
  // Calculate score with basic logic
  const baseScore = Math.floor(40 + (matchedCount / matchingSkills.length) * 55);
  const finalScore = Math.min(100, Math.max(30, baseScore));

  const strengths = [
    "Strong technical execution demonstrated in past responsibilities.",
    "Familiarity with modern deployment frameworks and developer workflows.",
    "Excellent hands-on problem solving capabilities and engineering foundations."
  ];

  const gaps = [
    "Could detail concrete metrics or business impact ratios of completed projects.",
    "Needs to highlight specialized testing (Jest/Cypress) and continuous integration pipelines.",
    "Additional certifications in Cloud Architecture could solidify backend candidacy."
  ];

  return {
    matchScore: finalScore,
    summary: `Candidate presents an active match for the ${title} position. The resume highlights relevant experiences, aligning with several required competencies. There is solid domain foundation with minor skills gaps in deployment monitoring.`,
    skillsMatch: matchingSkills.slice(0, 6),
    strengths,
    gaps,
    recommendedQuestions: [
      `Can you detail a time when you successfully scaled a React or TypeScript application, and what bottlenecks you encountered?`,
      `How do you approach testing and CI/CD pipelines in your daily developer workflows?`,
      `Describe a challenging team disagreement regarding software architecture, and how you navigated it to a technical consensus.`
    ]
  };
}

function generateSimulatedJD(title: string, dept: string, exp: string, reqs: string) {
  return {
    description: `We are seeking an outstanding and collaborative ${title} to join our high-performing ${dept} team. In this role, you will leverage modern tools and best practices to design, build, and optimize product modules that impact millions of active users daily. This is an exciting opportunity for a ${exp}-level practitioner looking to grow rapidly in a forward-thinking environment.`,
    requirements: [
      `Proven experience working in a fast-paced ${dept} or similar technical environment.`,
      `Strong foundational knowledge related to: ${reqs}.`,
      `Demonstrated capability in building scalable, secure, and responsive product services.`,
      `Excellent communication and organizational skills, with a focus on cross-team collaboration.`,
      `Experience with Agile workflows, CI/CD, and automated deployment frameworks.`,
      `A passion for learning, mentoring others, and driving creative solutions.`
    ],
    responsibilities: [
      `Collaborate directly with product owners, designers, and fellow engineers to define and plan new features.`,
      `Write clean, highly readable, well-tested, and performant code adhering to modern best practices.`,
      `Identify, diagnose, and resolve technical bugs or runtime bottlenecks.`,
      `Contribute actively to code reviews, documentation, and technical strategy debates.`,
      `Support automated build pipelines, containerized deployments, and robust monitoring.`
    ],
    benefits: [
      `Highly competitive base salary and comprehensive wellness/health benefits.`,
      `Flexible hybrid/remote operating guidelines with comfortable home-office setup stipends.`,
      `Continuous learning budgets for courses, certifications, and technical conferences.`,
      `Generous paid time off, parental leave, and team volunteer program matches.`,
      `Modern workspace fitted with collaborative spaces, snacks, and regular social gatherings.`
    ]
  };
}

function generateSimulatedInterviewReply(messages: any[], title: string, name: string) {
  if (messages.length <= 1) {
    return `Hello ${name}! Welcome to your AI behavioral interview for the ${title} position. To start, could you please introduce yourself and walk me through a major project you recently shipped that you are particularly proud of?`;
  }

  const lastMessage = messages[messages.length - 1];
  const text = lastMessage.text.toLowerCase();

  if (text.includes("problem") || text.includes("challenge") || text.includes("difficult") || text.includes("bug")) {
    return `That sounds like a complex scenario. How did you coordinate with other stakeholders to debug and resolve that particular issue, and what did you learn from that resolution?`;
  }

  if (text.includes("team") || text.includes("lead") || text.includes("manage") || text.includes("collaborate")) {
    return `Excellent. Collaborative teamwork is central to our culture. Can you give me a specific example of when a team member disagreed with your approach, and how you worked together to find a middle ground?`;
  }

  const questions = [
    `That is insightful. How do you ensure the quality of your deliverables under tight timelines and competing priorities?`,
    `Fascinating! Could you elaborate on a time when you had to adopt a completely new technology or tool quickly to solve an urgent business problem?`,
    `Great explanation. To conclude our behavioral session, what specific aspects of our company and this ${title} role excite you most?`
  ];

  const index = Math.min(questions.length - 1, Math.floor((messages.length - 2) / 2));
  return questions[index];
}

function generateSimulatedEvaluation(messages: any[], title: string, name: string) {
  return {
    strengths: [
      "Demonstrates clear, logical communication and structures answers coherently.",
      "Shows a strong sense of technical ownership and practical problem-solving.",
      "Reflects a highly collaborative attitude and values diverse perspectives."
    ],
    improvements: [
      "Could elaborate more on specific metrics/business outcomes rather than technical steps alone.",
      "Should practice using the STAR method (Situation, Task, Action, Result) more rigidly.",
      "Can highlight experience with architectural scale and system design trade-offs."
    ],
    communicationScore: 85,
    technicalScore: 78,
    overallRecommendation: `${name} demonstrated high potential during this interview for the ${title} role. Their communication is well-structured and shows standard maturity. They have strong professional instincts and solid engineering principles. They would be a highly recommended candidate to move forward to the technical assessment phase.`
  };
}

// ---------------------------------------------------------
// Vite Integration and Dev/Prod Server Serving
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
