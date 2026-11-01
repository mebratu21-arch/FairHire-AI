import { Injectable, NotFoundException } from '@nestjs/common';
import {
  JobPostingDto,
  CandidateApplicationDto,
  CandidateNoteDto,
  EmailTemplateDto,
} from './recruiter.types';

@Injectable()
export class RecruiterService {
  private jobs: JobPostingDto[] = [
    {
      id: 'job_01',
      tenantId: 'tenant_fairhire_default',
      title: 'Senior Distributed Systems Engineer',
      department: 'Platform Engineering',
      location: 'Tel Aviv / Remote',
      workplaceType: 'hybrid',
      language: 'en',
      status: 'published',
      description: 'Architect resilient high-throughput cloud infrastructure and streaming data pipelines with zero-trust security.',
      screeningCriteria: [
        {
          id: 'crit_1',
          name: 'Distributed Systems Architecture',
          description: 'Experience with Kafka, Raft/Paxos consensus, and event-driven microservices.',
          weight: 0.4,
          targetKeywords: ['distributed', 'kafka', 'consensus', 'microservices', 'kubernetes'],
        },
        {
          id: 'crit_2',
          name: 'High-Concurrency Runtime',
          description: 'Deep knowledge of Go, Rust, or modern Node.js concurrency primitives.',
          weight: 0.35,
          targetKeywords: ['concurrency', 'go', 'rust', 'memory', 'throughput', 'async'],
        },
        {
          id: 'crit_3',
          name: 'Observability & SRE Reliability',
          description: 'Production incident management, tracing, and metric collection.',
          weight: 0.25,
          targetKeywords: ['prometheus', 'grafana', 'opentelemetry', 'slo', 'tracing'],
        },
      ],
      applicantCount: 14,
      createdAt: '2026-10-24T10:00:00.000Z',
    },
    {
      id: 'job_02',
      tenantId: 'tenant_fairhire_default',
      title: 'מפתח/ת Full-Stack בכיר/ה (Next.js & TypeScript)',
      department: 'Product Engineering',
      location: 'Herzliya / Hybrid',
      workplaceType: 'hybrid',
      language: 'he',
      status: 'published',
      description: 'הובלת פיתוח מערכות ליבה של פלטפורמת הגיוס ההוגן עם דגש על ארכיטקטורה נקייה, ביצועים גבוהים וחווית משתמש מעולה.',
      screeningCriteria: [
        {
          id: 'crit_he_1',
          name: 'מומחיות ב-React ו-Next.js',
          description: 'שליטה מעמיקה ב-App Router, Server Components וניהול ביצועים.',
          weight: 0.45,
          targetKeywords: ['react', 'next.js', 'typescript', 'tailwind', 'state'],
        },
        {
          id: 'crit_he_2',
          name: 'תכנון Backend ו-PostgreSQL',
          description: 'ידע ב-SQL, אינדוקס, תכנון סכמות ומערכות הרשאות.',
          weight: 0.35,
          targetKeywords: ['postgresql', 'sql', 'nest', 'express', 'api'],
        },
        {
          id: 'crit_he_3',
          name: 'הובלה טכנולוגית ועבודת צוות',
          description: 'חניכת מפתחים, Code Reviews וכתיבת תיעוד טכני.',
          weight: 0.2,
          targetKeywords: ['mentoring', 'architecture', 'review', 'collaboration'],
        },
      ],
      applicantCount: 9,
      createdAt: '2026-10-28T14:30:00.000Z',
    },
    {
      id: 'job_03',
      tenantId: 'tenant_fairhire_default',
      title: 'ዋና የሶፍትዌር መሐንዲስ (Lead Software Engineer)',
      department: 'Core Infrastructure',
      location: 'Addis Ababa / Remote',
      workplaceType: 'remote',
      language: 'am',
      status: 'published',
      description: 'ለፋይናንስ እና ለግንኙነት ቴክኖሎጂዎች አስተማማኝ እና ደህንነቱ የተጠበቀ የሶፍትዌር መሰረተ-ልማት ግንባታን መምራት።',
      screeningCriteria: [
        {
          id: 'crit_am_1',
          name: 'የመረጃ ቋት እና የስርዓት ደህንነት (Security & DB)',
          description: 'በPostgreSQL፣ ዳታቤዝ ደህንነት እና መረጃ ጥበቃ ላይ የዳበረ ልምድ።',
          weight: 0.5,
          targetKeywords: ['database', 'security', 'postgresql', 'architecture', 'ደህንነት'],
        },
        {
          id: 'crit_am_2',
          name: 'የቡድን አመራር እና የስራ ቅልጥፍና (Team Leadership)',
          description: 'ትላልቅ ፕሮጀክቶችን በስኬት ማጠናቀቅ እና ወጣት መሐንዲሶችን ማብቃት።',
          weight: 0.5,
          targetKeywords: ['leadership', 'mentorship', 'planning', 'agile', 'አመራር'],
        },
      ],
      applicantCount: 6,
      createdAt: '2026-10-30T08:15:00.000Z',
    },
  ];

