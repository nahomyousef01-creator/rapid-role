'use client'

import { useState, useEffect, useMemo, lazy, Suspense, useRef } from 'react'
import type { Job, JobsData } from '@/types/job'

const UKMap = lazy(() => import('@/components/UKMap'))

const AGENCY_COLORS: Record<string, string> = {
  'arc-hospitality': '#1a4f72',
  'constellation':   '#6b3fa0',
  'blue-arrow':      '#005eb8',
  'adecco':          '#e8001d',
  'hays':            '#00a650',
  'staffline':       '#f5821f',
  'manpower':        '#0063a3',
}

const CATEGORIES = [
  { id: 'Hospitality', label: 'Hospitality', emoji: '🍽', desc: 'Hotels, restaurants & events' },
  { id: 'Catering',    label: 'Catering',    emoji: '👨‍🍳', desc: 'Chefs, kitchen & food service' },
  { id: 'Industrial',  label: 'Industrial',  emoji: '🏭', desc: 'Warehouse, factory & production' },
  { id: 'Logistics',   label: 'Logistics',   emoji: '🚛', desc: 'Driving, delivery & supply chain' },
  { id: 'Admin',       label: 'Admin',       emoji: '📋', desc: 'Office, reception & support' },
  { id: 'Finance',     label: 'Finance',     emoji: '💼', desc: 'Accounts, finance & banking' },
  { id: 'HR',          label: 'HR',          emoji: '👥', desc: 'Human resources & recruitment' },
  { id: 'IT',          label: 'IT',          emoji: '💻', desc: 'Tech support & development' },
]

