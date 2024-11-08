"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetFavPropertyApi } from "@/store/actions/campaign";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import VerticalCard from "@/Components/Cards/VerticleCard";
import Link from "next/link";
import { languageData } from "@/store/reducer/languageSlice";
import Pagination from "@/Components/Pagination/ReactPagination";
import { translate } from "@/utils";
import NoData from "@/Components/NoDataFound/NoData";
import dynamic from "next/dynamic.js";
import TablePagination from "../Pagination/TablePagination.jsx";
import ReactPagination from "@/Components/Pagination/ReactPagination";
const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })


const UserFavProperties = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [getFavProp, setGetFavProp] = useState([]);
    const [offsetdata, setOffsetdata] = useState(0);
    const limit = 8;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    useEffect(() => {
        GetFavPropertyApi(
            offsetdata.toString(),
            limit.toString(),
            (response) => {
                setTotal(response.total);
                const favPropData = response.data;
                setIsLoading(false);
                setGetFavProp(favPropData);
                updateIndices(offsetdata, response.total);
            },
            (error) => {
                console.log(error);
            }
        );
    }, [offsetdata]);

    const removeCard = (cardId) => {
        const updatedFavProp = getFavProp.filter((ele) => ele.id !== cardId);
        setGetFavProp(updatedFavProp);
    };

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        updateIndices(newOffset, total);
        window.scrollTo(0, 0);
    };
    const updateIndices = (newOffset, total) => {
        const newStartIndex = total > 0 ? newOffset * limit + 1 : 0;
        const newEndIndex = Math.min((newOffset + 1) * limit, total);
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
    };

    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("fav")}</h3>
                </div>
                <div className="fav_card">
                    <div className="row">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <VerticalCardSkeleton />
                                </div>
                            ))
                        ) : (
                            <>
                                {getFavProp?.length > 0 ? (
                                    <>
                                        {getFavProp?.map((ele, index) => (
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={index}>
                                                <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                    <VerticalCard ele={ele} removeCard={removeCard} />
                                                </Link>
                                            </div>
                                        ))}
                                        {total > limit ? (
                                            <div className="col-12">
                                                <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} s />
                                            </div>
                                        ) : null}
                                    </>
                                ) : (

                                    <div className="col-sm-12">
                                        <div className="noDataFoundDiv">
                                            <NoData />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserFavProperties;
