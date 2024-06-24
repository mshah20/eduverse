import { useState } from "react";
import Sidebar from "./Sidebar";
import ErrorMsg from "./ErrorMsg";
import { createNewCourse } from "../firebase";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import useUserInfo from "../hooks/useUserInfo";

const NewCourse = () => {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const [courseId, setCourseId] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { db } = useFirebaseConfig()
    const { uid, name } = useUserInfo()

    const inputFields = [{
        'title': 'Title *',
        'value': title,
        'setState': (e) => {
            // const capitalizedTitle = e.target.value.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())
            setTitle(e.target.value)
        },
        'placeholder': 'Software Engineering I'
    }, {
        'title': 'Department *',
        'value': department,
        'setState': (e) => {setDepartment(e.target.value.toUpperCase())},
        'placeholder': 'CEN'
    }, {
        'title': 'Course Number *',
        'value': courseNumber,
        'type': 'number',
        'setState': (e) => {setCourseNumber(e.target.value)},
        'placeholder': '4010'
    }, {
        'title': 'Term *',
        'value': term,
        'setState': (e) => {
            const capitalizedTerm = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
            setTerm(capitalizedTerm)
        },
        'placeholder': 'Summer'
    }, {
        'title': 'Year *',
        'value': year,
        'type': 'number',
        'setState': (e) => {setYear(e.target.value)},
        'placeholder': '2024'
    }, {
        'title': 'Course ID *',
        'value': courseId,
        'setState': (e) => {setCourseId(e.target.value)},
        'placeholder': 'DoeCEN4010Summer2024'
    }]
    
    const handleSubmit = (title, department, courseNumber, term, year, courseID, instructor, uid, db) => {
        createNewCourse(title, department, courseNumber, term, year, courseID, instructor, uid, db)
        .then((response) => {
            if(response.status === 400) {
                setErrorMsg(response.message);
                setShowError(true);
    
                setTimeout(() => {
                    setShowError(false);
                }, 3000)
            }
        })
    }

    return (
        <div className='flex'>
            <Sidebar />
            {showError && <ErrorMsg message={errorMsg} />}

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-8'>Create a Course</h1>

                <div className='ml-6 w-[500px]'>
                    {inputFields.map((inputField) => (
                        <div key={inputField.title}>
                            <p className='my-2 font-bold'>{inputField.title}</p>
                            <input className='w-full p-2 rounded'
                                value={inputField.value}
                                type={inputField.type ? inputField.type : 'text'}
                                onChange={(e) => {inputField.setState(e)}}
                                placeholder={inputField.placeholder}
                            />
                        </div>
                    ))}

                    <p className='text-sm italic my-2 text-center'>* denotes required field</p>

                    <button className='w-full mt-8 mb-2 p-2 rounded bg-green-500 text-slate-50 hover:bg-green-600 active:scale-[0.98]'
                        onClick={() => {handleSubmit(title, department, courseNumber, term, year, courseId, name, uid, db)}}
                    >
                        Create Course
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default NewCourse;