import React, { useEffect, useState } from 'react';
import { FaFolderOpen, FaFolder } from "react-icons/fa6";
import { PiFileCppFill } from "react-icons/pi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

const Navbar = ({ userData, openFile, setOpenFile }) => {
    const username = userData.username;
    const [open, setOpen] = useState(true);
    const [files, setFiles] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [refreshFiles, setRefreshFiles] = useState(false);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        selectedFile: null
    });

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.post("http://localhost:3000/fileNames/getFilenames", { "username": username });
                setFiles(response.data);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        if (username) {
            fetchFiles();
        }
    }, [username, refreshFiles]);

    const createNewFile = async () => {
        setIsCreating(true);
        try {
            const response = await axios.post("http://localhost:3000/fileNames/newFile", { username });
            if (response.data && response.data.files) {
                setRefreshFiles(prev => !prev);
                setOpenFile(response.data.newFileName);
            }
        } catch (error) {
            console.error("Error creating new file:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleContextMenu = (e, file) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            selectedFile: file
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleDeleteFile = async () => {
        if (!contextMenu.selectedFile) return;
        
        try {
            await axios.post("http://localhost:3000/fileNames/delFile", { 
                username,
                filename: contextMenu.selectedFile 
            });
            setRefreshFiles(prev => !prev);
            if (openFile === contextMenu.selectedFile) {
                setOpenFile(null);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        } finally {
            handleCloseContextMenu();
        }
    };

    const handleRenameFile = async () => {
        // Implement rename functionality here
        // You might want to show a modal or input field
        console.log("Rename file:", contextMenu.selectedFile);
        handleCloseContextMenu();
    };

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                handleCloseContextMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu.visible]);

    return (
        <div className='bg-[#1f2937] text-white p-4 flex flex-col h-full' onClick={handleCloseContextMenu}>
            <div className='flex-1 overflow-hidden flex flex-col'>
                <h1 
                    className='flex items-center gap-2 cursor-pointer text-xl font-semibold rounded-lg hover:bg-[#374151] py-2 px-4' 
                    onClick={() => setOpen(!open)} 
                    style={{ fontFamily: '"M PLUS 1 Code", sans-serif' }}
                >
                    {open ? <FaFolderOpen /> : <FaFolder />}
                    src/
                </h1>

                {open && (
                    <div 
                        className='ml-1 flex-1 overflow-y-auto' 
                        style={{ fontFamily: '"M PLUS 1 Code", sans-serif', maxHeight: 'calc(100vh - 200px)' }}
                    >
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setOpenFile(file)}
                                    onContextMenu={(e) => handleContextMenu(e, file)}
                                    className={`rounded-lg flex items-center gap-2 cursor-pointer font-medium w-full pl-10 pr-2 py-1
                                        ${openFile === file ? 'bg-[#374151] text-gray-200' : 'hover:bg-[#374151]'}`}
                                >
                                    <PiFileCppFill className='text-2xl'/>
                                    {file}
                                </button>
                            ))
                        ) : (
                            <p className="pl-10">No files found.</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Context Menu */}
            {contextMenu.visible && (
                <div 
                    className="fixed bg-[#374151] text-white rounded-md shadow-lg z-50 py-1 min-w-[100px]"
                    style={{
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div 
                        className="px-4 py-2 hover:bg-[#4B5563] cursor-pointer text-red-400 font-semibold flex items-center gap-1"
                        onClick={handleDeleteFile}
                    >
                        <MdDelete className='text-xl'/>
                        Delete
                    </div>
                </div>
            )}

            {/* New File Button at the bottom */}
            <button 
                onClick={createNewFile}
                disabled={isCreating}
                className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer justify-center"
            >
                {isCreating ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Creating...
                    </span>
                ) : (
                    <div className="flex justify-center items-center gap-1">
                        <IoMdAddCircleOutline className='text-2xl'/>
                        New File
                    </div>
                )}
            </button>
        </div>
    );
};

export default Navbar;