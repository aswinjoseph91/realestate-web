"use client"
import { Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreIcon from "@mui/icons-material/MoreVert";
import { store } from "@/store/store";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { FiPlusCircle } from "react-icons/fi";
import { userSignUpData } from "@/store/reducer/authSlice";
import { languageLoaded, setLanguage } from "@/store/reducer/languageSlice";
import { translate } from "@/utils";
import Link from "next/link";
import { GetLimitsApi } from "@/store/actions/campaign";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const AdminHeader = ({ hasSubscription }) => {

    const router = useRouter()
    const AddPropertyPath = router.pathname === '/user/properties'
    const language = store.getState().Language.languages;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const settingData = useSelector(settingsData);
    const LanguageList = settingData && settingData.languages;

    const [selectedLanguage, setSelectedLanguage] = useState(language.name);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);



    useEffect(() => {
        if (language && language.rtl === 1) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [language]);





    const handleLanguageChange = (languageCode) => {
        languageLoaded(
            languageCode,
            "1",
            (response) => {
                const currentLang = response && response.data.name;
                setSelectedLanguage(currentLang);

                // Dispatch the setLanguage action to update the selected language in Redux
                store.dispatch(setLanguage(currentLang));
            },
            (error) => {
                toast.error(error)
                console.log(error);
            }
        );
    };
    useEffect(() => {


    }, [selectedLanguage])


    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleCheckLimits = (e) => {
        e.preventDefault()
        if (hasSubscription) {
            GetLimitsApi(
                "property",
                (response) => {
                    if (response.message === "Please Subscribe for Post Property") {
                        Swal.fire({
                            icon: "error",
                            title: translate("opps"),
                            text: translate("yourPackageLimitOver"),
                            allowOutsideClick: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                            },

                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/subscription-plan"); // Redirect to the subscription page
                            }
                        });
                    } else {
                        router.push("/user/properties");
                    }
                },
                (error) => {
                    console.log("API Error:", error);
                }
            );
        } else {
            Swal.fire({
                icon: "error",
                title: translate("opps"),
                text: translate("youHaveNotSubscribe"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/subscription-plan");

                }
            });
        }

    }


    const handleCheckLimitsforProject = (e) => {
        e.preventDefault()
        // router.push("/user/add-project");
        if (hasSubscription) {
            GetLimitsApi(
                "property",
                (response) => {
                    if (response.message === "Please Subscribe for Post Property") {
                        Swal.fire({
                            icon: "error",
                            title: translate("opps"),
                            text: translate("yourPackageLimitOver"),
                            allowOutsideClick: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                            },

                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/subscription-plan"); // Redirect to the subscription page
                            }
                        });
                    } else {
                        router.push("/user/add-project");
                    }
                },
                (error) => {
                    console.log("API Error:", error);
                }
            );
        } else {
            Swal.fire({
                icon: "error",
                title: translate("opps"),
                text: translate("youHaveNotSubscribe"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/subscription-plan"); // Redirect to the subscription page

                }
            });
        }

    }
    const menuId = "primary-search-account-menu";
    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <GTranslateIcon />
                </IconButton>
                <Dropdown id="dropdown">
                    <Dropdown.Toggle id="dropdown-basic-dashboard">{selectedLanguage}</Dropdown.Toggle>
                    <Dropdown.Menu id="language">
                        {LanguageList &&
                            LanguageList.map((ele, index) => (
                                <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                    <span className="perent_link">
                                        <span className="links">
                                            {ele.name}
                                        </span>
                                    </span>
                                </Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>
            </MenuItem>

            {!AddPropertyPath ? (
                <MenuItem  onClick={handleCheckLimits}>
                    <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <span style={{ color: "#000" }}>{translate("addProp")}</span>
                </MenuItem>
            ) : (
                <MenuItem onClick={handleCheckLimitsforProject}>
                    <IconButton  size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <span style={{ color: "#000" }}>{translate("addProject")}</span>
                </MenuItem>

            )}
        </Menu>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, color: "#000" }} />
                    <Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" }, alignItems: "center" }}>
                        <Dropdown id="dropdown">
                            <Dropdown.Toggle id="dropdown-basic-dashboard">{selectedLanguage}</Dropdown.Toggle>
                            <Dropdown.Menu id="language">
                                {LanguageList &&
                                    LanguageList.map((ele, index) => (
                                        <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                            <span className="perent_link">
                                                <span className="links">
                                                    {ele.name}
                                                </span>
                                            </span>
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Box>
                            {!AddPropertyPath ? (

                                <button className="btn" id="dashboard_add" onClick={handleCheckLimits}>
                                    <FiPlusCircle size={20} className="mx-2 add-nav-button" />
                                    {translate("addProp")}
                                </button>
                            ) : (
                                <button className="btn" id="dashboard_add" onClick={handleCheckLimitsforProject}>
                                    <FiPlusCircle size={20} className="mx-2 add-nav-button" />
                                    {translate("addProject")}
                                </button>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: { md: "flex", lg: "none" } }}>
                        <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="#000">
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>

                {renderMobileMenu}
            </Box>
        </>
    );
};

export default AdminHeader;
