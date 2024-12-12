import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()
const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctor,SetDoctor]=useState([])
    const [appointment,SetAppointment]=useState([])
    const[list,Setlist]=useState([])
    const [dashdata,SetDashData]=useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
   
    
    
    const allDoctor= async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/all-doctor`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${aToken}` // assuming `aToken` is a bearer token
                },
               
            });

            const data = await res.json()
            if(data.success)
            {
                SetDoctor(data.doctors)
              
                
                
            }
            else{
                toast.error(data.message)
            }
            
         
            
        } catch (error) {
            toast.error(error.message)
        }
    }
    const changeAvailablity= async (docId)=>{
        try {
            const res = await fetch(`${backendUrl}/api/admin/change-availability`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${aToken}`, // assuming `aToken` is a bearer token
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ docId }) 
               
            });

            const data = await res.json()
            if(data.success)
            { toast.success(data.success)
                allDoctor()
              
              
                
                
            }
            else{
                toast.error(data.message)
            }
            
          console.log(docId)
            
        }
        
        catch (error) {
            toast.error(error.message)
        }
        
    }
    const getAllAppointments = async ()=>{
        try {
            const response =await fetch(`${backendUrl}/api/admin/appointments`,
               {  method: 'GET',
                headers: {
                    'Authorization': `Bearer ${aToken}`, // assuming `aToken` is a bearer token
                  
                },   
         } )
        
         
         const data = await response.json()
         console.log(data);
         
         if(data.success)
         {
            
            SetAppointment(data.appointments)
           
           
         }
            
        } catch (error) {
            
            toast.error(error.message)
        }
    }
    const cancelAppointment =async(appoinmentId)=>
    {
    try {
        const response =await fetch(`${backendUrl}/api/admin/cancel-appointments`,
            {  method: 'POST',
             headers: {
                 'Authorization': `Bearer ${aToken}`, // assuming `aToken` is a bearer token
                 'Content-Type': 'application/json'
             },body: JSON.stringify({ appoinmentId }) 
             

            
    })
    const data= await response.json()
    if(data.success){
        toast.success(data.message);
         getAllAppointments()
    }
    else{
        toast.error(data.message);
        
    }
}
    catch (error) {
        toast.error('Error canceling appointment. Please try again later.');
    }
    }
    const getDashData = async () => {
        console.log('Calling getDashData', aToken);
        
        try {
            const res = await fetch(`${backendUrl}/api/admin/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${aToken}`, // assuming `aToken` is a bearer token
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();
            console.log(data);
            
            if (data.success) {
                SetDashData(data.dashData);
                Setlist(data.dashData.latestAppoinments);
                console.log('Updated dashData:', data.dashData);
                console.log('Updated list:', data.dashData.latestAppoinments);
            } else {
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error('Error fetching dashboard data: ' + error.message);
        }
    }
   
   
    
    const value = {
        aToken,
         setAToken,
          backendUrl,
          allDoctor,
          doctor,
          changeAvailablity,
          appointment,
          SetAppointment,
          getAllAppointments,
          cancelAppointment,
          dashdata,
          getDashData,
         
    
    }
  
    
    
    
    return <AdminContext.Provider value={value}>
        {props.children}
        </AdminContext.Provider>

}
export default AdminContextProvider