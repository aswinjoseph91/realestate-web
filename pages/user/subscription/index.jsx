"use client"

import React from "react";
// import UserSubScription from '@/Components/User/UserSubScription.jsx'
import dynamic from "next/dynamic.js";
const UserSubScription = dynamic(() => import('../../../src/Components/User/UserSubScription.jsx'), { ssr: false })

import Meta from "@/Components/Seo/Meta";

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
            <UserSubScription />
        </>
    );
};

export default Index;
