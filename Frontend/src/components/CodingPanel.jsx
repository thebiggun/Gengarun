import React, { useRef, useContext, useEffect, useState, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import { OutputContext } from "./OutputContext.jsx";
import Lottie from "lottie-react";
import Animation1 from "../assets/Animation1.json";

const defaultCode = `#include <bits/stdc++.h>
using namespace std;
int main() {
    // Write Your Code here
    
    return 0;
}`;

const CodingPanel = ({ userData, openFile }) => {
    const editorRef = useRef(null);
    const { setOutput } = useContext(OutputContext);
    const [isLoading, setIsLoading] = useState(false);
    const [initialContent, setInitialContent] = useState(defaultCode);
    const [isEditorMounted, setIsEditorMounted] = useState(false);
    const [currentContent, setCurrentContent] = useState(defaultCode);
    const saveTimeoutRef = useRef(null);

    // 1. Fetch content when openFile changes
    useEffect(() => {
        if (!openFile) {
            setInitialContent(defaultCode);
            setCurrentContent(defaultCode);
            return;
        }

        const fetchFileContent = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post("http://localhost:3000/fileContent/getFileContent", {
                    username: userData.username,
                    filename: openFile
                });
                
                const content = response.data.content?.replace(/\\n/g, '\n') || defaultCode;
                setInitialContent(content);
                setCurrentContent(content);
                
                if (isEditorMounted && editorRef.current) {
                    editorRef.current.setValue(content);
                }
            } catch (error) {
                console.error("Error fetching file content:", error);
                setInitialContent(defaultCode);
                setCurrentContent(defaultCode);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchFileContent();
    }, [openFile, userData.username, isEditorMounted]);

    // Add auto-save function
    const autoSave = useCallback(async (content) => {
        if (!openFile) return;
        
        try {
            await axios.post("http://localhost:3000/fileContent/saveFileContent", {
                text: content,
                filename: openFile,
                username: userData.username
            });
            console.log("Auto-saved successfully");
        } catch (err) {
            console.error("Auto-save error:", err);
        }
    }, [openFile, userData.username]);

    // Debounced save function
    const debouncedSave = useCallback((content) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(() => {
            autoSave(content);
        }, 1000); // Save after 1 second of no typing
    }, [autoSave]);

    // 2. Handle editor mount
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        setIsEditorMounted(true);
        defineCustomTheme(monaco);
        monaco.editor.setTheme("myCustomTheme");
        
        // Set the initial value
        editor.setValue(currentContent);
        
        // Listen for changes to update our state and trigger auto-save
        editor.onDidChangeModelContent(() => {
            const newContent = editor.getValue();
            setCurrentContent(newContent);
            debouncedSave(newContent);
        });
    };

    const handleRun = async () => {
        if (!openFile) {
            alert("Please select a file first!");
            return;
        }

        setIsLoading(true);
        try {
            const codeContent = editorRef.current.getValue();
            const body = { 
                text: codeContent,
                filename: openFile,
                username: userData.username
            };

            await axios.post("http://localhost:3000/fileContent/saveFileContent", body);
            const executeResponse = await axios.post("http://localhost:3000/fileSaving", body);
            setOutput(executeResponse.data.Output || "No output received.");
        } catch (err) {
            console.error("Execution error:", err);
            setOutput("Error executing code: " + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const defineCustomTheme = (monaco) => {
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "keyword", foreground: "FFA500" },
                { token: "string", foreground: "46d17a" },
                { token: "comment", foreground: "808080", fontStyle: "italic" },
                { token: "identifier", foreground: "7DC3FF" }
            ],
            colors: {
                "editor.background": "#111827",
                "editor.foreground": "#FFFFFF",
            },
        });
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative pt-2 bg-[#111827] h-[60vh]">
            {openFile ? (
                <>
                    <MonacoEditor
                        key={openFile || "default"} // Force re-render when file changes
                        height="52vh"
                        defaultLanguage="cpp"
                        theme="myCustomTheme"
                        value={currentContent}
                        loading={<div className="text-white">Loading Editor...</div>}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true
                        }}
                    />
                    <div className="absolute bottom-2 right-4">
                        <button 
                            className={`bg-black hover:bg-neutral-900 hover:border-white hover:border text-white font-bold py-2 px-3 rounded flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={handleRun}
                            disabled={isLoading}
                        >
                            <FaPlay /> {isLoading ? "Running..." : "Run"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-white text-lg">
                    <Lottie animationData={Animation1} loop={true} className="w-72 h-72" />
                    <p className="mr-12 font-semibold text-2xl">Select a file to start coding!</p>
                </div>
            )}
        </div>
    );
};

export default CodingPanel;