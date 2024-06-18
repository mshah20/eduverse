import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000;

// Test Endpoint
app.get('/test', (req, res) => {
    res.json({ "users": ["userOne", "userTwo", "userThree"] })
})

app.get('/firebase', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_APIKEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_APPID
    })
})

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})