"use client"
import { AddFavourite } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { formatPriceAbbreviated, isThemeEnabled, placeholderImage, translate, truncate } from "@/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ImageToSvg } from "../Cards/ImageToSvg";
import LoginModal from "../LoginModal/LoginModal";
import Swal from "sweetalert2";
import { Tooltip } from "antd";
import { store } from "@/store/store";

const AllPropertieCard = ({ ele }) => {
    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const themeEnabled = isThemeEnabled();
    const isLoggedIn = useSelector((state) => state.User_signup);

    // Initialize isLiked based on ele.is_favourite
    const [isLiked, setIsLiked] = useState(ele.is_favourite === 1);

    // Initialize isDisliked as false
    const [isDisliked, setIsDisliked] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const language = store.getState().Language.languages;
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
        <>

                <Card id="all_prop_main_card" className="row" key={ele.id}>
                    <div className="col-md-4 img_div" id="all_prop_main_card_rows_cols">
                        <Image loading="lazy" className="card-img" id="all_prop_card_img" src={ele?.title_image} alt="no_img" width={20} height={20} onError={placeholderImage} />
                        {ele.promoted ? <span className="all_prop_feature">{translate("feature")}</span> : null}

                        {/* <span className="all_prop_sell">{translate(ele.property_type)}</span>
                    <span className="all_prop_price">
                    {CurrencySymbol} {formatPriceAbbreviated(ele.price)}
                    </span> */}
                    </div>
                    <div className="col-md-8" id="all_prop_main_card_rows_cols">
                        <Card.Body id="all_prop_card_body">
                            <span className="all_prop_like">
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
                                    <div id="all_prop_sub_body">
                                        <div className="cate_image">
                                            {themeEnabled ? (
                                                <ImageToSvg imageUrl={ele.category && ele.category.image} className="custom-svg" />
                                            ) : (
                                                <Image loading="lazy" src={ele?.category.image} alt="no_img" width={20} height={20} onError={placeholderImage} />
                                            )}
                                        </div>
                                        <span className="sub_body_title"> {ele.category.category}</span>
                                    </div>
                                }
                                <div id="sub_body_middletext">
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
                                            <Tooltip title={Array.isArray(elem?.name) ? elem.name.slice(0, 1).join(', ') : elem?.name} placement={language.rtl === 1 ? "topRight" : "topLeft"}>
                                                <div className="col-lg-3 parmas_div" key={index}>

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
                            <Card.Footer id="all_prop_card_footer" style={{ height: validParameters.length > 0 ? "auto" : "120px" }}>
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
                            </Card.Footer>
                        </Card.Body>
                    </div>
                </Card>
            {/* </div> */}

            {showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </>

    );
};

export default AllPropertieCard;
