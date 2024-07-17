import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AssignmentGradeModal from "./AssignmentGradeModel";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import { useUserInfo } from '../hooks/useUserInfo';
import { getAllAssignments, getTotalGrade } from "../firebase";

const StudentGradeModel = ({ name, uid }) => {
    const [courseId, setCourseId] = useState('')
    const { db } = useFirebaseConfig()
    const { role } = useUserInfo()
    const [showStudentGrades, setShowStudentGrades] = useState(false)
    const [assignments, setAssignments] = useState([])
    const [totalGrade, setTotalGrade] = useState(80)

    const fetchAllAssignments = async (courseId, db) => {
        const data = await getAllAssignments(courseId, db)
        return data;
    }

    const fetchTotalAssignmentGrade = async (courseId, uid, db) => {
        const data = await getTotalGrade(courseId, uid, db)
        return data;
    }

    useEffect(() => {        
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));

        if(role === 'Student') {
            setShowStudentGrades(true)
        }

        if(courseId !== '' && db !== null) {
            fetchAllAssignments(courseId, db)
            .then((data) => {
                setAssignments(data)
            })

            if(showStudentGrades) {
                fetchTotalAssignmentGrade(courseId, uid, db)
                .then((data) => {
                    setTotalGrade(data)
                })
            }
        }

        
    }, [role, uid, courseId, db, showStudentGrades])

    return (
        <div className='mb-4 w-full bg-slate-50 drop-shadow-md-blue rounded-lg'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl p-4 font-bold'>{name}</h1>
                {(role === 'Teacher' || role === 'Admin')
                && (
                    <button
                        title='Expand'
                        onClick={() => setShowStudentGrades(!showStudentGrades)}
                    >
                        <ChevronDownIcon className='size-8 mr-4' />
                    </button>
                )}
                
            </div>      

            {showStudentGrades && (
                <div>
                    <div className='font-bold flex justify-between p-4'>
                        <p>Assignments</p>
                        <div className={role === 'Student' ? 'flex gap-8 mr-6' : 'flex gap-8 mr-28'}>
                            <p>Grade % ( / 100)</p>
                            <p>Grade ( / 100)</p>
                        </div>                                  
                    </div>

                    <hr />

                    {assignments?.map((assignment) => (
                        <div key={assignment.title}>
                            <AssignmentGradeModal title={assignment.title} uid={uid} />
                        </div>
                    ))}

                    <div className='font-bold flex justify-between p-4'>
                        <p>Total</p>
                        <p className={role === 'Student' ? 'mr-[70px]' : 'mr-40'}>{totalGrade}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default StudentGradeModel;