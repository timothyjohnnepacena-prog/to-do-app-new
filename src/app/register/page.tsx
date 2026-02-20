'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) router.push('/login');
    else alert("Registration failed!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] border-t-8 border-orange-500">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 text-center uppercase tracking-wider">Join Us</h1>
        <p className="text-gray-500 text-center mb-8 text-sm italic">Create your personal Kanban workspace</p>
        <input 
          type="text" placeholder="Choose a Username" 
          className="w-full p-3 mb-4 border-2 border-gray-100 rounded-xl text-black focus:border-orange-500 outline-none transition-all"
          onChange={(e) => setUsername(e.target.value)} required
        />
        <input 
          type="password" placeholder="Create a Password" 
          className="w-full p-3 mb-8 border-2 border-gray-100 rounded-xl text-black focus:border-orange-500 outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-black text-lg hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
          SIGN UP NOW
        </button>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already a member? <Link href="/login" className="text-orange-500 font-bold hover:underline">Log In</Link>
        </p>
      </form>
    </div>
  );
}