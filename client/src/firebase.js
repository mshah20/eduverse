import { createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    setPersistence, 
    browserLocalPersistence
} from "firebase/auth";
import { query, doc, updateDoc, deleteDoc, getDocs, collection, where, addDoc, getDoc, arrayUnion, orderBy } from "firebase/firestore";
import { isAnyStringEmpty } from "./utils";

const createUserInDB = async (uid, name, email, role, db) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
            uid,
            name,
            email,
            role
        });
    }
}

const signup = async (name, email, password, role, auth, db) => {
    let res = {};

    if(name === null || name === '') {
        res = {
            "status": 400,
            "message": "Name field required"
        }
    } else {
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("user signed up as = ", user);
    
            createUserInDB(user.uid, name, email, role, db);
    
            res = {
                "status": 200,
                "message": "Account created successfully."
            };
        })
        .catch((error) => {
            res = {
                "status": 400,
                "message": error.message.replace('Firebase: ', '')
            };
        });
    }

    return res;
}

const signIn = async (email, password, auth) => {
    return setPersistence(auth, browserLocalPersistence)
    .then(async () =>{
        return signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            return {
                'status': 200,
                'message': 'Account logged in successfully'
            }
        })
        .catch((error) => {
            return {
                "status": 400,
                "message": error.message.replace('Firebase: ', '')
            };
        })
    })   
}

const handleSignOut = (auth) => {
    return signOut(auth);
};

const getUserName = async (uid, db) => {
    let userName = '';
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        userName = doc.data().name;
    })

    return userName;
}

const getRole = async (uid, db) => {
    let role = '';
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        role = doc.data().role;
    })

    return role.charAt(0).toUpperCase() + role.slice(1);
}

const createNewCourse = async (title, department, courseNumber, term, year, courseID, instructor, uid, db) => {
    console.log({
        title, department, courseNumber, term, year, courseID
    })

    if(isAnyStringEmpty([title, department, courseNumber, term, year, courseID])) {
        return {
            "status": 400,
            "message": "Missing required field(s)"
        }
    }
    
    const q = query(collection(db, "courses"), where("courseID", "==", courseID));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
        await addDoc(collection(db, "courses"), {
            title,
            department,
            courseNumber,
            term,
            year,
            courseID,
            instructor,
            uid
        })

        return {
            "status": 200,
            "message": "Course successfully created"
        }
    } else {
        return {
            "status": 400,
            "message": "Course ID already in use"
        }
    }
}

const getCoursesTeacher = async (uid, db) => {
    let courses = [];
    const q = query(collection(db, "courses"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        courses.push(doc.data());
    })

    return courses;
}

const getCoursesStudent = async (uid, db) => {
    let courses = [];
    const q = query(collection(db, "courses"), where("students", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        courses.push(doc.data());
    })

    return courses;
}

const getCourseInfo = async (courseId, db) => {
    let info;
    const q = query(collection(db, "courses"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        info = doc.data();
    })
  
    return info;
}

const getSyllabus = async (courseId, db) => {
    let syllabus = '';
    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
        syllabus = docSnap.data().syllabus;
    }

    return syllabus;
}

const updateSyllabus = async (courseId, html, db) => {
    const docRef = doc(db, "courses", courseId);

    return updateDoc(docRef, {
        syllabus: html
    }).then(() => {
        return {
            'status': 200,
            'message': 'Updated syllabus successfully'
        }
    }).catch(() => {
        return { 
            "status": 400,
            "message": "Error updating syllabus"
        }
    })
}

const enrollInCourse = async (courseId, uid, db) => {
    if(courseId === '' || courseId === null) {
        return {
            "status": 400,
            "message": "Invalid Course ID"
        }
    }

    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
        await updateDoc(docRef, {
            students: arrayUnion(uid)
        })

        return {
            "status": 200,
            "message": "Enrolled successfully"
        }
    }
    else {
        return {
            "status": 400,
            "message": "Course with this ID doesn't exist"
        }
    }
}

const addModule = async (courseId, db, module) => {
    return addDoc(collection(db, courseId), {
        title: module.title,
        content: module.content
    }).then((docRef) => {
        if(docRef.id !== null && docRef.id !== '') {
            return {
                "status": 200,
                "message": "Module added successfully" 
            }
        } 
        else {
            return {
                "status": 400,
                "message": "Error adding module"
            }
        }
    })
}

const getAllModules = async (courseId, db) => {
    let allModules = [];
    const q = query(collection(db, courseId), orderBy("title"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allModules.push(doc.data());
    })
  
    return allModules;
}

const deleteModule = async (courseId, db, title) => {
    const docs = [];
    const q = query(collection(db, courseId),  where("title", "==", title))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        docs.push(doc);
    })

    return deleteDoc(docs[0].ref)
    .then(() => {
        return {
            "status": 200,
            "message": "Module deleted successfully"
        }
    })
    .catch(() => {
        return {
            "status": 400,
            "message": "Error deleting module"
        }
    })
}

export {
    signup,
    signIn,
    handleSignOut,
    getUserName,
    getRole,
    createNewCourse,
    getCoursesTeacher,
    getCoursesStudent,
    getCourseInfo,
    getSyllabus,
    updateSyllabus,
    enrollInCourse,
    addModule,
    getAllModules,
    deleteModule
}