  private applications: CandidateApplicationDto[] = [
    {
      id: 'app_01',
      tenantId: 'tenant_fairhire_default',
      jobId: 'job_01',
      jobTitle: 'Senior Distributed Systems Engineer',
      candidateToken: 'cand_98124_blind',
      stage: 'interview',
      overallScore: 89.5,
      verifiedQuotesValid: true,
      verifiedQuotes: [
        'Architected real-time streaming pipeline processing 180k events/sec using Apache Kafka',
        'Implemented Raft consensus cluster ensuring strict consistency during failover tests',
        'Configured Prometheus OpenTelemetry exporters and reduced MTTR by 42%',
      ],
      redactedCv: `[CANDIDATE] has 8+ years experience in distributed backend architectures.
Led development of low-latency transaction engine in Go and Kubernetes.
Architected real-time streaming pipeline processing 180k events/sec using Apache Kafka.
Implemented Raft consensus cluster ensuring strict consistency during failover tests.
Configured Prometheus OpenTelemetry exporters and reduced MTTR by 42%.
Contact: [REDACTED_EMAIL] | [REDACTED_PHONE]`,
      candidateLanguage: 'en',
      notesCount: 2,
      createdAt: '2026-10-25T11:20:00.000Z',
    },
    {
      id: 'app_02',
      tenantId: 'tenant_fairhire_default',
      jobId: 'job_01',
      jobTitle: 'Senior Distributed Systems Engineer',
      candidateToken: 'cand_41782_blind',
      stage: 'screening',
      overallScore: 78.0,
      verifiedQuotesValid: true,
      verifiedQuotes: [
        'Built microservices using Go and Docker containerized deployment',
        'Integrated Kafka event queues for background task scheduling',
      ],
      redactedCv: `Backend engineer with 5 years focus on cloud infrastructure.
Built microservices using Go and Docker containerized deployment.
Integrated Kafka event queues for background task scheduling.
Maintained Kubernetes clusters and observability dashboards.
Contact: [REDACTED_EMAIL]`,
      candidateLanguage: 'en',
      notesCount: 1,
      createdAt: '2026-10-26T15:00:00.000Z',
    },
    {
      id: 'app_03',
      tenantId: 'tenant_fairhire_default',
      jobId: 'job_02',
      jobTitle: 'מפתח/ת Full-Stack בכיר/ה (Next.js & TypeScript)',
      candidateToken: 'cand_he_5521',
      stage: 'interview',
      overallScore: 92.0,
      verifiedQuotesValid: true,
      verifiedQuotes: [
        'פיתוח מערכות פרונט-אנד מורכבות ב-Next.js 15 App Router ו-TypeScript',
        'תכנון סכמות ב-PostgreSQL תוך אופטימיזציית שאילתות ואינדקסים',
      ],
      redactedCv: `מועמד/ת בעל/ת 7 שנות ניסיון בהובלת צוותי פיתוח.
פיתוח מערכות פרונט-אנד מורכבות ב-Next.js 15 App Router ו-TypeScript.
תכנון סכמות ב-PostgreSQL תוך אופטימיזציית שאילתות ואינדקסים.
הובלת Code Reviews וחניכת מפתחים ג׳וניורים.
פרטי התקשרות: [REDACTED_EMAIL]`,
      candidateLanguage: 'he',
      notesCount: 3,
      createdAt: '2026-10-29T09:40:00.000Z',
    },
    {
      id: 'app_04',
      tenantId: 'tenant_fairhire_default',
      jobId: 'job_03',
      jobTitle: 'ዋና የሶፍትዌር መሐንዲስ (Lead Software Engineer)',
      candidateToken: 'cand_am_3019',
      stage: 'applied',
      overallScore: 86.0,
      verifiedQuotesValid: true,
      verifiedQuotes: [
        'በPostgreSQL እና በክላውድ ደህንነት ላይ ከ6 ዓመታት በላይ ተግባራዊ ልምድ',
        'የሶፍትዌር ቡድንን በመምራት ውስብስብ የቴክኖሎጂ ስራዎችን በብቃት ማጠናቀቅ',
      ],
      redactedCv: `[CANDIDATE] ከፍተኛ ልምድ ያለው የሶፍትዌር መሐንዲስ።
በPostgreSQL እና በክላውድ ደህንነት ላይ ከ6 ዓመታት በላይ ተግባራዊ ልምድ።
የሶፍትዌር ቡድንን በመምራት ውስብስብ የቴክኖሎጂ ስራዎችን በብቃት ማጠናቀቅ።
ያልተቋረጠ የስርዓት ስራ እና የኮድ ግምገማዎችን ማካሄድ።
አድራሻ: [REDACTED_EMAIL]`,
      candidateLanguage: 'am',
      notesCount: 1,
      createdAt: '2026-10-31T12:10:00.000Z',
    },
  ];

