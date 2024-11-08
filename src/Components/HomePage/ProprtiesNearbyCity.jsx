"use client"
import Image from 'next/image'
import React from 'react'
import MobileHeadline from '../MobileHeadlines/MobileHeadline'
import NearByCitysSkeleton from '../Skeleton/NearByCitysSkeleton'
import { placeholderImage, translate } from '@/utils'

import { Swiper, SwiperSlide } from "swiper/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import Link from 'next/link'
import PropertiesNearCityCard from '../Cards/PropertiesNearCityCard'

const ProprtiesNearbyCity = ({ isLoading, getNearByCitysData, language }) => {


    const breakpoints = {
        0: { slidesPerView: 1 },
        320: { slidesPerView: 1 },
        375: { slidesPerView: 1 },
        576: { slidesPerView: 1.5 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
        1400: { slidesPerView: 4 },
    };


    return (
        <div>
            {isLoading ? (
                // Show skeleton UI when data is being fetched
                <section id="main_citySection">
                    <div className="container">
                        <div className="prop_city_header">
                            <h3 className="headline">
                                {translate("properties")}{" "}
                                <span>
                                    <span className=""> {translate("nearby")}</span>
                                </span>{" "}
                                {translate("cities")}
                            </h3>
                        </div>
                        <div className="mobile-headline-view">
                            <MobileHeadline
                                data={{
                                    text: translate("propertiesNearbyCities"),
                                    link: getNearByCitysData.length > 6 ? "/properties-nearby-city" : "",
                                }}
                            />
                        </div>
                        <div className="row" id="nearBy-Citys">
                            {/* {Array.from({ length: 6 }).map((_, index) => ( */}
                            <div className="col-12" >
                                <div className="loading_data">
                                    <NearByCitysSkeleton />
                                </div>
                            </div>
                            {/* ))} */}
                        </div>
                    </div>
                </section>
            ) : (
                // Check if getNearByCitysData exists and has valid data
                getNearByCitysData && getNearByCitysData.length > 0 ? (
                    <section id="main_citySection">
                        <div className="container">
                            <div className="prop_city_header">
                                <h3 className="headline">
                                    {translate("properties")}{" "}
                                    <span>
                                        <span className=""> {translate("nearby")}</span>
                                    </span>{" "}
                                    {translate("cities")}
                                </h3>
                                <div className="rightside_prop_city_header">
                                    {getNearByCitysData.length > 6 ?
                                        <Link href="/properties-nearby-city">
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
                                        text: translate("propertiesNearbyCities"),
                                        link: getNearByCitysData.length > 6 ? "/properties-nearby-city" : "",
                                    }}
                                />
                            </div>
                            {/* <div className="row" id="nearBy-Citys">
                                {getNearByCitysData?.length > 5 ? (
                                    <>
                                        <div className="col-12 col-md-6 col-lg-3" id="city_img_div">
                                            <Link href={`/properties/city/${getNearByCitysData[1]?.City}`}>
                                                <div className="card bg-dark text-white mb-3" id="group_card">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[1]?.image}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        width={200}
                                                        height={200}
                                                        onError={placeholderImage}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[1]?.City}</h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[1]?.Count} {translate("properties")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3" id="city_img_div">
                                            <Link href={`/properties/city/${getNearByCitysData[2]?.City}`}>
                                                <div className="card bg-dark text-white mb-3" id="group_card">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[2]?.image}
                                                        onError={placeholderImage}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        width={200}
                                                        height={200}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[2]?.City}</h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[2]?.Count} {translate("properties")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-lg-6" id="city_image_main_div">
                                            <Link href={`/properties/city/${getNearByCitysData[0]?.City}`}>
                                                <div className="card bg-dark text-white mb-3" id="cityImgTop">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[0]?.image}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        width={200}
                                                        height={200}
                                                        onError={placeholderImage}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[0]?.City} </h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[0]?.Count} {translate("properties")}{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-lg-6" id="city_image_main_div">
                                            <Link href={`/properties/city/${getNearByCitysData[5]?.City}`}>
                                                <div className="card bg-dark text-white" id="cityImgTop">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[5]?.image}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        onError={placeholderImage}
                                                        width={200}
                                                        height={200}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[5]?.City} </h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[5]?.Count} {translate("properties")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3" id="city_img_div01">
                                            <Link href={`/properties/city/${getNearByCitysData[3]?.City}`}>
                                                <div className="card bg-dark text-white" id="group_card">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[3]?.image}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        width={200}
                                                        height={200}
                                                        onError={placeholderImage}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[3]?.City}</h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[3]?.Count} {translate("properties")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3" id="city_img_div01">
                                            <Link href={`/properties/city/${getNearByCitysData[4]?.City}`}>
                                                <div className="card bg-dark text-white " id="group_card">
                                                    <Image
                                                        loading="lazy"
                                                        src={getNearByCitysData && getNearByCitysData[4]?.image}
                                                        className="card-img"
                                                        alt="no_img"
                                                        id="TopImg"
                                                        width={200}
                                                        height={200}
                                                        onError={placeholderImage}
                                                    />
                                                    <div className="card-img-overlay">
                                                        <div id="city_img_headlines">
                                                            <h4 className="card-title">{getNearByCitysData && getNearByCitysData[4]?.City}</h4>
                                                            <p className="card-text">
                                                                {getNearByCitysData && getNearByCitysData[4]?.Count} {translate("properties")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {getNearByCitysData?.slice(0, 4).map((ele, index) => (
                                            <div className="col-12 col-md-6 col-lg-3" id="city_img_div" key={index}>
                                                <Link href={`/properties/city/${ele?.City}`}>
                                                    <div className="card bg-dark text-white mb-3" id="group_card">
                                                        <Image
                                                            loading="lazy"
                                                            src={ele?.image}
                                                            className="card-img"
                                                            alt="no_img"
                                                            id="TopImg"
                                                            width={200}
                                                            height={200}
                                                            onError={placeholderImage}
                                                        />
                                                        <div className="card-img-overlay">
                                                            <div id="city_img_headlines">
                                                                <h4 className="card-title">{ele?.City}</h4>
                                                                <p className="card-text">
                                                                    {ele?.Count} {translate("properties")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div> */}
                            <div id="nearBy-Citys">
                                <Swiper
                                    dir={language.rtl === 1 ? "rtl" : "ltr"}
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    freeMode={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[FreeMode, Pagination]}
                                    className="properties-city-swiper"
                                    breakpoints={breakpoints}
                                >
                                    {getNearByCitysData.map((ele, index) => (
                                        <SwiperSlide id="swiper-slider" key={index}>
                                            <PropertiesNearCityCard data={ele} language={language}/>
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

export default ProprtiesNearbyCity
