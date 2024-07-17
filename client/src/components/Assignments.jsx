import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useUserInfo } from '../hooks/useUserInfo';
import Tiptap from "./TipTap";
import SuccessMsg from "./SuccessMsg";
import ErrorMsg from "./ErrorMsg";
import { addAssignment, getAllAssignments } from "../firebase";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import AssignmentModal from "./AssignmentModal";

const Assignments = () => {
    const [courseId, setCourseId] = useState('')
    const { role } = useUserInfo()
    const { db } = useFirebaseConfig()
    const [showNewAssignmentInput, setShowNewAssignmentInput] = useState(false)
    const [assignmentTitle, setAssignmentTitle] = useState('')
    const [responseMsg, setResponseMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [assignments, setAssignments] = useState([])

    const placeholderModuleContent = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Facilisi etiam dignissim diam quis:</p><ul><li><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p></li><li><p>Et malesuada fames ac turpis egestas integer eget aliquet nibh. </p></li><li><p>Pharetra massa massa ultricies mi quis hendrerit. </p></li><li><p>Rhoncus aenean vel elit scelerisque mauris pellentesque.</p></li></ul>'

    const handleEditorSave = (html) => {
        if(assignmentTitle === '' || assignmentTitle === null) {
            setResponseMsg('Empty Module Title')
            setShowError(true);
    
            setTimeout(() => {
                setShowError(false);
            }, 3000)

            return
        }

        const assignment = {
            title: assignmentTitle,
            content: html
        }

        addAssignment(courseId, db, assignment)
        .then((response) => {
            setResponseMsg(response.message);

            if(response.status === 200) {
                setShowSuccess(true);
                setShowNewAssignmentInput(false)

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

        setAssignmentTitle('')
    }

    const fetchAllAssignments = async (courseId, db) => {
        const data = await getAllAssignments(courseId, db)
        return data;
    }

    useEffect(() => {        
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));

        if(courseId !== '' && db !== null) {
            fetchAllAssignments(courseId, db)
            .then((data) => {
                setAssignments(data)
            })
        }
    }, [courseId, db])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId} />

            {showSuccess && <SuccessMsg message={responseMsg} />}
            {showError && <ErrorMsg message={responseMsg} />}

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Assignments</h1>
            
                {assignments?.map((assignment) => (
                    <div key={assignment.title}>
                        <AssignmentModal title={assignment.title} content={assignment.content} />
                    </div>
                ))}

                {showNewAssignmentInput && (
                    <div className='flex flex-col items-center'>
                        <div className='w-[80%] mb-4 flex flex-col md:flex-row justify-center items-center gap-2'>
                            <span className='font-bold text-lg'>Assignment Title: </span>
                            <input 
                                className='w-[80%] p-1 rounded border-[1px] border-black'
                                value={assignmentTitle}
                                onChange={(e) => {setAssignmentTitle(e.target.value)}}
                                autoFocus
                            />
                        </div>
                        
                        <Tiptap 
                            onEditorContentSave={handleEditorSave}
                            input={placeholderModuleContent}
                        /> 
                        <button 
                            className='bg-red-500 text-slate-50 px-4 py-2 my-4 rounded cursor-pointer hover:bg-red-600 active:scale-95'
                            onClick={() => setShowNewAssignmentInput(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {(role === 'Teacher' || role === 'Admin') 
                && (!showNewAssignmentInput)
                && (
                    <button
                        className='bg-green-500 text-slate-50 px-4 py-3 mx-auto w-fit rounded flex items-center justify-center cursor-pointer hover:bg-green-600 active:scale-95'
                        onClick={() => setShowNewAssignmentInput(true)}
                    >
                        Create New Assignment
                    </button>
                )}
            </div>
        </div>
    );
}
 
export default Assignments;