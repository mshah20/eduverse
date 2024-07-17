import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useUserInfo } from '../hooks/useUserInfo';
import { getAllStudents } from "../firebase";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import StudentGradeModal from "./StudentGradeModal";

const Gradebook = () => {
    const [courseId, setCourseId] = useState('')
    const { db } = useFirebaseConfig()
    const { name, role, uid } = useUserInfo()
    const [students, setStudents] = useState([])

    const fetchAllStudents = async (courseId, db) => {
        const data = await getAllStudents(courseId, db)
        return data;
    }

    useEffect(() => {
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));

        if(courseId !== '' && db !== null) {
            fetchAllStudents(courseId, db)
            .then((students) => {
                setStudents(students)
            })
        }
    }, [courseId, db])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId} />

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Gradebook</h1>

                {(role === 'Teacher' || role === 'Admin') 
                && (  
                    students?.map((student) => (
                        <div key={student.uid}>
                            <StudentGradeModal name={student.name} uid={student.uid} />
                        </div>
                    ))
                )}

                {role === 'Student'
                && (
                    <StudentGradeModal name={name} uid={uid} />
                )}
            </div>
        </div>
    );
}
 
export default Gradebook;