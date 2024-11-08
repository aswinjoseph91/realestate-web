"use client"
import React, { useState, useEffect } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { getPropertyListApi } from "@/store/actions/campaign";
import Link from "next/link";
import VerticalCard from "@/Components/Cards/VerticleCard";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';


const MostViewProperties = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [propertyData, setPropertyData] = useState([]);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load
    const limit = 8;
    const isLoggedIn = useSelector((state) => state.User_signup);

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
  
    const fetchProperty = () => {
        setIsLoading(true)
        try {
            getPropertyListApi({
                most_viewed: 1,
                limit: limit.toString(),
                offset: offsetdata.toString(),
                onSuccess: (response) => {
                    const MostViewedData = response.data;
                    setIsLoading(false);
                    // Append data only if "Load More" is clicked (i.e., offset > 0)
                    if (offsetdata > 0) {
                        setPropertyData(prevData => [...prevData, ...MostViewedData]); // Append new data to the existing data
                    } else {
                        // If it's the initial load (i.e., offset === 0), replace the data
                        setPropertyData(MostViewedData);
                    }

                    setHasMoreData(MostViewedData.length === limit);
                },
                onError: (error) => {
                    setIsLoading(true);
                    console.log(error);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchProperty()
    }, [offsetdata, isLoggedIn])
    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
    };

    return (
        <Layout>
            <Breadcrumb title={translate("mostViewedProp")} />
            <section id="featured_prop_section">
                <div className="container">
                    <div id="feature_cards" className="row">
                        {isLoading ? ( // Show Skeleton when isLoading is true
                            Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <VerticalCardSkeleton />
                                </div>
                            ))
                        ) : propertyData && propertyData.length > 0 ? (
                            propertyData.map((ele, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={index}>
                                    <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                        <VerticalCard ele={ele} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="noDataFoundDiv">
                                <NoData />
                            </div>
                        )}
                        {propertyData && propertyData.length > 0 && hasMoreData ? (
                            <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MostViewProperties;
