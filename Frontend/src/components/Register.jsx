import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = ({setIsLogin}) => {

    const navigate = useNavigate();
    
    const [registerData, setRegisterData] = useState({
        email: '',
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3000/Auth/register',
                registerData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const token = response.data.token;

            localStorage.setItem("token", token);

            navigate("/editor");

        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data);
                alert(error.response.data.message || "Registration failed!");
            } else {
                console.error("Error:", error.message);
                alert("Something went wrong. Please try again.");
            }            
        }
    };

    return (
        <div className='p-2 flex'>
            <img src="/imgAuth.webp" alt="Logo" className="h-[390px] w-[300px] object-cover rounded-xl" />
            <div className='w-[280px] flex flex-col justify-center items-center p-2' style={{
                fontFamily: '"Tektur", sans-serif',
            }}>
                <h1 className='text-white font-bold text-3xl'>
                    Register
                </h1>
                <h1 className='items-left ml-5 mt-3 text-white font-semibold w-full py-1'>
                    Enter Email
                </h1>
                <input
                    name='email'
                    type='text'
                    onChange={handleChange}
                    placeholder='Enter Email'
                    className='ml-2 text-white px-2 py-1 bg-transparent rounded-md border-2 
                                border-transparent focus:outline-none transition duration-300 
                                bg-gradient-to-br from-blue-400 to-purple-500 
                                [border-image-source:linear-gradient(to_bottom_right,#3b82f6,#9333ea)] 
                                [border-image-slice:1] font-semibold w-[250px]'
                />
                <h1 className='items-left ml-5 text-white font-semibold w-full py-1'>
                    Enter Username
                </h1>
                <input
                    name='username'
                    type='text'
                    placeholder='Enter Username'
                    onChange={handleChange}
                    className='ml-2 text-white px-2 py-1 bg-transparent rounded-md border-2 
                                border-transparent focus:outline-none transition duration-300 
                                bg-gradient-to-br from-blue-400 to-purple-500 
                                [border-image-source:linear-gradient(to_bottom_right,#3b82f6,#9333ea)] 
                                [border-image-slice:1] font-semibold w-[250px]'
                />
                <h1 className='items-left ml-5 text-white font-semibold w-full py-1'>
                    Enter Password
                </h1>
                <input
                    name='password'
                    type='password'
                    onChange={handleChange}
                    placeholder='Enter Password'
                    className='ml-2 text-white px-2 py-1 bg-transparent rounded-md border-2 
                                border-transparent focus:outline-none transition duration-300 
                                bg-gradient-to-br from-blue-400 to-purple-500 
                                [border-image-source:linear-gradient(to_bottom_right,#3b82f6,#9333ea)] 
                                [border-image-slice:1] font-semibold w-[250px]'
                />

                <button className='mt-3 px-3 py-2 bg-blue-500 rounded-2xl text-xl font-semibold hover:scale-105 cursor-pointer hover:bg-blue-600 transition duration-200' onClick={handleSubmit}>
                    Register
                </button>
                <button className="relative inline-block cursor-pointer text-white after:block after:w-full after:h-0.5 after:bg-white after:transition-all after:duration-200 after:scale-x-0 hover:after:scale-x-100 mt-2" onClick={() => setIsLogin(true)}>
                    Already a User? Login
                </button>
            </div>
        </div>
    )
}

export default Register