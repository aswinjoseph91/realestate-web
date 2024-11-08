"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { useSelector } from "react-redux";
import { GetFeturedListingsApi, getPropertyListApi } from "@/store/actions/campaign.js";
import { RiCloseCircleLine, RiSendPlane2Line } from "react-icons/ri";
import { GrRefresh } from "react-icons/gr";
import { ButtonGroup, Modal, Pagination } from "react-bootstrap";
import LocationSearchBox from "@/Components/Location/LocationSearchBox.jsx";
import { BiFilter } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { translate } from "@/utils/index.js";
import { useRouter } from "next/router.js";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton.jsx";
import Link from "next/link.js";
import VerticalCard from "@/Components/Cards/VerticleCard.jsx";
import NoData from "@/Components/NoDataFound/NoData.jsx";
import { categoriesCacheData, filterDataaa } from "@/store/reducer/momentSlice";
import Layout from '../Layout/Layout';


const SearchPage = () => {

    const limit = 8;
    const searchedData = useSelector(filterDataaa)
    const [searchData, setSearchData] = useState();
    const [filterData, setFilterData] = useState("");
    const isLoggedIn = useSelector((state) => state.User_signup);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true); // Track if there's more data to load

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [formData, setFormData] = useState({
        propType: searchedData?.filterData?.propType ? searchedData?.filterData?.propType : "",
        minPrice: searchedData?.filterData?.minPrice ? searchedData?.filterData?.minPrice : "",
        maxPrice: searchedData?.filterData?.maxPrice ? searchedData?.filterData?.maxPrice : "",
        postedSince: searchedData?.filterData?.postedSince ? searchedData?.filterData?.postedSince : "",
        selectedLocation: searchedData?.filterData?.selectedLocation ? searchedData?.filterData?.selectedLocation : null,
    });
    const [activeTab, setActiveTab] = useState(searchedData.activeTab);
    const [searchInput, setSearchInput] = useState(searchedData.searchInput);

    const [isLoading, setIsLoading] = useState(true);
    const Categorydata = useSelector(categoriesCacheData);

    useEffect(() => {
        getPropertyListApi({
            category_id: formData.propType || "",
            city: formData.selectedLocation?.city || "",
            property_type: activeTab,
            max_price: formData.maxPrice !== undefined ? formData.maxPrice : "",
            min_price: formData.minPrice || "0",
            posted_since: formData.postedSince || "",
            state: formData.selectedLocation?.state || "",
            country: formData.selectedLocation?.country || "",
            search: searchInput,
            limit: limit.toString(),
            offset: offsetdata.toString(),
            onSuccess: (response) => {
                setTotal(response.total);
                const SearchD = response.data;
                setIsLoading(false);
                if(offsetdata > 0){
                    setSearchData(prevData => [...prevData, ...SearchD]); // Append new data to the existing data
                }else{
                    setSearchData(SearchD);
                }
                setHasMoreData(SearchD.length === limit);
            },
            onError: (error) => {
                console.log(error);
            }
        }
        );
    }, [isLoggedIn, offsetdata]);

    const handleHideFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Ensure the value is at least 0
        const sanitizedValue = Math.max(parseFloat(value), 0);

        // Update the form data
        setFormData({
            ...formData,
            [name]: sanitizedValue,
        });
    };

    const handlePostedSinceChange = (e) => {
        setFormData({
            ...formData,
            postedSince: e.target.value,
        });
    };

    const handleLocationSelected = (locationData) => {
        setFormData({
            ...formData,
            selectedLocation: locationData,
        });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab === "sell" ? 0 : 1);
    };

    const handleApplyFilter = () => {
        let postedSinceValue = "";
        if (formData.postedSince === "yesterday") {
            postedSinceValue = "1";
        } else if (formData.postedSince === "lastWeek") {
            postedSinceValue = "0";
        }

        // Include the postedSince value in the filterData object
        const newFilterData = {
            propType: formData.propType,
            minPrice: formData.minPrice,
            maxPrice: formData.maxPrice,
            postedSince: postedSinceValue,
            selectedLocation: formData.selectedLocation,
        };

        // Set the filter data in state
        setFilterData(newFilterData);
        // Close the modal
        setShowFilterModal(false);
    };

    useEffect(() => {
        // You can access the updated filterData value here

    }, [filterData]);

    const handleSearch = () => {
        setIsLoading(true);
        const searchData = {
            filterData: formData,
            activeTab: activeTab,
            searchInput: searchInput,
        };
        localStorage.setItem("searchData", JSON.stringify(searchData));
        getPropertyListApi({
            category_id: searchData.filterData.propType || "",
            city: searchData.filterData.selectedLocation?.city || "",
            limit: limit.toString(),
            offset: 0,
            property_type: searchData.activeTab,
            max_price: searchData.filterData.maxPrice !== undefined ? searchData.filterData.maxPrice : "",
            min_price: searchData.filterData.minPrice || "0",
            posted_since: searchData.filterData.postedSince || "",
            state: searchData.filterData.selectedLocation?.state || "",
            country: searchData.filterData.selectedLocation?.country || "",
            search: searchData.searchInput,
            onSuccess: (response) => {
                setTotal(response.total);
                const SearchD = response.data;

                setIsLoading(false);
                setSearchData(SearchD);
            },
            onError: (error) => {
                console.log(error);
            }
        }
        );
        setShowFilterModal(false); // Close the modal
    };

    const [clearfilterLocation, setClearFilerLocation] = useState(false);

    const handleClearFilter = () => {
        setClearFilerLocation(true)
        setFormData({
            propType: "",
            minPrice: "",
            maxPrice: "",
            postedSince: "",
            selectedLocation: null,
        });
    };
    useEffect(() => {

    }, [clearfilterLocation])
    const handleLoadMore = () => {
        const newOffset = offsetdata + limit;
        setOffsetdata(newOffset);
    };
    return (
        <Layout>
            <Breadcrumb title="" />
            <div className="serach_page_tab">
                <div id="searchbox" className="container">
                    <ButtonGroup>
                        <ul className="nav nav-tabs" id="tabs">
                            <li className="">
                                <a className={`nav-link ${activeTab === 0 ? "tab-0" : ""}`} aria-current="page" id="sellbutton" onClick={() => handleTabClick("sell")}>
                                    {translate("sell")}
                                </a>
                            </li>
                            <li className="">
                                <a className={`nav-link ${activeTab === 1 ? "tab-1" : ""}`} onClick={() => handleTabClick("rent")} aria-current="page" id="rentbutton">
                                    {translate("rent")}
                                </a>
                            </li>
                        </ul>
                    </ButtonGroup>
                    <div id="searchcard">
                        <div id="searchbuttoon">
                            <FiSearch size={20} />
                            <input
                                className="searchinput"
                                placeholder={translate("searchYourProperty")}
                                name="propertySearch"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        // Prevent the default form submission behavior
                                        e.preventDefault();
                                        // Trigger the click event on the submit button
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                        <div id="leftside-buttons">
                            <button className="filter" onClick={() => setShowFilterModal(true)}>
                                <BiFilter size={25} />
                                {translate("filter")}
                            </button>
                            <button className="find" onClick={handleSearch}>
                                {translate("search")}
                            </button>
                        </div>
                    </div>
                </div>

                <Modal show={showFilterModal} onHide={handleHideFilterModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" className="filter-modal">
                    <Modal.Header>
                        <Modal.Title>{translate("filterProp")}</Modal.Title>
                        <RiCloseCircleLine className="close-icon" size={40} onClick={handleHideFilterModal} />
                    </Modal.Header>
                    <Modal.Body>
                        <form action="">
                            <div className="first-grup">
                                <div className="prop-type-modal filter_label_title">
                                    <span>{translate("propTypes")}</span>
                                    <select className="form-select" aria-label="Default select" name="propType" value={formData.propType} onChange={handleInputChange}>
                                        <option value="">{translate("selectPropType")}</option>
                                        {/* Add more options as needed */}
                                        {Categorydata &&
                                            Categorydata?.map((ele, index) => (
                                                <option key={index} value={ele.id}>
                                                    {ele.category}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="prop-location-modal filter_label_title">
                                    <span>{translate("selectYourLocation")}</span>
                                    <LocationSearchBox onLocationSelected={handleLocationSelected} clearfilterLocation={clearfilterLocation} />
                                </div>
                            </div>
                            <div className="second-grup">
                                <div className="budget-price-modal filter_label_title">
                                    <span>{translate("budget")}</span>
                                    <div className="budget-inputs">
                                        <input className="price-input" type="number" placeholder={translate("minPrice")} name="minPrice" value={formData.minPrice} onChange={handleInputChange} />
                                        <input className="price-input" type="number" placeholder={translate("maxPrice")} name="maxPrice" value={formData.maxPrice} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="third-grup">
                                <div className="posted-since filter_label_title">
                                    <span>{translate("postedSince")}</span>
                                    <div className="posted-duration-modal">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="anytime" checked={formData.postedSince === "anytime"} onChange={handlePostedSinceChange} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                {translate("anytime")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="lastWeek" checked={formData.postedSince === "lastWeek"} onChange={handlePostedSinceChange} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                {translate("lastWeek")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="flexRadioDefault"
                                                id="flexRadioDefault3"
                                                value="yesterday"
                                                checked={formData.postedSince === "yesterday"}
                                                onChange={handlePostedSinceChange}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                {translate("yesterday")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer className="filter-footer">
                        <div className="clear-filter-modal" onClick={handleClearFilter}>
                            <GrRefresh size={25} />
                            <button id="clear-filter-button" type="submit" >
                                {translate("clearFilter")}
                            </button>
                        </div>
                        <div className="apply-filter-modal" onClick={handleApplyFilter}>
                            <RiSendPlane2Line size={25} />
                            <button id="apply-filter-button" type="submit" >
                                {translate("applyFilter")}
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="search_content container">
                <div id="feature_cards" className="row">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                <VerticalCardSkeleton />
                            </div>
                        ))
                    ) : searchData && searchData.length > 0 ? (
                        searchData.map((ele, index) => (
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3" key={index}>
                                <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                    <VerticalCard ele={ele} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <NoData />
                    )}
                    {searchData && searchData.length > 0 && hasMoreData ? (
                        <div className="col-12 loadMoreDiv" id="loadMoreDiv">
                            <button className='loadMore' onClick={handleLoadMore}>{translate("loadmore")}</button>
                        </div>
                    ) : null}
                </div>
            </div>
        </Layout>
    )
}

export default SearchPage
