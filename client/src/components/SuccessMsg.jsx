

const SuccessMsg = ({ message }) => {
    return (
        <div className='z-[10] animate-fadeInOut bg-green-500 p-2 absolute top-4 right-4 w-[300px] text-center rounded text-slate-50'>
            <p>{message}</p>
        </div>
    );
}

export default SuccessMsg;