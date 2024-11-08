"use client"
import React from "react";
import { Card } from "react-bootstrap";
import Image from "next/image";
import { BadgeSvg, placeholderImage, translate, truncate } from "@/utils";

const AgentCard = ({ ele, handlecheckPremiumUserAgent }) => {


    return (
        <Card id="main_agent_card" onClick={(e) => handlecheckPremiumUserAgent(e, ele)}>
            <div className="bgDiv">

                <Card.Body>
                    <div className="agent_card_content">
                        <div className="agent_img_div">
                            <Image loading="lazy" src={ele?.profile ? ele?.profile : placeholderImage} className="agent-profile" width={100} height={100} alt="no_img" onError={placeholderImage} />
                            {ele?.is_verified &&
                                <span className="verified_badge">{BadgeSvg}</span>
                            }
                        </div>
                        <div className="mt-2">
                            <span className="agent-name">{truncate(ele.name, 18)}</span>
                        </div>
                        <div className="view-all-agent" >
                            <div className="count">
                                {ele?.property_count > 0 &&
                                    <div>
                                        <span>{ele?.property_count > 1 ? translate("properties") : translate("property")}</span>
                                        <span>{ele?.property_count}</span>
                                    </div>


                                }
                                {ele?.property_count > 0 && ele?.projects_count > 0 &&
                                    <span className="divider">
                                    </span>
                                }
                                {ele?.projects_count > 0 &&
                                    <div>
                                        <span>{ele?.projects_count > 1 ? translate("projects") : translate("project")}</span>
                                        <span>{ele?.projects_count}</span>
                                    </div>

                                }
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </div>

        </Card >
    );
};

export default AgentCard;