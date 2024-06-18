import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Support from "./components/Support";
import Syllabus from "./components/Syllabus";
import CourseContent from "./components/CourseContent";
import Gradebook from "./components/Gradebook";
import NewCourse from "./components/NewCourse";

const routes = [{
        'path': '/',
        'element': <LoginPage />
    }, {
        'path': '/signup',
        'element': <SignupPage />
    }, {
        'path': '/new-course',
        'element': <NewCourse />
    }, {
        'path': '/dashboard',
        'element': <Dashboard />
    }, {
        'path': '/syllabus',
        'element': <Syllabus />
    }, {
        'path': '/content',
        'element': <CourseContent />
    }, {
        'path': '/gradebook',
        'element': <Gradebook />
    }, {
        'path': '/support',
        'element': <Support />
    }
]

const App = () => {

    return (
        <div className='bg-slate-200'>
            <Router>
                <Routes>
                    {routes.map((route, index) => (
                        <Route 
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Routes>
            </Router>
        </div>
    );
}

export default App;