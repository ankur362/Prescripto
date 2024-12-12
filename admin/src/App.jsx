
import { useContext } from 'react';
import './App.css'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from '../src/context/Admin.context.jsx'
import Navbar from './component/Navbar.jsx';
import Sidebar from './component/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppiontment from './pages/Admin/AllAppiontment.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import DoctorAppointment from './pages/Doctor/DoctorAppointment.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import { DoctorContext } from './context/Doctor.context.jsx';

function App() {
  const {aToken} =useContext(AdminContext)
  const {dToken} =useContext(DoctorContext)

  return aToken||dToken? (
    <div className='bg-[#F8F9FD]'>
     
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dasboard' element={<Dashboard/>}/>
          <Route path='/all-appiontment' element={<AllAppiontment/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          {/*Doctor Route*/}
          <Route path='/doctor-appiontment' element={<DoctorAppointment/>}/>
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>

        </Routes>
      </div>
    </div>
  ):
  (
    <>
          <Login/>
          <ToastContainer/>
    </>

  )
}

export default App
