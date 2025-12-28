import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/routes/components/Navbar";

const Resume = () => {
    const { id } = useParams();
    const { fs, kv } = usePuterStore();
    const navigate = useNavigate();

    // State management based on YouTuber's logic
    const [imageUrl, setImageUrl] = useState<string>('');
    const [feedback, setFeedback] = useState<any>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResume = async () => {
            try {
                setLoading(true);
                // 1. Fetch the data object from Puter KV Store
                const resume = await kv.get(`resume:${id}`);
                if (!resume) {
                    console.error("No resume found for this ID");
                    return;
                }

                const data = JSON.parse(resume);
                setAnalysisData(data);
                setFeedback(data.feedback);

                // 2. Read the image file from Puter File System (PFS)
                // This converts the cloud path into a readable Blob
                const imageBlob = await fs.read(data.imagePath);
                if (!imageBlob) return;

                // 3. Create a local URL for the image so the browser can display it
                const url = URL.createObjectURL(imageBlob as Blob);
                setImageUrl(url);
            } catch (error) {
                console.error("Error loading resume analysis:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadResume();

        // Cleanup function to prevent memory leaks
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [id, fs, kv]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 animate-pulse">Loading Analysis...</p>
            </div>
        </div>
    );

    return (
        <main className="!pt-0 bg-gray-50 min-h-screen font-sans">
            <Navbar />

            {/* Split Screen Container */}
            <div className="flex flex-row w-full max-lg:flex-col-reverse h-[calc(100vh-64px)] overflow-hidden">

                {/* LEFT SIDE: Resume Image Preview */}
                <section className="lg:w-1/2 p-8 overflow-y-auto bg-[#f3f4f6] flex justify-center">
                    {imageUrl && (
                        <div className="animate-in fade-in duration-1000 max-w-2xl shadow-2xl rounded-2xl overflow-hidden h-fit bg-white p-2">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-xl"
                                alt="Analyzed Resume"
                            />
                        </div>
                    )}
                </section>

                {/* RIGHT SIDE: Feedback & Scores */}
                <section className="lg:w-1/2 p-10 overflow-y-auto bg-white border-l border-gray-100">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900">Resume Review</h1>
                                <p className="text-blue-600 font-semibold mt-1">{analysisData?.jobTitle} @ {analysisData?.companyName}</p>
                            </div>
                        </div>

                        {/* Main Score Card */}
                        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm ring-1 ring-gray-900/5">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                    {/* Circular Score Visual */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                        <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={314}
                                                strokeDashoffset={314 - (314 * (feedback?.overallScore || 0)) / 100}
                                                className="text-pink-500 transition-all duration-1000"
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-black text-gray-900">{feedback?.overallScore}/100</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Your Resume Score</h2>
                                    <p className="text-gray-500 text-sm">This score represents your alignment with the job description.</p>
                                </div>
                            </div>

                            {/* Detailed Metric Bars */}
                            <div className="space-y-7">
                                <ScoreBar label="Tone & Style" score={feedback?.toneStyleScore || 0} color="bg-orange-400" />
                                <ScoreBar label="Content" score={feedback?.contentScore || 0} color="bg-pink-500" />
                                <ScoreBar label="Structure" score={feedback?.structureScore || 0} color="bg-teal-500" />
                                <ScoreBar label="Skills" score={feedback?.skillsScore || 0} color="bg-purple-500" />
                            </div>
                        </div>

                        {/* ATS Badge */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center gap-4 mb-10">
                            <div className="bg-emerald-500 p-2 rounded-lg text-white">🛡️</div>
                            <div>
                                <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-xs">ATS Compatibility</h3>
                                <p className="text-emerald-800 font-medium">Your resume is optimized for automated tracking systems.</p>
                            </div>
                        </div>

                        {/* Improvement Checklist */}
                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Resume Improvement Checklist</h3>
                            <div className="space-y-3">
                                {feedback?.improvementTips?.map((tip: string, index: number) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 group-hover:bg-white"></div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

// Sub-component for progress bars
const ScoreBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <span className="text-sm font-black text-gray-900">{score}/100</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
                className={`${color} h-full transition-all duration-1000 ease-out`}
                style={{ width: `${score}%` }}
            ></div>
        </div>
    </div>
);

export default Resume;