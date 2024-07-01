import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const Gradebook = () => {
    const [courseId, setCourseId] = useState('')

    useEffect(() => {
        let path = window.location.pathname.replace('/course/', '');
        setCourseId(path.substring(0, path.indexOf('/')));
    }, [])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId} />

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Gradebook</h1>
            </div>
        </div>
    );
}
 
export default Gradebook;