import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
})

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <div className={`max-w-md mx-auto`}>
        <h1 className="text-3xl font-bold mb-6">
            Register
        </h1>
        <form action="" className={`space-y-4`}>
            <input type="text"
                   className="w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => setName(e.target.value)}
                   value={name}
                   placeholder="Full Name"
            />
            <input type="text"
                   className="w-full border border-gray-300 rounded-md p-2"
                   onChange={(e) => setEmail(e.target.value)}
                   value={email}
                   placeholder="Email address"
            />
            <input type="text"
                   className="w-full border border-gray-300 rounded-md p-2"
                   onChange={(e) => setPassword(e.target.value)}
                   value={password}
                   placeholder="Password"
            />
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50">
                Register
            </button>
            <p className={`text-sm text-center mt-4`}>Already have an account?
                <Link to={`/login`} className="text-blue-600 hover:underline font-md ml-1">Login here.</Link>
            </p>
        </form>
    </div>
}
