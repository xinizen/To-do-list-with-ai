'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'taskpilot-ai-kbtes',
  appId: '1:90889312109:web:3ca7cdba51843945d22c64',
  storageBucket: 'taskpilot-ai-kbtes.firebasestorage.app',
  apiKey: 'AIzaSyA35S-QVtnvrZVNWr2Le_RTD_2L6XLEu1s',
  authDomain: 'taskpilot-ai-kbtes.firebaseapp.com',
  messagingSenderId: '90889312109',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
