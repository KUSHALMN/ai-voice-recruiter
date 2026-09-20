import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Code2 } from 'lucide-react';

interface CodeEditorProps {
    initialCode?: string;
    language?: string;
    onChange?: (value: string | undefined) => void;
    onSubmit: (code: string) => void;
    isSubmitting?: boolean;
}

export default function CodeEditor({
    initialCode = '// Write your solution here...',
    language = 'javascript',
    onChange,
    onSubmit,
    isSubmitting = false
}: CodeEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [currentLang, setCurrentLang] = useState(language);

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
        if (onChange) onChange(value);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Code2 className="w-5 h-5" />
                        <span className="font-semibold text-sm">Live Code Editor</span>
                    </div>
                    <div className="h-4 w-px bg-gray-600 mx-2"></div>
                    <select
                        value={currentLang}
                        onChange={(e) => setCurrentLang(e.target.value)}
                        className="bg-[#3c3c3c] text-gray-200 text-xs rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSubmit(code)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Submit Solution
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    defaultLanguage={currentLang}
                    language={currentLang}
                    value={code}
                    theme="vs-dark"
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                    }}
                />
            </div>
        </div>
    );
}
