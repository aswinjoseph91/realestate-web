"use client"
import Image from 'next/image'
import React from 'react'
import { formatPriceAbbreviated, isThemeEnabled, placeholderImage } from '@/utils'
import { ImageToSvg } from './ImageToSvg'
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useRouter } from 'next/router';

const MapCard = ({ data, CurrencySymbol }) => {


    const router = useRouter()


    const themeEnabled = isThemeEnabled();
    const viewProperty = (e) => {
        e.preventDefault()
        router.push(`properties-details/${data.slug_id}`)

    }
    return (
        <>
            <div className="verticle_card_map">
                <div className="card verticle_main_card_map">
                    <div className="verticle_card_img_div_map">
                        <Image loading="lazy" className="card-img" id="verticle_card_img_map" src={data?.title_image} alt="no_img" width={200} height={200} onError={placeholderImage} />
                    </div>
                    <div className="card-img-overlay">
                        <span className="sell_tag_map">{data.property_type}</span>
                    </div>

                    <div className="card-body">

                        <div className="feature_card_mainbody">
                            <div className='d-flex align-items-center gap-2'>

                                <div className="cate_image">
                                    {themeEnabled ? (

                                        <ImageToSvg imageUrl={data.category && data.category.image} className="custom-svg" />
                                    ) : (
                                        <Image loading="lazy" src={data?.category} alt="no_img" width={20} height={20} onError={placeholderImage} />
                                    )}

                                </div>
                                <span className="feature_body_title"> {data.category && data.category.category} </span>

                            </div>
                            <div>
                                <span className="price_tag">
                                    {CurrencySymbol} {formatPriceAbbreviated(data.price)}
                                </span>
                            </div>
                        </div>
                        <div className="feature_card_middletext">
                            <span>{data.title}</span>
                            <p>
                                {data.city} {data.city ? "," : null} {data.state} {data.state ? "," : null} {data.country}
                            </p>

                        </div>
                        <div className="view_property_map">
                            <button onClick={viewProperty}>
                                <IoArrowForwardCircleOutline size={25} />
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default MapCard
