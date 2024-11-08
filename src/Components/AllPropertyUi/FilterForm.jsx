"use client"
import React, { useEffect, useState } from "react";
import { translate } from "@/utils";
import { ButtonGroup } from "react-bootstrap";
import { RiSendPlane2Line } from "react-icons/ri";
import LocationSearchBox from "../Location/LocationSearchBox";
import { GetAllCategorieApi } from "@/store/actions/campaign";
import debounce from 'lodash.debounce';
import { Autocomplete, TextField } from '@mui/material';

const FiletrForm = (props) => {

    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        fetchAllCategories();
    }, []);

    useEffect(() => {
    }, [categoryData]);

    // Debounced function to handle search
    const debouncedFetchCategories = debounce((searchTerm) => {
        fetchAllCategories(searchTerm);
    }, 1000); // Adjust delay as needed


    const handleCategoryChange = (event, newValue) => {
        props?.setFilterData(prev => ({
            ...prev,
            category: newValue ? newValue.id : "" // Handles default option
        }));
    };
    return (
        <div className="card" id="filter-card">
            <div className="card title" id="filter-title">
                <span>{translate("filterProp")}</span>
                <button onClick={props.handleClearFilter}>{translate("clearFilter")}</button>
            </div>
            <div className="card-body">
                <div className="filter-button-box">
                    <ButtonGroup id="propertie_button_grup">
                        <ul className="nav nav-tabs" id="props-tabs">
                            <li className="">
                                <a className={`nav-link ${props.filterData.propType === 0 ? "active" : ""}`} aria-current="page" id="prop-sellbutton" onClick={() => props.handleTabClick("sell")}>
                                    {translate("forSell")}
                                </a>
                            </li>
                            <li className="">
                                <a className={`nav-link ${props.filterData.propType === 1 ? "active" : ""}`} onClick={() => props.handleTabClick("rent")} aria-current="page" id="prop-rentbutton">
                                    {translate("forRent")}
                                </a>
                            </li>
                        </ul>
                    </ButtonGroup>
                </div>

                {!props.cateName && (
                    <div className="prop-type filter_label_title">
                        <span>{translate("propTypes")}</span>
                        {/* <select className="form-select" aria-label="Default select" name="category" value={props.filterData.category} onChange={props.handleInputChange}>
                            <option value="">{translate("selectPropType")}</option>
                            {props.getCategories &&
                                props.getCategories?.map((ele, index) => (
                                    <option key={index} value={ele.id}>
                                        {ele.category}
                                    </option>
                                ))}
                        </select> */}
                        <Autocomplete
                            disableCloseOnSelect
                            options={categoryData}
                            getOptionLabel={(option) => option.category || ""}
                            onChange={handleCategoryChange}
                            onInputChange={handleCategorySearch}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Select Property Type" // Simple placeholder text
                                    style={{ color: "#000", opacity: "0.66" }}
                                />
                            )}
                            loading={isLoading}
                            value={categoryData.find(cat => cat.id === props.filterData.category) || null}
                            style={{ width: '100%', padding: "0px", border: "none" }}
                        />
                    </div>
                )}
                {!props.cityName && (
                    <div className="prop-location filter_label_title">
                        <span>{translate("selectYourLocation")}</span>
                        <LocationSearchBox onLocationSelected={props.handleLocationSelected} selectedLocation={props?.selectedLocation} clearfilterLocation={props?.clearfilterLocation} />
                    </div>
                )}
                <div className="budget-price filter_label_title">
                    <span>{translate("budget")}</span>
                    <div className="budget-inputs">
                        <input className="price-input" type="number" placeholder={translate("minPrice")} name="minPrice" value={props.filterData.minPrice} onChange={props.handleInputChange} />
                        <input className="price-input" type="number" placeholder={translate("maxPrice")} name="maxPrice" value={props.filterData.maxPrice} onChange={props.handleInputChange} />
                    </div>
                </div>
                <div className="posted-since filter_label_title">
                    <span>{translate("postedSince")}</span>
                    <div className="posted-duration">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="anytime" checked={props.filterData.postedSince === "anytime"} onChange={props.handlePostedSinceChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                {translate("anytime")}
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="lastWeek" checked={props.filterData.postedSince === "lastWeek"} onChange={props.handlePostedSinceChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                {translate("lastWeek")}
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" value="yesterday" checked={props.filterData.postedSince === "yesterday"} onChange={props.handlePostedSinceChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                {translate("yesterday")}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="apply-filter" onClick={props.handleApplyfilter}>
                    <RiSendPlane2Line size={25} />
                    <button id="apply-filter-button">{translate("applyFilter")}</button>
                </div>
            </div>
        </div>
    );
};

export default FiletrForm;
