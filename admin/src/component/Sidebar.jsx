import React, { useContext } from 'react'
import { AdminContext } from '../context/Admin.context'
import { NavLink } from 'react-router-dom'
import { assets } from '../assests/assets_admin/assets'
import { DoctorContext } from '../context/Doctor.context'

const Sidebar = () => {
    const {aToken}=useContext(AdminContext)
    const {dToken}=useContext(DoctorContext)
  return (
    <div className='min h-screen bg-white border-r'>{
             aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/admin-dasboard'}>
                    <img src ={
                        assets.home_icon
                    }/>
                    <p >Dashboard</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/all-appiontment'}>
                    <img src ={
                        assets.appointment_icon
                    }/>
                    <p>Appiontments</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-doctor'}>
                    <img src ={
                        assets.add_icon
                    }/>
                    <p>Add</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-list'}>
                    <img src ={
                        assets.people_icon
                    }/>
                    <p>Doctor List</p>
                </NavLink>
              
             </ul>

        }
        {
             dToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-dashboard'}>
                    <img src ={
                        assets.home_icon
                    }/>
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-appiontment'}>
                    <img src ={
                        assets.appointment_icon
                    }/>
                    <p className='hidden md:block'>Appiontments</p>
                </NavLink>
               
                <NavLink className={({isActive})=>`flex item-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${isActive? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/doctor-profile'}>
                    <img src ={
                        assets.people_icon
                    }/>
                    <p className='hidden md:block'>Profile</p>
                </NavLink>
              
             </ul>

        }


    </div>
  )
}

export default Sidebar