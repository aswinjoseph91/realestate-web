"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import VerticalCard from "@/Components/Cards/VerticleCard";
import FilterForm from "@/Components/AllPropertyUi/FilterForm";
import { useRouter } from "next/router";
import GridCard from "@/Components/AllPropertyUi/GridCard";
import AllPropertieCard from "@/Components/AllPropertyUi/AllPropertieCard";
import { getPropertyListApi } from "@/store/actions/campaign";
import CustomHorizontalSkeleton from "@/Components/Skeleton/CustomHorizontalSkeleton";
import { languageData } from "@/store/reducer/languageSlice";
import { useSelector } from "react-redux";
import NoData from "@/Components/NoDataFound/NoData";
import { categoriesCacheData } from "@/store/reducer/momentSlice";
import Layout from '../Layout/Layout';
import { translate } from '@/utils';

const City = () => {

    const [grid, setGrid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [CategoryListByPropertyData, setCategoryListByPropertyData] = useState([]);

    const [filterData, setFilterData] = useState({
        propType: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        postedSince: "",
        selectedLocation: null,
    });
    const [total, setTotal] = useState();
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load
    const limit = 9;

    const router = useRouter();

    const city = router.query;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const lang = useSelector(languageData);
    const Categorydata = useSelector(categoriesCacheData);

    useEffect(() => { }, [lang]);
    useEffect(() => { }, [grid]);

    useEffect(() => {
        setIsLoading(true);
        if (!router.isReady) return;
        getPropertyListApi({
            city: city.slug,
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const propertyData = response.data;
                setIsLoading(false);
                setCategoryListByPropertyData(propertyData);
                setHasMoreData(propertyData.length === limit); // Update hasMoreData
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    }, [isLoggedIn, router.isReady]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Ensure that the input value is a positive number
        if (type === "number") {
            const sanitizedValue = Math.max(0, parseInt(value));
            setFilterData({
                ...filterData,
                [name]: sanitizedValue,
            });
        } else {
            setFilterData({
                ...filterData,
                [name]: value,
            });
        }
    };

    const handleTabClick = (tab) => {
        const propTypeValue = tab === "sell" ? 0 : 1;
        setFilterData({
            ...filterData,
            propType: propTypeValue,
        });
    };
    const handlePostedSinceChange = (e) => {
        setFilterData({
            ...filterData,
            postedSince: e.target.value,
        });
    };

    const handleApplyfilter = (e) => {
        e.preventDefault();

        let postedSinceValue = "";
        if (filterData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (filterData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }

        getPropertyListApi({
            category_id: filterData ? filterData?.category : "",
            city: city,
            offset: "0", // Reset offset for new filters
            limit: limit.toString(),
            property_type: filterData ? filterData?.propType : "",
            max_price: filterData ? filterData?.maxPrice : "",
            min_price: filterData ? filterData?.minPrice : "",
            posted_since: postedSinceValue,
            onSuccess: (response) => {
                setTotal(response.total);
                const propertyData = response.data;
                setCategoryListByPropertyData(propertyData);
                setIsLoading(false);
                setOffsetdata(0); // Reset offset after applying filter
                setHasMoreData(propertyData.length === limit); // Update hasMoreData
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    const handleClearFilter = () => {
        setFilterData({
            propType: "",
            category: "",
            minPrice: "",
            maxPrice: "",
            postedSince: "",
            selectedLocation: null,
        });
        getPropertyListApi({
            city: city.slug,
            offset: "0", // Reset offset after clearing filters
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const propertyData = response.data;
                setIsLoading(false);
                setCategoryListByPropertyData(propertyData);
                setHasMoreData(propertyData.length === limit); // Update hasMoreData
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    const handleLoadMore = () => {
        setIsLoading(true);
        getPropertyListApi({
            city: city.slug,
            offset: (offsetdata + limit).toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                const propertyData = response.data;
                if (propertyData.length > 0) {
                    setTotal(response.total);
                    setCategoryListByPropertyData((prevData) => [...prevData, ...propertyData]); // Append data
                    setOffsetdata((prevOffset) => prevOffset + limit);
                    setHasMoreData(propertyData.length === limit); // Update hasMoreData
                } else {
                    setHasMoreData(false); // No more data available
                }
                setIsLoading(false);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    return (
        <Layout>
            <Breadcrumb title={city.slug ? `${translate("propertiesListedIn")} ${city.slug} ` : `No Properties in ${city.slug}`} />

            <div id="all-prop-containt">
                <div className="all-properties container">
                    <div className="row " id="main-all-prop">
                        <div className="col-12 col-md-12 col-lg-3">
                            <FilterForm
                                filterData={filterData}
                                getCategories={Categorydata}
                                handleInputChange={handleInputChange}
                                handleTabClick={handleTabClick}
                                handlePostedSinceChange={handlePostedSinceChange}
                                cityName={city.slug}
                                handleApplyfilter={handleApplyfilter}
                                handleClearFilter={handleClearFilter}
                                setFilterData={setFilterData}
                            />
                        </div>
                        <div className="col-12 col-md-12 col-lg-9">
                            <div className="all-prop-rightside">
                                {CategoryListByPropertyData && CategoryListByPropertyData.length > 0 ? <GridCard total={total} setGrid={setGrid} /> : null}
                                {CategoryListByPropertyData && CategoryListByPropertyData.length > 0 ? (
                                    // Row cards
                                    !grid ? (
                                        <div className="all-prop-cards" id="rowCards">
                                            {isLoading
                                                ? // Show skeleton loading when data is being fetched
                                                Array.from({ length: 8 }).map((_, index) => (
                                                    <div className="col-sm-12  loading_data">
                                                        <CustomHorizontalSkeleton />
                                                    </div>
                                                ))
                                                : CategoryListByPropertyData.map((ele) => (
                                                    <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref key={ele.slug_id}>
                                                        <AllPropertieCard ele={ele} />
                                                    </Link>
                                                ))}
                                        </div>
                                    ) : (
                                        // Column cards
                                        <div id="columnCards">
                                            <div className="row" id="all-prop-col-cards">
                                                {CategoryListByPropertyData.map((ele, index) => (
                                                    <div className="col-12 col-md-6 col-lg-4" key={ele.slug_id}>
                                                        <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                            <VerticalCard ele={ele} />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="noDataFoundDiv">
                                        <NoData />
                                    </div>
                                )}

                                {CategoryListByPropertyData && CategoryListByPropertyData.length > 0 && hasMoreData ? (
                                    <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                                        <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default City;
