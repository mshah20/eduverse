import { useEffect, useState } from 'react'
import { useFirebaseConfig } from './/useFirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getRole, getUserName } from '../firebase';

export const useUserInfo = () => {
    const { auth, db } = useFirebaseConfig();
    const [uid, setUid] = useState(null);
    const [name, setName] = useState(null);
    const [role, setRole] = useState(null);

    const getUserInfo = () => {
        try {
            const user = auth.currentUser;

            setUid(user.uid)
            getUserName(user.uid, db)
            .then((name) => {
                setName(name)
            })
            getRole(user.uid, db)
            .then((role) => {
                setRole(role)
            })
        
        } catch (error) {
            console.log('Error when getting user info', error);
            return
        }
    }
    
    useEffect(() => {
        if(auth === null) {
            // auth not loaded yet
        } else {
            const unsub = onAuthStateChanged(auth, (authObj) => { 
                unsub(); 
                if (authObj) {
                    // logged in
                    getUserInfo();
                }
            })
        }
        
        // eslint-disable-next-line
    }, [auth])

    return { uid, name, role}
}

export default useUserInfo;