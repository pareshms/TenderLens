// ================================================================
// TENDERLENS — Nemotron AI Provider
// NVIDIA Nemotron 340B integration via OpenAI-compatible API
// ================================================================

import { type Requirement, type RiskItem } from './data';

const NEMOTRON_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NEMOTRON_MODEL = 'nvidia/nemotron-4-340b-instruct';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface NemotronResponse {
  choices: { message: { content: string } }[];
}

export async function callNemotron(messages: ChatMessage[], apiKey: string): Promise<string> {
  const res = await fetch(NEMOTRON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: NEMOTRON_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Nemotron API error ${res.status}: ${errorText}`);
  }

  const data: NemotronResponse = await res.json();
  return data.choices[0]?.message?.content || '';
}

// ── System prompts ───────────────────────────────────────────────

const SYSTEM_PROMPT = `You are TenderLens AI, an expert procurement intelligence assistant. You analyze tender documents and provide evidence-backed analysis.

RULES:
1. Always cite specific page numbers, clause numbers, and sections when referencing tender requirements.
2. Never claim legal compliance or guarantee tender success. Use language like "appears to satisfy" or "requires human verification".
3. Provide concise, structured answers with clear evidence references.
4. When comparing company data against tender requirements, always show both values.
5. Flag any ambiguities or areas requiring human review.
6. Format responses with clear sections using markdown.`;

// ── Public API ───────────────────────────────────────────────────

export async function analyzeRequirements(
  tenderText: string,
  apiKey: string
): Promise<string> {
  return callNemotron([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Analyze this tender document and extract ALL requirements. For each requirement, identify:
- Title
- Description
- Category (eligibility/financial/technical/experience/legal/documentation/submission)
- Whether it's mandatory
- Page/section/clause reference
- Any threshold values

Tender text:
${tenderText.substring(0, 8000)}`,
    },
  ], apiKey);
}

export async function analyzeRisks(
  requirements: Requirement[],
  apiKey: string
): Promise<string> {
  const reqSummary = requirements
    .filter(r => r.status !== 'satisfied')
    .map(r => `- ${r.title} (${r.status}, ${r.category}, Clause ${r.clause}): ${r.description}`)
    .join('\n');

  return callNemotron([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Analyze the following unsatisfied tender requirements and provide a risk assessment:

${reqSummary}

For each risk:
1. What is the risk?
2. Why is it a risk?
3. What is the potential impact?
4. What action should be taken?
5. Priority level (high/medium/low)

Be specific and cite clause numbers.`,
    },
  ], apiKey);
}

export async function matchEvidence(
  requirement: Requirement,
  companyData: string,
  apiKey: string
): Promise<string> {
  return callNemotron([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Match this tender requirement against company evidence:

REQUIREMENT:
Title: ${requirement.title}
Description: ${requirement.description}
Tender Reference: ${requirement.sourceDocument}, Page ${requirement.page}, ${requirement.clause}
Threshold: ${requirement.threshold || 'Not specified'}

COMPANY DATA:
${companyData}

Provide:
1. Does the evidence satisfy the requirement?
2. What specific evidence supports the match?
3. Are there any gaps?
4. Confidence level and reasoning`,
    },
  ], apiKey);
}

export async function answerQuestion(
  question: string,
  requirements: Requirement[],
  risks: RiskItem[],
  apiKey: string
): Promise<string> {
  const context = `
TENDER: Urban Mobility Infrastructure Package (TND-2026-UMIP-48C)
Organization: Demo Infrastructure Authority
Value: ₹48 Crore
Deadline: 24 Sep 2026 (6 days remaining)
Readiness: 74%

REQUIREMENTS SUMMARY:
Total: ${requirements.length}
Satisfied: ${requirements.filter(r => r.status === 'satisfied').length}
Review: ${requirements.filter(r => r.status === 'review').length}
Missing: ${requirements.filter(r => r.status === 'missing').length}

MISSING REQUIREMENTS:
${requirements.filter(r => r.status === 'missing').map(r => `- ${r.title} (${r.clause}, Page ${r.page}): ${r.description}`).join('\n')}

REQUIREMENTS NEEDING REVIEW:
${requirements.filter(r => r.status === 'review').map(r => `- ${r.title} (${r.clause}, Page ${r.page}): ${r.description}`).join('\n')}

HIGH RISKS:
${risks.filter(r => r.level === 'high').map(r => `- ${r.title}: ${r.description} (Source: ${r.source})`).join('\n')}

ALL REQUIREMENTS:
${requirements.map(r => `- [${r.status.toUpperCase()}] ${r.title} | ${r.category} | ${r.mandatory ? 'Mandatory' : 'Optional'} | ${r.clause}, Page ${r.page} | ${r.description}`).join('\n')}
`;

  return callNemotron([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Based on the following tender analysis context, answer this question:

${context}

QUESTION: ${question}

Provide a concise, evidence-backed answer with specific references to clauses, pages, and requirement status. Use bullet points for clarity.`,
    },
  ], apiKey);
}

export async function generateActionPlan(
  requirements: Requirement[],
  apiKey: string
): Promise<string> {
  const gaps = requirements
    .filter(r => r.status === 'missing' || r.status === 'review')
    .map(r => `- ${r.title} (${r.status}, ${r.category}, ${r.clause}): ${r.description}`)
    .join('\n');

  return callNemotron([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Generate a prioritized action plan to address these compliance gaps for a tender submission deadline in 6 days:

${gaps}

For each action:
1. Task title
2. Priority (critical/high/medium/low)
3. Suggested owner/team
4. Estimated effort
5. Dependencies`,
    },
  ], apiKey);
}
