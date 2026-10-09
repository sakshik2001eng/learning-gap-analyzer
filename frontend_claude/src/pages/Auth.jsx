import {useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {ArrowRight,Brain,Eye,EyeOff,LockKeyhole,Mail,UserRound} from 'lucide-react';
import {useAuth} from '../auth';

function AuthShell({title,subtitle,children,footer}){
 return <main className="min-h-screen bg-[#f6f8fc] px-4 py-10 sm:py-16"><div className="mx-auto max-w-md"><Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl text-ink"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white"><Brain size={22}/></span>Gap Analyzer</Link><section className="card border-0 p-6 shadow-xl shadow-slate-200/70 sm:p-8"><h1 className="font-display text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-600">{subtitle}</p>{children}</section><p className="mt-6 text-center text-xs text-slate-500">Python Fundamentals · Learning Gap Analyzer</p></div></main>
}

function PasswordField({value,onChange,label}){
 const [show,setShow]=useState(false);
 return <label className="block text-sm font-medium">{label}<span className="relative mt-1 block"><LockKeyhole size={16} className="absolute left-3 top-3 text-slate-400"/><input required minLength={8} maxLength={128} type={show?'text':'password'} autoComplete={label==='Password'?'new-password':'current-password'} value={value} onChange={onChange} className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-11 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="At least 8 characters"/><button type="button" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'} className="absolute right-3 top-2.5 text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
}

export function SignUp(){
 const [params]=useSearchParams();const navigate=useNavigate();const {signup}=useAuth();
 const [role,setRole]=useState(params.get('role')==='teacher'?'teacher':'student');const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const user=await signup({name,email,password,role});navigate(user.role==='teacher'?'/teacher/dashboard':'/student/dashboard',{replace:true})}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <AuthShell title="Create your account" subtitle="Join the learning workspace as a student or teacher."><form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-medium">I am joining as<select value={role} onChange={e=>setRole(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5"><option value="student">Student</option><option value="teacher">Teacher</option></select></label>
 <label className="block text-sm font-medium">Full name<span className="relative mt-1 block"><UserRound size={16} className="absolute left-3 top-3 text-slate-400"/><input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="Your name"/></span></label>
 <label className="block text-sm font-medium">Email address<span className="relative mt-1 block"><Mail size={16} className="absolute left-3 top-3 text-slate-400"/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="you@example.com"/></span></label>
 <PasswordField label="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
 {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-bad">{error}</p>}
 <button disabled={busy} className="btn w-full justify-center bg-brand-600 py-3 text-white hover:bg-brand-700 disabled:opacity-60">{busy?'Creating account…':'Create account'}<ArrowRight size={16}/></button>
 </form><p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link className="font-semibold text-brand-600 hover:underline" to={`/login?role=${role}`}>Sign in</Link></p></AuthShell>
}

export function SignIn(){
 const [params]=useSearchParams();const navigate=useNavigate();const {login}=useAuth();
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const user=await login({email,password});navigate(user.role==='teacher'?'/teacher/dashboard':'/student/dashboard',{replace:true})}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <AuthShell title="Welcome back" subtitle="Sign in to continue your Python learning workspace."><form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-medium">Email address<span className="relative mt-1 block"><Mail size={16} className="absolute left-3 top-3 text-slate-400"/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="you@example.com"/></span></label>
 <PasswordField label="Sign-in password" value={password} onChange={e=>setPassword(e.target.value)}/>
 {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-bad">{error}</p>}
 <button disabled={busy} className="btn w-full justify-center bg-brand-600 py-3 text-white hover:bg-brand-700 disabled:opacity-60">{busy?'Signing in…':'Sign in'}<ArrowRight size={16}/></button>
 </form><p className="mt-5 text-center text-sm text-slate-600">New to the workspace? <Link className="font-semibold text-brand-600 hover:underline" to={`/signup?role=${params.get('role')==='teacher'?'teacher':'student'}`}>Create an account</Link></p></AuthShell>
}
