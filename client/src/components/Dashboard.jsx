import { useNavigate } from 'react-router';
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import CourseModal from "./CourseModal";
import Sidebar from "./Sidebar";
import { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import { getCoursesTeacher, getCoursesStudent, enrollInCourse, getCoursesAdmin } from '../firebase';
import ErrorMsg from './ErrorMsg';
import SuccessMsg from './SuccessMsg';


const Dashboard = () => {
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();
    const { db } = useFirebaseConfig()
    const { uid, role } = useUserInfo()
    const [courses, setCourses] = useState([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollCourseId, setEnrollCourseId] = useState('');
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const fetchCourses = async (uid, db, role) => {
        if(role === 'Teacher') {
            const data = await getCoursesTeacher(uid, db);
            setCourses(data);
        }  

        if(role === 'Student') {
            const data = await getCoursesStudent(uid, db);
            setCourses(data);
        }

        if(role === 'Admin') {
            const data = await getCoursesAdmin(db);
            setCourses(data);
        }
    }

    const handleEnroll = (enrollCourseId, uid, db) => {
        enrollInCourse(enrollCourseId, uid, db)
        .then((response) => {
                setResponseMsg(response.message);
            if(response.status === 200) {
                setShowSuccess(true);
    
                setTimeout(() => {
                    setShowSuccess(false);
                    window.location.reload()
                }, 3000)

            }
            else if(response.status === 400) {
                setShowError(true);
    
                setTimeout(() => {
                    setShowError(false);
                }, 3000)
            }
        })
    }

    useEffect(() => {
        if(role) {
            setIsLoadingUser(false);
        }

        if(db !== null && role !== null) {
            fetchCourses(uid, db, role)
        }
        
    }, [role, uid, db])

    return (
        <div className='flex'>
            <Sidebar />

            {showError && <ErrorMsg message={responseMsg} />}
            {showSuccess && <SuccessMsg message={responseMsg} />}

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Dashboard</h1>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {courses?.map((course) => {
                        return (
                            <CourseModal 
                                title={course.title}
                                department={course.department}
                                courseNumber={course.courseNumber}
                                term={course.term}
                                year={course.year}
                                id={course.courseId}
                                key={course.courseId}
                            />
                        )
                    })} 
                </div>
                
                {!isLoadingUser
                    && (role === 'Teacher')
                    && (<div className='bg-green-500 text-slate-50 px-4 py-3 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600'
                            onClick={() => {navigate('/new-course')}}
                        >
                            <PlusIcon className='size-6 mr-1' />
                            <span className='mt-[-2px] select-none'>Create a new course</span>
                        </div>
                    )
                }

                {showEnrollModal && (
                    <div className='flex items-center mx-auto w-fit bg-blue-200 mb-6 p-4 rounded'>
                        <input 
                            className='px-2 py-2 rounded'
                            onChange={(e) => {setEnrollCourseId(e.target.value)}}
                            value={enrollCourseId}
                            autoFocus
                            placeholder='Enter Course ID'
                        />
                        <button
                            className='bg-green-500 text-slate-50 ml-3 px-4 py-2 rounded hover:bg-green-600 active:scale-95'
                            onClick={() => handleEnroll(enrollCourseId, uid, db)}
                        >
                            Enroll
                        </button>
                        <button onClick={() => setShowEnrollModal(false)}>
                            <XMarkIcon className='size-8 ml-4' />
                        </button>
                    </div>
                )}

                {!isLoadingUser
                    && (role === 'Student')
                    && (<div className='bg-green-500 text-slate-50 px-4 py-3 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600'
                            onClick={() => setShowEnrollModal(true)}
                        >
                            <PlusIcon className='size-6 mr-1' />
                            <span className='mt-[-2px] select-none'>Enroll in a course</span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
 
export default Dashboard;