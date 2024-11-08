"use client"
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

const PaymentCheck = () => {

    const router = useRouter()
    const slug = router?.query?.slug

    useEffect(() => {
        if (slug === "success") {
            router.push('/')
            toast.success("Payment Done Successfully")
        } else if (slug === "fail") {
            router.push('/subscription-plan')
            toast.error("Payment Failed")
        }
    }, [router])

    return (
        <>

        </>
    )
}

export default PaymentCheck
