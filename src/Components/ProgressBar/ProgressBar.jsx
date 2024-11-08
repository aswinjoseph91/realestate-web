"use client"
import React from "react";
import { Progress } from "antd";
import { translate } from "@/utils";

function ProgressBar({ usedLimit, totalLimit }) {
    // Calculate the percentage of used limit relative to the total limit
    const progress = (usedLimit / totalLimit) * 100;


    return (
        <div style={{ position: "relative", display: "inline-flex" }}>
            <Progress
                id="progress_bar"
                type="circle"
                percent={totalLimit !== "unlimited" ? progress : 100}
                format={() => null} // Remove the percentage display
                strokeWidth={10} // Adjust the stroke width as needed
               
            />
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                }}
            >
               {totalLimit !== "unlimited" ? (

                   <span className="progress_bar_count">{`${usedLimit} / ${totalLimit}`}</span>
                   ):(
                       <span className="progress_bar_count">{translate("Unlimited")}</span>
                       
                   )
               } 
            </div>
        </div>
    );
}

export default ProgressBar;
