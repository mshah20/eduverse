import { createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    setPersistence, 
    browserLocalPersistence
} from "firebase/auth";
import { query, doc, updateDoc, deleteDoc, getDocs, collection, where, addDoc, getDoc, setDoc, arrayUnion, orderBy, arrayRemove } from "firebase/firestore";
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

const getUsers = async (db) => {
    let users = [];
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
        users.push(doc.data());
    })

    return users;
}

const createNewCourse = async (title, department, courseNumber, term, year, courseId, instructor, uid, db) => {
    console.log({
        title, department, courseNumber, term, year, courseId
    })

    if(isAnyStringEmpty([title, department, courseNumber, term, year, courseId])) {
        return {
            "status": 400,
            "message": "Missing required field(s)"
        }
    }
    
    const q = query(collection(db, "courses"), where("courseId", "==", courseId));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
        return setDoc(doc(db, 'courses', courseId), {
            title,
            department,
            courseNumber,
            term,
            year,
            courseId,
            instructor,
            uid
        })
        .then(() => {
            return {
                "status": 200,
                "message": "Course created successfully" 
            }
        })
        .catch(() => {
            return {
                "status": 400,
                "message": "Error creating course"
            }
        })
    } else {
        return {
            "status": 400,
            "message": "Course ID already in use"
        }
    }
}

const deleteCourse = async (courseId, db) => {
    return deleteDoc(doc(db, 'courses', courseId))
    .then(() => {
        return {
            "status": 200,
            "message": "Course deleted successfully"
        }
    })
    .catch(() => {
        return {
            "status": 400,
            "message": "Error while deleting course"
        }
    })
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

const getCoursesAdmin = async (db) => {
    let courses = [];
    const q = query(collection(db, "courses"));
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
        if(docSnap.data().syllabus) {
            syllabus = docSnap.data().syllabus;
        }        
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

const dropCourse = async (courseId, uid, db) => {
    const docRef = doc(db, "courses", courseId);

        return updateDoc(docRef, {
            students: arrayRemove(uid)
        })
        .then(() => {
            return {
                "status": 200,
                "message": "Course dropped successfully"
            }
        })
        .catch(() => {
            return {
                "status": 400,
                "message": "Course drop unsuccessful"
            }
        })
}

const addModule = async (courseId, db, module) => {
    return addDoc(collection(db, `${courseId}CourseContent`), {
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
    const q = query(collection(db, `${courseId}CourseContent`), orderBy("title"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allModules.push(doc.data());
    })
  
    return allModules;
}

const deleteModule = async (courseId, db, title) => {
    let docs = [];
    const q = query(collection(db, `${courseId}CourseContent`),  where("title", "==", title))
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

const addAssignment = async (courseId, db, assignment) => {
    return setDoc(doc(db, `${courseId}Assignments`, assignment.title), {
        title: assignment.title,
        content: assignment.content,       
        gradePercentage: 0,
        grades: []
    }).then(() => {
        return {
            "status": 200,
            "message": "Assignment added successfully" 
        }
    })
    .catch(() => {
        return {
            "status": 400,
            "message": "Error adding assignment"
        }
    })
}

const getAllAssignments = async (courseId, db) => {
    let allAssignments = [];
    const q = query(collection(db, `${courseId}Assignments`), orderBy("title"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allAssignments.push(doc.data());
    })
  
    return allAssignments;
}

const deleteAssignment = async (courseId, db, title) => {
    let docs = [];
    const q = query(collection(db, `${courseId}Assignments`),  where("title", "==", title))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        docs.push(doc);
    })

    return deleteDoc(docs[0].ref)
    .then(() => {
        return {
            "status": 200,
            "message": "Assignment deleted successfully"
        }
    })
    .catch(() => {
        return {
            "status": 400,
            "message": "Error deleting assignment"
        }
    })
}

const getAllStudents = async (courseId, db) => {
    let studentUids = [];
    const q = query(collection(db, "courses"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if(doc.data().students !== undefined) {
            studentUids = doc.data().students;
        }
    })

    const userNameArray = await Promise.all(studentUids.map((uid) => getUserName(uid, db)))
    return studentUids.map((uid, index) => ({
        name: userNameArray[index], 
        uid 
    }))
}

const getAssignmentGrade = async (courseId, title, uid, db) => {
    let assignmentGrade;
    let grade;
    const q = query(collection(db, `${courseId}Assignments`),  where("title", "==", title))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if(doc.data().grades === undefined 
            || doc.data().grades[uid] === undefined 
            || doc.data().grades[uid] === null
        ) {
            grade = 0;
        } 
        else {
            grade = doc.data().grades[uid]
        }

        assignmentGrade = {
            'gradePercentage': doc.data().gradePercentage,
            'grade': grade
        }
    })

    return assignmentGrade;
}

const updateAssignmentGrade = async (newGradePercentage, newGrade, courseId, title, uid, db) => {
    const docRef = doc(db, `${courseId}Assignments`, title);
    
    return updateDoc(docRef, {
        'gradePercentage': newGradePercentage,
        [`grades.${uid}`]: newGrade
    }).then(() => {
        return {
            'status': 200,
            'message': 'Updated successfully'
        }
    }).catch(() => {
        return { 
            "status": 400,
            "message": "Error updating"
        }
    })
}

const getTotalGrade = async (courseId, uid, db) => {
    let totalGrade = 0;
    let numAssignments = 0;
    const q = query(collection(db, `${courseId}Assignments`))
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
        querySnapshot.forEach((doc) => {        
            if(doc.data().grades !== undefined 
                && doc.data().grades[uid] !== undefined
            ) {
                totalGrade += parseInt(doc.data().grades[uid])
                numAssignments++;
            }
        })
        
        if(totalGrade !== 0) {
            totalGrade = totalGrade / numAssignments
        }
    }

    return totalGrade;
}

export {
    signup,
    signIn,
    handleSignOut,
    getUserName,
    getRole,
    getUsers,
    createNewCourse,
    deleteCourse,
    getCoursesTeacher,
    getCoursesStudent,
    getCoursesAdmin,
    getCourseInfo,
    getSyllabus,
    updateSyllabus,
    enrollInCourse,
    dropCourse,
    addModule,
    getAllModules,
    deleteModule,
    addAssignment,
    getAllAssignments,
    deleteAssignment,
    getAllStudents,
    getAssignmentGrade,
    updateAssignmentGrade,
    getTotalGrade
}