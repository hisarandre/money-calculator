import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAJnkO4MK3Su-_HNaIONLC13HbUPnVe1hI",
    authDomain: "money-calculator-884b3.firebaseapp.com",
    projectId: "money-calculator-884b3",
    storageBucket: "money-calculator-884b3.firebasestorage.app",
    messagingSenderId: "290748717757",
    appId: "1:290748717757:web:44730fff354d61688d35d4",
    measurementId: "G-09S561N2K8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
