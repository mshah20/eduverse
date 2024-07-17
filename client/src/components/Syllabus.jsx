import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import Tiptap from "./TipTap";
import { getSyllabus, updateSyllabus } from "../firebase";
import useFirebaseConfig from "../hooks/useFirebaseConfig";
import useUserInfo from "../hooks/useUserInfo";
import parse from 'html-react-parser';
import SuccessMsg from './SuccessMsg';
import ErrorMsg from "./ErrorMsg";

const Syllabus = () => {
    const [courseId, setCourseId] = useState('')
    const [syllabus, setSyllabus] = useState('')
    const { db } = useFirebaseConfig();
    const { role } = useUserInfo();
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleEditorSave = (html) => {
        updateSyllabus(courseId, html, db)
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

            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-8'>Syllabus</h1>

                <div>
                    {(role === 'Teacher' || role === 'Admin') ? 
                        <Tiptap 
                            onEditorContentSave={handleEditorSave}
                            input={syllabus}
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