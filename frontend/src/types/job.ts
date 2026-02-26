export interface Job {
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
