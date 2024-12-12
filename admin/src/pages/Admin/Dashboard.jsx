import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/Admin.context'
import { assets } from '../../assests/assets_admin/assets'

const Dashboard = () => {
  const { aToken, dashdata, getDashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashdata && (
    <div className='m-5'>
      {/* Overview Section */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.appoinments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashdata.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments Section */}
      <div>
        <hr />
        <img src={assets.list_icon} />
        <p>Latest Appointment</p>
        <hr />

        {/* Render Latest Appointments */}
        {dashdata.latestAppoinments && dashdata.latestAppoinments.length > 0 ? (
          dashdata.latestAppoinments.map((item, index) => (
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
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : (
                  <img 
                          className='w-10 cursor-pointer'
                    onClick={() => cancelAppointment(item._id)}
                    src={assets.cancel_icon} 
                    alt="Cancel Appointment" // Added alt attribute for accessibility
                  />
                  
                
                )}
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

export default Dashboard
