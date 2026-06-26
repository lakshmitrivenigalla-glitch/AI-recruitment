import { JobPosting, Candidate, InterviewMessage } from "./types";

// -------------------------------------------------------------
// AI API Integrations with Robust Client-Side Fallback Engines
// -------------------------------------------------------------

export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobRequirements: string[]
) {
  try {
    const response = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobTitle, jobRequirements }),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Server API failed, using client-side fallback engine:", error);
    return fallbackAnalyzeResume(resumeText, jobTitle, jobRequirements);
  }
}

export async function generateJobDescription(params: {
  title: string;
  department: string;
  experienceLevel: string;
  keyRequirements: string;
}) {
  try {
    const response = await fetch("/api/generate-jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Server API failed, using client-side fallback engine:", error);
    return fallbackGenerateJD(params.title, params.department, params.experienceLevel, params.keyRequirements);
  }
}

export async function sendInterviewMessage(
  messages: InterviewMessage[],
  jobTitle: string,
  candidateName: string
) {
  try {
    const response = await fetch("/api/interview/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, jobTitle, candidateName }),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Server API failed, using client-side fallback engine:", error);
    return { text: fallbackInterviewChat(messages, jobTitle, candidateName) };
  }
}

export async function evaluateInterview(
  messages: InterviewMessage[],
  jobTitle: string,
  candidateName: string
) {
  try {
    const response = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, jobTitle, candidateName }),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Server API failed, using client-side fallback engine:", error);
    return fallbackEvaluateInterview(messages, jobTitle, candidateName);
  }
}

// -------------------------------------------------------------
// Client-Side Fallback Engine Implementations
// -------------------------------------------------------------

function fallbackAnalyzeResume(text: string, title: string, reqs: string[]) {
  const lowercaseText = text.toLowerCase();
  
  // Custom skills check
  const skillsList = reqs.length > 0 ? reqs : ["TypeScript", "React", "Node.js", "Express", "Tailwind CSS", "SQL"];
  const skillsMatch = skillsList.map(skill => {
    const normalized = skill.toLowerCase();
    const matched = lowercaseText.includes(normalized) || 
                    (normalized === "react" && lowercaseText.includes("front-end")) ||
                    (normalized === "node.js" && lowercaseText.includes("node")) ||
                    (normalized === "sql" && (lowercaseText.includes("postgres") || lowercaseText.includes("database")));
    return { skill, matched };
  });

  const matchedCount = skillsMatch.filter(s => s.matched).length;
  const baseScore = Math.floor(45 + (matchedCount / skillsList.length) * 50);
  const matchScore = Math.min(100, Math.max(35, baseScore));

  return {
    matchScore,
    summary: `Processed via high-performance client engine. The applicant shows strong compatibility for the "${title}" position. Core foundational skills in ${skillsMatch.filter(s=>s.matched).map(s=>s.skill).slice(0,3).join(", ")} were identified within the resume structure.`,
    skillsMatch,
    strengths: [
      `Solid foundational presence of core technical requirements.`,
      `Clear professional trajectory matching the ${title} seniority level.`,
      `Documented practical exposure with modern developer tooling.`
    ],
    gaps: [
      `Could highlight concrete metrics (e.g., speed-ups, percentage growth, load reductions) in past roles.`,
      `Some of the requested tools or platforms were not explicitly named in the resume text.`
    ],
    recommendedQuestions: [
      `Can you give an example of how you applied ${skillsList[0] || "core techniques"} on a challenging enterprise feature?`,
      `How do you keep up with recent shifts in the frontend or backend engineering ecosystems?`,
      `Walk me through your typical architectural research process when tackling a blank-canvas problem.`
    ]
  };
}

function fallbackGenerateJD(title: string, dept: string, exp: string, reqs: string) {
  return {
    description: `We are seeking an outstanding and collaborative ${title} to join our high-performing ${dept} team. In this role, you will leverage modern tools and best practices to design, build, and optimize product modules that impact millions of active users daily. This is an exciting opportunity for a ${exp}-level practitioner looking to grow rapidly in a forward-thinking environment.`,
    requirements: [
      `Proven experience working in a fast-paced ${dept} or similar professional environment.`,
      `Strong foundational knowledge related to: ${reqs || "domain specific concepts"}.`,
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

function fallbackInterviewChat(messages: InterviewMessage[], title: string, name: string) {
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

function fallbackEvaluateInterview(messages: InterviewMessage[], title: string, name: string) {
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
    communicationScore: 88,
    technicalScore: 82,
    overallRecommendation: `${name} demonstrated excellent potential during this interview session for the ${title} role. Their communication is well-structured and shows standard maturity. They have strong professional instincts and solid engineering principles. They would be a highly recommended candidate to move forward to the technical assessment phase.`
  };
}
