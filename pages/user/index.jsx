"use client"
import React from "react";
// import DashboardContent from "../../src/Components/DashboardContent/DashboardContent.jsx";
import dynamic from 'next/dynamic'

const DashboardContent = dynamic(
  () => import('../../src/Components/DashboardContent/DashboardContent.jsx'),
  { ssr: false })
const Index = () => {
    return (
        <>
            <DashboardContent />
        </>
    );
};

export default Index;