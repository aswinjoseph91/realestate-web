"use client"
import React, { useEffect, useState } from 'react'
import 'firebase/messaging'
import { toast } from 'react-hot-toast'
import FirebaseData from '../../utils/Firebase'
import { Fcmtoken } from '@/store/reducer/settingsSlice'
import { useSelector } from 'react-redux'

const PushNotificationLayout = ({ children, onNotificationReceived }) => {
  const [notification, setNotification] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [isTokenFound, setTokenFound] = useState(false)
  const [fcmToken, setFcmToken] = useState('')
  const { fetchToken, onMessageListener } = FirebaseData()

  const FcmToken = useSelector(Fcmtoken)

  
  const handleFetchToken = async () => {
    await fetchToken(setTokenFound, setFcmToken)
    
  }
  
  useEffect(() => {
    handleFetchToken();
  }, [userToken]);
  useEffect(() => {
    if (typeof window !== undefined) {
      setUserToken(FcmToken)
      //userToken = window.localStorage.getItem('token')
    }
  }, [userToken])

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload && payload.data) {
          setNotification(payload.data);
          onNotificationReceived(payload.data);
        }
      })
      .catch((err) => {
        console.error('Error handling foreground notification:', err);
        toast.error('Error handling notification.');
      });
  }, [notification, onNotificationReceived]);

  // / service worker
  useEffect(() => {
    if (fcmToken) {
      // Only register the service worker if fcmToken is not null
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          })
          .catch((err) => {
            console.log('Service Worker registration failed: ', err);
          });
      }
    }
  }, [fcmToken]);
  return <div>{React.cloneElement(children)}</div>;
}

export default PushNotificationLayout
