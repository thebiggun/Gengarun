import React, { useRef, useContext, useEffect, useState } from "react";
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

const CodingPanel = ({ userData, openFile, connected, roomID }) => {
    const editorRef = useRef(null);
    const { setOutput } = useContext(OutputContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditorMounted, setIsEditorMounted] = useState(false);
    const [currentContent, setCurrentContent] = useState(defaultCode);

    useEffect(() => {
        if (!openFile) {
            setCurrentContent(defaultCode);
            return;
        }

        const fetchFileContent = async () => {
            setIsLoading(true);
            try {
                const baseURL = "http://localhost:3000/fileContent/getFileContent";

                const payload = connected
                    ? { username: roomID, filename: openFile }
                    : { username: userData.username, filename: openFile };

                const response = await axios.post(baseURL, payload);
                const content = response.data.content?.replace(/\\n/g, '\n') || defaultCode;

                setCurrentContent(content);

                if (isEditorMounted && editorRef.current) {
                    editorRef.current.setValue(content);
                }
            } catch (error) {
                console.error("Error fetching file content:", error);
                setCurrentContent(defaultCode);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFileContent();
    }, [openFile, userData.username, isEditorMounted, connected, roomID]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        setIsEditorMounted(true);
        defineCustomTheme(monaco);
        monaco.editor.setTheme("myCustomTheme");

        editor.setValue(currentContent);

        editor.onDidChangeModelContent(() => {
            const newContent = editor.getValue();
            setCurrentContent(newContent);
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
            const body = connected
                ? { username: roomID, filename: openFile, text: codeContent }
                : { username: userData.username, filename: openFile, text: codeContent };

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

    return (
        <div className="relative pt-2 bg-[#111827] h-[60vh]">
            {openFile ? (
                <>
                    <MonacoEditor
                        key={openFile || "default"}
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