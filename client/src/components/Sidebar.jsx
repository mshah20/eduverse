import { useNavigate } from 'react-router';
import { HomeIcon, 
    WrenchScrewdriverIcon, 
    UserCircleIcon, 
    DocumentCheckIcon, 
    BookOpenIcon, 
    CalendarDaysIcon,
    BookmarkIcon, 
    ArrowRightStartOnRectangleIcon 
} from '@heroicons/react/20/solid';
import { handleSignOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useFirebaseConfig } from '../hooks/useFirebaseConfig';
import { useUserInfo } from '../hooks/useUserInfo';

const Sidebar = ({courseId}) => {
    const navigate = useNavigate();
    const { auth } = useFirebaseConfig();
    const { name, role } = useUserInfo();
    let navLinks = [];

    if(courseId) {
        navLinks = [{
        'navigate': '/dashboard',
        'title': 'Dashboard',
        'icon': (className) => {return <HomeIcon className={className} />}
    }, {
        'navigate': '/support',
        'title': 'Support',
        'icon': (className) => {return <WrenchScrewdriverIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/syllabus`,
        'title': 'Syllabus',
        'icon': (className) => {return <BookmarkIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/content`,
        'title': 'Course Content',
        'icon': (className) => {return <BookOpenIcon className={className} />}
    },{
        'navigate': `/course/${courseId}/assignments`,
        'title': 'Assignments',
        'icon': (className) => {return <CalendarDaysIcon className={className} />}
    }, {
        'navigate': `/course/${courseId}/gradebook`,
        'title': 'Gradebook',
        'icon': (className) => {return <DocumentCheckIcon className={className} />}
    }]}
    else {
        navLinks = [{
            'navigate': '/dashboard',
            'title': 'Dashboard',
            'icon': (className) => {return <HomeIcon className={className} />}
        }, {
            'navigate': '/support',
            'title': 'Support',
            'icon': (className) => {return <WrenchScrewdriverIcon className={className} />}
        }]
    }

    const accountSignOut = (auth) => {
        handleSignOut(auth)
        .then(
            navigate('/')
        )
    }

    useEffect(() => {
        if(auth === null) {
            // auth not loaded yet
        } else {
            const unsub = onAuthStateChanged(auth, (authObj) => { 
                unsub(); 
                if (!authObj) {
                    // not logged in
                    navigate('/');
                }
            })
        }

        // eslint-disable-next-line
    }, [auth])

    return (
        <div className='p-2 bg-blue-950 text-slate-50 h-screen min-w-fit md:min-w-64 flex flex-col items-center select-none'>
            <h1 className='font-serif text-5xl mt-6 mb-24 hidden md:block'>Eduverse</h1>
            <h1 className='font-serif text-5xl mt-6 mb-24 block md:hidden'>E</h1>
            
            {navLinks.map((navLink) => (
                <div className='p-4 mb-2 flex w-full rounded cursor-pointer hover:bg-blue-900'
                    onClick={() => {navigate(navLink.navigate)}}
                    key={navLink.title}
                >
                    {navLink.icon('size-6 md:mr-3')}
                    <span className='hidden md:block'>{navLink.title}</span>
                </div>   
            ))}

            <div className='md:p-4 mt-auto flex items-center justify-between w-full rounded'>   
                <div className='hidden md:flex items-center'>
                    <UserCircleIcon className='size-6 md:mr-3'/>
                    <div>
                        <p className='font-bold'>{ name ? name : 'Loading...'}</p>
                        <p className='text-xs italic'>{role ? role : 'Loading...'}</p>
                    </div>
                </div>
            
                <div className='rounded p-4 md:py-2 md:px-4 cursor-pointer hover:bg-blue-900' 
                    onClick={() => {accountSignOut(auth)}}
                    title='Sign Out'
                >
                    <ArrowRightStartOnRectangleIcon className='size-6'/>
                </div>
            </div>
        </div>
    );
}
 
export default Sidebar;