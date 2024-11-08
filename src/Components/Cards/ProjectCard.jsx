"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import { useCallback, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaCrown } from "react-icons/fa";
import { ImageToSvg } from "./ImageToSvg";
import { isThemeEnabled, placeholderImage, translate, truncate } from "@/utils";

const ProjectCard = ({ ele }) => {
    const titleImage = ele.image;
    const galleryImages = ele?.gallary_images ? ele?.gallary_images?.filter(image => typeof image === 'object' && image.hasOwnProperty('name')).map(image => image.name) : [];
    const images = [titleImage, ...galleryImages]?.slice(0, 3);;
    const sliderRef = useRef(null);

    const handlePrev = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);

    const themeEnabled = isThemeEnabled();
    return (
        <div className='project_card'>
            <div className="card project_main_card">
                <div className="card-body">
                    {ele?.category &&
                        <div className="cate_image">
                            {themeEnabled ? (
                                <ImageToSvg imageUrl={ele && ele.category && ele.category.image} className="custom-svg" />
                            ) : (
                                <Image src={ele && ele.category && ele.category.image} alt="no_img" width={20} height={20} onError={placeholderImage} />
                            )}
                            <span className="project_body_title">{ele.category && ele.category.category}</span>
                        </div>
                    }
                    <div className="project_card_middletext">
                        <span>{truncate(ele.title, 40)}</span>
                        <p>
                            {ele.city}{ele.city ? "," : null} {ele.state}{ele.state ? "," : null} {ele.country}
                        </p>
                    </div>
                </div>
                <div className="cardImg_swiper">
                    <Swiper
                        ref={sliderRef}
                        slidesPerView={1}
                        loop={true}
                        spaceBetween={30}
                        freeMode={true}
                        autoplay={false}
                        modules={[FreeMode, Autoplay, Navigation]}
                        className="project-swiper"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="project_img">
                                    <Image src={image} width={0} height={0} alt="images" onError={placeholderImage} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {images && images.length > 1 &&
                        <>
                            <div className="project_next" onClick={handleNext}>
                                <span>
                                    <FaArrowRight size={20} />
                                </span>
                            </div>
                            <div className="project_prev" onClick={handlePrev}>
                                <span>
                                    <FaArrowLeft size={20} />
                                </span>
                            </div>
                        </>
                    }
                    <div className="project_premium_icon">
                        <span>
                            <FaCrown size={20} />
                        </span>
                    </div>
                    <div className="project_type">
                        <span>
                            {ele.type === "upcoming" ? translate("upcoming") : translate("underconstruction")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
