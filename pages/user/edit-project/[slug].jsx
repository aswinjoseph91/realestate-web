"use client"

import React from "react";
// import UserEditProject from '@/Components/User/UserEditProject.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserEditProject = dynamic(
  () => import('@/Components/User/UserEditProject.jsx'),
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
            <UserEditProject />
        </>
    );
};

export default Index;
