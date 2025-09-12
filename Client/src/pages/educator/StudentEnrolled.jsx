import React, { use, useState } from 'react'
import { useContext } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import { useEffect } from 'react'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext' 
import { Link } from 'react-router-dom'
const StudentEnrolled = () => {
 const [enrolledStudents, setEnrolledStudents] = useState(null)


  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  } 
  useEffect(() => {
    fetchEnrolledStudents()
  },[])
  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pb-0'>
<div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
  <table className='md:table-auto w-full table-fixed overflow-hidden pb-4'>
    <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
      <tr>
        <th className='px-4 py-3 font-semibold'>#</th>
        <th className='px-4 py-3 font-semibold'>Student Name</th>
        <th className='px-4 py-3 font-semibold'>Course Title</th>
        <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
      </tr>
    </thead>
    <tbody className='text-gray-500 text-sm'>
      {enrolledStudents.map((item,index) => (
        <tr key={index} className='border-b border-gray-500/20'>
          <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
          <td className='md:flex items-center gap-2 px-4 py-3'>
            <img src={item.student.imageUrl} alt=""  className='w-9 h-9 rounded-full'/>
            <span className='truncate'>{item.student.name}</span>
          </td>
          <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
          <td className='px-4 py-3 text-center hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  ) : <Loading/>
}

export default StudentEnrolled