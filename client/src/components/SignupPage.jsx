import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../firebase.js";
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import ErrorMsg from "./ErrorMsg.jsx";

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState("student");
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const { auth, db } = useFirebaseConfig()
    const navigate = useNavigate();

    const handleSignup = async (name, email, password, role, auth, db) => {
        const response = await signup(name, email, password, role, auth, db);
        setErrorMsg(response.message);

        console.log('response = ', response);

        if(response.status === 200) {
            navigate('/dashboard');
        }
        else if(response.status === 400) {
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 3000)
        }
    }

    return (
        <div className='min-h-screen min-w-[100vw] bg-slate-300'>
            {showError && <ErrorMsg message={errorMsg} />}

            <div className='bg-slate-50 px-6 py-10 w-[400px] max-w-[85%] rounded absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'>
                <h1 className='text-6xl text-center select-none font-serif'>Eduverse</h1>
                <h2 className='text-lg text-center select-none'>Education reimagined.</h2>

                <div className='mt-4'>
                    <p className='my-1'>Name</p>
                    <input className='w-full p-1 rounded border-[1px] border-black'
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </div>

                <div className='mt-4'>
                    <p className='my-1'>Email</p>
                    <input className='w-full p-1 rounded border-[1px] border-black'
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                </div>

                <div className='mt-4'>
                    <p className='my-1'>Password</p>
                    <input className='w-full p-1 rounded border-[1px] border-black'
                        type='password'
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>

                <div className='mt-4'>
                    <p className='my-1'>What are you?</p>
                    <select name='role'
                        className='min-w-full p-1.5 rounded border-[1px] border-black'
                        onChange={(e) => {setRole(e.target.value)}}
                    >
                        <option value='student'>Student</option>
                        <option value='teacher'>Teacher</option>
                    </select>
                </div>

                <button className='w-full mt-8 mb-2 p-2 rounded bg-green-500 text-slate-50 hover:bg-green-600 active:scale-[0.98]'
                    onClick={() => handleSignup(name, email, password, role, auth, db)}
                >
                    Sign Up
                </button>

                <div className='text-center text-xs'>
                    <span>Already have an account? </span>
                    <a href='http://localhost:3000/' className='text-blue-500 hover:underline'>Log In</a>
                </div>
            </div>
        </div>
    )
}

export default SignupPage;