"use client"
import React from "react";
import SomthingWent from "../../../public/something_went_wrong.svg";
import { placeholderImage, translate } from "@/utils";
import Image from "next/image";

const SomthingWentWrong = () => {
    return (
        <div className="col-12 text-center">
            <div>
                <Image loading="lazy" src={SomthingWent?.src} alt="no_img" width={200} height={200}  onError={placeholderImage}/>
            </div>
            <div className="no_data_found_text">
                <h3>{translate("oppsSomthingWentWrong")}</h3>
                {/* <span>{translate("noDatatext")}</span> */}
            </div>
        </div>
    );
};

export default SomthingWentWrong;
