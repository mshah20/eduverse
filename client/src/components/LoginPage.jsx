import { useNavigate } from 'react-router';
import loginBackground from '../images/login-bg.jpg';
import { signIn } from '../firebase';
import { useState } from 'react';
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import ErrorMsg from './ErrorMsg';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const { auth } = useFirebaseConfig() 

    const handleLogIn = (email, password, auth) => {
        signIn(email, password, auth)
        .then((response) => {
            console.log('response = ', response);

            if(response.status === 200) {
                navigate('/dashboard');
            }
            if(response.status === 400) {
                setErrorMsg(response.message);
                setShowError(true);
    
                setTimeout(() => {
                    setShowError(false);
                }, 3000)
            }
        })
    }

    return(
        <div className='overflow-hidden'>
            {showError && <ErrorMsg message={errorMsg} />}

            <img src={loginBackground} alt='Classroom' className='min-h-screen min-w-[100vw] fixed blur-[3px]' />
            <div className='bg-slate-50 px-6 py-10 w-[400px] max-w-[85%] rounded absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'>
                <h1 className='text-6xl text-center select-none font-serif'>Eduverse</h1>
                <h2 className='text-lg text-center select-none'>Education reimagined.</h2>

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

                <button className='w-full mt-8 mb-2 p-2 rounded bg-green-500 text-slate-50 hover:bg-green-600 active:scale-[0.98]'
                    onClick={() => handleLogIn(email, password, auth)}
                >
                    Log In
                </button>

                <div className='text-center text-xs'>
                    <span>Don't have an account? </span>
                    <a href='http://localhost:3000/signup' className='text-blue-500 hover:underline'>Create an account</a>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;