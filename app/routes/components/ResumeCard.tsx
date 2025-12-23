import { Link } from "react-router";
import ScoreCircle from "../../../constants/ScoreCircle";

type Resume = {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    feedback?: {
        overallScore: number;
    };
};

interface ResumeCardProps {
    resume: Resume;
}

const ResumeCard = ({ resume }: ResumeCardProps): JSX.Element => {
    const { id, companyName, jobTitle, feedback, imagePath } = resume;

    // Use the path directly from the resume object
    const imageSrc = imagePath;

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card block bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-5 border border-gray-100 hover:-translate-y-1"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-black font-semibold text-xl">{companyName}</h2>
                    <h3 className="text-gray-500 text-base">{jobTitle}</h3>
                </div>

                {feedback && (
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                )}
            </div>

            {/* Resume Preview */}
            <div className="gradient-border animate-in fade-in duration-700 rounded-xl overflow-hidden">
                <img
                    src={imageSrc}
                    alt={`Resume for ${jobTitle}`}
                    className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/pdf.png";
                    }}
                />
            </div>
        </Link>
    );
};

export default ResumeCard;
