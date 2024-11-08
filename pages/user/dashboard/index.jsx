"use client"

import React from "react";
// import UserDashboard from '@/Components/User/UserDashboard.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserDashboard = dynamic(
  () => import('@/Components/User/UserDashboard.jsx'),
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
            <UserDashboard />
        </>
    );
};

export default Index;
