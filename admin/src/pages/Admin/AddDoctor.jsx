import React, { useContext, useState } from 'react'
import { assets } from '../../assests/assets_admin/assets'
import { AdminContext } from '../../context/Admin.context'
import { toast } from 'react-toastify'

const AddDoctor = () => {
    const [image, setImage] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [exprience, setExprience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [about, setAbout] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [degree, setDegree] = useState('')
    const { aToken, backendUrl } = useContext(AdminContext)
    const Onsubmithandler = async (event) => {
        event.preventDefault();

        try {
            if (!image) {
                return toast.error('please upload image')

            }
            const formData = new FormData()
            formData.append('image', image)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', exprience)
            formData.append('fees', Number(fees))
            formData.append('specialization', speciality)
            formData.append('about', about)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({
                line1: address1,
                line2: address2
            }))
            //   formData.forEach((value,key)=>{
            //     // console.log(`${key} : ${value}`);

            //   })
            const response = await fetch(`${backendUrl}/api/admin/adddoctor`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${aToken}` // assuming `aToken` is a bearer token
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setImage(false)
                setAbout('')
                setAddress2('')
                setAddress1('')
                setEmail('')
                setPassword('')
                setExprience('1 Year')
                setFees('')
                setDegree('')
                setSpeciality('General physician')
                setName('')



            } else {
                toast.error(data.message);
            }




        }
        catch (error) {
            console.log(error);

        }
    }
    return (
        <form onSubmit={Onsubmithandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex item-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />

                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='doc-img' hidden />
                    <p>Upload doctor<br /> picture</p>
                </div>
                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} className='border rounded px-3 py-2' value={name} type="text" placeholder='Name' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password </p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='password' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Exprience</p>
                            <select onChange={(e) => setExprience(e.target.value)} value={exprience} className='border rounded px-3 py-2' name="" id=''>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                                <option value="6 Year">6 Year</option>
                                <option value="7 Year">7 Year</option>
                                <option value="8 Year">8 Year</option>
                                <option value="9 Year">9 Year</option>
                                <option value="10 Year">10 Year</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p >Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='fees' required />
                        </div>
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select className='border rounded px-3 py-2' onChange={(e) => setSpeciality(e.target.value)} value={speciality} id=''>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="Text" placeholder='Education' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='address 2' required />
                        </div>
                    </div>


                </div>
                <div className='flex-1 flex flex-col gap-1'>
                    <p>About Doctor</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className=' w-full border rounded px-4 pt-2' placeholder='write about doctor' rows={5} required />
                </div>
                <button type='submit' className='border rounded-full bg-primary text-white px-3 py-2 my-2 '>Add doctor</button>
            </div>
        </form>
    )
}

export default AddDoctor