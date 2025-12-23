import { type MetaFunction, useNavigate, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "Resumind | Auth" },
        { name: "description", content: "Log into your account" },
    ];
};

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Safely get the 'next' parameter from the URL
    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get("next") || "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next);
        }
    }, [auth.isAuthenticated, navigate, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10 max-w-md w-full">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gradient">Welcome</h1>
                        <h2 className="text-xl text-gray-600 mt-2">Log In to Continue Your Job Journey</h2>
                    </div>

                    <div className="flex flex-col items-center">
                        {isLoading ? (
                            <button className="auth-button animate-pulse" disabled>
                                <span>Signing you in...</span>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={() => auth.signOut()}>
                                        <span>Log Out</span>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={() => auth.signIn()}>
                                        <span>Log In</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;