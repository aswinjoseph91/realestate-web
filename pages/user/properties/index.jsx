"use client"

import React from "react";
// import UserAddProperty from '@/Components/User/UserAddProperty.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserAddProperty = dynamic(
  () => import('@/Components/User/UserAddProperty.jsx'),
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
            <UserAddProperty />
        </>
    );
};

export default Index;
