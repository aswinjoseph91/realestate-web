"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { FiEye } from 'react-icons/fi'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import { translate } from '@/utils'
import CustomCategorySkeleton from '../Skeleton/CustomCategorySkeleton'
import CategoryCard from '../Cards/CategoryCard'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

const HomeCategory = ({ isLoading, categoryData, language, breakpoints }) => {
    return (
        <div>
            {isLoading ? (
                <section id="apartments" style={{ padding: "50px" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-3" id="browse-by-agents">
                                <div className="browse-agent">
                                    <span>{translate("exploreApartment")}</span>
                                    <Link href="/all-categories">
                                        <button className="mt-3">
                                            <FiEye className="mx-2" size={25} />
                                            {translate("viewAllCategories")}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="mobile-headline-view">
                                <MobileHeadline
                                    data={{
                                        text: translate("exploreApartment"),
                                        link: "/all-categories",
                                    }}
                                />
                            </div>
                            <div className="col-sm-12 col-md-8 col-lg-9 loading_data" id="all-apart-cards">
                                <Swiper
                                    dir={language.rtl === 1 ? "rtl" : "ltr"}
                                    spaceBetween={30}
                                    slidesPerView={4}
                                    freeMode={true}
                                    modules={[FreeMode]}
                                    className="aprtment-swiper"
                                    breakpoints={breakpoints}
                                >
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <SwiperSlide key={index}>
                                            <CustomCategorySkeleton />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                categoryData && categoryData.some(ele => ele.properties_count !== 0 && ele.properties_count !== "") ? (
                    <section id="apartments">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-4 col-lg-3" id="browse-by-agents">
                                    <div className="browse-agent">
                                        <span>{translate("exploreApartment")}</span>
                                        <Link href="/all-categories">
                                            <button className="mt-3">
                                                <FiEye className="mx-2" size={25} />
                                                {translate("viewAllCategories")}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mobile-headline-view">
                                    <MobileHeadline
                                        data={{
                                            text: translate("exploreapartmentTypes"),
                                            link: "/all-categories",
                                        }}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-8 col-lg-9" id="all-apart-cards">
                                    <div className="aprt_cards">
                                        <Swiper
                                            dir={language.rtl === 1 ? "rtl" : "ltr"}
                                            spaceBetween={30}
                                            freeMode={true}
                                            pagination={{
                                                clickable: true
                                            }}
                                            modules={[FreeMode, Pagination, Navigation]}
                                            className="aprtment-swiper"
                                            breakpoints={breakpoints}
                                        >
                                            {categoryData.map((ele, index) =>
                                                ele.properties_count !== 0 && ele.properties_count !== "" ? (
                                                    <SwiperSlide id="aprt-swiper-slider" key={index}>
                                                        <Link href={`/properties/categories/${ele.slug_id}`}>
                                                            <CategoryCard ele={ele} />
                                                        </Link>
                                                    </SwiperSlide>
                                                ) : null
                                            )}
                                            {/* <div className="custom-swiper-button-prev">
                                                <BsArrowLeft />
                                            </div>
                                            <div className="custom-swiper-button-next">
                                                <BsArrowRight />
                                            </div> */}
                                        </Swiper>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                ) : null
            )}
        </div>
    )
}

export default HomeCategory