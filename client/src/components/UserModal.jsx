const UserModal = ({ name, email, role }) => {
    return (
        <div className='p-4 flex items-center justify-between mb-6 bg-blue-200 text-blue-950 rounded ease-in-out duration-100 drop-shadow-md hover:drop-shadow-md-blue'>
            <div>
                <p className='font-bold'>{name}</p>
                <p>{email}</p>
            </div>

            <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>
    );
}
 
export default UserModal;