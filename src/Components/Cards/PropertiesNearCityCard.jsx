"use client"
import { placeholderImage, translate } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { GoArrowUpLeft, GoArrowUpRight } from 'react-icons/go'

const PropertiesNearCityCard = ({ data, language }) => {
    return (
        <Link href={`/properties/city/${data?.City}`}>
            <div className="card city_card">
                <div className="city_card_img">
                    <Image src={data?.image} alt={data?.City} width={0} height={0} onError={placeholderImage} />
                    <div className="city_details">
                        <div className='city_name_count'>
                            <span className='title'>{data?.City}</span>
                            <span className='count'>{data?.Count} {translate("properties")}</span>
                        </div>
                        <div className="arrow">
                            {language?.rtl === 1 ?(
                                <GoArrowUpLeft size={24} />
                            ):(
                                <GoArrowUpRight size={24} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PropertiesNearCityCard
