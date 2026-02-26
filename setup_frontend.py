"""
Run this from inside /Users/nahom/agency-jobs-scraper:
    python3 setup_frontend.py
It will create the entire frontend/ folder and all files.
"""
import os

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

FILES = {}

# ── package.json ──────────────────────────────────────────────────────────────
FILES["package.json"] = """{
  "name": "agency-jobs-board",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
"""

# ── next.config.js ────────────────────────────────────────────────────────────
FILES["next.config.js"] = """/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
"""

# ── tailwind.config.js ────────────────────────────────────────────────────────
FILES["tailwind.config.js"] = """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      colors: {
        ink:   '#0f0f0f',
        paper: '#f7f5f0',
        cream: '#ede9e0',
        rust:  '#c94f2a',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out forwards',
      },
    },
  },
  plugins: [],
}
"""

# ── postcss.config.js ─────────────────────────────────────────────────────────
FILES["postcss.config.js"] = """module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
"""

# ── tsconfig.json ─────────────────────────────────────────────────────────────
FILES["tsconfig.json"] = """{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"""

# ── src/types/job.ts ──────────────────────────────────────────────────────────
FILES["src/types/job.ts"] = """export interface Job {
  id: string
  title: string
  agency: string
  agency_slug: string
  location: string
  job_type: string
  sector: string
  salary: string
  posted_date: string
  url: string
  description: string
  logo: string
  tags: string[]
}

export interface JobsData {
  scraped_at: string
  total: number
  jobs: Job[]
}
"""

# ── src/app/layout.tsx ────────────────────────────────────────────────────────
FILES["src/app/layout.tsx"] = """import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UK Agency Jobs',
  description: 'Jobs from ARC Hospitality, Blue Arrow, Adecco, Hays, Staffline & more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper">{children}</body>
    </html>
  )
}
"""

# ── src/app/globals.css ───────────────────────────────────────────────────────
FILES["src/app/globals.css"] = """@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: #f7f5f0;
  -webkit-font-smoothing: antialiased;
}

.font-display { font-family: 'Playfair Display', Georgia, serif; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #ede9e0; }
::-webkit-scrollbar-thumb { background: #c94f2a; border-radius: 3px; }

.job-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.job-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.08); }

.stagger > * {
  opacity: 0;
  animation: fadeUp 0.45s ease-out forwards;
}
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
.stagger > *:nth-child(n+6) { animation-delay: 300ms; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
"""

# ── src/app/api/jobs/route.ts ─────────────────────────────────────────────────
FILES["src/app/api/jobs/route.ts"] = """import { NextResponse } from 'next/server'
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
"""

