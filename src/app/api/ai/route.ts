// ================================================================
// TENDERLENS — Nemotron AI API Route
// Proxies requests to NVIDIA Nemotron to keep API key server-side
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { answerQuestion, analyzeRisks, matchEvidence } from '@/lib/ai-provider';
import { demoRequirements, demoRisks } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json();
    const apiKey = process.env.NEMOTRON_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NEMOTRON_API_KEY not configured', fallback: true },
        { status: 200 }
      );
    }

    let result: string;

    switch (action) {
      case 'answer': {
        result = await answerQuestion(
          payload.question,
          payload.requirements || demoRequirements,
          payload.risks || demoRisks,
          apiKey
        );
        break;
      }
      case 'analyze-risks': {
        result = await analyzeRisks(
          payload.requirements || demoRequirements,
          apiKey
        );
        break;
      }
      case 'match-evidence': {
        result = await matchEvidence(
          payload.requirement,
          payload.companyData || '',
          apiKey
        );
        break;
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ result, fallback: false });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'AI processing failed', fallback: true, message: String(error) },
      { status: 200 }
    );
  }
}
