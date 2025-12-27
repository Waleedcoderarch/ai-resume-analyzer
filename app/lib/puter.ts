import { create } from "zustand";

/** * 1. MISSING TYPES & INTERFACES
 * These define the shapes of the data Puter.js returns.
 */
interface PuterUser {
    username: string;
    email?: string;
}

interface FSItem {
    path: string;
    name: string;
    is_dir: boolean;
    size?: number;
}

interface KVItem {
    key: string;
    value: string;
}

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string | any[];
}

interface AIResponse {
    message: {
        content: string | any;
    };
}

interface PuterChatOptions {
    model?: string;
    stream?: boolean;
}

/** * 2. GLOBAL WINDOW DECLARATION
 * This tells TypeScript that Puter.js is loaded via a <script> tag.
 */
declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (path: string, data: string | File | Blob) => Promise<File | undefined>;
                read: (path: string) => Promise<Blob>;
                upload: (file: File[] | Blob[]) => Promise<FSItem>;
                delete: (path: string) => Promise<void>;
                readdir: (path: string) => Promise<FSItem[] | undefined>;
            };
            ai: {
                chat: (prompt: string | ChatMessage[], imageURL?: string | PuterChatOptions, testMode?: boolean, options?: PuterChatOptions) => Promise<any>;
                img2txt: (image: string | File | Blob, testMode?: boolean) => Promise<string>;
            };
            kv: {
                get: (key: string) => Promise<string | null>;
                set: (key: string, value: string) => Promise<boolean>;
                delete: (key: string) => Promise<boolean>;
                list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
                flush: () => Promise<boolean>;
            };
        };
    }
}

/** * 3. ZUSTAND STORE INTERFACE
 */
interface PuterStore {
    isLoading: boolean;
    error: string | null;
    puterReady: boolean;
    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => PuterUser | null;
    };
    fs: {
        write: (path: string, data: string | File | Blob) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob | undefined>;
        upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
    };
    ai: {
        chat: (prompt: string | ChatMessage[], imageURL?: string | PuterChatOptions, testMode?: boolean, options?: PuterChatOptions) => Promise<AIResponse | undefined>;
        feedback: (path: string, message: string) => Promise<AIResponse | undefined>;
        img2txt: (image: string | File | Blob, testMode?: boolean) => Promise<string | undefined>;
    };
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
        delete: (key: string) => Promise<boolean | undefined>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[] | KVItem[] | undefined>;
        flush: () => Promise<boolean | undefined>;
    };
    init: () => void;
    clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

/** * 4. THE ACTUAL STORE IMPLEMENTATION
 */
export const usePuterStore = create<PuterStore>((set, get) => {
    const setError = (msg: string) => {
        set({ error: msg, isLoading: false });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        const puter = getPuter();
        if (!puter) return false;
        set({ isLoading: true });
        try {
            const isSignedIn = await puter.auth.isSignedIn();
            const user = isSignedIn ? await puter.auth.getUser() : null;
            set({
                auth: { ...get().auth, user, isAuthenticated: isSignedIn },
                isLoading: false
            });
            return isSignedIn;
        } catch (err) {
            setError("Auth check failed");
            return false;
        }
    };

    return {
        isLoading: false,
        error: null,
        puterReady: false,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn: async () => { await getPuter()?.auth.signIn(); await checkAuthStatus(); },
            signOut: async () => { await getPuter()?.auth.signOut(); set({ auth: { ...get().auth, user: null, isAuthenticated: false } }); },
            refreshUser: async () => { await checkAuthStatus(); },
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path, data) => getPuter()!.fs.write(path, data),
            read: (path) => getPuter()!.fs.read(path),
            readdir: (path) => getPuter()!.fs.readdir(path),
            upload: (files) => getPuter()!.fs.upload(files),
            delete: (path) => getPuter()!.fs.delete(path),
        },
        ai: {
            chat: (prompt, imageURL, testMode, options) => getPuter()!.ai.chat(prompt, imageURL, testMode, options),
            feedback: async (path, message) => {
                return getPuter()!.ai.chat([{
                    role: "user",
                    content: [
                        { type: "file", puter_path: path },
                        { type: "text", text: message }
                    ]
                }], { model: "claude-sonnet-4" }) as Promise<AIResponse>;
            },
            img2txt: (image, testMode) => getPuter()!.ai.img2txt(image, testMode),
        },
        kv: {
            get: (key) => getPuter()!.kv.get(key),
            set: (key, value) => getPuter()!.kv.set(key, value),
            delete: (key) => getPuter()!.kv.delete(key),
            list: (pattern, values) => getPuter()!.kv.list(pattern, values),
            flush: () => getPuter()!.kv.flush(),
        },
        init: () => {
            if (getPuter()) {
                set({ puterReady: true });
                checkAuthStatus();
            } else {
                const interval = setInterval(() => {
                    if (getPuter()) {
                        clearInterval(interval);
                        set({ puterReady: true });
                        checkAuthStatus();
                    }
                }, 500);
            }
        },
        clearError: () => set({ error: null }),
    };
});