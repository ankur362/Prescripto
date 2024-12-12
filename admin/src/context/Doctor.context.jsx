import { createContext, useEffect, useState } from "react";
import {toast} from 'react-toastify'


export const DoctorContext = createContext()
const DoctorContextProvider = (props) => {

    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const [appoint,setAppoint]=useState([])
    const [datA,setDatA]=useState(false)
    const [profile,setprofile]=useState(false)
    useEffect(() => {
        if (dToken) {
            localStorage.setItem("dToken", dToken);
        } else {
            localStorage.removeItem("dToken");
        }
    }, [dToken]);
    const getAppointment =async()=>{
        try {
            const response =await fetch(`http://localhost:4000/api/doctor/appointment`,
                {  method: 'GET',
                 headers: {
                     'Authorization': `Bearer ${dToken}`, // assuming `aToken` is a bearer token
                     'Content-Type': 'application/json'
                 },   
          } )
         
          
          const data = await response.json()
          console.log(data);
          console.log('hello');
          
          
          if(data.success)
          {
             
             setAppoint(data.appointmentData.reverse())
             console.log(data.appointmentData.reverse());
             
            
            
          }
          else{
            toast.error(data.message)
          }
             
         } catch (error) {
             
             toast.error(error.message)
         }
     }

     const completeAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/doctor/accept-appointment`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${dToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ appointmentId }),
                }
            );
    
            const data = await response.json();
    
            if (data.success) {
                toast.success(data.message || "Appointment marked as completed.");
                getAppointment(); // Refresh the appointment list
            } else {
                toast.error(data.message || "Failed to complete the appointment.");
            }
        } catch (error) {
            console.error("Error completing appointment:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };
    
    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/doctor/cancel-appointment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${dToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointmentId })
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Log raw response text for debugging
                console.error(`Error response from server: ${errorText}`);
                toast.error(`Server error: ${response.status}`);
                return;
            }
    
            const data = await response.json();
    
            if (data.success) {
                toast.success(data.message);
                getAppointment(); // Refresh appointment list
            } else {
                toast.error(data.message || "Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error.message);
            toast.error("An unexpected error occurred while cancelling the appointment");
        }
    };
    // doctordash data
    const doctorDashdata = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/doctor/dashboard`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${dToken}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                // Handle non-200 HTTP responses
                const errorMessage = await response.text();
                console.error("Error fetching dashboard:", errorMessage);
                toast.error(`Server Error: ${response.status}`);
                return;
            }
    
            const data = await response.json();
            console.log(data);
    
            if (data.success) {
                setDatA(data.dashData);
               
            } else {
                toast.error(data.message || "Failed to load dashboard data.");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error.message);
            toast.error("An unexpected error occurred while fetching the dashboard data.");
        }
    };
    //profile
    const getDoctorProfile = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/doctor/profile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${dToken}`,
                    'Content-Type': 'application/json',
                },
            });  
            
            const data = await response.json();
            
            
            if (data.success) {
            
                setprofile(data.docData);
                console.log("Profile State Set To:", data.docData); // Log the data being set to profile
            } else {
                console.log("Error Message:", data.message); // Log the error message
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch Error:", error.message); // Log fetch errors
            toast.error(error.message);
        }
    }
    

    










    const value = {
        dToken,
        setDToken,
        appoint,
        setAppoint,
        getAppointment,
        completeAppointment,
        cancelAppointment,
        datA,
        doctorDashdata,
        profile,
        setprofile,
        getDoctorProfile,
     

    }
    
    
    
    
    return <DoctorContext.Provider value={value}>
        {props.children}
        </DoctorContext.Provider>

}
export default DoctorContextProvider