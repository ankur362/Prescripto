import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/Doctor.context'
import { assets } from '../../assests/assets_admin/assets'

const DoctorAppointment = () => {
    const {  dToken,appoint,getAppointment,completeAppointment,cancelAppointment}=useContext(DoctorContext)
    useEffect(()=>{
       
            getAppointment()
        
    },[dToken])
    
    const calculateAge = (dob) => {
        const [day, month, year] = dob.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day); // Month is 0-indexed
        const ageDiff = new Date() - birthDate;
        return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25)); // Convert milliseconds to years
    }
  return (
    <div className='w-full max-w-6xl m-5'>
        <p className='mb-3 text-lg font-medium'>All Appointments</p>
        <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
            <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
            </div>
            {
                appoint.map((item,index)=>(
                    <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 ' key={index}>
                        <p className='max-sm:hidden'>{index+1}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full' src={item.userData.image}/> <p>{item.userData.name}</p>

                        </div>
                        <div>
                            <p className='text-xs inline border border-primary px-2 rounded-full'>
                                {item.payment ? 'online':'Cash'}
                            </p>
                        </div>

                        <p className='max-sm:hidden'>Age: {calculateAge(item.userData.dob)} </p>
                        <p>{item.slotDate} {item.slotTime}</p>
                        <p>${item.amount}</p>
                        {
                            item.cancelled
                            ?
                            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            :item.isCompleted
                            ?<p className='text-green-500'>Completed</p>
                            :<div className='flex'>
                            <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
                            <img className='w-10 cursor-pointer' onClick={()=>completeAppointment(item._id)}src={assets.tick_icon}/>
                        </div>

                        }
                        
                    </div>

                ))
            }
        </div>
    </div>
  )
}

export default DoctorAppointment