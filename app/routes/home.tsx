import type { Route } from "./+types/home";
import Navbar from "~/routes/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Waleed Ahmed | Project AI Resume Analyzer" },
        { name: "description", content: "BCA Student & Developer of ATS Resume Analyzer" },
    ];
}

export default function Home() {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/auth?next=/");
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <main className="bg-[url('/bg-main.svg')] bg-cover min-h-screen flex flex-col">
            <Navbar />

            <section className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-3xl w-full text-center">

                    {/* Part 1: Your Introduction */}
                    <div className="mb-12">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Introduction</span>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mt-4">
                            Waleed Ahmed
                        </h1>
                        <p className="text-2xl font-medium text-gray-500 italic mt-3">
                            St. Joseph Degree College
                        </p>
                        <p className="text-2xl font-medium text-gray-500 italic mt-1">
                            Osmania University
                        </p>

                        <div className="h-1 w-20 bg-blue-600 mx-auto mt-8 rounded-full"></div>

                        <p className="mt-8 text-gray-700 leading-relaxed text-xl">
                            I am a software developer with a strong foundation in programming and web technologies, specializing in backend development and AI-integrated applications. I focus on designing practical, scalable solutions that address real-world problems, with particular interest in building intelligent systems that enhance hiring and recruitment workflows.
                        </p>
                    </div>

                    {/* Part 2: About the Project */}
                    <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_32px_64px_-15px_rgba(37,99,235,0.2)]">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Featured Project
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 mb-8">
                            ATS Resume Analyzer
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto mb-12">
                            {[
                                "AI-powered analysis comparing resumes with job descriptions",
                                "Simulates real Applicant Tracking System (ATS) behavior",
                                "Generates resume score based on job relevance",
                                "Identifies missing and weak keywords",
                                "Provides clear, actionable improvement suggestions",
                                "Provides clear improvement tips to optimize resumes for ATS systems", // NEW POINT ADDED
                                "Built using Puter.js with AI prompt-based analysis",
                                "Focused on backend logic and real-world recruitment use cases"
                            ].map((point, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 border border-gray-100/50 hover:bg-white transition-colors">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-700 font-medium leading-snug">{point}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tools & Tech Tags */}
                        <div className="mb-12">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Tools & Technologies</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {[
                                    { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
                                    { name: 'Tailwind CSS', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
                                    { name: 'Puter.js', logo: 'https://puter.com/favicon.ico' },
                                    { name: 'AI Engineering', logo: 'https://cdn.simpleicons.org/openai/412991' },
                                    { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
                                    { name: 'PDF.js', logo: 'https://cdn.simpleicons.org/adobeacrobatreader/EC1C24' }
                                ].map((tool) => (
                                    <span
                                        key={tool.name}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:border-blue-300 transition-colors"
                                    >
                                        <img
                                            src={tool.logo}
                                            alt={tool.name}
                                            className="w-5 h-5 object-contain"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        {tool.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            to="/upload"
                            className="inline-block px-12 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Get Started with AI Analysis
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}