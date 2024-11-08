"use client"

import React from "react";
// import UserFavProperties from '@/Components/User/UserFavProperties.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserFavProperties = dynamic(
  () => import('@/Components/User/UserFavProperties.jsx'),
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
            <UserFavProperties />
        </>
    );
};

export default Index;
