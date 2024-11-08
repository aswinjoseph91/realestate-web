"use client"
import React from 'react'
import dynamic from "next/dynamic.js";
const PaymentCheck = dynamic(() => import('@/Components/SubcriptionPlan/PaymentCheck'), { ssr: false })
const index = () => {
    return (
        <>
            <PaymentCheck />
        </>
    )
}

export default index
