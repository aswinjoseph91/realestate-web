"use client"
import React from "react";
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserVerificationForm = dynamic(
  () => import('@/Components/User/UserVerificationForm.jsx'),
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
            <UserVerificationForm />
        </>
    );
};

export default Index;
