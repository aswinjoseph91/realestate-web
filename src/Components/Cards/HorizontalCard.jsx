"use client"
import { AddFavourite } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { formatPriceAbbreviated, isThemeEnabled, placeholderImage, translate, truncate } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ImageToSvg } from "./ImageToSvg";
import Swal from "sweetalert2";
import LoginModal from "../LoginModal/LoginModal";
import { Tooltip } from "antd";

const HorizontalCard = ({ ele }) => {
    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const isLoggedIn = useSelector((state) => state.User_signup);

    const DummyImgData = useSelector(settingsData);
    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const [isLiked, setIsLiked] = useState(ele.is_favourite === 1);
    const themeEnabled = isThemeEnabled();

    // Initialize isDisliked as false
    const [isDisliked, setIsDisliked] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };


    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoggedIn && isLoggedIn.data && isLoggedIn.data.token) {
            AddFavourite(
                ele.id,
                "1",
                (response) => {
                    setIsLiked(true);
                    setIsDisliked(false);
                    toast.success(response.message);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            Swal.fire({
                title: translate("plzLogFirst"),
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
    };

    const handleDislike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AddFavourite(
            ele.id,
            "0",
            (response) => {
                setIsLiked(false);
                setIsDisliked(true);
                toast.success(response.message);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        // Update the state based on ele.is_favourite when the component mounts
        setIsLiked(ele.is_favourite === 1);
        setIsDisliked(false);
    }, [ele.is_favourite]);
    const validParameters = ele?.parameters.filter(
        (elem) => elem?.value !== "" && elem?.value !== "0"
    ).slice(0, 3);
    return (
        <div className="horizontal_card">
            <div className="card" id="main_prop_card">

                <div className="image_div col-5">
                    <Image loading="lazy" className="card-img" id="prop_card_img" alt="no_img" src={ele?.title_image} width={20} height={20} onError={placeholderImage} />

                    {ele.promoted ? <span className="prop_feature">{translate("feature")}</span> : null}
                    {/* <span className="prop_sell">{translate(ele.property_type)}</span>
                    <span className="prop_price">
                    {CurrencySymbol} {formatPriceAbbreviated(ele.price)}
                    </span> */}
                </div>

                <div className="card-body col-7" id="main_prop_card_body">
                    <span className="prop_like">
                        {isLiked ? (
                            <AiFillHeart size={20} className="liked_property" onClick={handleDislike} />
                        ) : isDisliked ? (
                            <AiOutlineHeart size={20} className="disliked_property" onClick={handleLike} />
                        ) : (
                            <AiOutlineHeart size={20} onClick={handleLike} />
                        )}
                    </span>
                    <div className="first_div">
                        {ele.category &&
                            <div className="prop_card_mainbody">
                                <div className="cate_image">
                                    {themeEnabled ? (
                                        <ImageToSvg imageUrl={ele.category && ele.category.image} className="custom-svg" />
                                    ) : (
                                        <Image loading="lazy" src={ele?.category?.image} alt="no_img" width={20} height={20} onError={placeholderImage} />
                                    )}
                                </div>
                                <span className="body_title"> {ele.category.category} </span>
                            </div>
                        }
                        <div id="prop_card_middletext">
                            <span>{truncate(ele?.title, 40)}</span>
                            <p>
                            {truncate(`${ele?.city ? ele?.city + ', ' : ''}${ele?.state ? ele?.state + ', ' : ''}${ele?.country || ''}`, 20)}
                            </p>
                        </div>
                    </div>
                    {validParameters.length > 0 ? (
                        <div className="category_params">
                            <div className="row">
                                {validParameters.slice(0, 3).map((elem, index) => (
                                    <Tooltip title={Array.isArray(elem?.name) ? elem.name.slice(0, 1).join(', ') : elem?.name}>
                                        <div className="col-lg-3 " key={index}>

                                            <div className="cat_content">
                                                <div className="param_img">
                                                    {themeEnabled ? (
                                                        <ImageToSvg imageUrl={elem?.image && elem?.image} className="custom-svg" />
                                                    ) : (
                                                        <Image loading="lazy" src={elem?.image} alt="no_img" width={0} height={0} onError={placeholderImage} />
                                                    )}
                                                </div>
                                                <div className="param_name">
                                                    <span>
                                                        <span>
                                                            {Array.isArray(elem?.value) ? truncate(elem.value.slice(0, 1).join(', '), 5) : truncate(elem.value, 5)}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    <div className="card-footer" id="prop_card_footer" style={{ height: validParameters.length > 0 ? "auto" : "120px" }}>
                        {ele.property_type && <span className={`${ele?.property_type === "sell" ? "for_sale" : "for_rent"} `}>  {""}{translate(ele.property_type)}</span>}
                        {ele?.price &&
                            <span className="price_tag">
                                <span>
                                    {CurrencySymbol}
                                </span>
                                <span>
                                    {formatPriceAbbreviated(ele?.price)}
                                </span>
                            </span>
                        }
                    </div>
                </div>
            </div>
            {showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </div>
    );
};

export default HorizontalCard;
