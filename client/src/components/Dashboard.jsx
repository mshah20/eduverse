import { useNavigate } from 'react-router';
import { PlusIcon } from "@heroicons/react/20/solid";
// import GoalModal from "./CourseModal";
import Sidebar from "./Sidebar";
import { useEffect, useState } from 'react';
import { useUserInfo } from '../hooks/useUserInfo';


const Dashboard = () => {
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();
    const { role } = useUserInfo();
    
    useEffect(() => {
        if(role) {
            setIsLoadingUser(false);
        }
    }, [role])

    return (
        <div className='flex'>
            <Sidebar />

            <div className='p-4 w-full'>
                <h1 className='font-bold text-3xl mb-24'>Dashboard</h1>
                {/* <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    <GoalModal 
                        title='Software Engineering I'
                        id='CEN 4010'
                        term='Summer 2024'
                    />
                    <GoalModal 
                        title='Software Engineering I'
                        id='CEN 4010'
                        term='Summer 2024'
                    />
                    <GoalModal 
                        title='Software Engineering I'
                        id='CEN 4010'
                        term='Summer 2024'
                    />
                </div> */}
                
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