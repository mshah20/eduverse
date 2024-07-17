import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import useUserInfo from "../hooks/useUserInfo";
import { deleteModule } from "../firebase";
import useFirebaseConfig from "../hooks/useFirebaseConfig";
import SuccessMsg from "./SuccessMsg";
import ErrorMsg from "./ErrorMsg";

const ModuleModal = ({ title, content }) => {
    const [courseId, setCourseId] = useState('')
    const [showModuleContent, setShowModuleContent] = useState(false)
    const { role } = useUserInfo();
    const { db } = useFirebaseConfig();
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleModuleDeletion = (courseId, db, title) => {
        deleteModule(courseId, db, title)
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
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));
    }, [courseId])

    return (
        <>
            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}
            
            <div className='mb-4 w-full bg-slate-50 drop-shadow-md-blue rounded-lg'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl p-4 font-bold'>{title}</h1>
                    <div className='flex items-center gap-2 mr-2'>
                        <button
                            title='Expand'
                            onClick={() => setShowModuleContent(!showModuleContent)}
                        >
                            <ChevronDownIcon className='size-8' />
                        </button>
                        {(role === 'Teacher' || role === 'Admin') && (
                            <button
                                title='Delete Module'
                                className='mr-4'
                                onClick={() => {handleModuleDeletion(courseId, db, title)}}
                            >
                                <XMarkIcon className='size-6' />
                            </button>
                        )}
                        
                    </div>
                    
                </div>

                {showModuleContent && (
                    <div className='bg-slate-50 p-4 rounded-lg tiptap'>
                        {parse(content)}
                    </div>
                )}
            </div>
        </>
    );
}
 
export default ModuleModal;