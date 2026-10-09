import {useState} from 'react';import {NavLink,Outlet,Link,useNavigate} from 'react-router-dom';
import {LayoutDashboard,Target,Route,ClipboardList,LineChart,Users,AlertTriangle,FileText,BarChart3,Menu,X,Brain,BookPlus,LogOut} from 'lucide-react';
import {useAuth} from '../auth';
const nav={student:[['/student/dashboard','Dashboard',LayoutDashboard,true],['/student/gaps','My Learning Gaps',Target],['/student/learning-path','Learning Path',Route],['/student/quizzes','Quizzes',ClipboardList],['/student/progress','Progress',LineChart]],
teacher:[['/teacher/dashboard','Dashboard',LayoutDashboard,true],['/teacher/assessments','Assessments',BookPlus],['/teacher/students','My Students',Users],['/teacher/gaps','Learning Gaps',AlertTriangle],['/teacher/materials','Study Materials',FileText],['/teacher/reports','Reports',BarChart3]]};
export default function Layout({role}){
 const [open,setOpen]=useState(false);const go=useNavigate();const {user,logout}=useAuth();
 const links=<nav aria-label="Main" className="flex flex-col gap-1">{nav[role].map(([to,l,I,end])=><NavLink key={to} to={to} end={end} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive?'bg-brand-600 text-white':'text-slate-700 hover:bg-brand-50'}`}><I size={18} aria-hidden/>{l}</NavLink>)}</nav>;
 return <div className="min-h-screen lg:flex">
 <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-white p-4 transition-transform lg:static lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
  <Link to="/" className="mb-6 flex items-center gap-2 font-display text-lg"><Brain className="text-brand-600"/>Gap Analyzer</Link>{links}
  <div className="mt-8 border-t border-line pt-4"><div className="mb-3 flex items-center gap-3 rounded-xl bg-paper p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{user?.name?.slice(0,1)?.toUpperCase()}</span><span className="min-w-0"><b className="block truncate text-sm">{user?.name}</b><span className="text-xs capitalize text-slate-500">{role} account</span></span></div><button onClick={()=>{logout();go('/',{replace:true});setOpen(false)}} className="btn w-full justify-start text-slate-600 hover:bg-red-50 hover:text-bad"><LogOut size={16}/>Log out</button></div></aside>
 {open&&<div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={()=>setOpen(false)}/>}
 <div className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden"><button aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><span className="font-display">Gap Analyzer</span><span className="w-6"/></header>
 <main className="mx-auto max-w-6xl p-4 sm:p-8"><Outlet/></main></div></div>}
