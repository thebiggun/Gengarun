import React, { useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";

const UpperBar = () => {
    const [projectName, setProjectName] = useState("Project Name");
    const [conencted, setConencted] = useState(true);

    return (
        <div className="p-2 flex items-center justify-between">
            <div className="flex items-center">
                <img src="/Logo.png" alt="Logo" className="h-15 rounded-xl" />

                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="border-2 border-white px-3 py-2 rounded-lg ml-2 hover:border-gray-400 text-3xl font-semibold"
                    style={{
                        fontFamily: '"Tektur", sans-serif',
                        minWidth: "10ch",
                        width: `${projectName.length}ch`,
                        maxWidth: "40ch",
                    }}
                />

                {
                    conencted ? (<div className="bg-[#dcfce7] px-2 py-1 rounded-lg ml-2 text-green-800 font-semibold flex items-center gap-2">
                        <FaDotCircle />
                        Connected
                    </div>) : (<div className="bg-[#fcd9d9] px-2 py-1 rounded-lg ml-2 text-red-800 font-semibold flex items-center gap-2">
                        <FaDotCircle />
                        Disconnected
                    </div>)
                }
            </div>
            <div>
                <button className="flex items-center bg-black text-white px-2 py-1 rounded-lg font-semibold hover:bg-gray-800 cursor-pointer mr-5">
                    <FaShareAlt />
                    Share
                </button>
            </div>
        </div>
    );
};

export default UpperBar;
