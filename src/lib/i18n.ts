import { ExplanationLanguageOption } from '../types.js';

export type TranslationKey = string;

export const translations: Record<string, Record<string, string>> = {
  // NAVBAR
  'nav.title': {
    English: 'PlaceMate AI',
    Tamil: 'பிளேஸ்மேட் AI',
    Tanglish: 'PlaceMate AI',
    Hindi: 'प्लेसमेट एआई',
    Malayalam: 'പ്ലേസ്മേറ്റ് എഐ',
    Telugu: 'ప్లేస్‌మేట్ ఏఐ'
  },
  'nav.tagline': {
    English: 'PLACEMENT TRAINER',
    Tamil: 'வேலைவாய்ப்பு பயிற்சியாளர்',
    Tanglish: 'PLACEMENT TRAINER',
    Hindi: 'प्लेसमेंट ट्रेनर',
    Malayalam: 'പ്ലേസ്മെന്റ് ട്രെയിനർ',
    Telugu: 'ప్లేస్‌మెంట్ ట్రైనర్'
  },
  'nav.explanationLanguage': {
    English: 'Explanation Language',
    Tamil: 'விளக்க மொழி',
    Tanglish: 'Explanation Language',
    Hindi: 'व्याख्या की भाषा',
    Malayalam: 'വിശദീകരണ ഭാഷ',
    Telugu: 'వివరణ భాష'
  },
  'nav.programmingLanguage': {
    English: 'Programming Language',
    Tamil: 'நிரலாக்க மொழி',
    Tanglish: 'Programming Language',
    Hindi: 'प्रोग्रामिंग भाषा',
    Malayalam: 'പ്രോഗ്രാമിംഗ് ഭാഷ',
    Telugu: 'ప్రోగ్రామింగ్ భాష'
  },
  'nav.streak': {
    English: 'Streak',
    Tamil: 'தொடர்ச்சி',
    Tanglish: 'Streak',
    Hindi: 'स्ट्रैक',
    Malayalam: 'സ്ട്രീക്ക്',
    Telugu: 'స్ట్రీక్'
  },
  'nav.days': {
    English: 'Days',
    Tamil: 'நாட்கள்',
    Tanglish: 'Days',
    Hindi: 'दिन',
    Malayalam: 'ദിവസങ്ങൾ',
    Telugu: 'రోజులు'
  },
  'nav.xp': {
    English: 'EXP',
    Tamil: 'புள்ளிகள்',
    Tanglish: 'EXP',
    Hindi: 'अंक',
    Malayalam: 'പോയിന്റുകൾ',
    Telugu: 'పాయింట్లు'
  },
  'nav.editProfile': {
    English: 'Profile Settings',
    Tamil: 'சுயவிவர அமைப்புகள்',
    Tanglish: 'Profile Settings',
    Hindi: 'प्रोफ़ाइल सेटिंग्स',
    Malayalam: 'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ',
    Telugu: 'ప్రొఫైల్ సెట్టింగ్‌లు'
  },
  'nav.logout': {
    English: 'Logout',
    Tamil: 'வெளியேறு',
    Tanglish: 'Logout Pannu',
    Hindi: 'लॉग आउट',
    Malayalam: 'ലോഗ് ഔട്ട്',
    Telugu: 'లాగ్ అవుట్'
  },

  // SIDEBAR
  'sidebar.mainLearning': {
    English: 'MAIN LEARNING',
    Tamil: 'முதன்மை கற்றல்',
    Tanglish: 'MAIN LEARNING',
    Hindi: 'मुख्य सीख',
    Malayalam: 'പ്രധാന പഠനം',
    Telugu: 'ముఖ్యమైన నేర్చుకోవడం'
  },
  'sidebar.dashboard': {
    English: 'Dashboard',
    Tamil: 'டாஷ்போர்டு',
    Tanglish: 'Dashboard',
    Hindi: 'डैशबोर्ड',
    Malayalam: 'ഡാഷ്‌ബോർഡ്',
    Telugu: 'డాష్‌బోర్డ్'
  },
  'sidebar.aptitude': {
    English: 'Aptitude & Logic',
    Tamil: 'திறனறிவு மற்றும் தர்க்கம்',
    Tanglish: 'Aptitude & Logic',
    Hindi: 'योग्यता और तर्क',
    Malayalam: 'ആപ്റ്റിറ്റ്യൂഡ് & ലോജിക്',
    Telugu: 'ఆప్టిట్యూడ్ & లాజిక్'
  },
  'sidebar.dsa': {
    English: 'DSA Mastery',
    Tamil: 'தரவு கட்டமைப்புகள் மற்றும் அல்காரிதம்கள்',
    Tanglish: 'DSA Mastery',
    Hindi: 'डेटा स्ट्रक्चर्स और एल्गोरिदम',
    Malayalam: 'ഡാറ്റാ സ്ട്രക്ചറുകൾ & അൽഗോരിതം',
    Telugu: 'డేటా స్ట్రక్చర్స్ & ఆల్గోరిథమ్స్'
  },
  'sidebar.programming': {
    English: 'Programming Tutor',
    Tamil: 'நிரலாக்க பயிற்சியாளர்',
    Tanglish: 'Programming Practice',
    Hindi: 'प्रोग्रामिंग ट्यूटर',
    Malayalam: 'പ്രോഗ്രാമിംഗ് ട്യൂട്ടർ',
    Telugu: 'ప్రోగ్రామింగ్ ట్యూటర్'
  },
  'sidebar.interviewPractice': {
    English: 'INTERVIEW & PRACTICE',
    Tamil: 'நேர்காணல் மற்றும் பயிற்சி',
    Tanglish: 'INTERVIEW & PRACTICE',
    Hindi: 'इंटरव्यू और अभ्यास',
    Malayalam: 'ഇന്റർവ്യൂ & പ്രാക്ടീസ്',
    Telugu: 'ఇంటర్వ్యూ & ప్రాక్టీస్'
  },
  'sidebar.spokenPractice': {
    English: 'Spoken Practice',
    Tamil: 'பேசும் பயிற்சி',
    Tanglish: 'Spoken Practice',
    Hindi: 'बोलने का अभ्यास',
    Malayalam: 'സംസാര പരിശീലനം',
    Telugu: 'సంభాషణ ప్రాక్టీస్'
  },
  'sidebar.mockInterview': {
    English: 'Mock Interviews',
    Tamil: 'மாதிரி நேர்காணல்கள்',
    Tanglish: 'Mock Interviews',
    Hindi: 'मॉक इंटरव्यू',
    Malayalam: 'മോക്ക് ഇന്റർവ്യൂ',
    Telugu: 'మాక్ ఇంటర్వ్యూ'
  },
  'sidebar.resumeAnalyzer': {
    English: 'Resume Analyzer',
    Tamil: 'விண்ணப்ப சுயவிவர பகுப்பாய்வி',
    Tanglish: 'Resume Analyzer',
    Hindi: 'रेज़्यूमे विश्लेषक',
    Malayalam: 'റെസ്യൂമെ വിശകലനം',
    Telugu: 'రెజ్యూమ్ విశ్లేషణ'
  },
  'sidebar.aiCoach': {
    English: 'AI Placement Coach',
    Tamil: 'AI வேலைவாய்ப்பு பயிற்சியாளர்',
    Tanglish: 'AI Placement Coach',
    Hindi: 'एआई प्लेसमेंट कोच',
    Malayalam: 'എഐ പ്ലേസ്‌മെന്റ് കോച്ച്',
    Telugu: 'ఏఐ ప్లేస్‌మెంట్ కోచ్'
  },
  'sidebar.companyPrep': {
    English: 'Company Prep',
    Tamil: 'நிறுவன தயாரிப்பு',
    Tanglish: 'Company Prep',
    Hindi: 'कंपनी की तैयारी',
    Malayalam: 'കമ്പനി തയ്യാറെടുപ്പ്',
    Telugu: 'కంపెనీ ప్రిపరేషన్'
  },
  'sidebar.dailyChallenges': {
    English: 'Daily Challenges',
    Tamil: 'தினசரி சவால்கள்',
    Tanglish: 'Daily Challenges',
    Hindi: 'दैनिक चुनौतियाँ',
    Malayalam: 'ദിനചര്യ വെല്ലുവിളികൾ',
    Telugu: 'రోజువారీ సవాళ్లు'
  },
  'sidebar.explanationMode': {
    English: 'EXPLANATION MODE',
    Tamil: 'விளக்க முறை',
    Tanglish: 'EXPLANATION MODE',
    Hindi: 'व्याख्या मोड',
    Malayalam: 'വിശദീകരണ മോഡ്',
    Telugu: 'వివరణ మోడ్'
  },
  'sidebar.active': {
    English: 'ACTIVE',
    Tamil: 'செயலில் உள்ளது',
    Tanglish: 'ACTIVE',
    Hindi: 'सक्रिय',
    Malayalam: 'സജീവം',
    Telugu: 'యాక్టివ్'
  },

  // COMMON BUTTONS
  'btn.start': {
    English: 'Start Learning',
    Tamil: 'கற்றலைத் தொடங்கு',
    Tanglish: 'Learning-ah Start Pannu',
    Hindi: 'सीखना शुरू करें',
    Malayalam: 'പഠനം ആരംഭിക്കുക',
    Telugu: 'నేర్చుకోవడం ప్రారంభించండి'
  },
  'btn.continue': {
    English: 'Continue',
    Tamil: 'தொடரவும்',
    Tanglish: 'Continue Pannu',
    Hindi: 'जारी रखें',
    Malayalam: 'തുടരുക',
    Telugu: 'కొనసాగించండి'
  },
  'btn.submit': {
    English: 'Submit',
    Tamil: 'சமர்ப்பிக்கவும்',
    Tanglish: 'Submit Pannu',
    Hindi: 'सबमिट करें',
    Malayalam: 'സമർപ്പിക്കുക',
    Telugu: 'సమర్పించండి'
  },
  'btn.tryAgain': {
    English: 'Try Again',
    Tamil: 'மீண்டும் முயற்சிக்கவும்',
    Tanglish: 'Thirumba Try Pannu',
    Hindi: 'पुनः प्रयास करें',
    Malayalam: 'വീണ്ടും ശ്രമിക്കുക',
    Telugu: 'మళ్లీ ప్రయత్నించండి'
  },
  'btn.runCode': {
    English: 'Run & Execute Code',
    Tamil: 'நிரலை இயக்கு',
    Tanglish: 'Code-ah Run Pannu',
    Hindi: 'कोड चलाएं',
    Malayalam: 'കോഡ് പ്രവർത്തിപ്പിക്കുക',
    Telugu: 'కోడ్ రన్ చేయండి'
  },
  'btn.showHint': {
    English: 'Show Hint',
    Tamil: 'குறிப்பைக் காட்டு',
    Tanglish: 'Hint-ah Paar',
    Hindi: 'संकेत देखें',
    Malayalam: 'സൂചന കാണിക്കുക',
    Telugu: 'హింట్ చూడండి'
  },
  'btn.viewSolution': {
    English: 'View Solution',
    Tamil: 'தீர்வைப் பார்',
    Tanglish: 'Solution-ah Paar',
    Hindi: 'समाधान देखें',
    Malayalam: 'പരിഹാരം കാണുക',
    Telugu: 'సమాధానం చూడండి'
  },
  'btn.next': {
    English: 'Next Topic',
    Tamil: 'அடுத்த தலைப்பு',
    Tanglish: 'Next Topic',
    Hindi: 'अगला विषय',
    Malayalam: 'അടുത്ത വിഷയം',
    Telugu: 'తరువాత అంశం'
  },
  'btn.previous': {
    English: 'Previous',
    Tamil: 'முந்தையது',
    Tanglish: 'Previous',
    Hindi: 'पिछला',
    Malayalam: 'മുമ്പത്തേത്',
    Telugu: 'క్రితం'
  },
  'btn.save': {
    English: 'Save Changes',
    Tamil: 'மாற்றங்களைச் சேமி',
    Tanglish: 'Changes-ah Save Pannu',
    Hindi: 'बदलाव सहेजें',
    Malayalam: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
    Telugu: 'మార్పులను సేవ్ చేయండి'
  },
  'btn.cancel': {
    English: 'Cancel',
    Tamil: 'ரத்து செய்',
    Tanglish: 'Cancel Pannu',
    Hindi: 'रद्द करें',
    Malayalam: 'റദ്ദാക്കുക',
    Telugu: 'రద్దు చేయండి'
  },
  'btn.clear': {
    English: 'Clear History',
    Tamil: 'வரலாற்றை அழி',
    Tanglish: 'History-ah Clear Pannu',
    Hindi: 'इतिहास साफ़ करें',
    Malayalam: 'ചരിത്രം മായ്ക്കുക',
    Telugu: 'చరిత్రను క్లియర్ చేయండి'
  },

  // DASHBOARD
  'dash.welcome': {
    English: 'Welcome back,',
    Tamil: 'மீண்டும் வருக,',
    Tanglish: 'Welcome back,',
    Hindi: 'वापसी पर स्वागत है,',
    Malayalam: 'വീണ്ടും സ്വാഗതം,',
    Telugu: 'తిరిగి స్వాగతం,'
  },
  'dash.targetCompanyLabel': {
    English: 'Target Company:',
    Tamil: 'இலக்கு நிறுவனம்:',
    Tanglish: 'Target Company:',
    Hindi: 'लक्षित कंपनी:',
    Malayalam: 'ലക്ഷ്യമിട്ട കമ്പനി:',
    Telugu: 'లక్ష్యంగా ఉన్న కంపెనీ:'
  },
  'dash.readinessLabel': {
    English: 'Placement Readiness Score',
    Tamil: 'வேலைவாய்ப்பு தயார்நிலை மதிப்பெண்',
    Tanglish: 'Placement Readiness Score',
    Hindi: 'प्लेसमेंट तैयारी स्कोर',
    Malayalam: 'പ്ലേസ്മെന്റ് സജ്ജീകരണ സ്കോർ',
    Telugu: 'ప్లేస్‌మెంట్ సన్నాహక స్కోరు'
  },
  'dash.overallScore': {
    English: 'Overall Score',
    Tamil: 'மொத்த மதிப்பெண்',
    Tanglish: 'Overall Score',
    Hindi: 'कुल स्कोर',
    Malayalam: 'ആകെ സ്കോർ',
    Telugu: 'మొత్తం స్కోరు'
  },
  'dash.aptitudeScore': {
    English: 'Aptitude & Logic',
    Tamil: 'திறனறிவு & தர்க்கம்',
    Tanglish: 'Aptitude & Logic',
    Hindi: 'योग्यता और तर्क',
    Malayalam: 'ആപ്റ്റിറ്റ്യൂഡ് & ലോജിക്',
    Telugu: 'ఆప్టిట్యూడ్ & లాజిక్'
  },
  'dash.dsaScore': {
    English: 'DSA Mastery',
    Tamil: 'தரவு கட்டமைப்புகள்',
    Tanglish: 'DSA Mastery',
    Hindi: 'डेटा स्ट्रक्चर्स',
    Malayalam: 'ഡാറ്റാ സ്ട്രക്ചറുകൾ',
    Telugu: 'డేటా స్ట్రక్చర్స్'
  },
  'dash.programmingScore': {
    English: 'Programming',
    Tamil: 'நிரலாக்கம்',
    Tanglish: 'Programming Practice',
    Hindi: 'प्रोग्रामिंग',
    Malayalam: 'പ്രോഗ്രാമിംഗ്',
    Telugu: 'ప్రోగ്രാమింగ్'
  },
  'dash.communicationScore': {
    English: 'Spoken Communication',
    Tamil: 'பேச்சு தொடர்பு',
    Tanglish: 'Spoken Communication',
    Hindi: 'मौखिक संचार',
    Malayalam: 'സംസാര വിവരവിനിമയം',
    Telugu: 'సంభాషణ నైపుణ్యం'
  },
  'dash.quickActionsTitle': {
    English: 'Recommended Quick Practice',
    Tamil: 'பரிந்துரைக்கப்பட்ட விரைவுப் பயிற்சி',
    Tanglish: 'Recommended Quick Practice',
    Hindi: 'अनुशंसित त्वरित अभ्यास',
    Malayalam: 'ശ്രദ്ധിക്കേണ്ട ദ്രുത പരിശീലനം',
    Telugu: 'సిఫార్సు చేసిన త్వరిత ప్రాక్టీస్'
  },
  'dash.startChallenge': {
    English: 'Daily Challenges Sprint',
    Tamil: 'தினசரி சவால்கள்',
    Tanglish: 'Daily Challenges Sprint',
    Hindi: 'दैनिक चुनौतियाँ',
    Malayalam: 'ദിനചര്യ വെല്ലുവിളികൾ',
    Telugu: 'రోజువారీ సవాళ్లు'
  },
  'dash.practiceAptitude': {
    English: 'Practice Quant & Logic',
    Tamil: 'திறனறிவு பயிற்சி',
    Tanglish: 'Aptitude Practice Pannu',
    Hindi: 'योग्यता अभ्यास',
    Malayalam: 'ആപ്റ്റിറ്റ്യൂഡ് പരിശീലനം',
    Telugu: 'ఆప్టిట్యూడ్ ప్రాక్టీస్'
  },
  'dash.solveDSA': {
    English: 'Solve Algorithm Problems',
    Tamil: 'அல்காரிதம் கணக்குகள்',
    Tanglish: 'DSA Problems Solve Pannu',
    Hindi: 'एल्गोरिदम हल करें',
    Malayalam: 'ആൽഗോരിതം പരിശീലിക്കുക',
    Telugu: 'ఆల్గోరిథమ్స్ పూర్తి చేయండి'
  },
  'dash.codeIn': {
    English: 'Interactive Programming Studio',
    Tamil: 'ஊடாடும் நிரலாக்க மையம்',
    Tanglish: 'Programming Studio',
    Hindi: 'प्रोग्रामिंग स्टूडियो',
    Malayalam: 'പ്രോഗ്രാമിംഗ് സ്റ്റുഡിയോ',
    Telugu: 'ప్రోగ്രാమింగ్ స్టూడియో'
  },

  // PROFILE MODAL
  'profile.title': {
    English: 'Candidate Placement Profile',
    Tamil: 'வேலைவேட்பாளர் சுயவிவரம்',
    Tanglish: 'Candidate Placement Profile',
    Hindi: 'उम्मीदवार प्लेसमेंट प्रोफ़ाइल',
    Malayalam: 'ഉദ്യോഗാർത്ഥി പ്രൊഫൈൽ',
    Telugu: 'అభ్యర్థి ప్లేస్‌మెంట్ ప్రొఫైల్'
  },
  'profile.fullName': {
    English: 'Full Name',
    Tamil: 'முழு பெயர்',
    Tanglish: 'Full Name',
    Hindi: 'पूरा नाम',
    Malayalam: 'പൂർണ്ണ നാമം',
    Telugu: 'పూర్తి పేరు'
  },
  'profile.collegeName': {
    English: 'College / Institution Name',
    Tamil: 'கல்லூரி / கல்வி நிறுவனம்',
    Tanglish: 'College Name',
    Hindi: 'कॉलेज / संस्थान का नाम',
    Malayalam: 'കോളേജ് നാമം',
    Telugu: 'కళాశాల పేరు'
  },
  'profile.academicYear': {
    English: 'Academic Year',
    Tamil: 'கல்வியாண்டு',
    Tanglish: 'Academic Year',
    Hindi: 'शैक्षणिक वर्ष',
    Malayalam: 'അക്കാദമിക് വർഷം',
    Telugu: 'విద్యా సంవత్సరం'
  },
  'profile.department': {
    English: 'Department / Branch',
    Tamil: 'துறை / பிரிவு',
    Tanglish: 'Department',
    Hindi: 'विभाग / शाखा',
    Malayalam: 'വകുപ്പ്',
    Telugu: 'విభాగం'
  },
  'profile.targetCompany': {
    English: 'Target Company',
    Tamil: 'இலக்கு நிறுவனம்',
    Tanglish: 'Target Company',
    Hindi: 'लक्षित कंपनी',
    Malayalam: 'ലക്ഷ്യമിട്ട കമ്പനി',
    Telugu: 'లక్ష్యంగా ఉన్న కంపెనీ'
  },

  // PROGRAMMING MODULE TUTOR
  'prog.welcomeTitle': {
    English: 'AI Programming Tutor & Studio',
    Tamil: 'AI நிரலாக்க பயிற்சியாளர்',
    Tanglish: 'AI Programming Tutor',
    Hindi: 'एआई प्रोग्रामिंग ट्यूटर',
    Malayalam: 'എഐ പ്രോഗ്രാമിംഗ് ട്യൂട്ടർ',
    Telugu: 'ఏఐ ప్రోగ్రామింగ్ ట్యూటర్'
  },
  'prog.selectLanguage': {
    English: 'Select Language to Master:',
    Tamil: 'கற்க வேண்டிய மொழியைத் தேர்ந்தெடுக்கவும்:',
    Tanglish: 'Master panna Language-ah Select Pannu:',
    Hindi: 'सीखने के लिए भाषा चुनें:',
    Malayalam: 'പഠിക്കേണ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:',
    Telugu: 'నేర్చుకోవడానికి భాషను ఎంచుకోండి:'
  },
  'prog.startLearning': {
    English: 'Start Step-by-Step Learning Course',
    Tamil: 'படிபடியா பாடப் பயிற்சியைத் தொடங்கு',
    Tanglish: 'Step-by-Step Learning Course-ah Start Pannu',
    Hindi: 'चरण-दर-चरण पाठ्यक्रम शुरू करें',
    Malayalam: 'ഘട്ടം ഘട്ടമായുള്ള പഠനം ആരംഭിക്കുക',
    Telugu: 'దశలవారీ కోర్సును ప్రారంభించండి'
  },
  'prog.coursePath': {
    English: 'Structured Learning Path',
    Tamil: 'கட்டமைக்கப்பட்ட கற்றல் பாதை',
    Tanglish: 'Structured Learning Path',
    Hindi: 'संरचित शिक्षण मार्ग',
    Malayalam: 'ക്രമീകരിച്ച പഠന പാത',
    Telugu: 'నిర్మితమైన నేర్చుకునే మార్గం'
  },
  'prog.interactiveEditor': {
    English: 'Interactive Code Studio',
    Tamil: 'ஊடாடும் நிரல் மையம்',
    Tanglish: 'Interactive Code Studio',
    Hindi: 'इंटरएक्टिव कोड स्टूडियो',
    Malayalam: 'ഇന്ററാക്ടീവ് കോഡ് സ്റ്റുഡിയോ',
    Telugu: 'ఇంటరాక్టివ్ కోడ్ స్టూడియో'
  },
  'prog.aiTutorTab': {
    English: 'Ask AI Tutor',
    Tamil: 'AI பயிற்சியாளரிடம் கேள்',
    Tanglish: 'AI Tutor-kitta Kaelu',
    Hindi: 'एआई ट्यूटर से पूछें',
    Malayalam: 'എഐ ട്യൂട്ടറോട് ചോദിക്കുക',
    Telugu: 'ఏఐ ట్యూటర్‌ని అడగండి'
  },
  'prog.practiceTab': {
    English: 'Concept & Practice Code',
    Tamil: 'கோட்பாடு மற்றும் பயிற்சி நிரல்',
    Tanglish: 'Concept & Practice Code',
    Hindi: 'अवधारणा और कोड अभ्यास',
    Malayalam: 'ആശയം & കോഡ് പ്രാക്ടീസ്',
    Telugu: 'కాన్సెప్ట్ & కోడ్ ప్రాక్టీస్'
  },
  'prog.askTutorPlaceholder': {
    English: 'Ask AI Tutor (e.g. "Explain this loop simply", "Why error?", "Give example")...',
    Tamil: 'AI பயிற்சியாளரிடம் கேட்கவும் (எ.கா: "இந்த லூப்பை எளிமையா விளக்கு", "ஏன் இந்த பிழை?")...',
    Tanglish: 'AI Tutor-kitta kaelu (e.g. "Indha concept puriyala", "Why error?", "Simple ah explain pannu")...',
    Hindi: 'एआई ट्यूटर से पूछें (जैसे "यह लूप समझाएं", "त्रुटि क्यों आई?")...',
    Malayalam: 'എഐ ട്യൂട്ടറോട് ചോദിക്കുക (ഉദാ: "ഈ ലൂപ്പ് ലളിതമായി വിശദീകരിക്കുക")...',
    Telugu: 'ఏఐ ట്യൂటర్‌ని అడగండి (ఉదా: "ఈ లూప్‌ని సులభంగా వివరించండి")...'
  },
  'prog.errorExplanationTitle': {
    English: 'AI Error & Debug Explanation',
    Tamil: 'AI பிழை விளக்கப்பகுப்பாய்வு',
    Tanglish: 'AI Error & Debug Explanation',
    Hindi: 'एआई त्रुटि और डिबग व्याख्या',
    Malayalam: 'എഐ പിശക് വിശദീകരണം',
    Telugu: 'ఏఐ ఎర్రర్ వివరణ'
  }
};

export function t(key: string, language: ExplanationLanguageOption | string = 'English'): string {
  const normLang = language || 'English';
  if (translations[key] && translations[key][normLang]) {
    return translations[key][normLang];
  }
  if (translations[key] && translations[key]['English']) {
    return translations[key]['English'];
  }
  return key;
}
