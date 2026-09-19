// ================================================================
// TENDERLENS — Complete Demo Data Store
// Realistic fictional procurement data for the Urban Mobility
// Infrastructure Package tender (₹48 Cr)
// ================================================================

// ── Types ────────────────────────────────────────────────────────

export type RequirementStatus = 'satisfied' | 'review' | 'missing' | 'unknown';
export type RequirementCategory = 'eligibility' | 'financial' | 'technical' | 'experience' | 'legal' | 'documentation' | 'submission' | 'other';
export type RiskLevel = 'high' | 'medium' | 'low';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'override';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: RequirementCategory;
  mandatory: boolean;
  sourceDocument: string;
  page: number;
  section: string;
  clause: string;
  threshold?: string;
  unit?: string;
  companyValue?: string;
  evidenceDocuments: string[];
  status: RequirementStatus;
  risk: RiskLevel;
  confidence: number;
  reviewStatus: ReviewStatus;
  aiExplanation: string;
}

export interface Evidence {
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  excerpt: string;
  evidenceType: string;
  matchedRequirement: string;
  confidence: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  reviewer?: string;
  timestamp: string;
}

export interface TenderDocument {
  id: string;
  name: string;
  type: 'tender' | 'financial' | 'experience' | 'technical' | 'legal' | 'certificate' | 'registration' | 'other';
  pages: number;
  uploadedAt: string;
  processed: boolean;
  evidenceCount: number;
  size: string;
}

export interface Tender {
  id: string;
  title: string;
  tenderId: string;
  organization: string;
  estimatedValue: string;
  currency: string;
  submissionDeadline: string;
  daysRemaining: number;
  totalRequirements: number;
  satisfiedRequirements: number;
  reviewRequirements: number;
  missingRequirements: number;
  readiness: number;
  risk: RiskLevel;
  status: 'analyzing' | 'in-review' | 'ready' | 'submitted' | 'archived';
  category: string;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  annualTurnover: string;
  yearsInOperation: number;
  employees: number;
  certifications: string[];
  pastProjects: PastProject[];
  technicalCapabilities: string[];
  locations: string[];
  registrations: string[];
  gstNumber: string;
  panNumber: string;
}

export interface PastProject {
  id: string;
  name: string;
  client: string;
  value: string;
  completionDate: string;
  nature: string;
  status: 'completed' | 'ongoing';
  certificateUploaded: boolean;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  relatedRequirement?: string;
  tenderId: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  actor: 'system' | 'ai' | 'user';
  tenderId?: string;
  icon: string;
}

export interface RiskItem {
  id: string;
  category: string;
  title: string;
  description: string;
  level: RiskLevel;
  source: string;
  impact: string;
  suggestedAction: string;
  relatedRequirements: string[];
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'release' | 'clarification' | 'pre-bid' | 'submission' | 'technical-opening' | 'financial-opening' | 'other';
  status: 'past' | 'upcoming' | 'imminent' | 'today';
  tenderId: string;
}

// ── Demo Company Profile ─────────────────────────────────────────

export const demoCompanyProfile: CompanyProfile = {
  name: 'Meridian Infrastructure Pvt. Ltd.',
  industry: 'Civil Engineering & Infrastructure Development',
  annualTurnover: '₹7.2 Crore',
  yearsInOperation: 8,
  employees: 145,
  certifications: [
    'ISO 9001:2015 — Quality Management',
    'ISO 14001:2015 — Environmental Management',
    'ISO 45001:2018 — Occupational Health & Safety',
  ],
  pastProjects: [
    {
      id: 'proj-1',
      name: 'Greenfield Highway Connector Phase II',
      client: 'National Highway Authority',
      value: '₹12.4 Crore',
      completionDate: '2024-03-15',
      nature: 'Road Infrastructure',
      status: 'completed',
      certificateUploaded: true,
    },
    {
      id: 'proj-2',
      name: 'Suburban Rail Station Modernization',
      client: 'Metro Rail Corporation',
      value: '₹16.8 Crore',
      completionDate: '2023-11-20',
      nature: 'Urban Transit Infrastructure',
      status: 'completed',
      certificateUploaded: true,
    },
    {
      id: 'proj-3',
      name: 'Industrial Zone Access Road Network',
      client: 'State Infrastructure Board',
      value: '₹8.6 Crore',
      completionDate: '2025-06-30',
      nature: 'Road Infrastructure',
      status: 'ongoing',
      certificateUploaded: false,
    },
  ],
  technicalCapabilities: [
    'Reinforced concrete construction',
    'Pre-stressed bridge construction',
    'Urban transit station works',
    'Road & highway construction',
    'Drainage & utility systems',
    'Environmental remediation',
  ],
  locations: ['New Delhi', 'Mumbai', 'Bengaluru'],
  registrations: [
    'MSME Registration (EM-II)',
    'PWD Class I Contractor',
    'CPWD Registered',
    'PAN: AABCM1234K',
    'GST: 07AABCM1234K1ZP',
  ],
  gstNumber: '07AABCM1234K1ZP',
  panNumber: 'AABCM1234K',
};

// ── Demo Tenders ─────────────────────────────────────────────────

