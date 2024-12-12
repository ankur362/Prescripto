import React, { useState } from 'react'
import { assets } from '../assests/assets_admin/assets.js'
import { AdminContext } from '../context/Admin.context.jsx'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/Doctor.context.jsx'
const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {setAToken,backendUrl} = useContext(AdminContext)
    const {setDToken}=useContext(DoctorContext)
    

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(state);
        
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            console.log(state);
            
    
            if (state === 'Admin') {
                console.log("Attempting admin login");
                
                // Ensure there's no double slash in the URL.
                const response = await fetch(`${backendUrl}/api/admin/loginadmin`, {
                    method: 'POST',
                    body: JSON.stringify({email,password}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if(!response.ok){
                    const {error} = await response.json()
                    toast.error(error)
                }
                const {message,token} = await response.json()
                
                if (message) {
                    console.log("hello");
                    localStorage.setItem('aToken',token)
                    
                    setAToken(token);
                    console.log(token);
                } 
                else{ 
                  
                    
                    toast.error(message)
                }
            }
            else if (state === 'Doctor') {
                console.log("Attempting doctor login");
            
                try {
                    const response = await fetch(`${backendUrl}/api/doctor/login`, {
                        method: 'POST',
                        body: JSON.stringify({ email, password }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });
            
                    const data = await response.json();
            
                    // Check for success in the response body
                    if (data.success) {
                        // Successful login
                        localStorage.setItem('dToken', data.token);
                        setDToken(data.token);
                        toast.success(data.message || "Login successful!");
                        console.log(data.token);
                    } else {
                        // Unsuccessful login
                        toast.error(data.message || "Login failed. Please try again.");
                    }
                } catch (error) {
                    // Handle unexpected errors
                    console.error("Error during login:", error);
                    toast.error("An unexpected error occurred. Please try again later.");
                }
            }
            
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to the server. Please try again later.');
        }
    }

    
  return (
  <form onSubmit={onSubmit} className='min-h-[80vh] flex items-center justify-center'>
    <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full'>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} className='border border-[#DADADA] rounded-md p-2 w-full mt-1' type="email" required placeholder='Enter your email' />
        </div>
        <div className='w-full'>
            <p>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} className='border border-[#DADADA] rounded-md p-2 w-full mt-1' type="password"  required placeholder='Enter your password' />
        </div>
        <button className='bg-primary text-white rounded-md py-2 w-full text-base'>Login</button>
    {
        state === 'Admin' 
        ?
        <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary cursor-pointer'>Click here</span></p>
        :
        <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary cursor-pointer'>Click here</span></p>
    }
    
    </div>
  </form>
  )
}

export default Login