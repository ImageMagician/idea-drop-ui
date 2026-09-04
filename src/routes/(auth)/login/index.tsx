import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
})

function LoginPage() {
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { mutateAsync, isPending } = useMutation({
            mutationFn: loginUser,
            onSuccess: (data) => {
                setAccessToken(data.accessToken);
                setUser(data.user);
                navigate({to: '/ideas'})
            },
        onError: (err) => {
                setError(err.message)
        }
        }
    );

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        await mutateAsync({email, password});
    }

    return <div className={`max-w-md mx-auto`}>
        <h1 className="text-3xl font-bold mb-6">
            Login
        </h1>
        { error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                { error }
            </div>
        )}
        <form onSubmit={handleSubmit} className={`space-y-4`}>
            <input type="text"
                   className="w-full border border-gray-300 hover:border-gray-500 focus-visible:outline-4 focus-visible:outline-blue-200 rounded-md p-2"
                   onChange={(e) => setEmail(e.target.value)}
                   value={email}
                   placeholder="Email address"
            />
            <input type="password"
                   className="w-full border border-gray-300 hover:border-gray-500 focus-visible:outline-4 focus-visible:outline-blue-200 rounded-md p-2"
                   onChange={(e) => setPassword(e.target.value)}
                   value={password}
                   placeholder="Password"
            />
            <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50"
                    disabled={isPending}
            >
                { isPending ? 'Logging in' : 'Login' }
            </button>
            <p className={`text-sm text-center mt-4`}>Don't have an account?
                <Link to={`/register`} className="text-blue-600 hover:underline font-md ml-1">Register here.</Link>
            </p>
        </form>
    </div>
}