export const demoTenders: Tender[] = [
  {
    id: 'tnd-001',
    title: 'Urban Mobility Infrastructure Package',
    tenderId: 'TND-2026-UMIP-48C',
    organization: 'Demo Infrastructure Authority',
    estimatedValue: '₹48 Crore',
    currency: 'INR',
    submissionDeadline: '2026-09-24',
    daysRemaining: 6,
    totalRequirements: 87,
    satisfiedRequirements: 64,
    reviewRequirements: 14,
    missingRequirements: 9,
    readiness: 74,
    risk: 'medium',
    status: 'in-review',
    category: 'Infrastructure',
  },
  {
    id: 'tnd-002',
    title: 'Water Treatment Plant Modernization',
    tenderId: 'TND-2026-WTPM-22C',
    organization: 'Municipal Water Board',
    estimatedValue: '₹22 Crore',
    currency: 'INR',
    submissionDeadline: '2026-10-05',
    daysRemaining: 17,
    totalRequirements: 63,
    satisfiedRequirements: 51,
    reviewRequirements: 8,
    missingRequirements: 4,
    readiness: 81,
    risk: 'low',
    status: 'in-review',
    category: 'Utilities',
  },
  {
    id: 'tnd-003',
    title: 'Smart Highway Corridor Phase III',
    tenderId: 'TND-2026-SHC3-65C',
    organization: 'National Highways Authority',
    estimatedValue: '₹65 Crore',
    currency: 'INR',
    submissionDeadline: '2026-09-28',
    daysRemaining: 10,
    totalRequirements: 112,
    satisfiedRequirements: 74,
    reviewRequirements: 22,
    missingRequirements: 16,
    readiness: 66,
    risk: 'high',
    status: 'analyzing',
    category: 'Highways',
  },
  {
    id: 'tnd-004',
    title: 'Solar Microgrid Deployment — Industrial Zone',
    tenderId: 'TND-2026-SMIZ-15C',
    organization: 'Renewable Energy Authority',
    estimatedValue: '₹15 Crore',
    currency: 'INR',
    submissionDeadline: '2026-10-12',
    daysRemaining: 24,
    totalRequirements: 45,
    satisfiedRequirements: 38,
    reviewRequirements: 5,
    missingRequirements: 2,
    readiness: 84,
    risk: 'low',
    status: 'ready',
    category: 'Energy',
  },
];

// ── Demo Requirements (for Urban Mobility tender) ────────────────

