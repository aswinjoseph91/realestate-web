"use client"
import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import VerticalCard from "../Cards/VerticleCard";
import VerticalCardSkeleton from "../Skeleton/VerticalCardSkeleton";
import Link from "next/link";
import { getAllprojectsApi } from "@/store/actions/campaign";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { store } from "@/store/store";
import { translate } from "@/utils";
import ProjectCard from "../Cards/ProjectCard";
import Swal from "sweetalert2";
import { settingsData } from "@/store/reducer/settingsSlice";
import ProjectCardSkeleton from "../Skeleton/ProjectCardSkeleton";
import LoginModal from "../LoginModal/LoginModal";

const SimilerProjectSlider = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [getSimilerData, setSimilerData] = useState();
    const [showModal, setShowModal] = useState(false);

    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const router = useRouter();
    const ProjectSlug = router.query;

    useEffect(() => {
        setIsLoading(true);
        getAllprojectsApi({
            slug_id: ProjectSlug.slug,
            get_similar:"1",
            onSuccess: (response) => {
              const ProjectData = response && response?.data;
              setIsLoading(false);
              setSimilerData(ProjectData);
    
            },
            onError: (error) => {
              setIsLoading(false);
              console.log(error);
            }
          }
          );
    }, [isLoggedIn, ProjectSlug]);

    const breakpoints = {
        320: {
            slidesPerView: 1,
        },
        375: {
            slidesPerView: 1.5,
        },
        576: {
            slidesPerView: 1.5,
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
            slidesPerView: 4,
        },
    };
    const settingData = useSelector(settingsData);
    const isPremiumUser = settingData && settingData.is_premium;
    const isSubscription = settingData && settingData.subscription;
    const language = store.getState().Language.languages;
    
    const handlecheckPremiumUser = (e, slug_id) => {
        e.preventDefault()
        if (userCurrentId) {
            if (isPremiumUser) {
                router.push(`/project-details/${slug_id}`)
            } else {
                Swal.fire({
                    title : translate("opps"),
                    text: translate("notPremiumUser"),
                    icon: "warning",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    customClass: {
                        confirmButton: 'Swal-confirm-buttons',
                        cancelButton: "Swal-cancel-buttons"
                    },
                    confirmButtonText: translate("ok"),
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/")
                    }
                });
            }
        } else {
            Swal.fire({
                title: translate("plzLogFirsttoAccess"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                allowOutsideClick: true,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModal(true)
                }
            });
        }
    }

    return (
        <div div id="similer-properties">
            {getSimilerData?.length > 0 ? (
                <>
                    <div className="similer-headline">
                        <span className="headline">
                            {translate("upcoming")} {" "}
                            <span>
                                <span className=""> {translate("projects")}</span>
                            </span>
                        </span>
                    </div>
                    <div className="similer-prop-slider">
                        <Swiper
                            dir={language.rtl === 1 ? "rtl" : "ltr"}
                            slidesPerView={4}
                            spaceBetween={30}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className="similer-swiper"
                            breakpoints={breakpoints}
                        >
                            {isLoading ? (
                                <Swiper
                                    dir={language.rtl === 1 ? "rtl" : "ltr"}
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    freeMode={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[FreeMode, Pagination]}
                                    className="most-view-swiper"
                                    breakpoints={breakpoints}
                                >
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <SwiperSlide>
                                            <div className="loading_data">
                                                <ProjectCardSkeleton />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                getSimilerData &&
                                getSimilerData.map((ele, index) => (
                                    <SwiperSlide id="similer-swiper-slider" key={index} onClick={(e) => handlecheckPremiumUser(e, ele.slug_id)} >
                                        <ProjectCard ele={ele} />
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>
                    </div>
                </>
            ) : null}
             {showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </div>
    );
};

export default SimilerProjectSlider;
