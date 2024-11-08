"use client"
import { store } from "@/store/store";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const MobileHeadline = (props) => {
    const { data } = props;
    const language = store.getState().Language.languages;
    return (
        <>
            <div className="container">
                <div id="mobile-headlines">
                    <div className="main-headline">
                        <span className="headline">
                            {data?.text}
                        </span>
                    </div>
                    <div>
                        {data?.link !== "" &&
                            <Link href={data?.link}>
                                <button className="mobileViewArrow">
                                    {language.rtl === 1 ?
                                        <IoIosArrowBack size={25} /> :
                                        <IoIosArrowForward size={25} />
                                    }
                                </button>
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileHeadline;
