import { useNavigate } from 'react-router';
import { XMarkIcon } from "@heroicons/react/20/solid";
import useUserInfo from "../hooks/useUserInfo";
import SuccessMsg from "./SuccessMsg";
import ErrorMsg from "./ErrorMsg";
import { useState } from 'react';
import useFirebaseConfig from "../hooks/useFirebaseConfig";
import { deleteCourse, dropCourse } from '../firebase';

const CourseModal = ({ title, department, courseNumber, term, year, id }) => {
    const navigate = useNavigate();
    const { uid, role } = useUserInfo();
    const { db } = useFirebaseConfig();
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleCourseRemoval = (courseId, uid, db) => {
        if(role === 'Student') {
            dropCourse(courseId, uid, db)
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
        else if(role === 'Teacher' || role === 'Admin') {
            deleteCourse(courseId, db)
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
    }

    return (
        <>
            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}
            <div className='flex items-center mb-6 bg-blue-200 text-blue-950 rounded cursor-pointer ease-in-out duration-100 drop-shadow-md hover:drop-shadow-md-blue'>
                <div className='w-full flex items-center justify-between pl-4 py-5'
                    onClick={() => {navigate(`/course/${id}`)}}
                >
                    <div>
                        <p className='font-bold text-lg'>{title}</p>
                        <p className='text-xs'>{department} {courseNumber}</p>
                    </div>

                    <p className='text-sm mr-2'>{term} {year}</p>        
                </div>
                
                <button
                    className='h-full rounded-tr rounded-brself-end ease-in-out duration-100 hover:bg-blue-300'
                    onClick={() => {handleCourseRemoval(id, uid, db)}}
                >
                    <XMarkIcon className='size-6 mx-2' />
                </button>
            </div>
        </>
    );
}
 
export default CourseModal;