// "use client"
// import React, { useEffect, useState } from 'react'
// import TextType from '@/app/components/UI/TextType/TextType'
// import Image from 'next/image'
// import { Session } from '@/lib/auth/auth'
// const Account = () => {
//     const [session, setSession] = useState<Session | null>(null);
//     const [firstName, setFirstName] = useState<string>('');
//     const [lastName, setLastName] = useState<string>('');
//     const [email, setEmail] = useState<string>('');

//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await fetch('/api/auth/me', { cache: 'no-store' });
//                 const data = await res.json();
//                 if (res.ok && data.ok) {
//                     setSession(data.user);
//                     console.log("Session data:", data.user);
//                 } else { 
//                   setSession(null)
//                 }
//               } catch (error){
//                 console.error("Error", error);
//                 setSession(null);
//               }
//           })();
//     }, []);


//     const handleLogout = async () => {
//         try{
//             await fetch('/api/auth/logout', {
//                 method: 'POST',
//                 headers:{
//                     'Content-Type' : 'application/json'
//                 }
//             })
//             window.location.href = "/";
//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     return (
//         <div className="container text-primary-text mx-auto px-4 mt-40">
//             <div className='flex justify-between flex-col md:flex-row w-full mb-10 gap-5'>
//             <div>
//               <div>
//                 <TextType
//                   textColors={["text-primary-text"]}
//                   text={["Account Settings"]}
//                   typingSpeed={25}
//                   pauseDuration={1500}
//                   showCursor
//                   cursorCharacter=""
//                   className="text-4xl text-primary-text text-center"
//                 />
//               </div>
            
//             </div>
//             <button className="flex justify-center items-center  justfiy-self-center w-full sm:w-1/3 lg:w-1/10 self-center bg-red-400 rounded-2xl border p-2 font-semibold
//                          transition hover:bg-red-600 hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
//                          active:translate-y-0 active:shadow-md
//                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
//                           onClick={handleLogout}>
//               <Image src="/icons/log-out.svg" alt="Logout Icon" width={22} height={22} className='mr-2' />
//               Logout

//             </button>
//           </div>
          
//           <div className='flex flex-col border-2 rounded-2xl mt-17 p-5'>
//             <h3 className='font-bold w-full'>Profile Information</h3>
//             <p className='text-sm w-full text-gray-500 mt-2'>Update your profile information below</p>
//             <div className="mt-5">
//             <form className="mt-6 flex flex-col gap-5">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <input
//                   onChange={(e) => setFirstName(e.target.value)}
//                   value={firstName || session?.name?.split(' ')[0] || ''}
//                   name="firstName"
//                   type="text"
//                   placeholder="First name"
//                   className="h-11 w-full rounded-2xl border px-4 outline-none transition
//                             focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
//                 />

//                 <input
//                   onChange={(e) => setLastName(e.target.value)}
//                   value={lastName || session?.name?.split(' ')[1] || ''}
//                   name="lastName"
//                   type="text"
//                   placeholder="Last name"
//                   className="h-11 w-full rounded-2xl border px-4 outline-none transition
//                             focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
//                 />

//               </div>

//               <div className="flex flex-col gap-3">
//                 <input
//                   onChange={(e) => setEmail(e.target.value)}
//                   value={email || session?.email || ''}
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   required
//                   className="h-11 w-full rounded-2xl border px-4 outline-none transition
//                             focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
//                 />
//               </div>
//               <div className="flex flex-row gap-3 justify-end">
//                 <button
//                 type="submit"
//                 className="w-full self-end lg:w-1/7 rounded-2xl border px-5 py-3 font-semibold
//                           transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
//                           active:translate-y-0 active:shadow-md
//                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="reset"
//                 className="w-full self-end sm:w-1/3 lg:w-1/7 rounded-2xl border px-5 py-3 font-semibold
//                           transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
//                           active:translate-y-0 active:shadow-md
//                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
//               >
//                 Save Changes
//               </button>
//               </div>
      
//             </form>
//             </div>
//         </div>
//         </div>
            
//     );
// }

// export default Account

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import AccountClient from "./AccountClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const s = await getSession();
  if (!s) redirect("/signin");
  // передаём готовые данные, без fetch на клиенте
  return <AccountClient initialSession={{ id: s.id, name: s.name, email: s.email }} />;
}
