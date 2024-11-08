"use client"
import { translate } from '@/utils'
import Link from 'next/link'
import React from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

const CommanLayoutHeader = () => {
    return (
        <div className="comman_header">
            <span className="headline">
                <span>
                    {translate("properties")}{" "} {translate("nearby")}{" "} {userCurrentLocation}
                </span>
            </span>
            {data?.length > 4 &&
                <div className="rightside_most_fav_header">
                    <Link href={`/properties/city/${userCurrentLocation}`}>
                        <button className="learn-more" id="viewall">
                            <span aria-hidden="true" className="circle">
                                <div className="icon_div">
                                    <span className="icon arrow">
                                        {language.rtl === 1 ? <BsArrowLeft /> : <BsArrowRight />}
                                    </span>
                                </div>
                            </span>
                            <span className="button-text">{translate("seeAllProp")}</span>
                        </button>
                    </Link>
                </div>
            }
        </div>
    )
}

export default CommanLayoutHeader
