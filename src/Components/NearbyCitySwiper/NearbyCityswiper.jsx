"use client";
import React, { useEffect, useState, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import VerticalCard from "../Cards/VerticleCard";
import MobileHeadline from "../MobileHeadlines/MobileHeadline";

import { store } from "@/store/store";
import { translate } from "@/utils";
import Link from "next/link";

const NearbyCityswiper = ({ data, userCurrentLocation, NearByBreakpoints }) => {


    const language = store.getState().Language.languages;

    return (
        <div id="similer-properties">
            {data?.length > 0 ? (
                <>
                    <div className="most_fav_header">
                        <div>
                        <span className="headline">
                                {translate("propertiesnearby")} {""}  {userCurrentLocation}
                            </span>
                        </div>
                        {data.length > 4 ? (
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
                        ) : null}
                    </div>
                    <div className="mobile-headline-view">
                        <MobileHeadline
                            data={{
                                text: `${translate("propertiesnearby")}${userCurrentLocation}`,
                                link: `/properties/city/${userCurrentLocation}`,
                            }}
                        />
                    </div>
                    <div className="nearbycity-swiper-slider">
                        <Swiper
                            dir={language.rtl === 1 ? "rtl" : "ltr"}
                            slidesPerView={4}
                            spaceBetween={16}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className="nearbycity-swiper"
                            breakpoints={NearByBreakpoints}
                        >
                            {data.map((ele, index) => (
                                <SwiperSlide id="similer-swiper-slider" key={index}>
                                    <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                        <VerticalCard ele={ele} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </div>
                </>
            ) : null}
        </div>
    );
};

export default NearbyCityswiper;
