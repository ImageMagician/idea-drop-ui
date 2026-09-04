import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser} from "@/api/auth.ts";
import { useAuth } from "@/context/AuthContext"

export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
})

function RegisterPage() {
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { mutateAsync, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setUser(data.user);
            navigate({to: '/ideas'})
        },
        onError: (err: any) => {
            setError(err.message)
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await mutateAsync({
                name, email, password
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    return <div className={`max-w-md mx-auto`}>
        <h1 className="text-3xl font-bold mb-6">
            Register
        </h1>
        {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                { error }
            </div>
        )}
        <form onSubmit={ handleSubmit } className={`space-y-4`}>
            <input type="text"
                   className="w-full border border-gray-300 hover:border-gray-500 rounded-md p-2 focus-visible:border-gray-600 focus-visible:outline-4 focus-visible:outline-blue-200"
                    onChange={(e) => setName(e.target.value)}
                   value={name}
                   placeholder="Full Name"
            />
            <input type="text"
                   className="w-full border border-gray-300 hover:border-gray-500 rounded-md p-2 focus-visible:border-gray-600 focus-visible:outline-4 focus-visible:outline-blue-200"
                   onChange={(e) => setEmail(e.target.value)}
                   value={email}
                   placeholder="Email address"
            />
            <input type="password"
                   className="w-full border border-gray-300 hover:border-gray-500 rounded-md p-2 focus-visible:border-gray-600 focus-visible:outline-4 focus-visible:outline-blue-200"
                   onChange={(e) => setPassword(e.target.value)}
                   value={password}
                   placeholder="Password"
            />
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50"
                disabled={isPending}
            >
                { isPending ? 'Registering...' : 'Register' }
            </button>
            <p className={`text-sm text-center mt-4`}>Already have an account?
                <Link to={`/login`} className="text-blue-600 hover:underline font-md ml-1">Login here.</Link>
            </p>
        </form>
    </div>
}