# ── src/app/page.tsx ──────────────────────────────────────────────────────────
FILES["src/app/page.tsx"] = """'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Job, JobsData } from '@/types/job'

const AGENCY_COLORS: Record<string, string> = {
  'arc-hospitality': '#1a4f72',
  'constellation':   '#6b3fa0',
  'blue-arrow':      '#005eb8',
  'adecco':          '#e8001d',
  'hays':            '#00a650',
  'staffline':       '#f5821f',
  'manpower':        '#0063a3',
}

const SECTOR_ICONS: Record<string, string> = {
  Hospitality: '🍽',
  Catering:    '👨\\u200d🍳',
  Industrial:  '🏭',
  Admin:       '📋',
  Logistics:   '🚛',
  Finance:     '💼',
  HR:          '👥',
  IT:          '💻',
  General:     '⚡',
}

function color(slug: string) { return AGENCY_COLORS[slug] || '#3d4f5c' }
function icon(sector: string) { return SECTOR_ICONS[sector] || '📌' }
function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function Page() {
  const [data, setData] = useState<JobsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [agencies, setAgencies]   = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [sectors, setSectors]     = useState<string[]>([])
  const [jobTypes, setJobTypes]   = useState<string[]>([])
  const [sort, setSort] = useState<'date'|'title'>('date')
  const [sidebar, setSidebar] = useState(true)
  const [modal, setModal] = useState<Job | null>(null)

  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  const jobs = data?.jobs || []
  const allAgencies  = useMemo(() => [...new Set(jobs.map(j => j.agency))].sort(), [jobs])
  const allLocations = useMemo(() => [...new Set(jobs.map(j => j.location))].sort(), [jobs])
  const allSectors   = useMemo(() => [...new Set(jobs.map(j => j.sector))].sort(), [jobs])
  const allJobTypes  = useMemo(() => [...new Set(jobs.map(j => j.job_type))].sort(), [jobs])

  const filtered = useMemo(() => {
    let out = jobs
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.agency.toLowerCase().includes(q) ||
        j.sector.toLowerCase().includes(q)
      )
    }
    if (agencies.length)  out = out.filter(j => agencies.includes(j.agency))
    if (locations.length) out = out.filter(j => locations.includes(j.location))
    if (sectors.length)   out = out.filter(j => sectors.includes(j.sector))
    if (jobTypes.length)  out = out.filter(j => jobTypes.includes(j.job_type))
    if (sort === 'date')  out = [...out].sort((a,b) => b.posted_date.localeCompare(a.posted_date))
    if (sort === 'title') out = [...out].sort((a,b) => a.title.localeCompare(b.title))
    return out
  }, [jobs, search, agencies, locations, sectors, jobTypes, sort])

  function toggle<T>(val: T, arr: T[], set: (v: T[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  function clearAll() {
    setSearch(''); setAgencies([]); setLocations([]); setSectors([]); setJobTypes([])
  }

  const hasFilters = search || agencies.length || locations.length || sectors.length || jobTypes.length

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f] text-white border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => setSidebar(s => !s)} className="flex flex-col gap-1.5 w-6">
            <span className="block h-0.5 bg-white w-6"/>
            <span className={`block h-0.5 bg-white transition-all ${sidebar ? 'w-4' : 'w-6'}`}/>
            <span className="block h-0.5 bg-white w-6"/>
          </button>
          <span className="font-display text-lg font-semibold tracking-tight">
            UK<span className="text-[#c94f2a]">Jobs</span>
          </span>
          <div className="flex-1 max-w-md">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs, locations, agencies…"
              className="w-full bg-white/10 text-white placeholder-white/40 border border-white/15 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-[#c94f2a]/60 transition-colors"
            />
          </div>
          <span className="ml-auto text-xs font-mono text-white/40 bg-white/10 px-3 py-1 rounded-full">
            {filtered.length} jobs
          </span>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`shrink-0 transition-all duration-300 overflow-hidden ${sidebar ? 'w-56' : 'w-0'}`}>
          <div className="w-56 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-5 px-4 border-r border-cream">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/30">Filters</span>
              {hasFilters && <button onClick={clearAll} className="text-xs text-[#c94f2a] hover:underline">Clear</button>}
            </div>

            <div className="flex gap-1.5 mb-5">
              {(['date','title'] as const).map(o => (
                <button key={o} onClick={() => setSort(o)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-colors ${sort === o ? 'bg-[#0f0f0f] text-white border-[#0f0f0f]' : 'border-cream text-black/50 hover:border-black/20'}`}>
                  {o.charAt(0).toUpperCase()+o.slice(1)}
                </button>
              ))}
            </div>

            <Section title="Agency">
              {allAgencies.map(a => {
                const slug = jobs.find(j => j.agency === a)?.agency_slug || ''
                return <Chip key={a} label={a} active={agencies.includes(a)} accent={color(slug)}
                  count={jobs.filter(j => j.agency === a).length}
                  onClick={() => toggle(a, agencies, setAgencies)} />
              })}
            </Section>

            <Section title="Location">
              {allLocations.map(l => <Chip key={l} label={l} active={locations.includes(l)}
                count={jobs.filter(j => j.location === l).length}
                onClick={() => toggle(l, locations, setLocations)} />)}
            </Section>

            <Section title="Sector">
              {allSectors.map(s => <Chip key={s} label={`${icon(s)} ${s}`} active={sectors.includes(s)}
                count={jobs.filter(j => j.sector === s).length}
                onClick={() => toggle(s, sectors, setSectors)} />)}
            </Section>

            <Section title="Job Type">
              {allJobTypes.map(t => <Chip key={t} label={t} active={jobTypes.includes(t)}
                count={jobs.filter(j => j.job_type === t).length}
                onClick={() => toggle(t, jobTypes, setJobTypes)} />)}
            </Section>
          </div>
        </aside>

        {/* Grid */}
        <main className="flex-1 min-w-0 p-5">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(9)].map((_,i) => <div key={i} className="bg-cream animate-pulse h-40 rounded-2xl"/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-black/25">
              <p className="font-display text-2xl mb-2">No jobs found</p>
              <button onClick={clearAll} className="text-[#c94f2a] text-sm hover:underline mt-2">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
              {filtered.map(j => <JobCard key={j.id} job={j} onClick={() => setModal(j)} />)}
            </div>
          )}
        </main>
      </div>

      {modal && <Modal job={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-mono uppercase tracking-widest text-black/30 mb-1.5">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function Chip({ label, active, count, accent, onClick }:
  { label: string; active: boolean; count: number; accent?: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-all ${active ? 'bg-[#0f0f0f] text-white font-medium' : 'hover:bg-cream text-black/60'}`}>
      <span className="flex items-center gap-2 truncate">
        {accent && active && <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: accent }}/>}
        <span className="truncate">{label}</span>
      </span>
      <span className={`shrink-0 text-xs font-mono ml-1 ${active ? 'text-white/50' : 'text-black/25'}`}>{count}</span>
    </button>
  )
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const c = color(job.agency_slug)
  return (
    <div className="job-card bg-white rounded-2xl border border-cream cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="h-1" style={{ background: c }}/>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-display text-[15px] font-semibold text-[#0f0f0f] leading-snug">{job.title}</h2>
          <span className="text-lg shrink-0">{icon(job.sector)}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-3"
          style={{ background: c+'18', color: c }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }}/>
          {job.agency}
        </span>
        <div className="space-y-1 text-sm text-black/50">
          <div className="flex items-center gap-1.5">
            <span>📍</span> {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <span>💷</span> {job.salary}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream">
          <span className="text-xs font-mono text-black/25">{timeAgo(job.posted_date)}</span>
          <span className="text-xs bg-cream text-black/40 px-2.5 py-1 rounded-full">{job.job_type}</span>
        </div>
      </div>
    </div>
  )
}

function Modal({ job, onClose }: { job: Job; onClose: () => void }) {
  const c = color(job.agency_slug)
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}>
      <div className="bg-paper rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden"
        style={{ animation: 'fadeUp 0.25s ease-out forwards' }}
        onClick={e => e.stopPropagation()}>
        <div className="h-1.5" style={{ background: c }}/>
        <div className="p-7">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ background: c+'18', color: c }}>
            <span className="w-2 h-2 rounded-full" style={{ background: c }}/>{job.agency}
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0f0f0f] mb-1">{job.title}</h2>
          <p className="text-black/40 text-sm mb-5">{icon(job.sector)} {job.sector}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[['📍','Location',job.location],['💷','Salary',job.salary],['⏱','Type',job.job_type],['📅','Posted',timeAgo(job.posted_date)]].map(([i,l,v]) => (
              <div key={l as string} className="bg-cream/60 rounded-xl p-3">
                <p className="text-xs text-black/35 mb-0.5">{i} {l}</p>
                <p className="text-sm font-medium text-[#0f0f0f]">{v}</p>
              </div>
            ))}
          </div>
          {job.description && <p className="text-sm text-black/60 leading-relaxed mb-5">{job.description}</p>}
          <div className="flex gap-3">
            <a href={job.url} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: c }}>
              Apply Now ↗
            </a>
            <button onClick={onClose}
              className="px-5 py-3 rounded-xl border border-cream text-black/50 text-sm hover:border-black/20">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
"""

# ── Write all files ───────────────────────────────────────────────────────────
def write(rel_path: str, content: str):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(content)
    print(f"  ✅ {rel_path}")

print(f"\n📁 Creating frontend in: {BASE}\n")
for path_key, content in FILES.items():
    write(path_key, content)

print(f"\n✨ Done! Now run:\n\n  cd {BASE}\n  npm install\n  npm run dev\n\nThen open http://localhost:3000\n")
