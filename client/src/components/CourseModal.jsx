import { useNavigate } from 'react-router';

const CourseModal = ({ title, department, courseNumber, term, year, id }) => {
    const navigate = useNavigate();

    return (
        <div className='bg-blue-200 text-blue-950 flex items-center justify-between px-4 py-5 mb-6 rounded drop-shadow-md cursor-pointer ease-in-out duration-100 hover:drop-shadow-md-blue'
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