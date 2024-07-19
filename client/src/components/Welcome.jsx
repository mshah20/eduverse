import { useNavigate } from 'react-router';
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { DocumentCheckIcon, 
    BookOpenIcon, 
    BookmarkIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getCourseInfo } from '../firebase';
import useFirebaseConfig from '../hooks/useFirebaseConfig';

const Welcome = () => {
    const { db } = useFirebaseConfig()
    const navigate = useNavigate();
    const [courseId, setCourseId] = useState('')
    const [courseTitle, setCourseTitle] = useState('');
    const [instructor, setInstructor] = useState('');

    const quickLinks = [{
        'navigate': `/course/${courseId}/syllabus`,
        'title': 'Syllabus',
        'icon': (className) => {return <BookmarkIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/content`,
        'title': 'Course Content',
        'icon': (className) => {return <BookOpenIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/assignments`,
        'title': 'Assignments',
        'icon': (className) => {return <CalendarDaysIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/gradebook`,
        'title': 'Gradebook',
        'icon': (className) => {return <DocumentCheckIcon className={className} />}
    }]

    useEffect(() => {
        let id = window.location.pathname.replace('/course/', '');
        setCourseId(id)

        if(db !== null) {
            getCourseInfo(id, db)
            .then((courseInfo) => {
                setCourseTitle(courseInfo.title)
                setInstructor(courseInfo.instructor)
            })
        }
    
    }, [db])

    return (
        <div className='flex'>
            <Sidebar courseId={courseId}/>
            
            <div className='p-4 w-full flex flex-col items-center overflow-auto max-h-screen'>
                <div className='text-center mt-16'>
                    <h1 className='text-5xl font-serif'>Welcome to {courseTitle}</h1>
                    <h2 className='italic'>taught by {instructor}</h2>
                </div>

                <div className='mt-24 lg:mt-32 grid gap-x-4 md:grid-cols-2'>
                    {quickLinks.map((link) => (
                        <div className='bg-blue-200 text-blue-500 rounded-lg my-4 lg:mx-4 p-4 lg:p-8 flex flex-col items-center w-48 select-none cursor-pointer hover:text-blue-800 hover:scale-105 ease-in-out duration-100'
                            onClick={() => {navigate(link.navigate)}}
                            key={link.title}
                        >
                            {link.icon('size-16')}
                            <p className='font-serif'>{link.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
 
export default Welcome;