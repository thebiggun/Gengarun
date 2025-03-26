import React, {useContext} from 'react'
import '../scroll.css'
import { OutputContext } from "./OutputContext.jsx";
const Output = () => {
    const { output } = useContext(OutputContext);
    return (
        <div className='h-[29.5vh] mt-[1px] bg-[#1f2937] text-white overflow-y-scroll'>
            <h1 className='text-bold text-lg sticky top-0 bg-[#1f2937] p-4 text-gray-300' style={{
                fontFamily: '"M PLUS 1 Code", sans-serif',}}>
                Output :
            </h1>
            <pre className="whitespace-pre-wrap pl-10">{output || "Run the code to see output"}</pre>
        </div>
    )
}

export default Output