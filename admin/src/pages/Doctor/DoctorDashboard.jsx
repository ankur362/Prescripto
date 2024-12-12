import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/Doctor.context'
import { assets } from '../../assests/assets_admin/assets'


const DoctorDashboard = () => {
    const {dToken,datA, doctorDashdata,cancelAppointment,completeAppointment}=useContext(DoctorContext)
useEffect(()=>{
  if(dToken)
  {
    doctorDashdata();
  }
},[dToken])
console.log(datA);

  return doctorDashdata && (
    <div className='m-5'>
        <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>${datA.earning}</p>
            <p className='text-gray-400'>Earning</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{datA.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{datA.patient}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <img src={assets.list_icon} />
        <p>Latest Appointment</p>
        <hr />

        {/* Render Latest Appointments */}
        {datA.latestappointment&& datA.latestappointment.length > 0 ? (
          datA.latestappointment
          .map((item, index) => (
            <div key={index} className='flex flex-row items-center justify-between p-4 border-b border-gray-200'>
              <div className='flex items-center'>
                {/* Circle Image */}
                <div className='w-12 h-12 mr-3'>
                  <img className='w-full h-full rounded-full object-cover' src={item.userData.image} alt={item.userData.name} />
                </div>

                {/* Name and Slot Date */}
                <div>
                  <p className='font-semibold text-gray-700'>{item.userData.name}</p>
                  <p className='text-sm text-gray-500'>Booking on {item.slotDate}</p>
                </div>
              </div>

              {/* Cancel Button (Positioned at the right corner) */}
              <div className='relative'>
                {  item.cancelled
                            ?
                            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            :item.isCompleted
                            ?<p className='text-green-500'>Completed</p>
                            :<div className='flex'>
                            <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
                            <img className='w-10 cursor-pointer' onClick={()=>completeAppointment(item._id)}src={assets.tick_icon}/>
                        </div>}
              </div>
            </div>
          ))
        ) : (
          <p>No recent appointments.</p>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard