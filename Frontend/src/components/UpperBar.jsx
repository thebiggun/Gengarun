import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import { FaDotCircle, FaShareAlt } from "react-icons/fa";

const UpperBar = ({ connected, setConnected, setRoom }) => {
    const [projectName, setProjectName] = useState("Project Name");
    const [showPopup, setShowPopup] = useState(false);
    const [roomID, setRoomID] = useState("");
    const [localRoom, setLocalRoom] = useState(""); // Renamed to avoid conflict
    const popupRef = useRef(null);

    // ✅ Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Handle Create Room API Call
    const handleCreateRoom = async () => {
        try {
            const res = await axios.get("http://localhost:3000/Rooms/createRoom");
            console.log("Room Created:", res.data);
            setRoom(res.data.roomID); // Use the prop function to update the parent state
            setLocalRoom(res.data.roomID); // Update the local state
            setShowPopup(false);
            setConnected(true);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const handleJoinRoom = async () => {
        try {
            const res = await axios.post("http://localhost:3000/Rooms/joinRoom", { roomID }, { headers: { "Content-Type": "application/json" } });
            console.log("Room Joined:", res.data);
            setRoom(roomID); // Use the prop function to update the parent state
            setLocalRoom(roomID); // Update the local state
            setShowPopup(false);
            setConnected(true);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    return (
        <div className="p-2 flex items-center justify-between relative">
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

                {connected ? (
                    <div className="bg-[#dcfce7] px-2 py-1 rounded-lg ml-2 text-green-800 font-semibold flex items-center gap-2">
                        <FaDotCircle />
                        Connected (RoomID: {localRoom})
                    </div>
                ) : (
                    <div className="bg-[#fcd9d9] px-2 py-1 rounded-lg ml-2 text-red-800 font-semibold flex items-center gap-2">
                        <FaDotCircle />
                        Disconnected
                    </div>
                )}
            </div>

            <div className="relative">
                <button
                    className="flex items-center bg-black text-white px-2 py-1 rounded-lg font-semibold hover:bg-gray-800 cursor-pointer mr-5"
                    onClick={() => setShowPopup(!showPopup)}
                >
                    <FaShareAlt className="mr-1" />
                    Share
                </button>

                {showPopup && (
                    <div
                        ref={popupRef}
                        className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50"
                    >
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600"
                            onClick={handleCreateRoom}
                        >
                            Create Room
                        </button>

                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomID}
                            onChange={(e) => setRoomID(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg mb-2"
                        />

                        <button
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            onClick={handleJoinRoom}
                        >
                            Join Room
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpperBar;
