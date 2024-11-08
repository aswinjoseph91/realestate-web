import React from "react";
// import UserRegister from "@/Components/UserRegister/UserRegister";
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic'

const UserRegister = dynamic(
  () => import('@/Components/UserRegister/UserRegister'),
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
            <UserRegister />
        </>
    );
};

export default Index;
