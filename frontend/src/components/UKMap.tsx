'use client'

import{useEffect,useRef,useState}from'react'
import type{Job}from'@/types/job'
import{getCoordsForLocation}from'@/lib/ukCities'

const COLORS:Record<string,string>={
'arc-hospitality':'#1a4f72',
'constellation':'#6b3fa0',
'blue-arrow':'#005eb8',
'adecco':'#e8001d',
'hays':'#00a650',
'staffline':'#f5821f',
'manpower':'#0063a3'
}

interface MapProps{
jobs:Job[]
onJobClick:(job:Job)=>void
}

export default function UKMap({jobs,onJobClick}:MapProps){
const mapRef=useRef<HTMLDivElement>(null)
const mapInstance=useRef<any>(null)
const markers=useRef<any[]>([])
const[mounted,setMounted]=useState(false)

useEffect(()=>{setMounted(true)},[])

useEffect(()=>{
if(!mounted||!mapRef.current||mapInstance.current)return

const initMap=async()=>{
const L=await import('leaflet')
const link=document.createElement('link')
link.rel='stylesheet'
link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
document.head.appendChild(link)

const m=L.map(mapRef.current!,{
center:[54.5,-3.5],
zoom:6,
attributionControl:false
})

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(m)
mapInstance.current=m
}

initMap()

return()=>{
if(mapInstance.current){
mapInstance.current.remove()
mapInstance.current=null
}
}
},[mounted])

useEffect(()=>{
if(!mapInstance.current)return

const updateLayer=async()=>{
const L=await import('leaflet')
markers.current.forEach(m=>m.remove())
markers.current=[]

const grouped=jobs.reduce((acc,j)=>{
acc[j.location]=acc[j.location]||[]
acc[j.location].push(j)
return acc
},{}as Record<string,Job[]>)

Object.entries(grouped).forEach(([loc,list])=>{
const pos=getCoordsForLocation(loc)
if(!pos)return

const count=list.length
const color=COLORS[list[0].agency_slug]||'#e8522a'

const icon=L.divIcon({
className:'',
iconSize:[30,42],
iconAnchor:[15,42],
popupAnchor:[0,-40],
html:`
<div style="width:30px;height:42px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
<svg viewBox="0 0 40 48" fill="${color}" xmlns="http://www.w3.org/2000/svg">
<path d="M20 0C9 0 0 9 0 20C0 33 20 48 20 48C20 48 40 33 40 20C40 9 31 0 20 0Z" stroke="white" stroke-width="3"/>
<circle cx="20" cy="19" r="9" fill="white"/>
<text x="20" y="23" text-anchor="middle" font-size="10" font-weight="900" fill="${color}">${count}</text>
</svg>
</div>`
})

const marker=L.marker(pos,{icon}).addTo(mapInstance.current)

const popupContent=list.slice(0,3).map(j=>`
<div style="padding:5px 0;cursor:pointer;border-bottom:1px solid #eee" onclick="window.dispatchEvent(new CustomEvent('openJob',{detail:'${j.id}'}))">
<div style="font-weight:700;font-size:12px;color:#111">${j.title}</div>
<div style="font-size:10px;color:#666">${j.agency}</div>
</div>`).join('')

marker.bindPopup(`<div style="font-family:sans-serif"><b>${loc}</b>${popupContent}</div>`)
markers.current.push(marker)
})

const handleOpen=(e:any)=>{
const job=jobs.find(j=>j.id===e.detail)
if(job)onJobClick(job)
}

window.addEventListener('openJob',handleOpen)
return()=>window.removeEventListener('openJob',handleOpen)
}

updateLayer()
},[jobs,onJobClick])

return <div ref={mapRef} style={{width:'100%',height:'100%',background:'#0a0a0a',outline:'none'}}/>
}