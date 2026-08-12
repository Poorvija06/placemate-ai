export type YearOption = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';

export type DepartmentOption = 
  | 'Information Technology (IT)'
  | 'Computer Science and Engineering (CSE)'
  | 'Electronics and Communication Engineering (ECE)'
  | 'Electrical and Electronics Engineering (EEE)'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Artificial Intelligence and Data Science (AI & DS)'
  | 'Artificial Intelligence and Machine Learning (AI & ML)'
  | 'Computer Science and Business Systems (CSBS)';

export type ProgrammingLangOption = 'Java' | 'Python' | 'C' | 'C++';

export type DomainOption = 
  | 'Software Development'
  | 'Web Development'
  | 'Full Stack Development'
  | 'Mobile App Development'
  | 'Data Science'
  | 'Artificial Intelligence'
  | 'Machine Learning'
  | 'Data Analytics'
  | 'Cyber Security'
  | 'Cloud Computing'
  | 'DevOps'
  | 'UI/UX Design'
  | 'Testing / QA'
  | 'Database / Backend Development';

export type TargetCompanyOption = 
  | 'TCS'
  | 'Infosys'
  | 'Wipro'
  | 'Accenture'
  | 'Cognizant'
  | 'Capgemini'
  | 'HCLTech'
  | 'Tech Mahindra'
  | 'Zoho'
  | 'Amazon'
  | 'Microsoft'
  | 'Google'
  | 'IBM'
  | 'Deloitte'
  | 'EY'
  | 'PwC'
  | 'Oracle'
  | 'Freshworks'
  | 'Other';

export type ExplanationLanguageOption = 
  | 'English'
  | 'Tamil'
  | 'Tanglish'
  | 'Hindi'
  | 'Malayalam'
  | 'Telugu'
  | 'Other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  year: YearOption | '';
  department: DepartmentOption | '';
  programmingLanguage: ProgrammingLangOption;
  domain: DomainOption;
  targetCompany: string;
  explanationLanguage: ExplanationLanguageOption;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  placementReadiness: number; // 0-100
  aptitude: number; // 0-100
  dsa: number; // 0-100
  programming: number; // 0-100
  communication: number; // 0-100
  mockInterview: number; // 0-100
  companyPrep: number; // 0-100
  
  aptitudeSolved: number;
  dsaProblemsSolved: number;
  programmingProblemsSolved: number;
  speakingSessions: number;
  mockInterviews: number;
  dailyStreak: number;
  xp: number;
  achievements: string[];
  lastActiveDate: string;

  completedTopics: {
    aptitude: string[];
    dsa: string[];
    programming: string[];
    company: string[];
  };

  dailyChallengesCompleted: {
    [dateStr: string]: {
      aptitude?: boolean;
      dsa?: boolean;
      programming?: boolean;
      communication?: boolean;
    };
  };
}

export interface ResumeReport {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  resumeScore: number;
  atsReadiness: number;
  detectedCgpa: string | null;
  detectedName: string | null;
  detectedEmail: string | null;
  detectedPhone: string | null;
  detectedEducation: Array<{ degree: string; institution: string; score: string; year: string }>;
  detectedSkills: string[];
  detectedLanguages: string[];
  detectedProjects: Array<{ title: string; description: string; techStack: string[] }>;
  detectedCertifications: string[];
  detectedAchievements: string[];
  strengths: string[];
  weaknesses: string[];
  areasForImprovement: string[];
  missingInformation: string[];
  suggestions: string[];
  customInterviewQuestions: Array<{ category: string; question: string; context: string }>;
  rawExtractedTextSnippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  audioUrl?: string;
  timestamp: string;
}

export interface InterviewQnA {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export interface MockInterviewResult {
  id: string;
  type: 'HR' | 'Technical' | 'Coding' | 'Full Mock';
  targetCompany: string;
  date: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  areasToImprove: string[];
  qnaHistory: InterviewQnA[];
}

export interface SpokenEvaluation {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  clarityScore: number;
  confidenceScore: number;
  transcription: string;
  grammarFeedback: string[];
  vocabularySuggestions: string[];
  improvedVersion: string;
  generalFeedback: string;
}

export interface AptitudeLesson {
  topic: string;
  conceptTitle: string;
  simpleExplanation: string;
  exampleProblem: {
    question: string;
    solutionSteps: string[];
    answer: string;
  };
  guidedPractice: {
    question: string;
    hint: string;
    explanation: string;
  };
  mcqQuestions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface DSALesson {
  topic: string;
  conceptTitle: string;
  explanation: string;
  codeExample: {
    language: string;
    code: string;
    lineByLineExplanation: string[];
  };
  practiceProblem: {
    title: string;
    description: string;
    starterCode: string;
    expectedOutput: string;
    hint: string;
    solutionCode: string;
  };
}

export interface ProgrammingLesson {
  topic: string;
  conceptTitle: string;
  simpleExplanation: string;
  syntaxRules: string;
  codeExample: {
    language: string;
    code: string;
    lineByLineExplanation: string[];
  };
  practiceExercise: {
    title: string;
    description: string;
    exerciseType: string;
    starterCode: string;
    expectedOutput: string;
    hints: string[];
    solutionCode: string;
  };
}

export interface CodeEvaluationResult {
  passed: boolean;
  score: number;
  output: string;
  feedback: string;
  complexity: {
    time: string;
    space: string;
  };
  bugsFound: string[];
  suggestions: string[];
  optimizedCode?: string;
}

export interface CompanyPrepData {
  companyName: string;
  domain: string;
  overview: string;
  rounds: Array<{
    roundNumber: number;
    name: string;
    description: string;
    focusAreas: string[];
  }>;
  keyTopics: string[];
  codingPattern: string;
  frequentlyAskedQuestions: Array<{
    question: string;
    category: string;
    frequency: string;
    sampleAnswerOrApproach: string;
  }>;
  preparationTips: string[];
}

export interface DailyChallenge {
  id: string;
  category: 'Aptitude' | 'DSA' | 'Programming' | 'Spoken' | 'HR';
  title: string;
  description: string;
  mcqOptions?: string[];
  correctOptionIndex?: number;
  rewardXp: number;
}
