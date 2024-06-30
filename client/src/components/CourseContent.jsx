import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import { useUserInfo } from '../hooks/useUserInfo';
import Tiptap from "./TipTap";
import { addModule, getAllModules } from "../firebase";
import SuccessMsg from "./SuccessMsg";
import ErrorMsg from "./ErrorMsg";
import ModuleModal from "./ModuleModal";

const CourseContent = () => {
    const [courseId, setCourseId] = useState('')
    const { role } = useUserInfo()
    const { db } = useFirebaseConfig()
    const [showNewContentInput, setShowNewContentInput] = useState(false);
    const [moduleTitle, setModuleTitle] = useState('')
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [modules, setModules] = useState([])

    const placeholderModuleContent = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Facilisi etiam dignissim diam quis:</p><ul><li><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p></li><li><p>Et malesuada fames ac turpis egestas integer eget aliquet nibh. </p></li><li><p>Pharetra massa massa ultricies mi quis hendrerit. </p></li><li><p>Rhoncus aenean vel elit scelerisque mauris pellentesque.</p></li></ul>'

    const handleEditorSave = (html) => {
        if(moduleTitle === '' || moduleTitle === null) {
            setResponseMsg('Empty Module Title')
            setShowError(true);
    
            setTimeout(() => {
                setShowError(false);
            }, 3000)

            return
        }

        const module = {
            title: moduleTitle,
            content: html
        }

        addModule(courseId, db, module)
        .then((response) => {
            setResponseMsg(response.message);

            if(response.status === 200) {
                setShowSuccess(true);
                setShowNewContentInput(false)

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

        setModuleTitle('')

        console.log({
            title: moduleTitle,
            content: html
        });
    }

    const fetchAllModules = async (courseId, db) => {
        const data = await getAllModules(courseId, db)
        return data;
    }

    useEffect(() => {
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));

        if(courseId !== '' && db !== null) {
            fetchAllModules(courseId, db)
            .then((data) => {
                setModules(data)
            })
        }

    }, [courseId, db])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId} />

            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}

            <div className='p-4 w-full'>
                <h1 className='font-bold text-3xl mb-24'>Course Content</h1>

                {modules?.map((module) => (
                    <div key={module.title}>
                        <ModuleModal title={module.title} content={module.content} />
                    </div>
                ))}

                {showNewContentInput && (
                    <div className='flex flex-col items-center'>
                        <div className='w-[80%] mb-4 flex flex-col md:flex-row justify-center items-center gap-2'>
                            <span className='font-bold text-lg'>Module Title: </span>
                            <input 
                                className='w-[80%] p-1 rounded border-[1px] border-black'
                                value={moduleTitle}
                                onChange={(e) => {setModuleTitle(e.target.value)}}
                                autoFocus
                            />
                        </div>
                        
                        <Tiptap 
                            onEditorContentSave={handleEditorSave}
                            input={placeholderModuleContent}
                        /> 
                        <button 
                            className='bg-red-500 text-slate-50 px-4 py-2 my-4 rounded cursor-pointer hover:bg-red-600 active:scale-95'
                            onClick={() => setShowNewContentInput(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {role === 'Teacher' 
                && (!showNewContentInput)
                && (
                    <button
                        className='bg-green-500 text-slate-50 px-4 py-3 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600 active:scale-95'
                        onClick={() => setShowNewContentInput(true)}
                    >
                        Add a new module
                    </button>
                )}
                
            </div>
        </div>
    );
}
 
export default CourseContent;