"use client"
import { categoriesCacheData } from '@/store/reducer/momentSlice.js'
import { placeholderImage, translate } from '@/utils/index.js'
import dynamic from 'next/dynamic.js'
import Image from 'next/image.js'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ImageToSvg } from '../Cards/ImageToSvg.jsx'
import { AddUserIntrestApi, DeleteUserIntrestApi, GetFacilitiesApi, GetUserIntrestApi } from '@/store/actions/campaign.js'
import { settingsData } from '@/store/reducer/settingsSlice.js'
import { Autocomplete } from '@react-google-maps/api'
import { Input, Slider } from 'antd';
import toast from 'react-hot-toast'
import { useRouter } from 'next/router.js'
import { FaCheckCircle } from 'react-icons/fa'
import { FaRegCircleCheck } from 'react-icons/fa6'

const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })

const PersonalizeFeed = () => {
    const systemSettingsData = useSelector(settingsData);
    const CurrencySymbol = systemSettingsData && systemSettingsData.currency_symbol;
    const MaxPriceInSystem = systemSettingsData && systemSettingsData.max_price;

    const router = useRouter();

    const Categorydata = useSelector(categoriesCacheData);
    const [getFacilities, setGetFacilities] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);
    const [sliderValue, setSliderValue] = useState([0, MaxPriceInSystem]);
    const [formData, setFormData] = useState({
        category: [],
        facility: [],
        property_type: '',
        latitude: '',
        longitude: '',
        city: '',
        state: '',
        country: '',
        address: '',
        max_price: '',
        min_price: '',
    });

    const fetchUserIntrestData = () => {
        GetUserIntrestApi({
            onSuccess: (res) => {
                if (res.data) {
                    const { category_ids, price_range, property_type, outdoor_facilitiy_ids, city } = res.data;
                    const minPrice = parseInt(price_range[0]);
                    const maxPrice = parseInt(price_range[1]);

                    // Set the initial state for category based on category_ids
                    const categoryIds = category_ids && category_ids.map(id => parseInt(id));

                    // Set the initial state for facility based on outdoor_facilitiy_ids
                    const facilityIds = outdoor_facilitiy_ids && outdoor_facilitiy_ids.map(id => parseInt(id));
                    // Set the initial property_type dropdown value based on fetched property_type
                    let initialPropertyType = '';
                    if (property_type && property_type.includes("0") && property_type.includes("1")) {
                        initialPropertyType = ''; // All
                    } else if (property_type.includes("0")) {
                        initialPropertyType = '0'; // Sell
                    } else if (property_type.includes("1")) {
                        initialPropertyType = '1'; // Rent
                    }
                  
                    setFormData({
                        ...formData,
                        min_price: price_range ? price_range[0] : '',
                        max_price: price_range ? price_range[1] : '',
                        property_type: initialPropertyType,
                        city: city || '',
                        category: categoryIds,
                        facility: facilityIds,
                    });
                    setSliderValue([minPrice, maxPrice]);
                }
            },
            onError: (err) => {
                console.log(err);
            },
        });
    };

    const fetchFacilitiesData = () => {
        GetFacilitiesApi(
            (response) => {
                const facilityData = response && response.data;
                setGetFacilities(facilityData);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    useEffect(() => {
        fetchUserIntrestData()
    }, []);
    useEffect(() => {
        fetchFacilitiesData()
    }, []);
    useEffect(() => {

    }, [formData]);


    const handleCategoryCheckboxChange = (categoryId) => {
        const updatedCategories = formData.category.includes(categoryId)
            ? formData.category.filter((id) => id !== categoryId)
            : [...formData.category, categoryId];
        setFormData({ ...formData, category: updatedCategories });
    };

    const handleFacilityCheckboxChange = (facilityId) => {
        const updatedFacilities = formData.facility.includes(facilityId)
            ? formData.facility.filter((id) => id !== facilityId)
            : [...formData.facility, facilityId];
        setFormData({ ...formData, facility: updatedFacilities });
    };


    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let updatedSliderValue = sliderValue;
        let minValue = formData.min_price;
        let maxValue = formData.max_price;

        // Update the corresponding field in formData using the input's "name" attribute
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));

        // Update the address field if the input field is the location input
        if (name === 'city') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                address: value
            }));
        }

        // Parse the input values to integers
        if (name === 'min_price') {
            minValue = parseInt(value) || 0; // Set to 0 if parsing fails
        } else if (name === 'max_price') {
            maxValue = parseInt(value) || 0; // Set to 0 if parsing fails
        }

        // Update the Slider value
        updatedSliderValue = [minValue, maxValue];
        setSliderValue(updatedSliderValue);
    };


    const getFieldValue = (addressComponents, fieldType) => {
        const field = addressComponents.find(
            (component) => component.types.includes(fieldType)
        );
        return field ? field.long_name : '';
    };
    const handlePropertyTypeChange = (value) => {
        setFormData({ ...formData, property_type: value });
    };
    const handlePlaceChanged = () => {
        const place = autocomplete.getPlace();

        if (place && place.address_components) {
            const city = getFieldValue(place.address_components, 'locality');
            const state = getFieldValue(place.address_components, 'administrative_area_level_1');
            const country = getFieldValue(place.address_components, 'country');
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const formattedAddress = place.formatted_address;
            setFormData((prevData) => ({
                ...prevData,
                city: city,
                state: state,
                country: country,
                latitude: latitude,
                longitude: longitude,
                address: formattedAddress,
            }));
        }
    };

    useEffect(() => {
    }, [formData]);

    const handleSliderChange = (value) => {


        setSliderValue(value);
        // Check if the maximum value is less than the minimum value
        if (value[0] > value[1]) {
            // If so, display a toast message
            toast.error("The maximum price cannot be less than the minimum price.");
            // Exit the function to prevent further updates
            return;
        }

        setFormData({
            ...formData,
            min_price: value[0],
            max_price: value[1]
        });
    };

    // Format the price range string
    const priceRangeText = `${CurrencySymbol}${sliderValue[0]} to ${CurrencySymbol}${sliderValue[1]}`;

    const handleSubmitFeedsData = (e) => {
        e.preventDefault()
        // Check if min_price is filled and max_price is not filled
        if (formData.min_price && !formData.max_price) {
            // Display a toast message indicating that the maximum price needs to be filled
            toast.error("Please fill in the maximum price.");
            return; // Exit the function
        }
        const range = [formData.min_price, formData.max_price].join(',');


        AddUserIntrestApi({
            category_ids: formData?.category,
            outdoor_facilitiy_ids: formData?.facility,
            city: formData?.city,
            price_range: range,
            property_type: formData?.property_type,
            onSuccess: (res) => {
                toast.success(res.message)
                router.push("/")
            },
            onError: (err) => {
                console.log(err)

            }
        }
        )
    }
    const clearFeeds = () => {
        setFormData({
            category: [],
            facility: [],
            property_type: '',
            latitude: '',
            longitude: '',
            city: '',
            state: '',
            country: '',
            address: '',
            max_price: '',
            min_price: '',
        });
        setSliderValue([0, MaxPriceInSystem])
    };
    const handleClearFeedsData = (e) => {
        e.preventDefault()

        DeleteUserIntrestApi({
            onSuccess: (res) => {
                toast.success(res.message)
                clearFeeds()
                // router.push("/")
            },
            onError: (err) => {
                console.log(err)

            }
        }
        )
    }
    useEffect(() => {
    }, [formData])

    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("personalizeFeed")}</h3>
                </div>
                <div className="personalize_card card">

                    {Categorydata && Categorydata.length > 0 &&
                        <div className="category_section">
                            <h5>{translate("chooseYourIntrest")}</h5>
                            <hr />
                            <div className="all_categories">
                                {Categorydata?.map((ele, optionIndex) => (
                                    <div className="custom-checkbox" key={optionIndex}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox_category_${ele?.id}_${optionIndex}`}
                                            className="custom-checkbox-input"
                                            checked={formData?.category.includes(ele.id)}
                                            onChange={() => handleCategoryCheckboxChange(ele.id)}
                                        />
                                        <label htmlFor={`checkbox_category_${ele?.id}_${optionIndex}`} className="custom-checkbox-label">
                                            {formData?.category.includes(ele.id) && <FaRegCircleCheck className="checked-icon" size={18} />}

                                            {ele.category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {getFacilities && getFacilities.length > 0 &&
                        <div className="facility_section">
                            <h5>{translate("choosenearbyplaces")}</h5>
                            <p>{translate("GetRecommendationLocations")}</p>
                            <hr />
                            <div className="all_facility">
                                {getFacilities?.map((ele, optionIndex) => (
                                    <div className="custom-checkbox" key={optionIndex}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox_facility_${ele?.id}_${optionIndex}`}
                                            className="custom-checkbox-input"
                                            checked={formData.facility.includes(ele.id)} // Check if the facility ID is in the array
                                            onChange={() => handleFacilityCheckboxChange(ele.id)}
                                        />
                                        <label htmlFor={`checkbox_facility_${ele?.id}_${optionIndex}`} className="custom-checkbox-label">
                                            {formData.facility.includes(ele.id) && <FaRegCircleCheck className="checked-icon" size={20} />}
                                            {ele.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }

                    <div className="location_section">
                        <h5>{translate("youPreferredCity")}</h5>
                        <hr />
                        <div className="location_and_type">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="add_prop_fields">
                                        <span>{translate('city')}</span>
                                        <Autocomplete
                                            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                                            onPlaceChanged={handlePlaceChanged}
                                        >
                                            <input
                                                type="text"
                                                style={{ width: "100%" }}
                                                id="prop_title_input"
                                                placeholder={translate("searchCity")}
                                                name="city"
                                                value={formData.city}
                                                onChange={(event) => handleInputChange(event)}
                                            />
                                        </Autocomplete>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="add_prop_fields">
                                        <span>{translate("propTypes")}</span>
                                        <select
                                            className="form-select categories"
                                            aria-label="Default select"
                                            name="property_type"
                                            value={formData.property_type}
                                            onChange={(event) => handlePropertyTypeChange(event.target.value)}
                                        >
                                            <option value="">{translate("all")}</option>
                                            <option value="0">{translate("sell")}</option>
                                            <option value="1">{translate("rent")}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="range_section">
                        <h5>{translate("theBudgetForTheProperty")}</h5>
                        <hr />
                        <div className="range">
                            <div className="budget-price">
                                <span>{translate("budget")}</span>
                                <div className="budget-price-inputs mt-2">
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3">
                                            <Input
                                                className="price-input"
                                                type="number"
                                                placeholder={translate("minPrice")}
                                                name="min_price"
                                                value={formData.min_price}
                                                onChange={handleInputChange}
                                                prefix={CurrencySymbol} // Adding currency symbol as prefix
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-3">
                                            <Input
                                                className="price-input"
                                                type="number"
                                                placeholder={translate("maxPrice")}
                                                name="max_price"
                                                value={formData.max_price}
                                                onChange={handleInputChange}
                                                prefix={CurrencySymbol} // Adding currency symbol as prefix
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="slider_div">
                                    <div className="priceText">
                                        {priceRangeText &&
                                            <span>{translate("Price Range:")} {""}
                                                <span className='priceRangetext'>
                                                    {priceRangeText}
                                                </span>
                                            </span>
                                        }
                                        <Slider
                                            range
                                            min={0}
                                            max={parseInt(MaxPriceInSystem)} // Corrected to parse the value as an integer
                                            value={sliderValue}
                                            onChange={handleSliderChange}
                                            style={{ width: '100%' }}
                                            className='customSlider'
                                        />
                                    </div>
                                    <div className="personalizeFeed_submit">
                                        <button onClick={handleClearFeedsData} className='clear'>{translate("clear")}</button>
                                        <button onClick={handleSubmitFeedsData} className='submit'>{translate("submit")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VerticleLayout>
    );
}

export default PersonalizeFeed;
