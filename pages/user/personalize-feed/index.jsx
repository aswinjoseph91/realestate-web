"use client"
import React from "react";
// import PersonalizeFeed from '@/Components/User/PersonalizeFeed.jsx'
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const PersonalizeFeed = dynamic(
  () => import('@/Components/User/PersonalizeFeed.jsx'),
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
            <PersonalizeFeed />
        </>
    );
};

export default Index;
