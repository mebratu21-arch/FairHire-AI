export interface JobPostingDto {
  id?: string;
  tenantId?: string;
  title: string;
  department: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  language: 'en' | 'he' | 'am';
  status: 'draft' | 'published' | 'archived';
  description: string;
  screeningCriteria: {
    id: string;
    name: string;
    description: string;
    weight: number;
    targetKeywords: string[];
  }[];
  applicantCount?: number;
  createdAt?: string;
}

export interface CandidateApplicationDto {
  id: string;
  tenantId: string;
  jobId: string;
  jobTitle: string;
  candidateToken: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  overallScore: number;
  verifiedQuotesValid: boolean;
  verifiedQuotes: string[];
  redactedCv: string;
  candidateLanguage: 'en' | 'he' | 'am';
  notesCount: number;
  createdAt: string;
}

export interface CandidateNoteDto {
  id: string;
  applicationId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface EmailTemplateDto {
  id: string;
  name: string;
  category: 'invite' | 'acknowledgement' | 'rejection' | 'offer';
  subject: string;
  body: string;
  language: string;
}
