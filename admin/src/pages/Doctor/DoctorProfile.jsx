import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/App.context';
import { DoctorContext } from '../../context/Doctor.context';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const {profile,setprofile,getDoctorProfile, dToken } = useContext(DoctorContext); // Access backendUrl and aToken
    const [edit,setEdit]=useState(false)
    const updateProfile = async () => {
        try {
            const updateData = {
                address: profile.address,
                fees: profile.fees,
                available: profile.available,
            };
            const response = await fetch(
                `http://localhost:4000/api/doctor/update-profile`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${dToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData), // Flattened structure
                }
            );
            const data = await response.json(); // Await the parsed JSON
            if (data.success) {
                toast.success(data.message);
                setEdit(false);
                getDoctorProfile();
            } else {
                console.log(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
   useEffect(()=>{
    if(dToken)
    {
        getDoctorProfile()
    }
   },[dToken])
  
   
  
    return profile && (
      <div >
        <div className='flex flex-col gap-4 m-5'>
            <div>
                <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profile.image}/>
            </div>
            <div className='flex-1 border border-stone-100 rounded-lg  p-8 py-7 bg-white'>
                {/*----name degrre experience-----*/}
                <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profile.name}</p>
                <div className='flex items-center gap-2 mt-1 text-gray-600'>
                <p >{profile.degree}-{profile.specialization}</p>
                <button className='py-0.5 px-2 border text-xs rounded-full' >{profile.experience}</button>
                </div>
                {/*-------*/}
                <div>
                    <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About</p>
                    <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profile.about}</p>
                </div>
                <p className='text-gray-600 font-medium mt-4 '>
                    Appointment Fee:<span className='text-gray-800'>${edit?<input value={profile.fees}type='number' onChange={(e)=>setprofile(prev=>({...prev,fees:e.target.value}))}/> :profile.fees}</span>
                </p>
                
                <div className='flex gap-2 py-2'>
                    <p>Address:</p>
                    <p className='text-sm'>
                    
                        { edit?<input value={profile.address.line1}type='text' onChange={(e)=>setprofile(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}/>:profile.address.line1}
                        <br/>
                        { edit?<input value={profile.address.line2}type='text' onChange={(e)=>setprofile(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}/>:profile.address.line2}
                    </p>
                </div>
                <div className='flex gap-1 pt-2'>
                    <input onChange={()=> edit&& setEdit(prev=>({...prev,available:!prev.available}))} checked={profile.available} type='checkbox' name='' id=''/>
                    <label htmlFor=''>Available</label>
                </div>
                {edit?<button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
                :<button onClick={()=>setEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>}
                
                </div>
                
        </div>
        
      
      </div>
    )
  }
  
  
  

export default DoctorProfile