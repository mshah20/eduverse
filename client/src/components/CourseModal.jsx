import { useNavigate } from 'react-router';

const CourseModal = ({ title, department, courseNumber, term, year, id }) => {
    const navigate = useNavigate();

    return (
        <div className='bg-slate-300 flex items-center justify-between px-4 py-3 mb-6 rounded drop-shadow-md cursor-pointer'
            onClick={() => {navigate(`/course/${id}`)}}
        >
            <div>
                <p className='font-bold text-lg'>{title}</p>
                <p className='text-xs'>{department} {courseNumber}</p>
            </div>

                <p className='text-sm'>{term} {year}</p>
        </div>
    );
}
 
export default CourseModal;