  private notes: CandidateNoteDto[] = [
    {
      id: 'note_01',
      applicationId: 'app_01',
      authorName: 'Sarah Chen (Recruiter)',
      content: 'Blind screening passed with high scores in consensus & Kafka. Candidate demonstrates stellar systems depth.',
      createdAt: '2026-10-25T14:00:00.000Z',
    },
    {
      id: 'note_02',
      applicationId: 'app_03',
      authorName: 'Sarah Chen (Recruiter)',
      content: 'ציטוטים אומתו במלואם. התאמה מעולה לדרישות ה-Full-Stack והובלת הצוות הטכנולוגי.',
      createdAt: '2026-10-29T11:00:00.000Z',
    },
  ];

  private emailTemplates: EmailTemplateDto[] = [
    {
      id: 'tpl_invite_en',
      name: 'Technical Interview Invitation (English)',
      category: 'invite',
      subject: 'Interview with FairHire AI: Next Steps for {{job_title}}',
      body: `Hello {{candidate_token}},

Congratulations! Based on your verified qualifications in our blind screening review for the {{job_title}} role at {{company_name}}, we would love to invite you to a technical interview.

We practice blind evaluation to ensure fair, merit-based hiring. During this 45-minute conversation, you will meet with the engineering lead to discuss system architecture and distributed systems.

Please let us know your availability over the next few business days.

Warm regards,
Talent Acquisition Team
{{company_name}}`,
      language: 'en',
    },
    {
      id: 'tpl_invite_he',
      name: 'הזמנה לראיון טכנולוגי (עברית)',
      category: 'invite',
      subject: 'הזמנה לראיון עבור משרת {{job_title}} ב-{{company_name}}',
      body: `שלום {{candidate_token}},

שמחים לעדכן כי קורות החיים שלך עברו בהצלחה יתרה את שלב הסינון העיוור עבור משרת {{job_title}}.

כחלק ממחויבותנו לגיוס הוגן ונטול הטיות, בחנו את התאמתך המקצועית בלבד. נשמח להזמינך לשיחה טכנולוגית מעמיקה בת 45 דקות.

נודה אם תשיב/י למייל זה עם מועדים נוחים עבורך בימים הקרובים.

בברכה,
צוות הגיוס והטכנולוגיה
{{company_name}}`,
      language: 'he',
    },
    {
      id: 'tpl_invite_am',
      name: 'የቃለ መጠይቅ ጥሪ (አማርኛ)',
      category: 'invite',
      subject: 'የቃለ-መጠይቅ ጥሪ ለ{{job_title}} የስራ መደብ - {{company_name}}',
      body: `ሰላም {{candidate_token}}፣

ለ{{job_title}} የስራ መደብ ያቀረቡት ማመልከቻ በFairHire አድልዎ-አልባ የብቃት ማጣሪያ ስርዓት መሰረት ከፍተኛ ነጥብ በማስመዝገብ ለቀጣይ ዙር አልፏል።

የብቃት እና የቴክኒክ ክህሎትዎን ለመገምገም የ45 ደቂቃ የኦንላይን ቃለ-መጠይቅ ማድረግ እንፈልጋለን።

እባክዎ ለእርስዎ የሚመችዎትን የቀን እና የሰዓት አማራጮች ያሳውቁን።

ከሰላምታ ጋር፣
የቅጥር አስተዳደር ቡድን
{{company_name}}`,
      language: 'am',
    },
  ];

