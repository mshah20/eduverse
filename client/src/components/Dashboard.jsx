import { useNavigate } from 'react-router';
import { PlusIcon } from "@heroicons/react/20/solid";
import CourseModal from "./CourseModal";
import Sidebar from "./Sidebar";
import { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';
import useFirebaseConfig from '../hooks/useFirebaseConfig';
import { getCourses } from '../firebase';


const Dashboard = () => {
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();
    const { db } = useFirebaseConfig()
    const { uid, role } = useUserInfo()
    const [courses, setCourses] = useState([]);
    
    const fetchCourses = async (uid, db) => {
        const data = await getCourses(uid, db);
        setCourses(data);
    }

    useEffect(() => {
        if(role) {
            setIsLoadingUser(false);
        }

        if(db !== null) {
            fetchCourses(uid, db)
        }
        
    }, [role, uid, db])

    return (
        <div className='flex'>
            <Sidebar />

            <div className='p-4 w-full'>
                <h1 className='font-bold text-3xl mb-24'>Dashboard</h1>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {/* <CourseModal 
                        title='Software Engineering I'
                        department='CEN'
                        courseNumber='4010'
                        term='Summer'
                        year='2024'
                        id='DoeCEN4010Summer2024'
                    />
                    <CourseModal 
                        title='Software Engineering II'
                        department='CEN'
                        courseNumber='4020'
                        term='Summer'
                        year='2025'
                        id='DoeCEN4020Summer2025'
                    />
                    <CourseModal 
                        title='Software Engineering III'
                        department='CEN'
                        courseNumber='4030'
                        term='Summer'
                        year='2026'
                        id='DoeCEN4030Summer2026'
                    /> */}

                    {courses?.map((course) => {
                        return (
                            <CourseModal 
                                title={course.title}
                                department={course.department}
                                courseNumber={course.courseNumber}
                                term={course.term}
                                year={course.year}
                                id={course.courseID}
                                key={course.courseID}
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

                {!isLoadingUser
                    && (role === 'Student')
                    && (<div className='bg-green-500 text-slate-50 px-4 py-3 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600'
                            // onClick={() => {navigate('/enroll')}}
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