function color(slug: string) { return AGENCY_COLORS[slug] || '#3d4f5c' }
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [modal, setModal] = useState<Job | null>(null)
  const [search, setSearch] = useState('')
  const [heroVisible, setHeroVisible] = useState(true)
  const jobsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  useEffect(() => {
    const onScroll = () => setHeroVisible(window.scrollY < 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jobs = data?.jobs || []

  const filteredJobs = useMemo(() => {
    let out = jobs
    if (activeCategory) out = out.filter(j => j.sector === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.agency.toLowerCase().includes(q)
      )
    }
    return out
  }, [jobs, activeCategory, search])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    jobs.forEach(j => { counts[j.sector] = (counts[j.sector] || 0) + 1 })
    return counts
  }, [jobs])

  function scrollToJobs() {
    jobsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToMap() {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function selectCategory(id: string) {
    setActiveCategory(prev => prev === id ? null : id)
    setTimeout(() => jobsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0a0a0a' }}>

      {/* ── Sticky nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14"
        style={{
          background: heroVisible ? 'transparent' : 'rgba(10,10,10,0.95)',
          backdropFilter: heroVisible ? 'none' : 'blur(12px)',
          transition: 'background 0.3s ease',
          borderBottom: heroVisible ? 'none' : '1px solid rgba(255,255,255,0.06)',
        }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
          Rapid<span style={{ color: '#e8522a' }}>Role</span>
        </span>
        <div className="flex items-center gap-3">
          <button onClick={scrollToMap}
            className="text-white/50 hover:text-white text-sm transition-colors">
            Map
          </button>
          <button onClick={scrollToJobs}
            style={{ background: '#e8522a', color: 'white', borderRadius: '999px', padding: '6px 18px', fontSize: '13px', fontWeight: 600 }}>
            Find Jobs
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 40%, #1a0f0a 100%)' }}>

        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}/>

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #e8522a 0%, transparent 70%)', filter: 'blur(60px)' }}/>

        <div className="relative z-10 max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: 'rgba(232,82,42,0.15)', border: '1px solid rgba(232,82,42,0.3)', color: '#e8a07a' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8522a] animate-pulse"/>
            {loading ? 'Loading jobs…' : `${jobs.length} live jobs across the UK`}
          </div>

          {/* Main title */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}>
            Rapid<span style={{ color: '#e8522a' }}>Role</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '520px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Every UK agency job in one place. Find hospitality, industrial, logistics and office roles — updated daily.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scrollToJobs()}
              placeholder="Search jobs, locations, agencies…"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                padding: '14px 56px 14px 24px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
              }}
              className="placeholder-white/30 focus:border-[#e8522a]/50 transition-colors"
            />
            <button onClick={scrollToJobs}
              style={{
                position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                background: '#e8522a', border: 'none', borderRadius: '999px',
                padding: '8px 20px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}>
              Search
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={scrollToJobs}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-white transition-colors flex items-center gap-1.5">
              Browse all jobs ↓
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <button onClick={scrollToMap}
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-white transition-colors flex items-center gap-1.5">
              View map 🗺
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))' }}/>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background: '#0f0f0f', padding: '80px 32px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p style={{ color: '#e8522a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Browse by sector</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, letterSpacing: '-0.02em' }}>
              What are you looking for?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => {
              const count = categoryCounts[cat.id] || 0
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  style={{
                    background: active ? '#e8522a' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? '#e8522a' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    animationDelay: `${i * 50}ms`,
                  }}
                  className="hover:border-white/20 hover:bg-white/[0.07] group"
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{cat.emoji}</div>
                  <div style={{ color: active ? 'white' : 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{cat.label}</div>
                  <div style={{ color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '12px', marginBottom: '12px' }}>{cat.desc}</div>
                  <div style={{
                    display: 'inline-block',
                    background: active ? 'rgba(255,255,255,0.2)' : 'rgba(232,82,42,0.15)',
                    color: active ? 'white' : '#e8a07a',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {count} job{count !== 1 ? 's' : ''}
                  </div>
                </button>
              )
            })}
          </div>

          {activeCategory && (
            <div className="mt-4 text-center">
              <button onClick={() => setActiveCategory(null)}
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
                className="hover:text-white transition-colors">
                ✕ Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── MAP ── */}
      <div ref={mapRef}>
        <section style={{ background: '#0a0a0a', padding: '80px 32px 0' }}>
          <div className="max-w-6xl mx-auto mb-8">
            <p style={{ color: '#e8522a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Interactive map</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Jobs near you
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: '8px', fontSize: '15px' }}>Click any pin to see jobs in that location</p>
          </div>
        </section>
        <div style={{ height: '520px', position: 'relative' }}>
          {loading ? (
            <div style={{ height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Loading map…</p>
            </div>
          ) : (
            <Suspense fallback={<div style={{ height: '100%', background: '#111' }}/>}>
              <UKMap jobs={filteredJobs} onJobClick={setModal} />
            </Suspense>
          )}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
            background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)',
            color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            📍 {filteredJobs.length} jobs · {[...new Set(filteredJobs.map(j => j.location))].length} locations
          </div>
        </div>
      </div>

      {/* ── JOB LISTINGS ── */}
      <div ref={jobsRef}>
        <section style={{ background: '#0f0f0f', padding: '80px 32px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <p style={{ color: '#e8522a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {activeCategory ? `${activeCategory} jobs` : 'All jobs'}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
                </h2>
              </div>
              {activeCategory && (
                <button onClick={() => setActiveCategory(null)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: '999px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}
                  className="hover:text-white transition-colors">
                  ✕ {activeCategory}
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_,i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', height: '180px', animation: 'pulse 2s infinite' }}/>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>No jobs found</p>
                <button onClick={() => { setActiveCategory(null); setSearch('') }}
                  style={{ color: '#e8522a', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setModal(job)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>
          Rapid<span style={{ color: '#e8522a' }}>Role</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Aggregating UK agency jobs daily · {jobs.length} live listings</p>
      </footer>

      {modal && <Modal job={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const c = color(job.agency_slug)
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      className="hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5"
    >
      <div style={{ height: '3px', background: c }}/>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontSize: '15px', fontWeight: 600, lineHeight: 1.3 }}>{job.title}</h3>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: c+'22', color: c, borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, marginBottom: '12px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }}/>
          {job.agency}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>📍 {job.location}</span>
          <span>💷 {job.salary}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'monospace' }}>{timeAgo(job.posted_date)}</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', borderRadius: '999px', padding: '3px 10px', fontSize: '11px' }}>{job.job_type}</span>
        </div>
      </div>
    </div>
  )
}

function Modal({ job, onClose }: { job: Job; onClose: () => void }) {
  const c = color(job.agency_slug)
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#111', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '520px', overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div style={{ height: '4px', background: c }}/>
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c+'22', color: c, borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }}/>
            {job.agency}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{job.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '20px' }}>{job.sector}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[['📍','Location',job.location],['💷','Salary',job.salary],['⏱','Type',job.job_type],['📅','Posted',timeAgo(job.posted_date)]].map(([i,l,v]) => (
              <div key={l as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginBottom: '3px' }}>{i} {l}</p>
                <p style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>
          {job.description && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>{job.description}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={job.url} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: 'block', textAlign: 'center', background: c, color: 'white', borderRadius: '12px', padding: '14px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              Apply Now ↗
            </a>
            <button onClick={onClose}
              style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', background: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