  // Jobs CRUD
  getJobs(tenantId: string): JobPostingDto[] {
    return this.jobs.filter((j) => j.tenantId === tenantId);
  }

  createJob(tenantId: string, dto: JobPostingDto): JobPostingDto {
    const newJob: JobPostingDto = {
      ...dto,
      id: `job_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  updateJob(tenantId: string, id: string, dto: Partial<JobPostingDto>): JobPostingDto {
    const index = this.jobs.findIndex((j) => j.id === id && j.tenantId === tenantId);
    if (index === -1) {
      throw new NotFoundException('Job posting not found');
    }
    this.jobs[index] = { ...this.jobs[index], ...dto };
    return this.jobs[index];
  }

  deleteJob(tenantId: string, id: string): { success: boolean } {
    const index = this.jobs.findIndex((j) => j.id === id && j.tenantId === tenantId);
    if (index === -1) {
      throw new NotFoundException('Job posting not found');
    }
    this.jobs.splice(index, 1);
    return { success: true };
  }

  // Applications
  getApplications(tenantId: string, jobId?: string): CandidateApplicationDto[] {
    return this.applications.filter((a) => {
      const matchTenant = a.tenantId === tenantId;
      const matchJob = jobId ? a.jobId === jobId : true;
      return matchTenant && matchJob;
    });
  }

  updateStage(
    tenantId: string,
    applicationId: string,
    newStage: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected',
  ): CandidateApplicationDto {
    const app = this.applications.find((a) => a.id === applicationId && a.tenantId === tenantId);
    if (!app) {
      throw new NotFoundException('Application not found');
    }
    app.stage = newStage;
    return app;
  }

  // Notes
  getNotes(applicationId: string): CandidateNoteDto[] {
    return this.notes.filter((n) => n.applicationId === applicationId);
  }

  addNote(applicationId: string, authorName: string, content: string): CandidateNoteDto {
    const newNote: CandidateNoteDto = {
      id: `note_${Math.random().toString(36).substring(2, 9)}`,
      applicationId,
      authorName,
      content,
      createdAt: new Date().toISOString(),
    };
    this.notes.unshift(newNote);

    const app = this.applications.find((a) => a.id === applicationId);
    if (app) {
      app.notesCount += 1;
    }

    return newNote;
  }

  // Email Templates & Sending
  getTemplates(tenantId: string): EmailTemplateDto[] {
    return this.emailTemplates;
  }

  sendCommunication(
    tenantId: string,
    data: {
      applicationId: string;
      candidateToken: string;
      templateId: string;
      subject: string;
      body: string;
    },
  ) {
    return {
      success: true,
      dispatchedAt: new Date().toISOString(),
      recipientToken: data.candidateToken,
      subject: data.subject,
      message: 'Candidate communication dispatched securely through FairHire blind messaging gateway.',
    };
  }
}
