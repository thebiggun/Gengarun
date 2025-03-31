import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import UpperBar from "../components/UpperBar";
import CodingPanel from "../components/CodingPanel";
import Output from "../components/Output";
import { OutputProvider } from "../components/OutputContext";

const MainPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [userData, setUserData] = useState({});
    const [openFile, setOpenFile] = useState('');
    const [connected, setConnected] = useState(false);
    const [room, setRoom] = useState(0);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/Auth/verifyToken", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    console.log("Token verified");
                    setIsLoading(false);
                    setUserData(response.data.user);
                } else {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        verifyToken();
    }, [navigate]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>; // Show loading while verifying
    }

    return (
        <div className="h-screen flex flex-col">
            <UpperBar connected={connected} setConnected = {setConnected} room={room} setRoom = {setRoom}/>
            <div className="flex flex-grow">
                <div className="w-50 bg-gray-800 h-full">
                    <Navbar userData={userData} openFile={openFile} setOpenFile={setOpenFile} connected = {connected} roomID = {room}/>
                </div>
                <div className="w-[70vw] h-full ml-[1px]">
                    <OutputProvider>
                        <CodingPanel userData={userData} openFile={openFile} connected = {connected} roomID = {room}/>
                        <Output />
                    </OutputProvider>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
