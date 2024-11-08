"use client"

import React from "react";
// import UserProjects from '@/Components/User/UserProjects.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserProjects = dynamic(
  () => import('@/Components/User/UserProjects.jsx'),
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
            <UserProjects />
        </>
    );
};

export default Index;
