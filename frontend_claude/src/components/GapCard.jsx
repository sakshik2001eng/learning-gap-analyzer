import {SeverityBadge,ProgressBar,Button} from './ui';
export default function GapCard({g,detailed}){
 const bar=g.severity==='High'?'bg-bad':g.severity==='Medium'?'bg-warn':'bg-good';
 return <article className="card p-5 hover:shadow-md transition-shadow"><div className="flex items-start justify-between gap-2"><h3 className="font-semibold text-lg">{g.name}</h3><SeverityBadge level={g.severity}/></div>
 <div className="mt-3 flex items-center gap-3 text-sm"><span className="w-24 shrink-0">Mastery {g.mastery}%</span><ProgressBar value={g.mastery} color={bar}/></div>
 <p className="mt-3 text-sm"><b>Missing prerequisite:</b> {g.prereq}</p>
 <p className="mt-2 text-sm text-slate-600">{detailed&&<b>Detected because: </b>}{g.why}</p>
 <div className="mt-4 flex gap-2"><Button to={`/student/gaps/${g.id}`}>{detailed?'View analysis':'View gap'}</Button>{detailed&&<Button to="/student/learning-path" variant="ghost">Start learning</Button>}</div></article>}
