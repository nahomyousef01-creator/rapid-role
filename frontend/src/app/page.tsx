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
  if (days < 7) return days + 'd ago'
  return Math.floor(days / 7) + 'w ago'
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
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0a0a0a', minHeight: '100vh' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '56px',
        background: heroVisible ? 'transparent' : 'rgba(10,10,10,0.95)',
        backdropFilter: heroVisible ? 'none' : 'blur(12px)',
        transition: 'background 0.3s ease',
        borderBottom: heroVisible ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
          Rapid<span style={{ color: '#e8522a' }}>Role</span>
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={scrollToMap} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px' }}>Map</button>
          <button onClick={scrollToJobs} style={{ background: '#e8522a', border: 'none', color: 'white', borderRadius: '999px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Find Jobs</button>
        </div>
      </nav>

      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111 40%, #1a0f0a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(232,82,42,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }}/>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px',
            background: 'rgba(232,82,42,0.12)', border: '1px solid rgba(232,82,42,0.25)',
            borderRadius: '999px', padding: '8px 18px', color: '#e8a07a', fontSize: '13px', fontWeight: 500,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8522a' }}/>
            {loading ? 'Loading jobs...' : jobs.length + ' live jobs across the UK'}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 700, color: 'white', lineHeight: 1,
            letterSpacing: '-0.03em', marginBottom: '24px',
          }}>
            Rapid<span style={{ color: '#e8522a' }}>Role</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Every UK agency job in one place. Hospitality, industrial, logistics and more — updated daily.
          </p>

          <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 32px' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scrollToJobs()}
              placeholder="Search jobs, locations, agencies..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px', padding: '14px 120px 14px 24px',
                color: 'white', fontSize: '15px', outline: 'none',
              }}
            />
            <button onClick={scrollToJobs} style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              background: '#e8522a', border: 'none', borderRadius: '999px',
              padding: '9px 22px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>Search</button>
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToJobs} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px' }}>Browse all jobs ↓</button>
            <button onClick={scrollToMap} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px' }}>View map 🗺</button>
          </div>
        </div>
      </section>

      <section style={{ background: '#0f0f0f', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#e8522a', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Browse by sector</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, margin: 0 }}>What are you looking for?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat.id] || 0
              const active = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => selectCategory(cat.id)} style={{
                  background: active ? '#e8522a' : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (active ? '#e8522a' : 'rgba(255,255,255,0.08)'),
                  borderRadius: '16px', padding: '24px 20px', textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{cat.emoji}</div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{cat.label}</div>
                  <div style={{ color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '12px', marginBottom: '12px' }}>{cat.desc}</div>
                  <div style={{
                    display: 'inline-block',
                    background: active ? 'rgba(255,255,255,0.2)' : 'rgba(232,82,42,0.15)',
                    color: active ? 'white' : '#e8a07a',
                    borderRadius: '999px', padding: '2px 10px', fontSize: '11px', fontWeight: 600,
                  }}>{count} job{count !== 1 ? 's' : ''}</div>
                </button>
              )
            })}
          </div>
          {activeCategory && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={() => setActiveCategory(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '13px' }}>✕ Clear filter</button>
            </div>
          )}
        </div>
      </section>

      <div ref={mapRef}>
        <section style={{ background: '#0a0a0a', padding: '80px 32px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ color: '#e8522a', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Interactive map</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, margin: '0 0 8px' }}>Jobs near you</h2>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', margin: 0 }}>Click any pin to see jobs in that city</p>
          </div>
        </section>
        <div style={{ height: '520px', position: 'relative' }}>
          {loading ? (
            <div style={{ height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Loading map...</p>
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
            border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none',
          }}>
            📍 {filteredJobs.length} jobs · {[...new Set(filteredJobs.map((j: Job) => j.location))].length} locations
          </div>
        </div>
      </div>

      <div ref={jobsRef}>
        <section style={{ background: '#0f0f0f', padding: '80px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ color: '#e8522a', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {activeCategory ? activeCategory + ' jobs' : 'All jobs'}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, margin: 0 }}>
                  {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
                </h2>
              </div>
              {activeCategory && (
                <button onClick={() => setActiveCategory(null)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', borderRadius: '999px', padding: '8px 16px',
                  fontSize: '13px', cursor: 'pointer',
                }}>✕ {activeCategory}</button>
              )}
            </div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {[...Array(6)].map((_,i) => <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', height: '180px' }}/>)}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>No jobs found</p>
                <button onClick={() => { setActiveCategory(null); setSearch('') }} style={{ color: '#e8522a', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredJobs.map((job: Job) => <JobCard key={job.id} job={job} onClick={() => setModal(job)} />)}
              </div>
            )}
          </div>
        </section>
      </div>

      <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', color: 'white', margin: '0 0 8px' }}>Rapid<span style={{ color: '#e8522a' }}>Role</span></p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', margin: 0 }}>Aggregating UK agency jobs daily · {jobs.length} live listings</p>
      </footer>

      {modal && <Modal job={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const c = color(job.agency_slug)
  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease',
    }}>
      <div style={{ height: '3px', background: c }}/>
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontSize: '15px', fontWeight: 600, lineHeight: 1.3, margin: '0 0 10px' }}>{job.title}</h3>
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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
        <div style={{ height: '4px', background: c }}/>
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c+'22', color: c, borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }}/>{job.agency}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>{job.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: '0 0 20px' }}>{job.sector}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[['📍','Location',job.location],['💷','Salary',job.salary],['⏱','Type',job.job_type],['📅','Posted',timeAgo(job.posted_date)]].map(([i,l,v]) => (
              <div key={l as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', margin: '0 0 3px' }}>{i} {l}</p>
                <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
          {job.description && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>{job.description}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block', textAlign: 'center', background: c, color: 'white', borderRadius: '12px', padding: '14px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Apply Now ↗</a>
            <button onClick={onClose} style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', background: 'none', cursor: 'pointer', fontSize: '14px' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
