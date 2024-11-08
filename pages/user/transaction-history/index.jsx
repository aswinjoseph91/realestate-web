"use client"

import React from "react";
// import UserTransationHistory from '@/Components/User/UserTransationHistory.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserTransationHistory = dynamic(
  () => import('@/Components/User/UserTransationHistory.jsx'),
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
            <UserTransationHistory />
        </>
    );
};

export default Index;
