const GoalModal = ({ title, id, term }) => {
    return (
        <div className='bg-slate-300 flex items-center justify-between px-4 py-3 mb-6 rounded drop-shadow-md'>
            <div>
                <p className='font-bold text-lg'>{title}</p>
                <p className='text-xs'>{id}</p>
            </div>

            <p className='text-sm'>{term}</p>
        </div>
    );
}
 
export default GoalModal;