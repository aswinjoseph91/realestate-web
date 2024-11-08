'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import firebase from "firebase/compat/app"
import { getAuth } from "firebase/auth";
import toast from 'react-hot-toast';
import { getFcmToken } from '@/store/reducer/settingsSlice';
import { createStickyNote } from '.';

const FirebaseData = () => {
  let firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);
  const authentication = getAuth(app);
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
 


 

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
        
      } else {
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error('Error checking messaging support:', err);
      return null;
    }
  };
  const fetchToken = async (setTokenFound, setFcmToken) => {
    const messaging = await messagingInstance();
    if (!messaging) {
      console.error('Messaging not supported.');
      return;
    }
  
    try {
      getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })
        .then((currentToken) => {
  
          if (currentToken) {
            setFcmToken(currentToken);
            getFcmToken(currentToken);
          } else {
            setTokenFound(false);
            setFcmToken(null);
            console.log('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.error('Error retrieving token:', err);
          if (err.message.includes('no active Service Worker')) {
            registerServiceWorker();
          }
        });
    } catch (err) {
      console.error('Error in fetchToken:', err);
    }
  };

  const requestNotificationPermission = async () => {
    console.log("requestNotificationPermission")
    try {
        const permission = await Notification.requestPermission();
        console.log("Permission status:", permission);

        if (permission === 'granted') {
            // Permission granted, proceed to fetch token or other actions
            await fetchToken(setTokenFound);
        } else if (permission === 'denied') {
            console.log('Notification permission denied by user');
            // Handle denied permission scenario
        } else if (permission === 'default') {
            console.log('User closed the permission dialog without making a choice');
            // Handle when user closes the dialog without making a choice
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
};
  
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          // After successful registration, try to fetch the token again
          fetchToken();
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  };

  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error('Messaging not supported.');
      return null;
    }
  };
  const signOut = () => {
    return authentication.signOut();
  };
  return { firebase, authentication, fetchToken, onMessageListener, signOut,requestNotificationPermission }
}

export default FirebaseData;
