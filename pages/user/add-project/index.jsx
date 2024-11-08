"use client"

import React from "react";
// import UserAddProject from '@/Components/User/UserAddProject.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserAddProject = dynamic(
  () => import('@/Components/User/UserAddProject.jsx'),
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
            <UserAddProject />
        </>
    );
};

export default Index;
