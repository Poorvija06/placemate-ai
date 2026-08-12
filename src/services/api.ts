import { 
  UserProfile, 
  UserProgress, 
  ResumeReport, 
  SpokenEvaluation, 
  CodeEvaluationResult, 
  MockInterviewResult 
} from '../types.js';

const BASE_URL = '/api';

export async function registerUser(data: any): Promise<{ user: UserProfile; progress: UserProgress; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function loginUser(data: any): Promise<{ user: UserProfile; progress: UserProgress; resumeReport?: ResumeReport; token: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function updateUserProfile(data: any): Promise<{ user: UserProfile }> {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update profile');
  return json;
}

export async function updateUserProgress(email: string, delta: any): Promise<{ progress: UserProgress }> {
  const res = await fetch(`${BASE_URL}/users/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, delta })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update progress');
  return json;
}

export async function uploadResume(file: File, email: string): Promise<{ report: ResumeReport }> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('email', email);

  const res = await fetch(`${BASE_URL}/resume/analyze`, {
    method: 'POST',
    body: formData
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Resume analysis failed');
  return json;
}

export async function getAptitudeLesson(topic: string, difficulty: string, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/aptitude-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load Aptitude lesson');
  return json.lesson;
}

export async function getDSALesson(topic: string, programmingLanguage: string, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/dsa-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, programmingLanguage, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load DSA lesson');
  return json.lesson;
}

export async function getProgrammingLesson(topic: string, programmingLanguage: string, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/programming-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, programmingLanguage, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load Programming lesson');
  return json.lesson;
}

export async function sendProgrammingTutorChat(
  userQuestion: string, 
  currentTopic: string, 
  programmingLanguage: string, 
  currentCode: string, 
  explanationLanguage: string
) {
  const res = await fetch(`${BASE_URL}/ai/programming-tutor-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuestion, currentTopic, programmingLanguage, currentCode, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to get tutor answer');
  return json.reply;
}

export async function evaluateCode(
  code: string, 
  programmingLanguage: string, 
  problemTitle: string, 
  problemDescription: string, 
  explanationLanguage: string
): Promise<CodeEvaluationResult> {
  const res = await fetch(`${BASE_URL}/ai/code-eval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, programmingLanguage, problemTitle, problemDescription, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to evaluate code');
  return json.evaluation;
}

export async function evaluateSpokenTranscript(transcript: string, topic: string, explanationLanguage: string): Promise<SpokenEvaluation> {
  const res = await fetch(`${BASE_URL}/ai/spoken-eval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, topic, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to evaluate speech');
  return json.evaluation;
}

export async function getMockInterviewQuestion(interviewType: string, targetCompany: string, domain: string, qnaHistory: any[], explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/mock-interview/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interviewType, targetCompany, domain, qnaHistory, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate question');
  return json;
}

export async function evaluateMockInterviewAnswer(question: string, answer: string, interviewType: string, targetCompany: string, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/mock-interview/evaluate-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, interviewType, targetCompany, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to evaluate answer');
  return json;
}

export async function finalizeMockInterview(qnaHistory: any[], interviewType: string, targetCompany: string, email: string, explanationLanguage: string): Promise<MockInterviewResult> {
  const res = await fetch(`${BASE_URL}/ai/mock-interview/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qnaHistory, interviewType, targetCompany, email, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to finalize interview');
  return json.result;
}

export async function sendAICoachMessage(userMessage: string, conversationHistory: any[], userProfile: UserProfile, explanationLanguage: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/ai/coach/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage, conversationHistory, userProfile, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI Coach error');
  return json.reply;
}

export async function getCompanyPrepData(companyName: string, domain: string, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/company-prep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName, domain, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load company prep');
  return json.prepData;
}

export async function getDailyChallenges(userProfile: UserProfile, explanationLanguage: string) {
  const res = await fetch(`${BASE_URL}/ai/daily-challenges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile, explanationLanguage })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load daily challenges');
  return json.challenges;
}
