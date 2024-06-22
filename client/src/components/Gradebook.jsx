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
        </div>
    );
}
 
export default Gradebook;