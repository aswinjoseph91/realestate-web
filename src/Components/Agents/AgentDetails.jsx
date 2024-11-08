"use client"
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiPhoneCall } from "react-icons/fi";
import { RiMailSendLine } from "react-icons/ri";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import Link from "next/link";
import { languageData } from "@/store/reducer/languageSlice";
import { useSelector } from "react-redux";
import Image from "next/image";
import Layout from "../Layout/Layout";
import { useRouter } from "next/router";
import { getAgentPropertyApi } from "@/store/actions/campaign";
import VerticalCard from "../Cards/VerticleCard";
import { BadgeSvg, placeholderImage, translate, truncate } from "@/utils";
import fb from '../../assets/Images/fb.svg'
import insta from '../../assets/Images/insta.svg'
import twitter from '../../assets/Images/twitter.svg'
import youtube from '../../assets/Images/youtube.svg'
import ProjectCard from "../Cards/ProjectCard";
import VerticalCardSkeleton from "../Skeleton/VerticalCardSkeleton";
import ProjectCardSkeleton from "../Skeleton/ProjectCardSkeleton";
import { getIsProject } from "@/store/reducer/momentSlice";
import NoData from "../NoDataFound/NoData";

const AgentDeatils = () => {
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const router = useRouter()
    const slug = router?.query?.slug
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState();
    const [agentData, setAgentData] = useState({});
    const isProjectActive = useSelector(getIsProject)
    const [agentProperty, setAgentProperty] = useState([]);
    const [agentProject, setAgentProject] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(isProjectActive ? "projects" : "properties");
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };
    const fetchAgentProerties = () => {
        setIsLoading(true)
        try {
            getAgentPropertyApi({
                slug_id: slug,
                onSuccess: (res) => {
                    setIsLoading(false)
                    setAgentData(res?.data?.customer_data)
                    setAgentProperty(res?.data?.properties_data)
                    setTotal(res?.total)

                },
                onError: (error) => {
                    console.log(error)
                    setIsLoading(false)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAgentProjects = () => {
        setIsLoading(true)
        try {
            getAgentPropertyApi({
                slug_id: slug,
                is_projects: 1,
                onSuccess: (res) => {
                    setIsLoading(false)
                    setAgentData(res?.data?.customer_data)
                    setAgentProject(res?.data?.projects_data)
                    setTotal(res?.total)

                },
                onError: (error) => {
                    console.log(error)
                    setIsLoading(false)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (slug) {
            if (selectedCategory === "properties") {
                fetchAgentProerties()
            } else {
                fetchAgentProjects()
            }

        }
    }, [slug, selectedCategory])


    return (
        <Layout>
            <section id="agentDetailsSect">
                {console.log("agentData", agentData)}
                <Breadcrumb title={translate("agentDetails")} />
                <div className="agentContainer container">
                    <div className="row mt-3 agentDetailsDiv3">
                        <div className="col-12 col-md-12 col-lg-3">
                            <div className="card" id="owner-deatils-card">
                                <div className="card-header" id="card-owner-header">
                                    <div className="agent_img_div">
                                        <Image loading="lazy" width={200} height={200} src={agentData?.profile} className="owner-img" alt="no_img" onError={placeholderImage} />

                                    </div>
                                    <div className="owner-deatils">
                                        <div className="verified-owner">
                                            <span className="owner-name">{truncate(agentData?.name, 30)}</span>
                                            {agentData?.is_verify &&
                                                <span >{BadgeSvg}</span>
                                            }
                                        </div>
                                        <div className="socialIcons">
                                            {agentData?.facebook_id &&
                                                <Link href={agentData?.facebook_id}>
                                                    <button>
                                                        <Image src={fb} width={0} height={0} alt="fb" onError={placeholderImage} />
                                                    </button>
                                                </Link>
                                            }
                                            {agentData?.instagram_id &&
                                                <Link href={agentData?.instagram_id}>
                                                    <button>
                                                        <Image src={insta} width={0} height={0} alt="fb" onError={placeholderImage} />
                                                    </button>
                                                </Link>
                                            }
                                            {agentData?.twitter_id &&
                                                <Link href={agentData?.twitter_id}>
                                                    <button>
                                                        <Image src={twitter} width={0} height={0} alt="fb" onError={placeholderImage} />
                                                    </button>
                                                </Link>
                                            }
                                            {agentData?.youtube_id &&
                                                <Link href={agentData?.youtube_id}>
                                                    <button>
                                                        <Image src={youtube} width={0} height={0} alt="fb" onError={placeholderImage} />
                                                    </button>
                                                </Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {agentData?.address &&

                                        <div className="owner-contact">
                                            <div>
                                                <CiLocationOn id="mail-o" size={60} />
                                            </div>
                                            <div className="deatilss">
                                                <span className="o-d"> {translate("location")}</span>
                                                <span className="value">{agentData?.address}</span>
                                            </div>
                                        </div>
                                    }
                                    {agentData?.mobile &&
                                        <a href={`tel:${agentData && agentData?.mobile}`} target="_blank">

                                            <div className="owner-contact">
                                                <div>
                                                    <FiPhoneCall id="call-o" size={60} />
                                                </div>
                                                <div className="deatilss">
                                                    <span className="o-d"> {translate("call")}</span>
                                                    <span className="value">{agentData?.mobile}</span>
                                                </div>
                                            </div>
                                        </a>
                                    }
                                    {agentData?.mobile &&
                                        <a href={`mailto:${agentData && agentData?.email}`} target="_blank">
                                            <div className="owner-contact">
                                                <div>
                                                    <RiMailSendLine id="chat-o" size={60} />
                                                </div>
                                                <div className="deatilss">
                                                    <span className="o-d"> {translate("mail")}</span>
                                                    <span className="value">{agentData?.email}</span>
                                                </div>
                                            </div>
                                        </a>
                                    }



                                </div>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-9">
                            <div className="row aboutOwnerRow2">
                                <div>
                                    {agentData?.about_me && (
                                        <div className="aboutOwner card">
                                            <span className="ownerNameSpan">
                                                {translate("about")} <span id="ownerName">{translate("agent")}</span>
                                            </span>
                                            <p>
                                                {isExpanded ? agentData?.about_me : `${agentData?.about_me.substring(0, 300)}...`}
                                            </p>
                                            <span className="readMore" onClick={toggleReadMore} style={{ cursor: 'pointer' }}>
                                                {isExpanded ? (
                                                    <>
                                                        {translate("showless")} <AiFillCaretUp />
                                                    </>
                                                ) : (
                                                    <>
                                                        {translate("showMore")} <AiFillCaretDown />
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-12 col-md-12 col-lg-12">
                                    <div className="all-prop-rightside">
                                        <div className="card sortby_header">
                                            <div className="card-body" id="all-prop-headline-card">
                                                <div className="proprty_projects">
                                                    {/* {agentProperty && agentProperty?.length > 0 && */}
                                                    <button className={`${selectedCategory === "properties" ? "active" : ""}`} onClick={() => setSelectedCategory("properties")}>{translate("properties")}</button>
                                                    {/* } */}
                                                    {/* {agentProject && agentProject?.length > 0 && */}
                                                    <button className={`${selectedCategory === "projects" ? "active" : ""}`} onClick={() => setSelectedCategory("projects")}>{translate("projects")}</button>
                                                    {/* } */}
                                                </div>
                                                {selectedCategory === "properties" ? (
                                                    <div className="total">
                                                        <span>{total > 0 && `${total} ${total > 1 ? translate("proertiesFound") : translate("proertyFound")}`}</span>
                                                    </div>
                                                ) : (
                                                    <div className="total">
                                                        <span>{total > 0 && `${total} ${total > 1 ? translate("projectsfound") : translate("projectfound")}`}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {selectedCategory === "properties" ? (

                                            <div id="columnCards">
                                                <div className="row" id="all-prop-col-cards">
                                                    {isLoading
                                                        ? Array.from({ length: 6 }).map((_, index) => (
                                                            <div className="col-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <VerticalCardSkeleton />
                                                            </div>
                                                        ))
                                                        :
                                                        agentProperty?.map((ele) => (
                                                            <div className="col-12 col-md-6 col-lg-4">
                                                                <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                                    <VerticalCard ele={ele} />
                                                                </Link>
                                                            </div>
                                                        ))}
                                                </div>
                                                {agentProperty.length === 0 &&
                                                    <div className="col-12">
                                                        <NoData />
                                                    </div>
                                                }
                                            </div>
                                        ) : (
                                            <div id="columnCards">
                                                <div className="row" id="all-prop-col-cards">
                                                    {isLoading
                                                        ? Array.from({ length: 6 }).map((_, index) => (
                                                            <div className="col-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <ProjectCardSkeleton />
                                                            </div>
                                                        ))
                                                        :
                                                        agentProject?.map((ele) => (
                                                            <div className="col-12 col-md-6 col-lg-4">
                                                                <Link href="/project-details/[slug]" as={`/project-details/${ele.slug_id}`} passHref>
                                                                    <ProjectCard ele={ele} />
                                                                </Link>
                                                            </div>
                                                        ))}
                                                </div>
                                                {agentProject.length === 0 &&
                                                    <div className="col-12">
                                                        <NoData />
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout >
    );
};

export default AgentDeatils;
