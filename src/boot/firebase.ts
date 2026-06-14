// Import the functions you need from the SDKs you need
import { getAnalytics } from "@firebase/analytics"
import { initializeApp } from "@firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG))
const analytics = getAnalytics(app)

export { app, analytics }
