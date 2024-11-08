"use client"
import React from 'react'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import Link from 'next/link'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { translate } from '@/utils';
import VerticalCardSkeleton from '../Skeleton/VerticalCardSkeleton';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import UserRecommendationCard from '../Cards/UserRecommendationCard';

const UserRecommendationProperty = ({ isLoading, language, userRecommendationData, breakpointsMostFav }) => {
    return (
        <div>
            {isLoading ? (
                // Show skeleton loading when data is being fetched
                <section id="personalize_feed">
                    <div className="container">
                        <div className="personalize_feed_header">
                            <h3 className="headline">
                                <span className="">
                                    {" "} {translate("personalizeFeed")}
                                </span>
                                {" "}
                            </h3>
                        </div>
                        <div className="mobile-headline-view">
                            <MobileHeadline
                                data={{
                                    text: translate("personalizeFeed"),
                                    link: "",
                                }}
                            />
                        </div>
                        <div id="personalize_feed_properties" dir={language.rtl === 1 ? "rtl" : "ltr"}>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                freeMode={true}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[FreeMode, Pagination]}
                                className="personalize_feed_swiper"
                                breakpoints={breakpointsMostFav}
                            >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <SwiperSlide key={index}>
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
                // Check if userRecommendationData exists and has valid data
                userRecommendationData && userRecommendationData.length > 0 ? (
                    <section id="personalize_feed">
                        <div className="container">
                            <div className="personalize_feed_header">
                                <h3 className="headline">
                                    <span className="">
                                        {" "} {translate("personalizeFeed")}
                                    </span>
                                </h3>
                                <div className="rightside_personalize_feed">
                                    {userRecommendationData.length > 4 ?
                                        <Link href="/all-personalized-feeds">
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
                                        : null}
                                </div>
                            </div>
                            <div className="mobile-headline-view">
                                <MobileHeadline
                                    data={{
                                        text: translate("personalizeFeed"),
                                        link: userRecommendationData.length > 4 ? "/all-personalized-feeds" : "",
                                    }}
                                />
                            </div>
                            <div id="personalize_feed_properties" dir={language.rtl === 1 ? "rtl" : "ltr"}>
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    freeMode={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[FreeMode, Pagination]}
                                    className="personalize_feed_swiper"
                                    breakpoints={breakpointsMostFav}
                                >
                                    {userRecommendationData.map((ele, index) => (
                                        <SwiperSlide id="most-view-swiper-slider" key={index}>
                                            <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                <UserRecommendationCard ele={ele} />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </section>
                ) : null
            )}
        </div>
    )
}

export default UserRecommendationProperty
