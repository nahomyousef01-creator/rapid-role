import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Look for data file relative to project root
    const possiblePaths = [
      path.join(process.cwd(), '..', 'data', 'jobs.json'),
      path.join(process.cwd(), 'data', 'jobs.json'),
      path.join(process.cwd(), 'public', 'jobs.json'),
    ]

    let data = null
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        data = JSON.parse(fs.readFileSync(p, 'utf-8'))
        break
      }
    }

    if (!data) {
      // Return built-in sample data if no file found yet
      return NextResponse.json(getSampleData())
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(getSampleData())
  }
}

function getSampleData() {
  const now = new Date().toISOString().split('T')[0]
  const jobs = [
    // ARC Hospitality
    { id: 'arc-sous-chef-london', title: 'Sous Chef', agency: 'ARC Hospitality', agency_slug: 'arc-hospitality', location: 'London', job_type: 'Full-time', sector: 'Hospitality', salary: '£35,000–£42,000', posted_date: now, url: 'https://www.archospitality.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'arc-hotel-receptionist-manchester', title: 'Hotel Receptionist', agency: 'ARC Hospitality', agency_slug: 'arc-hospitality', location: 'Manchester', job_type: 'Full-time', sector: 'Hospitality', salary: '£22,000–£25,000', posted_date: now, url: 'https://www.archospitality.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'arc-banqueting-waiter-birmingham', title: 'Banqueting Waiter', agency: 'ARC Hospitality', agency_slug: 'arc-hospitality', location: 'Birmingham', job_type: 'Temporary', sector: 'Hospitality', salary: '£11.50/hr', posted_date: now, url: 'https://www.archospitality.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'arc-chef-de-partie-leeds', title: 'Chef de Partie', agency: 'ARC Hospitality', agency_slug: 'arc-hospitality', location: 'Leeds', job_type: 'Full-time', sector: 'Hospitality', salary: '£28,000–£33,000', posted_date: now, url: 'https://www.archospitality.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'arc-bar-supervisor-london', title: 'Bar Supervisor', agency: 'ARC Hospitality', agency_slug: 'arc-hospitality', location: 'London', job_type: 'Part-time', sector: 'Hospitality', salary: '£13/hr', posted_date: now, url: 'https://www.archospitality.co.uk/jobs/', description: '', logo: '', tags: [] },
    // Constellation
    { id: 'con-events-coordinator-london', title: 'Events Coordinator', agency: 'Constellation Agency', agency_slug: 'constellation', location: 'London', job_type: 'Contract', sector: 'Hospitality', salary: '£30,000–£38,000', posted_date: now, url: 'https://www.constellationagency.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'con-commis-chef-bristol', title: 'Commis Chef', agency: 'Constellation Agency', agency_slug: 'constellation', location: 'Bristol', job_type: 'Full-time', sector: 'Hospitality', salary: '£23,000–£26,000', posted_date: now, url: 'https://www.constellationagency.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'con-foh-manager-london', title: 'Front of House Manager', agency: 'Constellation Agency', agency_slug: 'constellation', location: 'London', job_type: 'Full-time', sector: 'Hospitality', salary: '£35,000–£45,000', posted_date: now, url: 'https://www.constellationagency.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'con-restaurant-manager-liverpool', title: 'Restaurant Manager', agency: 'Constellation Agency', agency_slug: 'constellation', location: 'Liverpool', job_type: 'Full-time', sector: 'Hospitality', salary: '£32,000–£40,000', posted_date: now, url: 'https://www.constellationagency.co.uk/jobs/', description: '', logo: '', tags: [] },
    // Blue Arrow
    { id: 'ba-warehouse-coventry', title: 'Warehouse Operative', agency: 'Blue Arrow', agency_slug: 'blue-arrow', location: 'Coventry', job_type: 'Temporary', sector: 'Industrial', salary: '£11.44/hr', posted_date: now, url: 'https://www.bluearrow.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'ba-forklift-northampton', title: 'Forklift Driver', agency: 'Blue Arrow', agency_slug: 'blue-arrow', location: 'Northampton', job_type: 'Temporary', sector: 'Industrial', salary: '£13.50/hr', posted_date: now, url: 'https://www.bluearrow.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'ba-kitchen-porter-manchester', title: 'Kitchen Porter', agency: 'Blue Arrow', agency_slug: 'blue-arrow', location: 'Manchester', job_type: 'Temporary', sector: 'Catering', salary: '£11.50/hr', posted_date: now, url: 'https://www.bluearrow.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'ba-cs-advisor-sheffield', title: 'Customer Service Advisor', agency: 'Blue Arrow', agency_slug: 'blue-arrow', location: 'Sheffield', job_type: 'Full-time', sector: 'Admin', salary: '£23,000–£25,000', posted_date: now, url: 'https://www.bluearrow.co.uk/jobs/', description: '', logo: '', tags: [] },
    { id: 'ba-hgv-driver-leeds', title: 'HGV Driver Class 2', agency: 'Blue Arrow', agency_slug: 'blue-arrow', location: 'Leeds', job_type: 'Temporary', sector: 'Logistics', salary: '£16/hr', posted_date: now, url: 'https://www.bluearrow.co.uk/jobs/', description: '', logo: '', tags: [] },
    // Adecco
    { id: 'adecco-office-admin-london', title: 'Office Administrator', agency: 'Adecco', agency_slug: 'adecco', location: 'London', job_type: 'Temporary', sector: 'Admin', salary: '£13–£15/hr', posted_date: now, url: 'https://www.adecco.co.uk/jobs', description: '', logo: '', tags: [] },
    { id: 'adecco-hr-coordinator-bristol', title: 'HR Coordinator', agency: 'Adecco', agency_slug: 'adecco', location: 'Bristol', job_type: 'Contract', sector: 'HR', salary: '£28,000–£32,000', posted_date: now, url: 'https://www.adecco.co.uk/jobs', description: '', logo: '', tags: [] },
    { id: 'adecco-logistics-coordinator-birmingham', title: 'Logistics Coordinator', agency: 'Adecco', agency_slug: 'adecco', location: 'Birmingham', job_type: 'Full-time', sector: 'Logistics', salary: '£25,000–£30,000', posted_date: now, url: 'https://www.adecco.co.uk/jobs', description: '', logo: '', tags: [] },
    // Hays
    { id: 'hays-executive-chef-edinburgh', title: 'Executive Chef', agency: 'Hays', agency_slug: 'hays', location: 'Edinburgh', job_type: 'Permanent', sector: 'Hospitality', salary: '£55,000–£70,000', posted_date: now, url: 'https://www.hays.co.uk/jobs/hospitality-jobs', description: '', logo: '', tags: [] },
    { id: 'hays-fb-manager-manchester', title: 'Food & Beverage Manager', agency: 'Hays', agency_slug: 'hays', location: 'Manchester', job_type: 'Permanent', sector: 'Hospitality', salary: '£40,000–£50,000', posted_date: now, url: 'https://www.hays.co.uk/jobs/hospitality-jobs', description: '', logo: '', tags: [] },
    { id: 'hays-events-manager-london', title: 'Events Manager', agency: 'Hays', agency_slug: 'hays', location: 'London', job_type: 'Permanent', sector: 'Hospitality', salary: '£38,000–£48,000', posted_date: now, url: 'https://www.hays.co.uk/jobs/hospitality-jobs', description: '', logo: '', tags: [] },
    // Staffline
    { id: 'staffline-packer-corby', title: 'Packer', agency: 'Staffline', agency_slug: 'staffline', location: 'Corby', job_type: 'Temporary', sector: 'Industrial', salary: '£11.44/hr', posted_date: now, url: 'https://www.staffline.co.uk/jobs', description: '', logo: '', tags: [] },
    { id: 'staffline-machine-op-coventry', title: 'Machine Operator', agency: 'Staffline', agency_slug: 'staffline', location: 'Coventry', job_type: 'Temporary', sector: 'Industrial', salary: '£12.50/hr', posted_date: now, url: 'https://www.staffline.co.uk/jobs', description: '', logo: '', tags: [] },
    // Manpower
    { id: 'manpower-it-support-london', title: 'IT Support Technician', agency: 'Manpower', agency_slug: 'manpower', location: 'London', job_type: 'Contract', sector: 'IT', salary: '£200/day', posted_date: now, url: 'https://www.manpower.co.uk/jobs', description: '', logo: '', tags: [] },
    { id: 'manpower-assembly-op-birmingham', title: 'Assembly Operative', agency: 'Manpower', agency_slug: 'manpower', location: 'Birmingham', job_type: 'Temporary', sector: 'Industrial', salary: '£12/hr', posted_date: now, url: 'https://www.manpower.co.uk/jobs', description: '', logo: '', tags: [] },
  ]
  return { scraped_at: new Date().toISOString(), total: jobs.length, jobs }
}
