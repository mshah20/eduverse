import { useEffect, useState } from 'react'
import axios from 'axios' ;
import { initializeApp } from 'firebase/app';
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


export const useFirebaseConfig = () => {
    const [app, setApp] = useState(null)
    const [auth, setAuth] = useState(null)
    const [db, setDb] = useState(null)

    const getFirebaseConfiguration = async () => {
        try {
            const { data: firebaseConfig } = await axios.get('http://localhost:5000/firebase')
            const _app = initializeApp(firebaseConfig)
            setApp(_app)
            setAuth(getAuth(_app))
            setDb(getFirestore(_app))
        } catch (error) {
            console.log('Error when getting firebase config', error);
            return
        }
    }

    useEffect(() => {
        getFirebaseConfiguration()
    }, [])

    return { auth, db, app }
}

export default useFirebaseConfig;