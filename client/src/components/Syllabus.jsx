import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import Tiptap from "./TipTap";
import { getSyllabus, updateSyllabus } from "../firebase";
import useFirebaseConfig from "../hooks/useFirebaseConfig";
import useUserInfo from "../hooks/useUserInfo";
import parse from 'html-react-parser';

const Syllabus = () => {
    const [courseId, setCourseId] = useState('')
    const [syllabus, setSyllabus] = useState('')
    const { db } = useFirebaseConfig();
    const { role } = useUserInfo();

    const handleEditorSave = (html) => {
        // save changes in editor to db
        updateSyllabus(courseId, html, db);

        console.log(html);
    }

    useEffect(() => {        
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));
    
        if(courseId !== '' && db !== null) {
            getSyllabus(courseId, db)
            .then((syllabus) => {
                setSyllabus(syllabus)
            })
        }

    }, [courseId, db])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId} />

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-8'>Syllabus</h1>

                <div>
                    {role === 'Teacher' ? 
                        <Tiptap 
                            onEditorContentSave={handleEditorSave}
                            syllabus={syllabus}
                        /> 
                    : ''}

                    {role === 'Student' ? 
                        <div className='tiptap'>
                            {parse(syllabus)}
                        </div>
                    : ''}
                    
                </div>
            </div>
        </div>
    );
}
 
export default Syllabus;