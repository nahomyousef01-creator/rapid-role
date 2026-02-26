import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET() {
  const possible = [
    path.join(process.cwd(), '..', 'data', 'jobs.json'),
    path.join(process.cwd(), 'data', 'jobs.json'),
    path.join(process.cwd(), 'public', 'jobs.json'),
  ]
  for (const p of possible) {
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
      return NextResponse.json(data)
    }
  }
  return NextResponse.json({ scraped_at: new Date().toISOString(), total: 0, jobs: [] })
}
