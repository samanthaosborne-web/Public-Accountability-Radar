import { NextResponse } from 'next/server';
import { demoAnomalies } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({ anomalies: demoAnomalies });
}
