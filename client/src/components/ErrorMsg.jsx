

const ErrorMsg = ({ message }) => {
    return (
        <div className='z-[10] animate-fadeInOut bg-red-600 p-2 fixed top-4 right-4 w-[300px] text-center rounded text-slate-50'>
            <p>{message}</p>
        </div>
    );
}

export default ErrorMsg;