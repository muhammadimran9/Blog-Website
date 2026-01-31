// Firebase Authentication Service
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc } from './firebase-config.js';

class FirebaseAuthService {
    constructor() {
        this.currentUser = null;
        this.initAuthListener();
    }

    // Initialize authentication state listener
    initAuthListener() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            if (user) {
                console.log('User signed in:', user.email);
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userId', user.uid);
            } else {
                console.log('User signed out');
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('userId');
                sessionStorage.removeItem('user');
            }
        });
    }

    // Register new user
    async register(userData) {
        try {
            const { email, password, name, address, preferredTopic, phone, experience } = userData;
            
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password || 'defaultPassword123');
            const user = userCredential.user;

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: email,
                name: name,
                address: address || '',
                phone: phone || '',
                preferredTopic: preferredTopic || 'programming',
                experience: experience || 'beginner',
                createdAt: new Date().toISOString(),
                quizzesTaken: 0,
                totalScore: 0,
                averageScore: 0
            });

            // Store user info in session
            const userInfo = {
                uid: user.uid,
                email: user.email,
                name: name,
                preferredTopic: preferredTopic || 'programming'
            };
            
            sessionStorage.setItem('user', JSON.stringify(userInfo));
            
            return { success: true, user: userInfo };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: this.getErrorMessage(error.code) };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password || 'defaultPassword123');
            const user = userCredential.user;

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            const userInfo = {
                uid: user.uid,
                email: user.email,
                name: userData.name || 'User',
                preferredTopic: userData.preferredTopic || 'programming'
            };

            sessionStorage.setItem('user', JSON.stringify(userInfo));
            
            return { success: true, user: userInfo };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: this.getErrorMessage(error.code) };
        }
    }

    // Logout user
    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Failed to logout' };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return sessionStorage.getItem('isLoggedIn') === 'true';
    }

    // Get current user info
    getCurrentUser() {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Get user data from Firestore
    async getUserData(uid) {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    // Convert Firebase error codes to user-friendly messages
    getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Email is already registered. Please login instead.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    }
}

// Create and export singleton instance
export const authService = new FirebaseAuthService();