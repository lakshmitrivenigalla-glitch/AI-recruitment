import { JobPosting, Candidate } from "./types";

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-1",
    title: "Senior React Engineer",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    experienceLevel: "Senior",
    status: "Active",
    applicantsCount: 4,
    datePosted: "2026-06-20",
    description: "We are looking for a Senior React Engineer with deep expertise in modern TypeScript, performance profiling, and state synchronization systems. You will lead development on our core enterprise application portal.",
    requirements: [
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Performance optimization",
      "State management (Zustand/Redux)"
    ]
  },
  {
    id: "job-2",
    title: "AI Product Manager",
    department: "Product",
    location: "Remote (USA)",
    type: "Full-time",
    experienceLevel: "Senior",
    status: "Active",
    applicantsCount: 3,
    datePosted: "2026-06-22",
    description: "Join us to shape the future of AI-driven talent match systems. You will collaborate with engineering, design, and LLM research teams to drive product requirements, API strategies, and UX patterns.",
    requirements: [
      "Product Strategy",
      "Large Language Models (LLMs)",
      "Agile Product Development",
      "Data Analytics & SQL",
      "User Research"
    ]
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Contract",
    experienceLevel: "Mid",
    status: "Active",
    applicantsCount: 2,
    datePosted: "2026-06-24",
    description: "Looking for a versatile Full Stack Developer to build out responsive API routes in Express/Node and sleek client-side panels in React. Experience deploying containerized solutions is a big plus.",
    requirements: [
      "Node.js",
      "Express",
      "React",
      "PostgreSQL",
      "Docker",
      "RESTful APIs"
    ]
  },
  {
    id: "job-4",
    title: "Senior Data Scientist",
    department: "Analytics",
    location: "San Francisco, CA",
    type: "Full-time",
    experienceLevel: "Senior",
    status: "Draft",
    applicantsCount: 0,
    datePosted: "2026-06-25",
    description: "Lead statistical model development and user pattern detection across our core streaming and engagement interfaces.",
    requirements: [
      "Python",
      "Machine Learning",
      "Pandas / NumPy",
      "TensorFlow",
      "Data Visualization"
    ]
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 321-9876",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    jobId: "job-1",
    matchScore: 92,
    status: "Interview",
    appliedDate: "2026-06-21",
    summary: "Alex is an outstanding React engineer with extensive experience refactoring enterprise bundles, adopting Vite, and crafting custom Tailwind systems. Showed incredible domain knowledge during introductory screening.",
    skillsMatch: [
      { skill: "TypeScript", matched: true },
      { skill: "React", matched: true },
      { skill: "Vite", matched: true },
      { skill: "Tailwind CSS", matched: true },
      { skill: "Performance optimization", matched: true },
      { skill: "State management (Zustand/Redux)", matched: false }
    ],
    strengths: [
      "Deeper mastery of modern rendering techniques and React 19 concurrent features.",
      "Track record of reducing cold start bundle sizes by up to 45% via code splitting.",
      "Excellent technical communication and documentation standards."
    ],
    gaps: [
      "Zustand or Redux specific state management wasn't heavily highlighted in resume text.",
      "Less exposure to enterprise continuous integration servers."
    ],
    recommendedQuestions: [
      "Describe how you would debug a recurring re-rendering issue in a deeply nested React tree without using profiler tools.",
      "How do you manage complex asynchronous operations in global application states?"
    ]
  },
  {
    id: "cand-2",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    jobId: "job-1",
    matchScore: 78,
    status: "Screening",
    appliedDate: "2026-06-22",
    summary: "Marcus is a solid front-end engineer transitioning into senior-level roles. Strong experience in React and design systems but slightly lower score due to lack of deep performance optimization metrics.",
    skillsMatch: [
      { skill: "TypeScript", matched: true },
      { skill: "React", matched: true },
      { skill: "Vite", matched: false },
      { skill: "Tailwind CSS", matched: true },
      { skill: "Performance optimization", matched: false },
      { skill: "State management (Zustand/Redux)", matched: true }
    ],
    strengths: [
      "Clean UI design sensibility, adhering strictly to responsive pixel guidelines.",
      "Excellent understanding of Redux Toolkit and structured data flows."
    ],
    gaps: [
      "Lack of direct metrics regarding web performance or rendering load time optimizations.",
      "Has not yet worked actively with Vite or React 18+ streaming hydration."
    ],
    recommendedQuestions: [
      "What steps do you take when you are asked to optimize a slow-loading web dashboard?",
      "Can you walk through your experience building reusable components with Tailwind CSS?"
    ]
  },
  {
    id: "cand-3",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    jobId: "job-2",
    matchScore: 96,
    status: "Applied",
    appliedDate: "2026-06-23",
    summary: "Sarah brings extensive experience driving Product strategy for AI developer suites and LLM prompt playgrounds. She understands both engineering constraints and executive commercial goals perfectly.",
    skillsMatch: [
      { skill: "Product Strategy", matched: true },
      { skill: "Large Language Models (LLMs)", matched: true },
      { skill: "Agile Product Development", matched: true },
      { skill: "Data Analytics & SQL", matched: true },
      { skill: "User Research", matched: true }
    ],
    strengths: [
      "Direct hands-on experience tuning prompting architectures and vector search parameters.",
      "Superb executive presentation skills with cross-functional alignment examples.",
      "Strong database queries and metrics reporting capacity."
    ],
    gaps: [
      "Fewer years of hardware-focused deep learning model pipeline exposure (primarily api/llm application layer)."
    ],
    recommendedQuestions: [
      "How do you design feedback loops in an AI product to continuously capture and refine LLM answer accuracies?",
      "Can you describe an instance where a key stakeholder strongly objected to an AI feature's probabilistic behavior, and how you managed it?"
    ]
  },
  {
    id: "cand-4",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+1 (555) 678-1234",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    jobId: "job-3",
    matchScore: 84,
    status: "Interview",
    appliedDate: "2026-06-24",
    summary: "Elena has a strong full stack background, with solid Node backend experience and a strong portfolio of React dashboards. She is quick to pick up new tools and architectures.",
    skillsMatch: [
      { skill: "Node.js", matched: true },
      { skill: "Express", matched: true },
      { skill: "React", matched: true },
      { skill: "PostgreSQL", matched: true },
      { skill: "Docker", matched: false },
      { skill: "RESTful APIs", matched: true }
    ],
    strengths: [
      "Solid Express API structuring, utilizing robust middleware patterns and typing.",
      "Clear database modeling in relational engines like PostgreSQL."
    ],
    gaps: [
      "Has not yet containerized workflows using Docker in production settings."
    ],
    recommendedQuestions: [
      "How do you structure database migration scripts when adding columns in production PostgreSQL instances?",
      "Describe how you configure JWT or session authentication protocols across front/back layers."
    ]
  }
];
