export type AppMode = 
  | 'linkedin_feed' 
  | 'linkedin_profile' 
  | 'ats_checker' 
  | 'jobify_studio' 
  | 'job_board' 
  | 'application_tracker';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  bannerUrl: string;
  headline: string;
  about: string;
  openToWork: boolean;
  connectionsCount: number;
  profileViews: number;
  postImpressions: number;
  searchAppearances: number;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  recommendations: RecommendationItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'hard' | 'soft' | 'tool';
  endorsements: number;
  endorsedByMe: boolean;
}

export interface RecommendationItem {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  relationship: string;
  text: string;
  date: string;
}

// ATS Resume Types
export interface KeywordMetric {
  term: string;
  category: 'technical' | 'soft_skill' | 'tool' | 'methodology';
  importance: 'critical' | 'high' | 'recommended';
  foundInResume: boolean;
  frequencyInJob: number;
  frequencyInResume: number;
}

export interface BulletImprovement {
  id: string;
  original: string;
  improved: string;
  scoreBoost: number;
  critique: string;
  missingKeywordsAdded: string[];
}

export interface AtsAuditCheck {
  id: string;
  name: string;
  category: 'format' | 'content' | 'sections' | 'metrics';
  status: 'passed' | 'warning' | 'failed';
  feedback: string;
}

export interface AtsScoreBreakdown {
  totalScore: number; // 0 - 100
  keywordScore: number; // 0 - 35
  impactScore: number; // 0 - 25
  formatScore: number; // 0 - 20
  structureScore: number; // 0 - 20
  totalKeywordsMatched: number;
  totalKeywordsRequired: number;
  quantifiableMetricsCount: number;
  actionVerbsCount: number;
}

// Jobify Types
export interface JobRequisition {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  salaryRange: string;
  department: string;
  experienceLevel: 'Entry' | 'Mid-Senior' | 'Lead' | 'Executive';
  postedAgo: string;
  applicantsCount: number;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  matchScore: number; // Dynamic against active resume
}

export type ApplicationStage = 
  | 'wishlist' 
  | 'applied' 
  | 'ats_passed' 
  | 'interviewing' 
  | 'offer' 
  | 'rejected';

export interface ApplicationCard {
  id: string;
  jobId: string;
  company: string;
  title: string;
  salary: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  stage: ApplicationStage;
  appliedDate: string;
  lastUpdated: string;
  atsMatchScore: number;
  tailoredResumeId?: string;
  coverLetterSnippet?: string;
  notes: string;
  interviewDate?: string;
}

export interface TailoredResume {
  id: string;
  targetJobId: string;
  targetJobTitle: string;
  targetCompany: string;
  tailoredHeadline: string;
  tailoredSummary: string;
  optimizedBullets: string[];
  matchedKeywords: string[];
  scoreBefore: number;
  scoreAfter: number;
  createdAt: string;
}

export interface CoverLetterRecord {
  id: string;
  jobTitle: string;
  company: string;
  hiringManager: string;
  tone: 'executive' | 'confident' | 'modern' | 'technical';
  content: string;
  createdAt: string;
}

export interface StarEvaluation {
  situationScore: number; // 0-25
  taskScore: number; // 0-25
  actionScore: number; // 0-25
  resultScore: number; // 0-25
  totalScore: number; // 0-100
  feedback: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

export interface MockInterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational' | 'system_design';
  roleTarget: string;
  question: string;
  hints: string[];
  evaluationCriteria: string;
}

export interface InterviewSessionRecord {
  id: string;
  questionId: string;
  questionText: string;
  candidateAnswer: string;
  evaluation: StarEvaluation;
  timestamp: string;
}

// LinkedIn Network Feed Types
export interface FeedComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface SocialFeedPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorCompany: string;
  timestamp: string;
  content: string;
  tags: string[];
  likesCount: number;
  userLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  comments: FeedComment[];
  attachmentType?: 'article' | 'job_share' | 'milestone';
  attachmentTitle?: string;
  attachmentDesc?: string;
}

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  mutualConnections: number;
  isConnected: boolean;
  connectionPending: boolean;
}

export interface PlatformNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'ats_boost' | 'job_match' | 'interview_reminder' | 'offer_alert' | 'social_reaction';
  read: boolean;
  targetMode?: AppMode;
}
