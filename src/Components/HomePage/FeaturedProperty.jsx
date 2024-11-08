"use client"
import React from 'react'
import VerticalCard from '../Cards/VerticleCard'
import Link from 'next/link'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import VerticalCardSkeleton from '../Skeleton/VerticalCardSkeleton'
import { translate } from '@/utils'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
// import required modules
import { FreeMode, Grid, Pagination } from "swiper/modules";
const FeaturedProperty = ({ getFeaturedListing, isLoading, language, nearbyCityData, handleImageLoaded }) => {

    const breakpoints = {
        0: {
            slidesPerView: 1.1,
        },
        375: {
            slidesPerView: 1.5,
        },
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2.5,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        },
        1400: {
            slidesPerView: 4,
        },
    };

    return (
        <>
            {isLoading ? (
                <section id="feature" style={{ paddingTop: nearbyCityData && nearbyCityData?.length > 0 ? "80px" : "0px", paddingBottom: nearbyCityData && nearbyCityData?.length > 0 ? "80px" : "0px" }}>
                    <div className="container">
                        <div id="main_features" className="py-3">
                            <div>
                                <div className="feature_header">
                                    <span className="headline">
                                        {translate("dicoverOurFeaturedListing")}
                                    </span>
                                    <div className="rightside_header">
                                        {getFeaturedListing.length > 8 ? (
                                            <Link href="/featured-properties">
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
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mobile-headline-view">
                                    <MobileHeadline
                                        data={{
                                            text: translate("dicoverOurFeaturedListing"),
                                            link: getFeaturedListing.length > 8 ? "/featured-properties" : "",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ rowGap: "20px" }}>

                            <Swiper
                                slidesPerView={2}
                                freeMode={true}
                                spaceBetween={30}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Pagination, FreeMode]}
                                breakpoints={breakpoints}
                            >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <SwiperSlide>
                                        <div className="loading_data">
                                            <VerticalCardSkeleton />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>
                    </div>
                </section>
            ) : (

                <section id="feature" style={{ paddingTop: nearbyCityData && nearbyCityData?.length > 0 ? "80px" : "0px" }}>
                    <div className="container">
                        {getFeaturedListing && getFeaturedListing.length > 0 ? (
                            <div id="main_features">
                                <div>
                                    <div className="feature_header">
                                        <span className="headline">
                                            {translate("discoverOur")} <span className="">{translate("featured")}</span> {translate("listings")}
                                        </span>
                                        <div className="rightside_header">
                                            {getFeaturedListing.length > 8 ? (
                                                <Link href="/featured-properties">
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
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="mobile-headline-view">
                                        <MobileHeadline
                                            data={{
                                                text: translate("dicoverOurFeaturedListing"),
                                                link: getFeaturedListing.length > 8 ? "/featured-properties" : "",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="feature-section-cards">
                                    <Swiper
                                        slidesPerView={2}
                                        freeMode={true}
                                        spaceBetween={30}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        modules={[Pagination, FreeMode]}
                                        breakpoints={breakpoints}
                                    >
                                        {getFeaturedListing.map((ele, index) => (
                                            <SwiperSlide key={index}>
                                                <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                    <VerticalCard ele={ele} />
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                </section>
            )}
        </>
    )
}

export default FeaturedProperty
