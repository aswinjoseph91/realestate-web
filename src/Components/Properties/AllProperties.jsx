"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import VerticalCard from "@/Components/Cards/VerticleCard";
import FilterForm from "@/Components/AllPropertyUi/FilterForm";
import GridCard from "@/Components/AllPropertyUi/GridCard";
import AllPropertieCard from "@/Components/AllPropertyUi/AllPropertieCard";
import { getPropertyListApi } from "@/store/actions/campaign";
import CustomHorizontalSkeleton from "@/Components/Skeleton/CustomHorizontalSkeleton";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Pagination from "@/Components/Pagination/ReactPagination";
import NoData from "@/Components/NoDataFound/NoData";
import { categoriesCacheData } from "@/store/reducer/momentSlice";
import Layout from '../Layout/Layout';

const AllProperties = () => {
    const [grid, setGrid] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [CategoryListByPropertyData, setCategoryListByPropertyData] = useState([]);
    const [clearfilterLocation, setClearFilerLocation] = useState(false);
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
    const [hasMoreData, setHasMoreData] = useState(true); // Track if more data is available
    const limit = 9;

    const isLoggedIn = useSelector((state) => state.User_signup);

    const lang = useSelector(languageData);
    const Categorydata = useSelector(categoriesCacheData);

    useEffect(() => { }, [lang]);
    useEffect(() => { }, [grid]);

    const handleLoadMore = () => {
        setIsLoading(true);
        let postedSinceValue = "";
        if (filterData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (filterData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }
        getPropertyListApi({
            category_id: filterData ? filterData?.category : "",
            city: filterData ? filterData?.selectedLocation?.city : "",
            offset: (offsetdata + limit).toString(),
            limit: limit.toString(),
            property_type: filterData ? filterData?.propType : "",
            max_price: filterData ? filterData?.maxPrice : "",
            min_price: filterData ? filterData?.minPrice : "",
            posted_since: postedSinceValue, // Set the postedSince parameter
            state: filterData ? filterData?.selectedLocation?.state : "",
            country: filterData ? filterData?.selectedLocation?.country : "",
            onSuccess: (response) => {
                const propertyData = response.data;
                if (propertyData.length > 0) {
                    setTotal(response.total);
                    setCategoryListByPropertyData((prevData) => [...prevData, ...propertyData]);
                    setOffsetdata((prevOffset) => prevOffset + limit);
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

    useEffect(() => {
        setIsLoading(true);
        getPropertyListApi({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                const propertyData = response.data;
                if (propertyData.length > 0) {
                    setTotal(response.total);
                    setCategoryListByPropertyData(propertyData);
                    setHasMoreData(propertyData.length === limit); // Set hasMoreData based on initial response
                }
                setIsLoading(false);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    }, [isLoggedIn]);

    const handleApplyfilter = (e) => {
        e.preventDefault();

        // Determine the value for the postedSince parameter based on filterData.postedSince
        let postedSinceValue = "";
        if (filterData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (filterData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }
        setIsLoading(true);
        getPropertyListApi({
            category_id: filterData ? filterData?.category : "",
            city: filterData ? filterData?.selectedLocation?.city : "",
            offset: offsetdata.toString(),
            limit: limit.toString(),
            property_type: filterData ? filterData?.propType : "",
            max_price: filterData ? filterData?.maxPrice : "",
            min_price: filterData ? filterData?.minPrice : "",
            posted_since: postedSinceValue, // Set the postedSince parameter
            state: filterData ? filterData?.selectedLocation?.state : "",
            country: filterData ? filterData?.selectedLocation?.country : "",
            onSuccess: (response) => {
                setTotal(response.total);
                const propertyData = response.data;
                setCategoryListByPropertyData(propertyData);
                setHasMoreData(propertyData.length === limit); // Update hasMoreData
                setIsLoading(false);
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
        setIsLoading(true);
        getPropertyListApi({    
            offset: offsetdata.toString(),
            limit: limit.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const propertyData = response.data;
                setCategoryListByPropertyData(propertyData);
                setHasMoreData(propertyData.length === limit); // Reset hasMoreData
                setIsLoading(false);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    };

    useEffect(() => { }, [clearfilterLocation]);

    return (
        <Layout>
            <Breadcrumb title={translate("allProperties")} />
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
                                    CategoryListByPropertyData.length > 0 ? (
                                        !grid ? (
                                            <div className="all-prop-cards" id="rowCards">
                                                {isLoading
                                                    ? Array.from({ length: 8 }).map((_, index) => (
                                                        <div className="col-sm-12 loading_data" key={index}>
                                                            <CustomHorizontalSkeleton />
                                                        </div>
                                                    ))
                                                    : CategoryListByPropertyData.map((ele, index) => (
                                                        <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref key={index}>
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
                                        <div className="noDataFoundDiv">
                                            <NoData />
                                        </div>
                                    )
                                ) : (
                                    <div className="all-prop-cards" id="rowCards">
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <div className="col-sm-12 loading_data" key={index}>
                                                <CustomHorizontalSkeleton />
                                            </div>
                                        ))}
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

export default AllProperties
