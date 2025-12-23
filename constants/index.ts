// index.ts

export type Resume = {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string; // relative to public folder
    resumePath: string; // relative to public folder
    feedback?: {
        overallScore: number;
    };
};

export const resumes: Resume[] = [
    // Original 1, 2, 3
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/resume_01.png", // Added '/' for safety
        resumePath: "resumes/resume-1.pdf",
        feedback: { overallScore: 85 },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/resume_02.png", // Added '/' for safety
        resumePath: "resumes/resume-2.pdf",
        feedback: { overallScore: 55 },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/resume_03.png", // Added '/' for safety
        resumePath: "resumes/resume-3.pdf",
        feedback: { overallScore: 75 },
    },

    // New Copies 4, 5, 6
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/resume_01.png",
        resumePath: "resumes/resume-1.pdf",
        feedback: { overallScore: 85 },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/resume_02.png",
        resumePath: "resumes/resume-2.pdf",
        feedback: { overallScore: 55 },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/resume_03.png",
        resumePath: "resumes/resume-3.pdf",
        feedback: { overallScore: 75 },
    },
];