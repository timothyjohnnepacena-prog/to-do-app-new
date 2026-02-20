'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', { username, password, redirect: false });
    if (result?.error) alert("Invalid credentials");
    else { router.push('/'); router.refresh(); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] border-t-8 border-indigo-600">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 text-center uppercase tracking-wider">Welcome</h1>
        <p className="text-gray-500 text-center mb-8 text-sm italic">Enter your details to access your board</p>
        <input 
          type="text" placeholder="Username" 
          className="w-full p-3 mb-4 border-2 border-gray-100 rounded-xl text-black focus:border-indigo-600 outline-none transition-all"
          onChange={(e) => setUsername(e.target.value)} required
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 mb-8 border-2 border-gray-100 rounded-xl text-black focus:border-indigo-600 outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
          LOG IN
        </button>
        <p className="mt-6 text-center text-sm text-gray-500">
          First time? <Link href="/register" className="text-orange-500 font-bold hover:underline">Create an Account</Link>
        </p>
      </form>
    </div>
  );
}