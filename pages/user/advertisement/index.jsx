"use client"
import Meta from '@/Components/Seo/Meta'
import React from 'react'
// import UserAdvertisement from '@/Components/User/UserAdvertisement.jsx'
import dynamic from 'next/dynamic'

const UserAdvertisement = dynamic(
  () => import('@/Components/User/UserAdvertisement.jsx'),
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
            <UserAdvertisement />
        </>
    )
}

export default Index
