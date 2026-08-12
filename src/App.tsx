import React, { useState } from 'react';
import { UserProfile, UserProgress, ResumeReport } from './types.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar, ActiveTab } from './components/Sidebar.js';
import { AuthModal } from './components/AuthModal.js';
import { Dashboard } from './components/Dashboard.js';
import { AptitudeModule } from './components/AptitudeModule.js';
import { DSAModule } from './components/DSAModule.js';
import { ProgrammingModule } from './components/ProgrammingModule.js';
import { SpokenPracticeModule } from './components/SpokenPracticeModule.js';
import { MockInterviewModule } from './components/MockInterviewModule.js';
import { ResumeAnalyzerModule } from './components/ResumeAnalyzerModule.js';
import { AICoachModule } from './components/AICoachModule.js';
import { CompanyPrepModule } from './components/CompanyPrepModule.js';
import { DailyChallengesModule } from './components/DailyChallengesModule.js';
import { updateUserProfile } from './services/api.js';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [resumeReport, setResumeReport] = useState<ResumeReport | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const handleAuthSuccess = (u: UserProfile, p: UserProgress, report?: ResumeReport) => {
    setUser(u);
    setProgress(p);
    if (report) setResumeReport(report);
  };

  const handleLogout = () => {
    setUser(null);
    setProgress(null);
    setResumeReport(null);
    setActiveTab('dashboard');
  };

  const handleLanguageChange = async (newLang: any) => {
    if (!user) return;
    const updated = { ...user, explanationLanguage: newLang };
    setUser(updated);
    try {
      await updateUserProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProgLangChange = async (newProgLang: any) => {
    if (!user) return;
    const updated = { ...user, programmingLanguage: newProgLang };
    setUser(updated);
    try {
      await updateUserProfile(updated);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || !progress) {
    return <AuthModal onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Global Navbar */}
      <Navbar
        user={user}
        progress={progress}
        onLanguageChange={handleLanguageChange}
        onProgLangChange={handleProgLangChange}
        onLogout={handleLogout}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} user={user} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard user={user} progress={progress} onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'aptitude' && (
            <AptitudeModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}

          {activeTab === 'dsa' && (
            <DSAModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}

          {activeTab === 'programming' && (
            <ProgrammingModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}

          {activeTab === 'spoken' && (
            <SpokenPracticeModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}

          {activeTab === 'interview' && (
            <MockInterviewModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}

          {activeTab === 'resume' && (
            <ResumeAnalyzerModule
              user={user}
              progress={progress}
              resumeReport={resumeReport}
              onReportGenerated={setResumeReport}
              onProgressUpdate={setProgress}
            />
          )}

          {activeTab === 'coach' && (
            <AICoachModule user={user} />
          )}

          {activeTab === 'company' && (
            <CompanyPrepModule user={user} progress={progress} />
          )}

          {activeTab === 'daily' && (
            <DailyChallengesModule user={user} progress={progress} onProgressUpdate={setProgress} />
          )}
        </main>

      </div>

    </div>
  );
}

export default App;