export const demoRequirements: Requirement[] = [
  {
    id: 'req-001',
    title: 'Minimum Annual Turnover',
    description: 'Bidder must have a minimum average annual turnover of ₹5 Crore over the last 3 financial years.',
    category: 'financial',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 18,
    section: 'Section 4 — Financial Criteria',
    clause: 'Clause 4.2',
    threshold: '₹5 Crore',
    unit: 'INR',
    companyValue: '₹7.2 Crore',
    evidenceDocuments: ['Financial_Statement_FY2025.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 96,
    reviewStatus: 'approved',
    aiExplanation: 'The verified company turnover of ₹7.2 Crore exceeds the minimum requirement of ₹5 Crore. Evidence sourced from audited financial statements for FY 2024–25.',
  },
  {
    id: 'req-002',
    title: 'Earnest Money Deposit (EMD)',
    description: 'Bidder must submit EMD of ₹96 Lakhs (2% of estimated contract value) in the form of a bank guarantee.',
    category: 'financial',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 12,
    section: 'Section 3 — Bid Security',
    clause: 'Clause 3.1',
    threshold: '₹96 Lakhs',
    companyValue: 'Bank Guarantee Arranged',
    evidenceDocuments: ['EMD_Bank_Guarantee.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 98,
    reviewStatus: 'approved',
    aiExplanation: 'EMD bank guarantee of ₹96 Lakhs has been arranged and document uploaded. Matches the 2% requirement of the ₹48 Crore estimated value.',
  },
  {
    id: 'req-003',
    title: 'Valid GST Registration',
    description: 'Bidder must possess a valid Goods and Services Tax registration certificate.',
    category: 'legal',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 22,
    section: 'Section 5 — Legal Requirements',
    clause: 'Clause 5.1',
    companyValue: 'GST: 07AABCM1234K1ZP',
    evidenceDocuments: ['GST_Registration.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 99,
    reviewStatus: 'approved',
    aiExplanation: 'Valid GST registration certificate uploaded. Registration number 07AABCM1234K1ZP verified against company profile.',
  },
  {
    id: 'req-004',
    title: 'PAN Card',
    description: 'Bidder must provide a valid Permanent Account Number (PAN) card.',
    category: 'legal',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 22,
    section: 'Section 5 — Legal Requirements',
    clause: 'Clause 5.2',
    companyValue: 'PAN: AABCM1234K',
    evidenceDocuments: ['PAN_Card.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 99,
    reviewStatus: 'approved',
    aiExplanation: 'PAN card AABCM1234K uploaded and matches the company registration details.',
  },
  {
    id: 'req-005',
    title: 'ISO 9001:2015 Certification',
    description: 'Bidder must hold a valid ISO 9001:2015 Quality Management System certification from an accredited body.',
    category: 'technical',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 30,
    section: 'Section 7 — Technical Qualifications',
    clause: 'Clause 7.3',
    companyValue: 'ISO 9001:2015 — Valid until Dec 2027',
    evidenceDocuments: ['ISO_9001_Certificate.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 94,
    reviewStatus: 'approved',
    aiExplanation: 'ISO 9001:2015 certificate from Bureau Veritas uploaded. Validity confirmed through December 2027.',
  },
  {
    id: 'req-006',
    title: 'Minimum 3 Similar Completed Projects',
    description: 'Bidder must have successfully completed at least 3 projects of similar nature (urban infrastructure) with a minimum value of ₹10 Crore each within the last 5 years.',
    category: 'experience',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 27,
    section: 'Section 6 — Experience Criteria',
    clause: 'Clause 6.4',
    threshold: '3 projects, ₹10 Crore each',
    companyValue: '2 projects verified',
    evidenceDocuments: ['Project_Completion_Highway.pdf', 'Project_Completion_Metro.pdf'],
    status: 'missing',
    risk: 'high',
    confidence: 88,
    reviewStatus: 'pending',
    aiExplanation: 'Only 2 qualifying projects identified: (1) Greenfield Highway Connector Phase II — ₹12.4 Cr, (2) Suburban Rail Station Modernization — ₹16.8 Cr. One additional qualifying project certificate is required. The Industrial Zone Access Road (₹8.6 Cr) does not meet the ₹10 Cr minimum threshold.',
  },
  {
    id: 'req-007',
    title: 'Minimum 5 Years Experience',
    description: 'Bidder must have been in operation for a minimum of 5 years in the relevant field of civil infrastructure construction.',
    category: 'experience',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 26,
    section: 'Section 6 — Experience Criteria',
    clause: 'Clause 6.1',
    threshold: '5 years',
    companyValue: '8 years',
    evidenceDocuments: ['Company_Registration_Certificate.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 97,
    reviewStatus: 'approved',
    aiExplanation: 'Company has been in operation for 8 years, exceeding the 5-year minimum requirement. Verified from incorporation certificate dated 2018.',
  },
  {
    id: 'req-008',
    title: 'Technical Personnel — Project Manager',
    description: 'Bidder must deploy a qualified Project Manager with minimum 10 years experience and a B.E./B.Tech in Civil Engineering.',
    category: 'technical',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 32,
    section: 'Section 7 — Technical Qualifications',
    clause: 'Clause 7.5',
    threshold: '10 years, B.E./B.Tech Civil',
    companyValue: 'CV submitted — 12 years experience',
    evidenceDocuments: ['PM_CV_Rahul_Sharma.pdf', 'PM_Degree_Certificate.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 92,
    reviewStatus: 'approved',
    aiExplanation: 'Proposed Project Manager Rahul Sharma has 12 years of experience in civil infrastructure with B.Tech from IIT Delhi. Qualification verified from uploaded CV and degree certificate.',
  },
  {
    id: 'req-009',
    title: 'Safety Management Plan',
    description: 'Bidder must submit a comprehensive safety management plan including risk assessment, safety protocols, emergency procedures, and training schedule.',
    category: 'documentation',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 35,
    section: 'Section 8 — Documentation',
    clause: 'Clause 8.2',
    companyValue: 'Draft prepared',
    evidenceDocuments: [],
    status: 'review',
    risk: 'medium',
    confidence: 72,
    reviewStatus: 'pending',
    aiExplanation: 'A draft safety management plan exists but has not been finalized or uploaded. The plan needs to include specific sections on risk assessment methodology, emergency evacuation procedures, and a detailed training schedule as per Clause 8.2.',
  },
  {
    id: 'req-010',
    title: 'Environmental Clearance Compliance',
    description: 'Bidder must demonstrate capability to obtain and comply with all necessary environmental clearances as per applicable regulations.',
    category: 'legal',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 24,
    section: 'Section 5 — Legal Requirements',
    clause: 'Clause 5.6',
    companyValue: 'ISO 14001:2015 held',
    evidenceDocuments: ['ISO_14001_Certificate.pdf'],
    status: 'review',
    risk: 'medium',
    confidence: 78,
    reviewStatus: 'pending',
    aiExplanation: 'ISO 14001:2015 certification suggests environmental management capability, but the tender requires explicit evidence of past environmental clearance compliance. Human verification recommended to confirm alignment with specific regulatory requirements.',
  },
  {
    id: 'req-011',
    title: 'Bid Document Fee Payment',
    description: 'Bidder must submit proof of bid document fee payment of ₹25,000 (non-refundable).',
    category: 'submission',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 8,
    section: 'Section 2 — Bid Submission',
    clause: 'Clause 2.3',
    threshold: '₹25,000',
    companyValue: 'Paid',
    evidenceDocuments: ['Bid_Fee_Receipt.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 99,
    reviewStatus: 'approved',
    aiExplanation: 'Payment receipt for ₹25,000 uploaded. Transaction reference verified.',
  },
  {
    id: 'req-012',
    title: 'Quality Control Plan',
    description: 'Bidder must submit a detailed quality control and quality assurance plan for the project, including testing protocols and material specifications.',
    category: 'documentation',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 36,
    section: 'Section 8 — Documentation',
    clause: 'Clause 8.4',
    evidenceDocuments: [],
    status: 'missing',
    risk: 'high',
    confidence: 85,
    reviewStatus: 'pending',
    aiExplanation: 'No quality control plan has been uploaded. This is a mandatory submission requirement. The plan must include material testing protocols, inspection schedules, and compliance with IS/IRC standards.',
  },
  {
    id: 'req-013',
    title: 'Solvency Certificate',
    description: 'Bidder must provide a solvency certificate from a scheduled bank for at least ₹10 Crore.',
    category: 'financial',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 19,
    section: 'Section 4 — Financial Criteria',
    clause: 'Clause 4.5',
    threshold: '₹10 Crore',
    companyValue: '₹12 Crore solvency',
    evidenceDocuments: ['Solvency_Certificate.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 95,
    reviewStatus: 'approved',
    aiExplanation: 'Solvency certificate from State Bank of India for ₹12 Crore uploaded. Exceeds the minimum ₹10 Crore requirement.',
  },
  {
    id: 'req-014',
    title: 'Work Program / Construction Schedule',
    description: 'Bidder must submit a detailed work program showing construction methodology, milestones, and timeline using CPM/PERT charts.',
    category: 'documentation',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 37,
    section: 'Section 8 — Documentation',
    clause: 'Clause 8.5',
    evidenceDocuments: [],
    status: 'missing',
    risk: 'high',
    confidence: 80,
    reviewStatus: 'pending',
    aiExplanation: 'No work program has been uploaded. The tender requires CPM/PERT charts showing construction methodology, resource deployment, and milestone timelines.',
  },
  {
    id: 'req-015',
    title: 'Authorized Signatory Power of Attorney',
    description: 'The bid must be signed by an authorized signatory. A power of attorney or board resolution must be provided.',
    category: 'legal',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 10,
    section: 'Section 2 — Bid Submission',
    clause: 'Clause 2.8',
    companyValue: 'Board Resolution uploaded',
    evidenceDocuments: ['Board_Resolution_Auth_Signatory.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 97,
    reviewStatus: 'approved',
    aiExplanation: 'Board resolution authorizing Mr. Vikram Mehta as authorized signatory uploaded and verified.',
  },
  {
    id: 'req-016',
    title: 'Equipment Deployment Plan',
    description: 'Bidder must demonstrate availability of key construction equipment: excavators (minimum 3), transit mixers (minimum 5), cranes (minimum 2), and other specified machinery.',
    category: 'technical',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 33,
    section: 'Section 7 — Technical Qualifications',
    clause: 'Clause 7.7',
    companyValue: 'Partial — 2 cranes available',
    evidenceDocuments: ['Equipment_List.pdf'],
    status: 'review',
    risk: 'medium',
    confidence: 74,
    reviewStatus: 'pending',
    aiExplanation: 'Equipment list shows 4 excavators and 6 transit mixers (meets requirement), but only 2 cranes against a minimum of 2 specified. The specification also mentions "other specified machinery" which needs detailed verification against the tender\'s Annexure-III equipment schedule.',
  },
  {
    id: 'req-017',
    title: 'Labour Welfare Compliance',
    description: 'Bidder must provide evidence of compliance with labour welfare regulations including PF, ESI, and Minimum Wages Act.',
    category: 'legal',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 25,
    section: 'Section 5 — Legal Requirements',
    clause: 'Clause 5.8',
    companyValue: 'PF & ESI registered',
    evidenceDocuments: ['PF_Registration.pdf', 'ESI_Registration.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 91,
    reviewStatus: 'approved',
    aiExplanation: 'PF registration certificate and ESI registration uploaded. Both are current and valid.',
  },
  {
    id: 'req-018',
    title: 'Joint Venture Agreement (if applicable)',
    description: 'If bidding as a JV, a notarized JV agreement must be submitted specifying lead partner, scope division, and financial liability.',
    category: 'legal',
    mandatory: false,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 11,
    section: 'Section 2 — Bid Submission',
    clause: 'Clause 2.10',
    companyValue: 'Not applicable — bidding as sole entity',
    evidenceDocuments: [],
    status: 'satisfied',
    risk: 'low',
    confidence: 99,
    reviewStatus: 'approved',
    aiExplanation: 'Company is bidding as a sole entity. JV agreement not required.',
  },
  {
    id: 'req-019',
    title: 'No Blacklisting Declaration',
    description: 'Bidder must submit a self-declaration that the firm has not been blacklisted by any government department or public sector undertaking.',
    category: 'eligibility',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 23,
    section: 'Section 5 — Legal Requirements',
    clause: 'Clause 5.4',
    companyValue: 'Declaration submitted',
    evidenceDocuments: ['No_Blacklisting_Declaration.pdf'],
    status: 'satisfied',
    risk: 'low',
    confidence: 98,
    reviewStatus: 'approved',
    aiExplanation: 'Self-declaration of non-blacklisting uploaded on company letterhead with authorized signatory.',
  },
  {
    id: 'req-020',
    title: 'Insurance Coverage',
    description: 'Bidder must provide evidence of adequate insurance coverage including Contractor All Risk (CAR) policy and Third Party Liability insurance.',
    category: 'financial',
    mandatory: true,
    sourceDocument: 'Tender_UMIP_2026.pdf',
    page: 20,
    section: 'Section 4 — Financial Criteria',
    clause: 'Clause 4.8',
    companyValue: 'CAR policy active',
    evidenceDocuments: ['CAR_Insurance_Policy.pdf'],
    status: 'review',
    risk: 'medium',
    confidence: 76,
    reviewStatus: 'pending',
    aiExplanation: 'CAR insurance policy uploaded and active. However, the Third Party Liability insurance document has not been separately uploaded. The existing CAR policy may include TPL coverage but needs human verification of coverage limits against tender requirements.',
  },
  // Additional requirements for volume
  ...generateAdditionalRequirements(),
];

function generateAdditionalRequirements(): Requirement[] {
  const additional: Partial<Requirement>[] = [
    { id: 'req-021', title: 'Technical Bid Format Compliance', category: 'submission', status: 'satisfied', mandatory: true, risk: 'low', confidence: 94, page: 9, clause: 'Clause 2.5', section: 'Section 2', description: 'Technical bid must follow the prescribed format as per Annexure-I.', aiExplanation: 'Technical bid document formatted as per Annexure-I template.' },
    { id: 'req-022', title: 'Financial Bid Format Compliance', category: 'submission', status: 'satisfied', mandatory: true, risk: 'low', confidence: 94, page: 9, clause: 'Clause 2.6', section: 'Section 2', description: 'Financial bid must follow BOQ format as per Annexure-II.', aiExplanation: 'BOQ format compliance verified.' },
    { id: 'req-023', title: 'Site Visit Certificate', category: 'submission', status: 'review', mandatory: false, risk: 'low', confidence: 82, page: 40, clause: 'Clause 9.1', section: 'Section 9', description: 'Bidder should have visited the site and obtained a site visit certificate.', aiExplanation: 'Site visit scheduled but certificate not yet uploaded.' },
    { id: 'req-024', title: 'ISO 14001:2015 Certificate', category: 'technical', status: 'satisfied', mandatory: false, risk: 'low', confidence: 95, page: 31, clause: 'Clause 7.4', section: 'Section 7', description: 'Environmental management system certification is preferred.', aiExplanation: 'ISO 14001:2015 certificate uploaded and valid.' },
    { id: 'req-025', title: 'ISO 45001:2018 Certificate', category: 'technical', status: 'satisfied', mandatory: false, risk: 'low', confidence: 95, page: 31, clause: 'Clause 7.4a', section: 'Section 7', description: 'Occupational health and safety certification is preferred.', aiExplanation: 'ISO 45001:2018 certificate valid until 2027.' },
    { id: 'req-026', title: 'Litigation History Declaration', category: 'legal', status: 'satisfied', mandatory: true, risk: 'low', confidence: 93, page: 24, clause: 'Clause 5.5', section: 'Section 5', description: 'Bidder must declare all current litigation and past arbitration cases.', aiExplanation: 'Declaration of no pending litigation uploaded.' },
    { id: 'req-027', title: 'Bid Validity Period — 180 Days', category: 'submission', status: 'satisfied', mandatory: true, risk: 'low', confidence: 97, page: 10, clause: 'Clause 2.7', section: 'Section 2', description: 'Bid must remain valid for 180 days from submission deadline.', aiExplanation: 'Bid validity of 180 days confirmed in the bid letter.' },
    { id: 'req-028', title: 'Sub-contractor Disclosure', category: 'technical', status: 'review', mandatory: true, risk: 'medium', confidence: 70, page: 34, clause: 'Clause 7.9', section: 'Section 7', description: 'If sub-contracting, details of proposed sub-contractors must be disclosed.', aiExplanation: 'Sub-contractor details partially documented. Needs verification of proposed electrical sub-contractor qualifications.' },
    { id: 'req-029', title: 'Defect Liability Period Acceptance', category: 'submission', status: 'satisfied', mandatory: true, risk: 'low', confidence: 96, page: 42, clause: 'Clause 10.2', section: 'Section 10', description: 'Bidder must accept defect liability period of 24 months post-completion.', aiExplanation: 'Acceptance included in the bid undertaking letter.' },
    { id: 'req-030', title: 'Mobilization Plan', category: 'documentation', status: 'review', mandatory: true, risk: 'medium', confidence: 68, page: 38, clause: 'Clause 8.7', section: 'Section 8', description: 'Detailed mobilization plan showing resource deployment within 30 days of LOA.', aiExplanation: 'Draft mobilization plan exists but requires finalization with specific resource allocation timelines.' },
    { id: 'req-031', title: 'Performance Security — 5%', category: 'financial', status: 'satisfied', mandatory: true, risk: 'low', confidence: 93, page: 13, clause: 'Clause 3.3', section: 'Section 3', description: 'Performance security of 5% of contract value to be submitted post-award.', aiExplanation: 'Undertaking to furnish 5% performance security included in bid. Bank has confirmed willingness to issue guarantee.' },
    { id: 'req-032', title: 'Key Personnel — Site Engineer', category: 'technical', status: 'satisfied', mandatory: true, risk: 'low', confidence: 90, page: 32, clause: 'Clause 7.6', section: 'Section 7', description: 'Minimum 2 site engineers with 5+ years experience.', aiExplanation: '3 site engineers proposed with 6-9 years experience each. CVs uploaded.' },
    { id: 'req-033', title: 'Previous Government Project Experience', category: 'experience', status: 'satisfied', mandatory: false, risk: 'low', confidence: 91, page: 28, clause: 'Clause 6.5', section: 'Section 6', description: 'Previous experience with government projects is preferred.', aiExplanation: 'Multiple government project completions documented, including NHA and Metro Rail Corporation.' },
    { id: 'req-034', title: 'Traffic Management Plan', category: 'documentation', status: 'missing', mandatory: true, risk: 'high', confidence: 82, page: 38, clause: 'Clause 8.8', section: 'Section 8', description: 'Detailed traffic management and diversion plan for construction zones.', aiExplanation: 'No traffic management plan uploaded. Required for urban infrastructure projects to address vehicular and pedestrian safety.' },
    { id: 'req-035', title: 'Material Source Identification', category: 'technical', status: 'review', mandatory: true, risk: 'medium', confidence: 71, page: 34, clause: 'Clause 7.10', section: 'Section 7', description: 'Bidder must identify sources for key construction materials (cement, steel, aggregates).', aiExplanation: 'Partial material sourcing plan provided. Steel and cement sources identified, but aggregate quarry details missing.' },
    { id: 'req-036', title: 'Financial Statement — Last 3 Years', category: 'financial', status: 'satisfied', mandatory: true, risk: 'low', confidence: 96, page: 18, clause: 'Clause 4.1', section: 'Section 4', description: 'Audited financial statements for the last 3 financial years.', aiExplanation: 'Audited financial statements for FY 2022-23, FY 2023-24, and FY 2024-25 uploaded and verified.' },
    { id: 'req-037', title: 'MSME Registration', category: 'eligibility', status: 'satisfied', mandatory: false, risk: 'low', confidence: 97, page: 23, clause: 'Clause 5.3', section: 'Section 5', description: 'MSME registration provides preference in bid evaluation.', aiExplanation: 'Valid MSME EM-II registration certificate uploaded.' },
    { id: 'req-038', title: 'Bid Cover Letter', category: 'submission', status: 'satisfied', mandatory: true, risk: 'low', confidence: 98, page: 8, clause: 'Clause 2.1', section: 'Section 2', description: 'Formal bid cover letter on company letterhead.', aiExplanation: 'Bid cover letter prepared on company letterhead with authorized signatory.' },
    { id: 'req-039', title: 'Integrity Pact', category: 'legal', status: 'review', mandatory: true, risk: 'medium', confidence: 75, page: 44, clause: 'Clause 11.1', section: 'Section 11', description: 'Bidder must sign and submit the Integrity Pact as per the prescribed format.', aiExplanation: 'Integrity pact format downloaded but not yet signed and uploaded. Requires authorized signatory and witness.' },
    { id: 'req-040', title: 'Compliance with Labour Laws', category: 'legal', status: 'satisfied', mandatory: true, risk: 'low', confidence: 92, page: 25, clause: 'Clause 5.7', section: 'Section 5', description: 'Compliance with all applicable labour laws and regulations.', aiExplanation: 'PF, ESI, and minimum wages compliance certificates uploaded.' },
  ];

  return additional.map(r => ({
    sourceDocument: 'Tender_UMIP_2026.pdf',
    evidenceDocuments: [],
    reviewStatus: 'pending' as ReviewStatus,
    companyValue: '',
    ...r,
  } as Requirement));
}

// ── Demo Documents ───────────────────────────────────────────────

export const demoDocuments: TenderDocument[] = [
  { id: 'doc-001', name: 'Tender_UMIP_2026.pdf', type: 'tender', pages: 86, uploadedAt: '2026-09-12T10:30:00', processed: true, evidenceCount: 87, size: '4.2 MB' },
  { id: 'doc-002', name: 'Financial_Statement_FY2025.pdf', type: 'financial', pages: 24, uploadedAt: '2026-09-12T11:15:00', processed: true, evidenceCount: 8, size: '1.8 MB' },
  { id: 'doc-003', name: 'Financial_Statement_FY2024.pdf', type: 'financial', pages: 22, uploadedAt: '2026-09-12T11:16:00', processed: true, evidenceCount: 6, size: '1.6 MB' },
  { id: 'doc-004', name: 'Financial_Statement_FY2023.pdf', type: 'financial', pages: 20, uploadedAt: '2026-09-12T11:17:00', processed: true, evidenceCount: 5, size: '1.5 MB' },
  { id: 'doc-005', name: 'Project_Completion_Highway.pdf', type: 'experience', pages: 8, uploadedAt: '2026-09-13T09:00:00', processed: true, evidenceCount: 4, size: '0.9 MB' },
  { id: 'doc-006', name: 'Project_Completion_Metro.pdf', type: 'experience', pages: 6, uploadedAt: '2026-09-13T09:05:00', processed: true, evidenceCount: 3, size: '0.7 MB' },
  { id: 'doc-007', name: 'ISO_9001_Certificate.pdf', type: 'certificate', pages: 2, uploadedAt: '2026-09-12T14:00:00', processed: true, evidenceCount: 1, size: '0.3 MB' },
  { id: 'doc-008', name: 'ISO_14001_Certificate.pdf', type: 'certificate', pages: 2, uploadedAt: '2026-09-12T14:02:00', processed: true, evidenceCount: 1, size: '0.3 MB' },
  { id: 'doc-009', name: 'ISO_45001_Certificate.pdf', type: 'certificate', pages: 2, uploadedAt: '2026-09-12T14:04:00', processed: true, evidenceCount: 1, size: '0.3 MB' },
  { id: 'doc-010', name: 'GST_Registration.pdf', type: 'registration', pages: 1, uploadedAt: '2026-09-12T12:00:00', processed: true, evidenceCount: 1, size: '0.2 MB' },
  { id: 'doc-011', name: 'PAN_Card.pdf', type: 'legal', pages: 1, uploadedAt: '2026-09-12T12:01:00', processed: true, evidenceCount: 1, size: '0.1 MB' },
  { id: 'doc-012', name: 'EMD_Bank_Guarantee.pdf', type: 'financial', pages: 3, uploadedAt: '2026-09-14T10:00:00', processed: true, evidenceCount: 1, size: '0.4 MB' },
  { id: 'doc-013', name: 'Company_Registration_Certificate.pdf', type: 'registration', pages: 2, uploadedAt: '2026-09-12T12:10:00', processed: true, evidenceCount: 2, size: '0.3 MB' },
  { id: 'doc-014', name: 'Equipment_List.pdf', type: 'technical', pages: 4, uploadedAt: '2026-09-15T08:30:00', processed: true, evidenceCount: 3, size: '0.5 MB' },
  { id: 'doc-015', name: 'PM_CV_Rahul_Sharma.pdf', type: 'technical', pages: 3, uploadedAt: '2026-09-15T09:00:00', processed: true, evidenceCount: 2, size: '0.4 MB' },
];

// ── Demo Risks ───────────────────────────────────────────────────

export const demoRisks: RiskItem[] = [
  {
    id: 'risk-001',
    category: 'Experience',
    title: 'Insufficient Qualifying Project Evidence',
    description: 'Only 2 of the required 3 similar completed projects have been documented. The third project (Industrial Zone Access Road) does not meet the ₹10 Crore minimum value threshold.',
    level: 'high',
    source: 'Clause 6.4, Page 27',
    impact: 'Potential disqualification from eligibility evaluation. This is a mandatory criterion.',
    suggestedAction: 'Identify and upload a completion certificate for an additional qualifying project of ₹10 Crore+ value, or verify if any ongoing project can be reclassified as completed.',
    relatedRequirements: ['req-006'],
  },
  {
    id: 'risk-002',
    category: 'Documentation',
    title: 'Missing Quality Control Plan',
    description: 'The mandatory quality control and quality assurance plan has not been prepared or uploaded.',
    level: 'high',
    source: 'Clause 8.4, Page 36',
    impact: 'Bid may be rejected as non-responsive during technical evaluation.',
    suggestedAction: 'Prepare QC/QA plan covering IS/IRC standards, material testing protocols, and inspection schedules. Assign to quality team immediately.',
    relatedRequirements: ['req-012'],
  },
  {
    id: 'risk-003',
    category: 'Documentation',
    title: 'Missing Traffic Management Plan',
    description: 'No traffic management plan has been submitted for construction zone operations.',
    level: 'high',
    source: 'Clause 8.8, Page 38',
    impact: 'Critical for urban infrastructure projects. Absence may result in technical disqualification.',
    suggestedAction: 'Engage traffic planning consultant or prepare in-house plan covering diversion routes, signage, and pedestrian safety measures.',
    relatedRequirements: ['req-034'],
  },
  {
    id: 'risk-004',
    category: 'Documentation',
    title: 'Work Program Not Submitted',
    description: 'The detailed construction work program with CPM/PERT charts has not been prepared.',
    level: 'high',
    source: 'Clause 8.5, Page 37',
    impact: 'Mandatory submission requirement. Will impact technical score.',
    suggestedAction: 'Prepare detailed CPM/PERT chart using project planning software. Include milestones, resource deployment, and critical path analysis.',
    relatedRequirements: ['req-014'],
  },
  {
    id: 'risk-005',
    category: 'Financial',
    title: 'Third Party Liability Insurance Gap',
    description: 'While CAR insurance is active, separate Third Party Liability insurance documentation has not been verified.',
    level: 'medium',
    source: 'Clause 4.8, Page 20',
    impact: 'May require additional insurance procurement if TPL is not covered under existing CAR policy.',
    suggestedAction: 'Review CAR policy for TPL coverage limits. If insufficient, arrange separate TPL insurance.',
    relatedRequirements: ['req-020'],
  },
  {
    id: 'risk-006',
    category: 'Technical',
    title: 'Sub-contractor Qualification Gaps',
    description: 'Electrical sub-contractor qualifications have not been fully documented.',
    level: 'medium',
    source: 'Clause 7.9, Page 34',
    impact: 'Could affect technical evaluation score.',
    suggestedAction: 'Obtain and upload qualification certificates for proposed electrical sub-contractor.',
    relatedRequirements: ['req-028'],
  },
  {
    id: 'risk-007',
    category: 'Deadline',
    title: 'Tight Submission Timeline',
    description: 'Only 6 days remain until the bid submission deadline with 9 missing requirements.',
    level: 'high',
    source: 'Submission Date: 24 Sep 2026',
    impact: 'Risk of incomplete submission if gaps are not addressed urgently.',
    suggestedAction: 'Prioritize critical missing documents. Assign dedicated team members to each gap. Daily status reviews recommended.',
    relatedRequirements: [],
  },
  {
    id: 'risk-008',
    category: 'Ambiguity',
    title: 'Equipment Schedule Cross-Reference Needed',
    description: 'Tender Annexure-III contains a detailed equipment schedule that needs cross-referencing with the submitted equipment list.',
    level: 'medium',
    source: 'Clause 7.7, Page 33 & Annexure-III',
    impact: 'Potential mismatch between submitted equipment and tender requirements.',
    suggestedAction: 'Cross-reference equipment list against Annexure-III. Verify quantities and specifications for all categories.',
    relatedRequirements: ['req-016'],
  },
];

// ── Demo Action Tasks ────────────────────────────────────────────

export const demoTasks: ActionTask[] = [
  { id: 'task-001', title: 'Upload 3rd Project Completion Certificate', description: 'Identify and upload a completion certificate for a qualifying project (₹10 Cr+ value) to satisfy Clause 6.4.', priority: 'critical', owner: 'Documentation Team', dueDate: '2026-09-19', status: 'pending', relatedRequirement: 'req-006', tenderId: 'tnd-001' },
  { id: 'task-002', title: 'Prepare Quality Control Plan', description: 'Create comprehensive QC/QA plan covering IS/IRC standards, material testing protocols, and inspection schedules.', priority: 'critical', owner: 'Quality Team', dueDate: '2026-09-20', status: 'pending', relatedRequirement: 'req-012', tenderId: 'tnd-001' },
  { id: 'task-003', title: 'Prepare Traffic Management Plan', description: 'Create traffic management and diversion plan for urban construction zones.', priority: 'critical', owner: 'Planning Team', dueDate: '2026-09-21', status: 'pending', relatedRequirement: 'req-034', tenderId: 'tnd-001' },
  { id: 'task-004', title: 'Create Work Program (CPM/PERT)', description: 'Prepare detailed work program with CPM/PERT charts showing milestones and resource deployment.', priority: 'high', owner: 'Project Planning', dueDate: '2026-09-21', status: 'in-progress', relatedRequirement: 'req-014', tenderId: 'tnd-001' },
  { id: 'task-005', title: 'Finalize Safety Management Plan', description: 'Complete the draft safety management plan with risk assessment, emergency procedures, and training schedule.', priority: 'high', owner: 'Safety Team', dueDate: '2026-09-20', status: 'in-progress', relatedRequirement: 'req-009', tenderId: 'tnd-001' },
  { id: 'task-006', title: 'Verify TPL Insurance Coverage', description: 'Review CAR policy for Third Party Liability coverage limits. Arrange separate TPL if needed.', priority: 'medium', owner: 'Finance Team', dueDate: '2026-09-22', status: 'pending', relatedRequirement: 'req-020', tenderId: 'tnd-001' },
  { id: 'task-007', title: 'Upload Sub-contractor Qualifications', description: 'Obtain and upload qualification certificates for proposed electrical sub-contractor.', priority: 'medium', owner: 'Procurement', dueDate: '2026-09-22', status: 'pending', relatedRequirement: 'req-028', tenderId: 'tnd-001' },
  { id: 'task-008', title: 'Sign Integrity Pact', description: 'Get the Integrity Pact signed by authorized signatory with witness and upload.', priority: 'medium', owner: 'Legal Team', dueDate: '2026-09-21', status: 'pending', relatedRequirement: 'req-039', tenderId: 'tnd-001' },
  { id: 'task-009', title: 'Complete Material Source Details', description: 'Identify and document aggregate quarry sources for the construction.', priority: 'medium', owner: 'Site Team', dueDate: '2026-09-22', status: 'pending', relatedRequirement: 'req-035', tenderId: 'tnd-001' },
  { id: 'task-010', title: 'Finalize Mobilization Plan', description: 'Complete mobilization plan with specific resource allocation timelines within 30 days of LOA.', priority: 'medium', owner: 'Project Planning', dueDate: '2026-09-22', status: 'pending', relatedRequirement: 'req-030', tenderId: 'tnd-001' },
  { id: 'task-011', title: 'Obtain Site Visit Certificate', description: 'Schedule and complete site visit to obtain certificate from the issuing authority.', priority: 'low', owner: 'Site Team', dueDate: '2026-09-23', status: 'pending', relatedRequirement: 'req-023', tenderId: 'tnd-001' },
  { id: 'task-012', title: 'Final Bid Review & Compilation', description: 'Compile all documents, verify completeness, and prepare final bid package for submission.', priority: 'critical', owner: 'Bid Manager', dueDate: '2026-09-23', status: 'pending', tenderId: 'tnd-001' },
];

// ── Demo Audit Log ───────────────────────────────────────────────

export const demoAuditLog: AuditEntry[] = [
  { id: 'aud-001', timestamp: '2026-09-12T10:30:00', action: 'Tender Uploaded', detail: 'Tender_UMIP_2026.pdf uploaded (86 pages, 4.2 MB)', actor: 'user', tenderId: 'tnd-001', icon: 'upload' },
  { id: 'aud-002', timestamp: '2026-09-12T10:32:00', action: 'AI Analysis Started', detail: 'Initiating requirement extraction and classification', actor: 'ai', tenderId: 'tnd-001', icon: 'brain' },
  { id: 'aud-003', timestamp: '2026-09-12T10:35:00', action: 'Requirements Extracted', detail: '87 requirements identified across 8 categories', actor: 'ai', tenderId: 'tnd-001', icon: 'list-checks' },
  { id: 'aud-004', timestamp: '2026-09-12T10:36:00', action: 'Classification Complete', detail: '42 mandatory, 45 non-mandatory requirements classified', actor: 'ai', tenderId: 'tnd-001', icon: 'tags' },
  { id: 'aud-005', timestamp: '2026-09-12T11:15:00', action: 'Documents Uploaded', detail: '3 financial statements uploaded (FY 2023-25)', actor: 'user', tenderId: 'tnd-001', icon: 'file-plus' },
  { id: 'aud-006', timestamp: '2026-09-12T11:20:00', action: 'Evidence Matching', detail: '8 financial requirements matched against uploaded statements', actor: 'ai', tenderId: 'tnd-001', icon: 'link' },
  { id: 'aud-007', timestamp: '2026-09-12T12:00:00', action: 'Legal Documents Uploaded', detail: 'GST, PAN, and registration certificates uploaded', actor: 'user', tenderId: 'tnd-001', icon: 'shield-check' },
  { id: 'aud-008', timestamp: '2026-09-12T14:00:00', action: 'Certifications Uploaded', detail: 'ISO 9001, 14001, 45001 certificates uploaded', actor: 'user', tenderId: 'tnd-001', icon: 'award' },
  { id: 'aud-009', timestamp: '2026-09-13T09:05:00', action: 'Experience Evidence Uploaded', detail: '2 project completion certificates uploaded', actor: 'user', tenderId: 'tnd-001', icon: 'briefcase' },
  { id: 'aud-010', timestamp: '2026-09-13T09:10:00', action: 'Evidence Gap Identified', detail: '3 critical compliance gaps detected — 1 experience, 2 documentation', actor: 'ai', tenderId: 'tnd-001', icon: 'alert-triangle' },
  { id: 'aud-011', timestamp: '2026-09-14T10:00:00', action: 'EMD Uploaded', detail: 'Bank guarantee for ₹96 Lakhs uploaded', actor: 'user', tenderId: 'tnd-001', icon: 'landmark' },
  { id: 'aud-012', timestamp: '2026-09-15T08:30:00', action: 'Technical Documents Uploaded', detail: 'Equipment list and personnel CVs uploaded', actor: 'user', tenderId: 'tnd-001', icon: 'wrench' },
  { id: 'aud-013', timestamp: '2026-09-15T09:15:00', action: 'Readiness Updated', detail: 'Bid readiness calculated at 74% — 64 satisfied, 14 review, 9 missing', actor: 'ai', tenderId: 'tnd-001', icon: 'gauge' },
  { id: 'aud-014', timestamp: '2026-09-15T09:20:00', action: 'Risk Assessment Generated', detail: '4 high risks, 4 medium risks identified', actor: 'ai', tenderId: 'tnd-001', icon: 'shield-alert' },
  { id: 'aud-015', timestamp: '2026-09-15T09:25:00', action: 'Action Plan Generated', detail: '12 tasks auto-generated with priorities and assignments', actor: 'ai', tenderId: 'tnd-001', icon: 'clipboard-list' },
  { id: 'aud-016', timestamp: '2026-09-16T14:00:00', action: 'Requirement Approved', detail: 'Reviewer approved REQ-001: Minimum Annual Turnover (✓ Satisfied)', actor: 'user', tenderId: 'tnd-001', icon: 'check-circle' },
  { id: 'aud-017', timestamp: '2026-09-16T14:05:00', action: 'Requirement Approved', detail: 'Reviewer approved REQ-007: 5 Years Experience (✓ Satisfied)', actor: 'user', tenderId: 'tnd-001', icon: 'check-circle' },
  { id: 'aud-018', timestamp: '2026-09-17T10:30:00', action: 'Work Program Started', detail: 'Task-004: Work Program creation marked as in-progress by Project Planning', actor: 'user', tenderId: 'tnd-001', icon: 'play' },
];

// ── Demo Deadlines ───────────────────────────────────────────────

export const demoDeadlines: Deadline[] = [
  { id: 'dl-001', title: 'Tender Released', date: '2026-09-05', type: 'release', status: 'past', tenderId: 'tnd-001' },
  { id: 'dl-002', title: 'Pre-Bid Meeting', date: '2026-09-10', type: 'pre-bid', status: 'past', tenderId: 'tnd-001' },
  { id: 'dl-003', title: 'Clarification Deadline', date: '2026-09-15', type: 'clarification', status: 'past', tenderId: 'tnd-001' },
  { id: 'dl-004', title: 'Last Date for Site Visit', date: '2026-09-20', type: 'other', status: 'upcoming', tenderId: 'tnd-001' },
  { id: 'dl-005', title: 'Bid Submission Deadline', date: '2026-09-24', type: 'submission', status: 'imminent', tenderId: 'tnd-001' },
  { id: 'dl-006', title: 'Technical Bid Opening', date: '2026-09-25', type: 'technical-opening', status: 'upcoming', tenderId: 'tnd-001' },
  { id: 'dl-007', title: 'Financial Bid Opening', date: '2026-10-10', type: 'financial-opening', status: 'upcoming', tenderId: 'tnd-001' },
];

// ── Evidence items for cross-referencing ─────────────────────────

export const demoEvidence: Evidence[] = [
  {
    documentId: 'doc-002',
    documentName: 'Financial_Statement_FY2025.pdf',
    page: 18,
    section: 'Statement of Revenue',
    excerpt: 'Total Revenue from Operations: ₹7,21,48,000 (Seven Crore Twenty-One Lakhs Forty-Eight Thousand)',
    evidenceType: 'Financial',
    matchedRequirement: 'req-001',
    confidence: 96,
    verificationStatus: 'verified',
    reviewer: 'Priya Sharma',
    timestamp: '2026-09-16T14:00:00',
  },
  {
    documentId: 'doc-005',
    documentName: 'Project_Completion_Highway.pdf',
    page: 1,
    section: 'Completion Certificate',
    excerpt: 'This is to certify that M/s Meridian Infrastructure Pvt. Ltd. has successfully completed the Greenfield Highway Connector Phase II project valued at ₹12.4 Crore.',
    evidenceType: 'Experience',
    matchedRequirement: 'req-006',
    confidence: 92,
    verificationStatus: 'verified',
    timestamp: '2026-09-13T09:10:00',
  },
  {
    documentId: 'doc-006',
    documentName: 'Project_Completion_Metro.pdf',
    page: 1,
    section: 'Completion Certificate',
    excerpt: 'Certificate of Completion: Suburban Rail Station Modernization — Contract Value ₹16.8 Crore — Completed satisfactorily on 20 November 2023.',
    evidenceType: 'Experience',
    matchedRequirement: 'req-006',
    confidence: 94,
    verificationStatus: 'verified',
    timestamp: '2026-09-13T09:12:00',
  },
  {
    documentId: 'doc-007',
    documentName: 'ISO_9001_Certificate.pdf',
    page: 1,
    section: 'Certificate',
    excerpt: 'Bureau Veritas certifies that M/s Meridian Infrastructure Pvt. Ltd. operates a Quality Management System conforming to ISO 9001:2015. Valid until: 31 December 2027.',
    evidenceType: 'Certification',
    matchedRequirement: 'req-005',
    confidence: 97,
    verificationStatus: 'verified',
    timestamp: '2026-09-12T14:05:00',
  },
];

// ── Copilot preset questions ─────────────────────────────────────

export const copilotPresets = [
  'What are the mandatory eligibility requirements?',
  'Show me all missing documents.',
  'Which requirement is currently the biggest risk?',
  'Where does the tender mention minimum turnover?',
  'Show every requirement that needs human review.',
  'What is the submission deadline and how many days are left?',
  'Summarize the financial requirements.',
  'What are the three most important unresolved requirements?',
];
