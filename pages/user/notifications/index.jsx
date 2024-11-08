"use client"

import React from "react";
// import UserNotification from '@/Components/User/UserNotification.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserNotification = dynamic(
  () => import('@/Components/User/UserNotification.jsx'),
  { ssr: false })
const Index = () => {

    return (
        <> 
        <Meta
        title=""
        description=""
        keywords=""
        ogImage=""
        pathName=""
    />
            <UserNotification />
        </>
    );
};

export default Index;
