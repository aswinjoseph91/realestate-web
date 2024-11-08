"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { placeholderImage, timeAgo, translate, truncate } from "@/utils";
import Image from "next/image";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";

const ArticleCard = ({ ele, language}) => {
    const stripHtmlTags = (htmlString) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    const systemsettingsData = useSelector(settingsData)


    return (
        <div>
            <Card id="article_main_card">
                <Image loading="lazy" height={0} width={0} variant="top" id="article_card_img" src={ele?.image} alt="no_img" onError={placeholderImage} />
                {ele.category?.category && ele.category?.category ? <span id="apartment_tag">{ele.category?.category}</span> : <span id="apartment_tag">{translate("General")}</span>}
                <Card.Body id="article_card_body">
                    <div id="article_card_headline">
                        <span>{stripHtmlTags(truncate(ele.title, 10))}</span>
                        {ele && ele.description && (
                            <>
                                <p>{stripHtmlTags(truncate(ele.description, 75))}</p>
                                <div id="readmore_article">
                                    <Link href="/article-details/[slug]" as={`/article-details/${ele.slug_id}`} passHref>
                                        <button className="readmore">
                                            {translate("showMore")}
                                            {language?.rtl === 1 ?(
                                                <AiOutlineArrowLeft className="mx-2" size={18} />

                                            ):(
                                                <AiOutlineArrowRight className="mx-2" size={18} />

                                            )}
                                        </button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </Card.Body>
                <Card.Footer id="article_card_footer">
                    <div id="admin_pic">
                        <Image loading="lazy" src={systemsettingsData?.admin_image} alt="no_img" className="admin" width={200} height={200} onError={placeholderImage} />
                    </div>
                    <div className="article_footer_text">
                        <span className="byadmin"> {translate("by")} {systemsettingsData?.admin_name}</span>
                        <p>{timeAgo(ele.created_at)}</p>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default ArticleCard;
