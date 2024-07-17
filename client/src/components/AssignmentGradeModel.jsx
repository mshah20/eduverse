import { useState, useEffect } from "react";
import { getAssignmentGrade, updateAssignmentGrade } from "../firebase";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import { useUserInfo } from '../hooks/useUserInfo';
import SuccessMsg from "./SuccessMsg";
import ErrorMsg from "./ErrorMsg";

const AssignmentGradeModal = ({ title, uid }) => {
    const [courseId, setCourseId] = useState('')
    const { db } = useFirebaseConfig()
    const { role } = useUserInfo()
    const [gradePercentage, setGradePercentage] = useState(0)
    const [grade, setGrade] = useState(0)
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const fetchAssignmentGrade = async (courseId, title, uid, db) => {
        const data = await getAssignmentGrade(courseId, title, uid, db)
        return data;
    }

    const handleUpdateGrade = (newGradePercentage, newGrade, courseId, title, uid, db) => {
        updateAssignmentGrade(newGradePercentage, newGrade, courseId, title, uid, db)
        .then((response) => {
            setResponseMsg(response.message);

            if(response.status === 200) {
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
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
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));

        if(courseId !== '' && db !== null) {
            fetchAssignmentGrade(courseId, title, uid, db)
            .then((data) => {
                setGradePercentage(data.gradePercentage)
                setGrade(data.grade)
            })
        }
    }, [courseId, db, title, uid])

    return (
        <>
            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}

            <div className='p-4 flex justify-between rounded hover:bg-slate-200'>
                <h1>{title}</h1>
                
                <div className='flex'>
                    <div className='flex gap-16 mr-10'>
                        {role === 'Student'
                        && (
                            <>
                                <p className='w-20 px-2 text-center'>{gradePercentage}</p>
                                <p className='w-20 px-2 text-center'>{grade}</p>
                            </>
                        )}

                        {(role === 'Teacher' || role === 'Admin')
                        && (
                            <>
                                <input 
                                    className='w-20 px-2 border border-black rounded'
                                    value={gradePercentage}
                                    onChange={(e) => {setGradePercentage(e.target.value)}}
                                    type='number'
                                />
                                <input 
                                    className='w-20 px-2 border border-black rounded'
                                    value={grade}
                                    onChange={(e) => {setGrade(e.target.value)}}
                                    type='number'
                                />
                            </>
                        )}
                        
                    </div>

                    {(role === 'Teacher' || role === 'Admin')
                    && (
                        <button 
                            className='bg-green-500 text-slate-50 px-4 py-1 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600 active:scale-95'
                            onClick={() => {handleUpdateGrade(gradePercentage, grade, courseId, title, uid, db)}}    
                        >
                            Update
                        </button>
                    )}
                    
                </div>
            </div>

            <hr />
        </>  
    );
}
 
export default AssignmentGradeModal;