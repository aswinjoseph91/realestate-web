"use client"
import React from 'react'
import HorizontalCard from '../Cards/HorizontalCard'
import Link from 'next/link'
import { translate } from '@/utils'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import CustomHorizontalSkeleton from '../Skeleton/CustomHorizontalSkeleton'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
// import required modules
import { FreeMode, Grid, Pagination } from "swiper/modules";
import VerticalCardSkeleton from '../Skeleton/VerticalCardSkeleton'

const MostViewedProperty = ({ isLoading, getMostViewedProp, language }) => {

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        375: {
            slidesPerView: 1.5,
        },
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        },
        1400: {
            slidesPerView: 3,
        },
    };
    return (
        <div>
            {isLoading ? (
                // Skeleton loading state
                <section id="main_properties">
                    <div className="properties_section">
                        <div className="container">
                            <div id="prop">
                                <div className="prop_header">
                                    <div>
                                        <h3 className="headline">
                                            {translate("most")}{" "}
                                            <span>
                                                <span className=""> {translate("viewed")}</span>
                                            </span>{" "}
                                            {translate("properties")}
                                        </h3>
                                    </div>
                                    <div className="rightside_prop_header">
                                        <Link href="/most-viewed-properties">
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
                                </div>
                                <div className="mobile-headline-view">
                                    <MobileHeadline
                                        data={{
                                            text: translate("mostViewedProperties"),
                                            link: "/most-viewed-properties",
                                        }}
                                    />
                                </div>
                                <div className="cards_sec mt-4">
                                    <div className="row" style={{ rowGap: "30px" }}>
                                        <Swiper
                                            slidesPerView={3}
                                            freeMode={true}
                                            spaceBetween={30}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[Pagination, FreeMode]}
                                            breakpoints={breakpoints}
                                        >

                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <SwiperSlide key={index}>
                                                    <VerticalCardSkeleton />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                // Display properties using Swiper
                getMostViewedProp && getMostViewedProp.length > 0 ? (
                    <section id="main_properties">
                        <div className="properties_section">
                            <div className="container">
                                <div id="prop">
                                    <div className="prop_header">
                                        <div>
                                            <h3 className="headline">
                                                {translate("most")}{" "}
                                                <span>
                                                    <span className=""> {translate("viewed")}</span>
                                                </span>{" "}
                                                {translate("properties")}
                                            </h3>
                                        </div>
                                        <div className="rightside_prop_header">
                                            {getMostViewedProp.length > 6 ?
                                                <Link href="/most-viewed-properties">
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
                                                text: translate("mostViewedProperties"),
                                                link: getMostViewedProp.length > 6 ? "/most-viewed-properties" : "",
                                            }}
                                        />
                                    </div>
                                    <Swiper
                                        slidesPerView={3}
                                        freeMode={true}
                                        spaceBetween={30}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        modules={[Pagination, FreeMode]}
                                        breakpoints={breakpoints}
                                    >
                                        {getMostViewedProp.map((ele, index) => (
                                            <SwiperSlide key={index}>
                                                <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                    <HorizontalCard ele={ele} />
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null
            )}
        </div>
    );

}
export default MostViewedProperty
