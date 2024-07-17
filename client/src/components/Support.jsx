import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/20/solid";
import Sidebar from "./Sidebar";

const Support = () => {
    return (
        <div className='flex'>
            <Sidebar />

            <div className='p-4 w-full overflow-auto max-h-screen'>
                <h1 className='font-bold text-3xl mb-24'>Support</h1>

                <div className='p-4 text-center bg-slate-50 rounded-lg drop-shadow-md-blue'>
                    <ChatBubbleBottomCenterTextIcon className='col-span-1 size-24 mx-auto my-4 text-blue-950' />
                    <hr className='' />
    
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        <div className='p-4 border-b-2 md:border-b-0 md:border-r-2 border-slate-200'>
                            <p className='text-center'><span className='font-bold'>Phone Number:</span> 123-456-7890</p>
                            <p className='text-center'><span className='font-bold'>Email:</span> support@eduverse.com</p>
                            <br />
                            <p>If you are experiencing any technical issues you can contact us and we will respond as soon as possible!</p>
                        </div>

                        <div className='p-4'>
                            <p className='text-left mb-2'>Reasons for contacting can include but are not limited to issues regarding:</p>
                            <ul className='list-disc text-left ml-8'>
                                <li>Logging in</li>
                                <li>Enrolling in courses</li>
                                <li>Updating course information</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Support;