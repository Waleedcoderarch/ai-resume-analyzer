import type { Route } from "./+types/home";
import Navbar from "~/routes/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/routes/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        { name: "description", content: "Smart feedback for your dream job !" },
    ];
}

export default function Home() {
    // 1. Move hooks to the top level of the Home component
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    // 2. Authentication Protection Logic
    useEffect(() => {
        // If user is not logged in, send them to the auth page
        if (!auth.isAuthenticated) {
            navigate("/auth?next=/");
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <main className="bg-[url('/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading text-center">
                    <h1>Track your Applications & Resume Ratings</h1>
                    <h2>Review your submission and check AI powered feedback</h2>
                </div>

                {/* 3. The Grid Layout */}
                {resumes.length > 0 ? (
                    <div className="resumes-section grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-12 px-6 pb-20">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-6">
                        No resumes uploaded yet.
                    </p>
                )}
            </section>
        </main>
    );
}