// firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './config/serviceAccountKey.json'assert { type: 'json' }; // Replace with your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'car-rental-sg.appspot.com', // Replace with your storage bucket name
});

export const storageBucket = admin.storage().bucket();
