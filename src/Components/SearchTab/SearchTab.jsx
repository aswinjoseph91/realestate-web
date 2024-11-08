"use client";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { BiFilter } from "react-icons/bi";
import { translate } from "@/utils";
import LocationSearchBox from "../Location/LocationSearchBox";
import { GrRefresh } from "react-icons/gr";
import { RiCloseCircleLine, RiSendPlane2Line } from "react-icons/ri";
import { useRouter } from "next/router";
import { getfilterData } from "@/store/reducer/momentSlice";
import { BsPinMap } from "react-icons/bs";
import { GetAllCategorieApi } from "@/store/actions/campaign";
import { Autocomplete, TextField } from '@mui/material';
import debounce from 'lodash.debounce';

const SearchTab = () => {
    const router = useRouter();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterD, setFilterD] = useState();
    const [formData, setFormData] = useState({
        propType: "",
        minPrice: "",
        maxPrice: "",
        postedSince: "",
        selectedLocation: null,
    });
    const [activeTab, setActiveTab] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const handleHideFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleCategorySearch = (event, newInputValue) => {
        debouncedFetchCategories(newInputValue);
    };

    const fetchAllCategories = (searchTerm = "") => {
        setIsLoading(true);
        try {
            GetAllCategorieApi({
                search: searchTerm,
                onSuccess: (response) => {
                    const categories = response?.data
                    setCategoryData(categories);
                    setIsLoading(false);
                },
                onError: (error) => {
                    console.log(error);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    };


    useEffect(() => {
        if (showFilterModal) {
            fetchAllCategories();
        }
    }, [showFilterModal]);

    useEffect(() => {
    }, [categoryData]);

    // Debounced function to handle search
    const debouncedFetchCategories = debounce((searchTerm) => {
        fetchAllCategories(searchTerm);
    }, 1000); // Adjust delay as needed


    const handleCategoryChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            propType: newValue ? newValue.id : "" // Handles default option
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target || e;

        if (name === 'minPrice' || name === 'maxPrice') {
            const sanitizedValue = Math.max(parseFloat(value) || 0, 0);
            setFormData(prev => ({
                ...prev,
                [name]: sanitizedValue,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
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

        const filterData = {
            propType: formData.propType || "",
            minPrice: formData.minPrice || "0",
            maxPrice: formData.maxPrice !== undefined ? formData.maxPrice : "",
            postedSince: postedSinceValue,
            selectedLocation: formData.selectedLocation || null,
        };
        setFilterD(filterData);
        setShowFilterModal(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const searchData = {
            filterData: filterD,
            activeTab: activeTab,
            searchInput: searchInput,
        };
        getfilterData(searchData);

        setShowFilterModal(false);
        router.push(`/search`);
    };

    const [clearfilterLocation, setClearFilerLocation] = useState(false);

    const handleClearFilter = () => {
        setClearFilerLocation(true);
        setFormData({
            propType: "",
            minPrice: "",
            maxPrice: "",
            postedSince: "",
            selectedLocation: null,
        });
    };

    return (
        <div>
            <div id="searchbox" className="container">
                <ButtonGroup className="group_radio">
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
                        <input className="searchinput" placeholder={translate("searchYourProperty")} name="propertySearch" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    </div>
                    <div id="leftside-buttons">
                        <button className="map_add" onClick={() => router.push('/properties-on-map')}>
                            <BsPinMap size={20} /> {""}{""}{""}
                            <span>{translate("map")}</span>
                        </button>
                        <button className="filter" onClick={() => setShowFilterModal(true)}>
                            <BiFilter size={25} />{""}{""}{""}
                            <span>{translate("filter")}</span>
                        </button>
                        <button className="find" onClick={handleSearch}>
                            <span>{translate("search")}</span>
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
                                <Autocomplete
                                    disablePortal
                                    options={categoryData}
                                    getOptionLabel={(option) => option.category || ""}
                                    onChange={handleCategoryChange}
                                    onInputChange={handleCategorySearch}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            fullWidth
                                            placeholder={translate("selectPropType")}
                                            style={{ color: "#000", opacity: "0.66" }}
                                        />
                                    )}
                                    loading={isLoading}
                                    value={categoryData.find(cat => cat.id === formData.propType) || null}
                                    style={{ width: '100%', padding: "0px", border: "none" }}
                                />
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
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" value="yesterday" checked={formData.postedSince === "yesterday"} onChange={handlePostedSinceChange} />
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
                        <button id="clear-filter-button" type="submit">
                            {translate("clearFilter")}
                        </button>
                    </div>
                    <div className="apply-filter-modal" onClick={handleApplyFilter}>
                        <RiSendPlane2Line size={25} />
                        <button id="apply-filter-button" type="submit">
                            {translate("applyFilter")}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SearchTab;
