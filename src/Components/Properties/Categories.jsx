"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import VerticalCard from "@/Components/Cards/VerticleCard";
import FilterForm from "@/Components/AllPropertyUi/FilterForm";
import { useRouter } from "next/router";
import GridCard from "@/Components/AllPropertyUi/GridCard";
import AllPropertieCard from "@/Components/AllPropertyUi/AllPropertieCard";
import { getPropertyListApi } from "@/store/actions/campaign";
import CustomHorizontalSkeleton from "@/Components/Skeleton/CustomHorizontalSkeleton";
import { useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';
import { translate } from '@/utils';

const Categories = () => {

    const [grid, setGrid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [CategoryListByPropertyData, setCategoryListByPropertyData] = useState([]);
    const [cateName, setCateName] = useState("");
    const [clearfilterLocation, setClearFilerLocation] = useState(false);
    const [filterData, setFilterData] = useState({
        propType: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        postedSince: "",
        selectedLocation: null,
    });
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const limit = 9;

    const router = useRouter();
    const cateId = router.query;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    useEffect(() => { }, [grid]);

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

    const handleLocationSelected = (locationData) => {
        setFilterData({
            ...filterData,
            selectedLocation: locationData,
        });
    };

    const fetchProperties = (offset) => {
        // Determine the value for the postedSince parameter based on filterData.postedSince
        let postedSinceValue = "";
        if (filterData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (filterData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }
        setIsLoading(true);

        getPropertyListApi({
            offset: offset.toString(),
            limit: limit.toString(),
            category_slug_id: cateId.slug,
            onSuccess: (response) => {
                const propertyData = response.data;
                setIsLoading(false);
                setCategoryListByPropertyData((prevData) => [...prevData, ...propertyData]);
                setTotal(response.total);
                setHasMoreData(propertyData.length === limit);
                if (propertyData.length > 0) {
                    setCateName(propertyData[0].category.category);
                }
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    useEffect(() => {
        if (!router.isReady) return;
        fetchProperties(0);
    }, [isLoggedIn, router.isReady]);

    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
        fetchProperties(newOffset);
    };

    const handleApplyfilter = (e) => {
        e.preventDefault();

        // Determine the value for the postedSince parameter based on filterData.postedSince
        let postedSinceValue = "";
        if (filterData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (filterData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }
        setIsLoading(true)
        getPropertyListApi({
            city: filterData ? filterData?.selectedLocation?.city : "",
            offset: "0",
            limit: limit.toString(),
            property_type: filterData ? filterData?.propType : "",
            max_price: filterData ? filterData?.maxPrice : "",
            min_price: filterData ? filterData?.minPrice : "",
            posted_since: postedSinceValue, // Set the postedSince parameter
            state: filterData ? filterData?.selectedLocation?.state : "",
            country: filterData ? filterData?.selectedLocation?.country : "",
            category_slug_id: cateId.slug,
            onSuccess: (response) => {
                const propertyData = response.data;
                setCategoryListByPropertyData(propertyData);
                setIsLoading(false);
                setTotal(response.total);
                setOffsetdata(0);
                setHasMoreData(propertyData.length === limit);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    const handleClearFilter = () => {
        setClearFilerLocation(true)
        setFilterData({
            propType: "",
            category: "",
            minPrice: "",
            maxPrice: "",
            postedSince: "",
            selectedLocation: null,
        });
        setIsLoading(true)
        getPropertyListApi({
            offset: "0",
            limit: limit.toString(),
            category_slug_id: cateId.slug,
            onSuccess: (response) => {
                const propertyData = response.data;
                setCategoryListByPropertyData(propertyData);
                setIsLoading(false);
                setTotal(response.total);
                setOffsetdata(0);
                setHasMoreData(propertyData.length === limit);
            },
            onError: (error) => {
                setIsLoading(true);
                console.log(error);
            }
        });
    };

    useEffect(() => { }, [clearfilterLocation])

    return (
        <Layout>
            <Breadcrumb title={`${cateName} Properties`} />
            <div id="all-prop-containt">
                <div className="all-properties container">
                    <div className="row " id="main-all-prop">
                        <div className="col-12 col-md-12 col-lg-3">
                            <FilterForm
                                filterData={filterData}
                                cateName={cateName}
                                handleInputChange={handleInputChange}
                                handleTabClick={handleTabClick}
                                handlePostedSinceChange={handlePostedSinceChange}
                                handleLocationSelected={handleLocationSelected}
                                handleApplyfilter={handleApplyfilter}
                                handleClearFilter={handleClearFilter}
                                selectedLocation={filterData?.selectedLocation}
                                clearfilterLocation={clearfilterLocation}
                                setFilterData={setFilterData}
                            />
                        </div>
                        <div className="col-12 col-md-12 col-lg-9">
                            <div className="all-prop-rightside">
                                {CategoryListByPropertyData && CategoryListByPropertyData.length > 0 ? <GridCard total={total} setGrid={setGrid} /> : null}

                                {CategoryListByPropertyData ? (
                                    // Data is available
                                    CategoryListByPropertyData.length > 0 ? (
                                        !grid ? (
                                            <div className="all-prop-cards" id="rowCards">
                                                {isLoading
                                                    ? // Show skeleton loading when data is being fetched
                                                    Array.from({ length: 8 }).map((_, index) => (
                                                        <div className="col-sm-12 loading_data" key={index}>
                                                            <CustomHorizontalSkeleton />
                                                        </div>
                                                    ))
                                                    : CategoryListByPropertyData.map((ele) => (
                                                        <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                            <AllPropertieCard ele={ele} />
                                                        </Link>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div id="columnCards">
                                                <div className="row" id="all-prop-col-cards">
                                                    {CategoryListByPropertyData.map((ele, index) => (
                                                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                                                            <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                                                <VerticalCard ele={ele} />
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        // No data found
                                        <div className="noDataFoundDiv">
                                            <NoData />
                                        </div>
                                    )
                                ) : (
                                    // Data is still loading
                                    <div className="all-prop-cards" id="rowCards">
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <div className="col-sm-12 loading_data" key={index}>
                                                <CustomHorizontalSkeleton />
                                            </div>
                                        ))
                                        }
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
    )
}

export default Categories
