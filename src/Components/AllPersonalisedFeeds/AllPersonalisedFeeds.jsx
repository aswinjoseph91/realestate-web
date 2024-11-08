"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { getUserRecommendationApi } from "@/store/actions/campaign";
import Link from "next/link";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Pagination from "@/Components/Pagination/ReactPagination";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';
import UserRecommendationCard from '../Cards/UserRecommendationCard';


const AllPersonalisedFeeds = () => {

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const [isLoading, setIsLoading] = useState(true);
    const [getFeaturedListing, setGetFeaturedListing] = useState(null);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const limit = 8;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    useEffect(() => {
        setIsLoading(true);
        getUserRecommendationApi({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (res) => {
                setGetFeaturedListing(res.data)
                setTotal(res.total)
                setIsLoading(false);

            },
            onError: (err) => {
                console.log(err)
                setIsLoading(false);

            }
        })
    }, [offsetdata, isLoggedIn]);


    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };

    return (
        <Layout>
            <Breadcrumb title={translate("personalizeFeeds")} />
            <section id="personalize_feed_properties_all">
                {isLoading ? ( // Show Skeleton when isLoading is true
                    <div className="container">
                        <div id="feature_cards" className="row">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <VerticalCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : getFeaturedListing && getFeaturedListing.length > 0 ? (
                    <>
                        <div className="container">
                            <div id="feature_cards" className="row">
                                {getFeaturedListing.map((ele, index) => (
                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={index}>
                                        <Link href={`/properties-details/${ele.slug_id}`} >
                                            <UserRecommendationCard ele={ele} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="noDataFoundDiv">
                        <NoData />
                    </div>
                )}
                {total > limit ? (
                    <div id="feature_cards" className="row">
                        <div className="col-12">
                            <Pagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : null}
            </section>
        </Layout>
    )
}

export default AllPersonalisedFeeds
