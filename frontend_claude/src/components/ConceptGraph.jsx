import {Check,AlertTriangle} from 'lucide-react';
export default function ConceptGraph({nodes}){
 return <ol className="flex flex-col gap-1 md:flex-row md:items-center md:gap-0" aria-label="Prerequisite map">{nodes.map((n,i)=>{const gap=n.state==='gap';return <li key={n.name} className="flex flex-col items-center md:flex-row">
 <div className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold ${gap?'border-bad bg-red-50 text-bad':'border-good/40 bg-emerald-50 text-good'}`}>{gap?<AlertTriangle size={16}/>:<Check size={16}/>}{n.name}</div>
 {i<nodes.length-1&&<div aria-hidden className={`h-6 w-0.5 md:h-0.5 md:w-6 ${nodes[i+1].state==='gap'?'bg-bad':'bg-good/40'}`}/>}</li>})}</ol>}
