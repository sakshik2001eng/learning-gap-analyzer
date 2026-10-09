import {createContext,useContext,useEffect,useState} from 'react';
import {api} from './api';

const AuthContext=createContext(null);

export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{if(!localStorage.getItem('lga_access_token'))return null;try{return JSON.parse(localStorage.getItem('lga_user')||'null')}catch{return null}});
 const [ready,setReady]=useState(false);
 useEffect(()=>{
   const token=localStorage.getItem('lga_access_token');
   if(!token){setReady(true);return}
   api('/auth/me').then(account=>{setUser(account);localStorage.setItem('lga_user',JSON.stringify(account))}).catch(()=>{localStorage.removeItem('lga_access_token');localStorage.removeItem('lga_user');setUser(null)}).finally(()=>setReady(true));
 },[]);
 async function authenticate(path,body){
   const result=await api(path,{method:'POST',body:JSON.stringify(body)});
   localStorage.setItem('lga_access_token',result.access_token);
   localStorage.setItem('lga_user',JSON.stringify(result.user));
   setUser(result.user);
   return result.user;
 }
 async function signup(body){return authenticate('/auth/signup',body)}
 async function login(body){return authenticate('/auth/login',body)}
 function logout(){localStorage.removeItem('lga_access_token');localStorage.removeItem('lga_user');setUser(null)}
 return <AuthContext.Provider value={{user,ready,signup,login,logout}}>{children}</AuthContext.Provider>;
}

export function useAuth(){
 const value=useContext(AuthContext);
 if(!value)throw new Error('useAuth must be used inside AuthProvider');
 return value;
}
