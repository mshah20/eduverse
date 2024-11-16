<div align="center">
  <h1>Eduverse</h1>
  <p>
    A modern student-driven LMS designed for educators and students alike.
  </p>

  <img src="https://raw.githubusercontent.com/mshah20/eduverse/main/client/src/images/EduverseDashboard.png" alt="Course dashboard" width="100%" />
</div>

## Installation Guide (Local Environment)

### Prerequisites

- [Node](https://nodejs.org)
- [Firebase](https://firebase.google.com)
- [Source Code](https://github.com/mshah20/eduverse)

### Node

Visit the [link](https://nodejs.org) and download the Node installer for your respective operating system.
Execute the installer and follow the guide the install Node.

### Firebase Setup

#### **Authentication:**

1. Visit the [link](https://console.firebase.google.com/) to login to the Firebase console. (_NOTE: This requires a Google account._)
2. Click add project to create a new Firebase project.
3. Name your project (i.e. Eduverse).
4. After enabling or disabling Google Analytics, press Create Project.
5. Expand the Build button in the sidebar and select Authentication.
6. Press Get Started and then enable Email/Password as a sign-in method.

#### **Database:**

1. Expand the Build button in the sidebar and select Firestore Database.
2. Select Create Database and start in test mode for now.

#### **Web Application:**

1. On the Project Overview page, press the </> button to register a web app.

### Application Setup

#### **Server:**

1. Visit the [link](https://github.com/mshah20/eduverse) to the code and download or clone the code into the directory of your choosing.
2. In your Firebase console, go to project settings and copy your app’s firebaseConfig object.
3. In the server folder, create a .env file and input your Firebase configuration and save it. It should be formatted like this:

```javascript
FIREBASE_APIKEY = "APIKEY";
FIREBASE_AUTHDOMAIN = "AUTHDOMAIN";
FIREBASE_PROJECTID = "PROJECTID";
FIREBASE_STORAGEBUCKET = "STORAGEBUCKET";
FIREBASE_MESSAGINGSENDERID = "MESSAGINGSENDERID";
FIREBASE_APPID = "APPID";
```

4. Open a terminal and navigate to the server folder and run the following commands:

```
> npm install
> npm start
```

5. Your server should now be running on port 5000 if it is available.

#### **Client:**

1. Open another terminal and navigate to the client folder and run the following commands:

```
> npm install
> npm start
```

2. Eduverse should now be up and running on your localhost port 3000 if available. Open your web browser and go to [http://localhost:3000](http://localhost:3000).
