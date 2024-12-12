import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/Admin.context.jsx';
import { assets } from '../../assests/assets_admin/assets.js';


const AllAppointment = () => {
  const { aToken, appointment, getAllAppointments ,cancelAppointment} = useContext(AdminContext);
  
  // Function to calculate age
  const calculateAge = (dob) => {
    const [day, month, year] = dob.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const birthDate = new Date(formattedDate);
    const differenceInMilliseconds = Date.now() - birthDate.getTime();
    const ageDate = new Date(differenceInMilliseconds);
    
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-5xl m-5">
      <p className="mb-3 text-lg font-medium">ALL Appointments</p>
      <div className="bg-white min-h-[60vh] rounded text-sm max-h-[80vh] overflow-y-scroll">
        
        {/* Header Row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        
        {/* Appointments List */}
        {appointment && appointment.length > 0 ? (
          appointment.map((item, index) => (
            <div 
              className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-start text-gray-500 py-3 px-6 border-b hover:bg-gray-50" 
              key={index}
            >
              <p className="hidden sm:block">{index + 1}</p>
              
              {/* Patient Information */}
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt="Patient" />
                <p>{item.userData.name}</p>
              </div>
              
              {/* Age */}
              <p>{calculateAge(item.userData.dob)}</p>
              
              {/* Date & Time */}
              <p className="text-left">{item.slotTime} | {item.slotDate}</p>
              
              {/* Doctor Name */}
              <p className="text-left">{item.doctor.name}</p>
              
              {/* Fees */}
              <p>${item.amount} </p>
              
              {/* Action Button */}
              {item.cancelled
              ?<p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : <img className='w-10 cursor-pointer' onClick={()=>cancelAppointment(item._id)}src={assets.cancel_icon}/>
            }
            
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No appointments available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
