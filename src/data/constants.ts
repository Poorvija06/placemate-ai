import { 
  YearOption, 
  DepartmentOption, 
  ProgrammingLangOption, 
  DomainOption, 
  TargetCompanyOption, 
  ExplanationLanguageOption 
} from '../types.js';

export const YEAR_OPTIONS: YearOption[] = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year'
];

export const DEPARTMENT_OPTIONS: DepartmentOption[] = [
  'Information Technology (IT)',
  'Computer Science and Engineering (CSE)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Artificial Intelligence and Machine Learning (AI & ML)',
  'Computer Science and Business Systems (CSBS)'
];

export const PROGRAMMING_LANGUAGES: ProgrammingLangOption[] = [
  'Java',
  'Python',
  'C',
  'C++'
];

export const DOMAIN_OPTIONS: DomainOption[] = [
  'Software Development',
  'Web Development',
  'Full Stack Development',
  'Mobile App Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Analytics',
  'Cyber Security',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Testing / QA',
  'Database / Backend Development'
];

export const TARGET_COMPANIES: TargetCompanyOption[] = [
  'TCS',
  'Infosys',
  'Wipro',
  'Accenture',
  'Cognizant',
  'Capgemini',
  'HCLTech',
  'Tech Mahindra',
  'Zoho',
  'Amazon',
  'Microsoft',
  'Google',
  'IBM',
  'Deloitte',
  'EY',
  'PwC',
  'Oracle',
  'Freshworks',
  'Other'
];

export const EXPLANATION_LANGUAGES: ExplanationLanguageOption[] = [
  'English',
  'Tamil',
  'Tanglish',
  'Hindi',
  'Malayalam',
  'Telugu',
  'Other'
];

export const APTITUDE_TOPICS = [
  { id: 'number-system', title: 'Number System', category: 'Quantitative', icon: 'Hash' },
  { id: 'percentages', title: 'Percentages', category: 'Quantitative', icon: 'Percent' },
  { id: 'profit-loss', title: 'Profit & Loss', category: 'Quantitative', icon: 'TrendingUp' },
  { id: 'ratio-proportion', title: 'Ratio & Proportion', category: 'Quantitative', icon: 'PieChart' },
  { id: 'averages', title: 'Averages', category: 'Quantitative', icon: 'BarChart' },
  { id: 'time-work', title: 'Time & Work', category: 'Quantitative', icon: 'Clock' },
  { id: 'speed-distance', title: 'Time, Speed & Distance', category: 'Quantitative', icon: 'Zap' },
  { id: 'interest', title: 'Simple & Compound Interest', category: 'Quantitative', icon: 'DollarSign' },
  { id: 'probability', title: 'Probability', category: 'Quantitative', icon: 'Dices' },
  { id: 'permutations', title: 'Permutation & Combination', category: 'Quantitative', icon: 'Shuffle' },
  { id: 'number-series', title: 'Number Series', category: 'Logical', icon: 'ListOrdered' },
  { id: 'coding-decoding', title: 'Coding & Decoding', category: 'Logical', icon: 'Binary' },
  { id: 'blood-relations', title: 'Blood Relations', category: 'Logical', icon: 'Users' },
  { id: 'direction-sense', title: 'Direction Sense', category: 'Logical', icon: 'Compass' },
  { id: 'syllogism', title: 'Syllogism', category: 'Logical', icon: 'CheckSquare' },
  { id: 'data-interpretation', title: 'Data Interpretation', category: 'Logical', icon: 'Table' }
];

export const DSA_TOPICS = [
  { id: 'arrays', title: 'Arrays', difficulty: 'Easy', icon: 'Grid' },
  { id: 'strings', title: 'Strings', difficulty: 'Easy', icon: 'Type' },
  { id: 'linked-list', title: 'Linked List', difficulty: 'Medium', icon: 'Link' },
  { id: 'stack', title: 'Stack', difficulty: 'Medium', icon: 'Layers' },
  { id: 'queue', title: 'Queue', difficulty: 'Medium', icon: 'List' },
  { id: 'trees', title: 'Trees', difficulty: 'Hard', icon: 'GitMerge' },
  { id: 'graphs', title: 'Graphs', difficulty: 'Hard', icon: 'Share2' },
  { id: 'searching', title: 'Searching (Linear, Binary)', difficulty: 'Easy', icon: 'Search' },
  { id: 'sorting', title: 'Sorting (Bubble, Quick, Merge)', difficulty: 'Medium', icon: 'ArrowUpDown' },
  { id: 'recursion', title: 'Recursion', difficulty: 'Medium', icon: 'Repeat' },
  { id: 'dynamic-programming', title: 'Dynamic Programming', difficulty: 'Hard', icon: 'Cpu' }
];
