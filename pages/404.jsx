"use client"
import React from 'react'
// import NoPageFound from '../src/assets/Images/404.png'
import { translate } from '@/utils'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const NoPageFound = dynamic(
    () => import('../src/assets/Images/404.png'),
    { ssr: false })

const Index = () => {
    return (
        <div className='errorPage'>
            <div className="col-12 text-center">
                <div>
                    <Image loading="lazy" src={NoPageFound.src} alt="404" width={500} height={500} />
                </div>
                <div className='no_page_found_text'>
                    <h3>
                        404
                    </h3>
                    <span>
                        {translate("PagenotFound")}

                    </span>
                </div>
            </div>
        </div>
    )
}

export default Index
