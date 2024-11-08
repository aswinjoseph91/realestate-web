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
import ProjectCardSkeleton from '../Skeleton/ProjectCardSkeleton';
import { translate } from '@/utils';
import { IoIosArrowForward } from 'react-icons/io';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProjectCard from '../Cards/ProjectCard';

const Projects = ({ isLoading, isPremiumUser, language, getProjects, breakpointsProjects, handlecheckPremiumUser }) => {
    return (
        <div>
            {isLoading ? (
                // Show skeleton loading when data is being fetched
                <section id="upcoming_projects" style={{ marginBottom: !isPremiumUser ? '100px' : '0' }}>
                    <div className="container">
                        <div className="project_header">
                            <h3 className="headline">
                                {translate("upcoming")}{" "}
                                <span>
                                    <span className=""> {translate("projects")}</span>
                                </span>{" "}
                            </h3>
                        </div>
                        <div className="mobile-headline-view-project">
                            <div id="mobile_headline_projects">
                                <div className="main_headline_projects">
                                    <span className="headline">
                                        {translate("upcoming")}{" "}
                                        <span>
                                            <span className=""> {translate("projects")}</span>
                                        </span>{" "}
                                    </span>
                                </div>
                                <div>
                                    <button className="mobileViewArrowProject">
                                        <IoIosArrowForward size={25} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="projects_cards" dir={language.rtl === 1 ? "rtl" : "ltr"}>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                freeMode={true}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[FreeMode, Pagination]}
                                className="all_project_swiper"
                                breakpoints={breakpointsProjects}
                            >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="loading_data">
                                            <ProjectCardSkeleton />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </section>
            ) : (
                // Check if getProjects exists and has valid data
                getProjects && getProjects.length > 0 ? (
                    <section id="upcoming_projects" style={{ marginBottom: !isPremiumUser ? '100px' : '0' }}>
                        <div className="container">
                            <div style={{ paddingTop: "40px" }}>

                                <div className="project_header">
                                    <h3 className="headline">
                                        {translate("upcommingProjects")}{" "}
                                    </h3>
                                    <div className="rightside_project_header">
                                        {getProjects.length > 4 ?
                                            <Link href="/all-projects">
                                                <button className="learn-more-project" id="viewall_projects">
                                                    <span aria-hidden="true" className="circle">
                                                        <div className="icon_div">
                                                            <span className="icon arrow">
                                                                {language.rtl === 1 ? <BsArrowLeft /> : <BsArrowRight />}
                                                            </span>
                                                        </div>
                                                    </span>
                                                    <span className="button-text">{translate("seeAllProjects")}</span>
                                                </button>
                                            </Link>
                                            : null}
                                    </div>
                                </div>
                                <div className="mobile-headline-view-project">
                                    <div id="mobile_headline_projects">
                                        <div className="main_headline_projects">
                                            <span className="headline">
                                                {translate("upcommingProjects")}{" "}
                                               
                                            </span>
                                        </div>
                                        <div>
                                            {getProjects.length > 4 ?
                                                <Link href="/all-projects">
                                                    <button className="mobileViewArrowProject">
                                                        <IoIosArrowForward size={25} />
                                                    </button>
                                                </Link>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div id="projects_cards" dir={language.rtl === 1 ? "rtl" : "ltr"}>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        freeMode={true}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        modules={[FreeMode, Pagination]}
                                        className="all_project_swiper"
                                        breakpoints={breakpointsProjects}
                                    >
                                        {getProjects.map((ele, index) => (
                                            <SwiperSlide id="most-view-swiper-slider" key={index} onClick={(e) => handlecheckPremiumUser(e, ele.slug_id)}>
                                                <ProjectCard ele={ele} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>

                        {!isPremiumUser &&
                            <div className="subscribeForProject">
                                <div className="container">
                                    <div className="card subcribeCard">
                                        <h3>
                                            {translate("ourPremium")}
                                        </h3>
                                        <Link href="/subscription-plan" className="subscribeNoButton">
                                            {translate("subscribeNow")} {""}
                                            {language.rtl === 1 ? (
                                                <FaArrowLeft size={20} />
                                            ) : (
                                                <FaArrowRight size={20} />
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        }

                    </section>
                ) : null
            )}
        </div>
    )
}

export default Projects
