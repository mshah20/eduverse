import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getUsers } from "../firebase";
import { useUserInfo } from '../hooks/useUserInfo';
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import UserModal from "./UserModal";

const Users = () => {
    const [users, setUsers] = useState([]);
    const { db } = useFirebaseConfig()
    const { role } = useUserInfo()

    const fetchUsers = async (db) => {
        const data = await getUsers(db);
        setUsers(data);
    }

    useEffect(() => {
        if(db !== null && role === 'Admin') {
            fetchUsers(db)
        }
    }, [db, role])

    return (
        <div className='flex'>
            <Sidebar />

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Users</h1>

                <div className='grid lg:grid-cols-3 gap-4'>
                    {users?.map((user) => (
                        <div key={user.email}>
                            <UserModal name={user.name} email={user.email} role={user.role} />
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
}
 
export default Users;