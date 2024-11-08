"use client"
import React from "react";
// import UserProfile from '@/Components/User/UserProfile.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserProfile = dynamic(
  () => import('@/Components/User/UserProfile.jsx'),
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
            <UserProfile />
        </>
    );
};

export default Index;
