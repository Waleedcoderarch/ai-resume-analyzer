import React, { useState } from 'react';
import Navbar from "~/routes/components/Navbar";
import FileUploader from "~/routes/components/FileUploader";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage, type PdfConversionResult } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";

/**
 * Enhanced instructions to ensure the AI returns ONLY clean JSON.
 */
const prepareInstructions = (jobTitle: string, jobDescription: string) => {
    return `Analyze this resume for the position of ${jobTitle}. 
    Job Description: ${jobDescription}. 
    Provide feedback in JSON format with the following keys:
    - overallScore: (0-100)
    - toneStyleScore: (0-100)
    - contentScore: (0-100)
    - structureScore: (0-100)
    - skillsScore: (0-100)
    - improvementTips: (array of strings)
    - missingKeywords: (array of strings)
    IMPORTANT: Return ONLY the JSON object.`;
};

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async (data: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File
    }) => {
        try {
            setIsProcessing(true);

            // 1. Upload Original Resume
            setStatusText('Uploading resume...');
            const uploadResult = await fs.upload([data.file]);
            const uploadedFile = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;
            if (!uploadedFile || !uploadedFile.path) throw new Error('Failed to upload resume');

            // 2. Convert PDF to Image (for AI vision/processing)
            setStatusText('Converting to image...');
            const imageResult = await convertPdfToImage(data.file);
            if (imageResult.error) throw new Error(`PDF Error: ${imageResult.error}`);
            if (!imageResult.file) throw new Error("Conversion finished but no file was created.");

            // 3. Upload the Converted Image
            setStatusText('Uploading the image...');
            const imageUploadResult = await fs.upload([imageResult.file]);
            const uploadImage = Array.isArray(imageUploadResult) ? imageUploadResult[0] : imageUploadResult;
            if (!uploadImage || !uploadImage.path) throw new Error('Failed to upload image.');

            // 4. Generate UUID and setup Data Object
            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const analysisData = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadImage.path,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                jobDescription: data.jobDescription,
                feedback: null as any,
            };

            // 5. AI Analysis Step
            setStatusText('AI is Analyzing...');
            const feedbackResponse = await ai.feedback(
                uploadedFile.path,
                prepareInstructions(data.jobTitle, data.jobDescription)
            );

            if (!feedbackResponse || !feedbackResponse.message) throw new Error('Failed to analyze resume');

            // --- START CLEANING LOGIC ---
            const feedbackContent = feedbackResponse.message.content;
            let feedbackText = typeof feedbackContent === 'string'
                ? feedbackContent
                : (feedbackContent as any)[0]?.text || JSON.stringify(feedbackContent);

            // Strip Markdown backticks that crash JSON.parse
            feedbackText = feedbackText
                .replace(/^```json/i, "")
                .replace(/^```/i, "")
                .replace(/```$/i, "")
                .trim();

            try {
                analysisData.feedback = JSON.parse(feedbackText);
            } catch (parseError) {
                console.error("Raw AI text that failed to parse:", feedbackText);
                throw new Error("AI response format error. Please try clicking Analyze again.");
            }
            // --- END CLEANING LOGIC ---

            // ADD THIS LINE BELOW (Line 104)
            console.log("Analysis Result Object:", analysisData);
            navigate(`/resume/${uuid}`);

            // 6. Save results to Puter Key-Value Store
            await kv.set(`resume:${uuid}`, JSON.stringify(analysisData));

            setStatusText('Analysis Complete!');

            // 7. Redirect to Result Page
            navigate(`/result/${uuid}`);

        } catch (error: any) {
            console.error("Analysis Error Details:", error);
            setStatusText(error.message || 'An error occurred');
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload a resume first!");
            return;
        }

        const formData = new FormData(e.currentTarget);
        handleAnalyze({
            companyName: formData.get('company-name') as string,
            jobTitle: formData.get('job-title') as string,
            jobDescription: formData.get('job-description') as string,
            file: file
        });
    };

    return (
        <main className="bg-[url('/bg-main.svg')] bg-cover min-h-screen relative">
            <Navbar />
            {/* --- ADD THIS LOADING OVERLAY --- */}
            {isProcessing && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
                    <img
                        src="/resume-scan.gif"
                        alt="Scanning..."
                        className="w-64 h-64 object-contain"
                    />
                    <h2 className="text-2xl font-bold text-blue-600 animate-pulse mt-4">
                        {statusText}
                    </h2>
                    <p className="text-gray-500 mt-2">Please wait, AI is reading your resume...</p>
                </div>
            )}
            {/* --- END LOADING OVERLAY --- */}

            <section className="main-section px-4">
                <div className="page-heading py-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Smart feedback for your dream job</h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        {isProcessing ? statusText : "Drop your resume for the ATS score and improvement tips"}
                    </p>
                </div>

                <div className="w-full max-w-2xl mx-auto pb-20">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Company Name</label>
                            <input name="company-name" placeholder="e.g. Google" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Job Title</label>
                            <input name="job-title" placeholder="e.g. Frontend Developer" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Job Description</label>
                            <textarea name="job-description" rows={5} placeholder="Paste requirements..." className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Upload Resume (PDF)</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>
                        <button
                            disabled={isProcessing}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
                            type="submit"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">🌀</span> {statusText}
                                </span>
                            ) : "Analyze Resume"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Upload;