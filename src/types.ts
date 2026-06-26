export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  description: string;
  requirements: string[];
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  datePosted: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  jobId: string;
  matchScore: number;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
  resumeText?: string;
  skillsMatch: { skill: string; matched: boolean }[];
  strengths: string[];
  gaps: string[];
  recommendedQuestions: string[];
  summary: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewSession {
  candidateId: string;
  jobId: string;
  messages: InterviewMessage[];
  status: 'not_started' | 'active' | 'completed';
  feedback?: {
    strengths: string[];
    improvements: string[];
    communicationScore: number;
    technicalScore: number;
    overallRecommendation: string;
  };
}
