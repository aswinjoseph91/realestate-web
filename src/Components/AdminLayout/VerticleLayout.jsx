"use client"
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessIcon from '@mui/icons-material/Business';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import AdminHeader from "./AdminHeader.jsx";
import AdminFooter from "./AdminFooter.jsx";
import Link from "next/link";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import StarsIcon from '@mui/icons-material/Stars';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { placeholderImage, translate } from "@/utils/index.js";
import { logoutSuccess } from "@/store/reducer/authSlice.js";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/router.js";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { RiAdvertisementLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice.js";
import { GetLimitsApi, SystemSettingsApi, beforeLogoutApi, deleteUserApi } from "@/store/actions/campaign.js"
import { store } from "@/store/store.js";
import Image from "next/image";
import { Fcmtoken, settingsData, settingsSuccess } from "@/store/reducer/settingsSlice.js";
import { getAuth, deleteUser } from 'firebase/auth';
import { isSubscribeRoutes, protectedRoutes } from "@/routes/routes.jsx";
import { usePathname } from 'next/navigation'
import { isSupported } from "firebase/messaging";
import { useMediaQuery, useTheme } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#282F39",
    height: "12vh",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));
export default function VerticleLayout(props) {
    const { children } = props;

    const [isMessagingSupported, setIsMessagingSupported] = useState(false);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const settingData = useSelector(settingsData);
    const dispatch = useDispatch()
    const FcmToken = useSelector(Fcmtoken)

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
    if (isSmallScreen) {
        setOpen(false);
    } else {
        setOpen(true);
    }
}, [isSmallScreen]);

    useEffect(() => {
        const checkMessagingSupport = async () => {
            try {
                const supported = await isSupported();
                setIsMessagingSupported(supported);

                if (supported) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationPermissionGranted(true);
                    }
                }
            } catch (error) {
                console.error('Error checking messaging support:', error);
            }
        };

        checkMessagingSupport();
    }, [notificationPermissionGranted, isMessagingSupported]);
    const [open, setOpen] = React.useState(true);
    const lang = useSelector(languageData);
    const router = useRouter();
    const pathname = usePathname();


    const hasSubscription = settingData?.subscription

    const CheckActiveUserAccount = () => {
        if (settingData?.is_active === false) {
            Swal.fire({
                title: translate("opps"),
                text: translate("yourAccountDeactiveted"),
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("logout"),
            }).then((result) => {
                if (result.isConfirmed) {
                    logoutSuccess();
                    signOut()
                }
            });
        }
    }
    useEffect(() => {
        CheckActiveUserAccount()
    }, [settingData?.is_active])

    const currentRoute = router.pathname;

    const isRouteActive = (route) => {
        return currentRoute === route;
    };

    useEffect(() => {
        SystemSettingsApi({
            onSuccess: (res) => {
                dispatch(settingsSuccess({ data: res.data }));
                document.documentElement.style.setProperty('--primary-color', res?.data?.system_color);
                document.documentElement.style.setProperty('--primary-category-background', res?.data?.category_background);
                document.documentElement.style.setProperty('--primary-sell', res?.data?.sell_background);
            },
            onError: (err) => {
                console.log(err);
            }
        });
    }, [isLoggedIn, userCurrentId]);


    const language = store.getState().Language.languages;
    const current_user = store.getState().User_signup?.data?.data?.id



    useEffect(() => { }, [lang]);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleLogout = () => {
        Swal.fire({
            title: translate("areYouSure"),
            text: translate("youNotAbelToRevertThis"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: translate("yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    beforeLogoutApi({
                        fcm_id:FcmToken,
                        onSuccess: (res) => {
                            // Perform the logout action
                            logoutSuccess();

                            toast.success(translate("logoutSuccess"));

                            router.push("/");
                        },
                        onError: (err) => {
                            console.log(err)
                        }
                    })
                } catch (error) {
                    console.log(error)
                }

                // Clear the recaptchaVerifier by setting it to null
                // window.recaptchaVerifier = null;
            } else {
                toast.error(translate("logoutcancel"));
            }
        });
    };






    const handleDeleteAcc = async () => {

        if (settingData && settingData.demo_mode === true) {
            Swal.fire({
                title: translate("opps"),
                text: translate("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            });
            return; // Stop further execution
        }


        // Initialize Firebase Authentication
        const auth = getAuth();

        // Get the currently signed-in user
        const user = auth.currentUser;

        Swal.fire({
            title: translate("areYouSure"),
            text: translate("youNotAbelToRevertThis"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            cancelButtonColor: "#d33",
            confirmButtonText:translate("yes"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Delete the user
                if (user) {

                    await deleteUser(user)
                        .then(() => {
                            deleteUserApi({

                                onSuccess: (res) => {
                                    router.push("/");
                                    toast.success(translate("userDeleteSuccess"))
                                    logoutSuccess();

                                },
                                onError: (err) => {
                                    console.log(err)
                                }
                            })
                        })
                        .catch((error) => {
                            console.error('Error deleting user:', error.message);
                            if (error.code === "auth/requires-recent-login") {
                                router.push("/");
                                toast.error(translate("deletePop"));
                                logoutSuccess();
                            }
                        });
                } else {
                    deleteUserApi({
                        onSuccess: (res) => {
                            router.push("/");
                            toast.success(translate("userDeleteSuccess"))
                            logoutSuccess();

                        },
                        onError: (err) => {
                            console.log(err)
                        }
                    })
                }
            } else {
                console.log("delete account process canceled ")
            }
        });
    };



    const handleChat = () => {

        if (settingData && settingData.demo_mode === true) {
            Swal.fire({
                title: translate("opps"),
                text: translate("notAllowdDemo"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            });
            return; // Stop further execution
        }
        if (isMessagingSupported && notificationPermissionGranted) {
            // If not in demo mode, navigate to the chat page
            router.push('/user/chat');
        } else {
            Swal.fire({
                title: translate("opps"),
                text: translate("notificationPermissionDenied"),
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            });
        }
    };

    // Check if the current route requires a subscription
    const requiresAuth = protectedRoutes.includes(pathname);

    useEffect(() => {
        authCheck();
    }, [requiresAuth, userCurrentId]); // Add userCurrentId to the dependencies

    const authCheck = () => {
        if (requiresAuth && !userCurrentId) {
            Swal.fire({
                icon: "error",
                title: translate("opps"),
                text: translate("youHaveToLoginFirst"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/"); // Redirect to the subscription page
                }
            });
        }
    };



    // Check if the current route requires a subscription
    const requiresSubscription = isSubscribeRoutes.includes(pathname);

    useEffect(() => {
        subscriptionCheck();
    }, [requiresSubscription]);

    const subscriptionCheck = () => {


        if (requiresSubscription && !hasSubscription) {
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
    const handleCheckLimits = (e) => {
        e.preventDefault()
        // router.push("/user/properties");
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


    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: "#fff",
                    height: "10vh",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "10vh",
                    }}
                >
                    <IconButton
                        color="inherit"
                        className="open_drawer"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link href="/user/dashboard">
                        <Image loading="lazy" src={settingData?.app_home_screen} alt="no_img" className="dashboard_mobile_logo" width={30} height={30} onError={placeholderImage} />
                    </Link>
                    <div className="container">
                        <AdminHeader hasSubscription={hasSubscription} />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} className={`${open ? 'isOpen': ""}`} sx={{
                 display: isSmallScreen && !open ?  'none':""
            }}>
                <DrawerHeader
                    sx={{
                        height: "10vh",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Link href="/">
                            <Image loading="lazy" src={settingData?.web_footer_logo} alt="no_img" className="dashboard_logo" width={200} height={200} onError={placeholderImage} />
                        </Link>
                        <IconButton
                            onClick={handleDrawerClose}
                            className="drawer_button"
                            sx={{
                                fontSize: "30",
                            }}
                        >
                            {language.rtl === 1 ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                        </IconButton>
                    </Box>
                </DrawerHeader>
                <Divider />
                <List className="drawer_list" sx={{
                    display: isSmallScreen && !open ?  'none':""
                }}>
                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/dashboard') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                        <Link href="/user/dashboard">
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/dashboard') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}

                                >
                                    <DashboardOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("myDashboard")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/advertisement') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                        <Link href="/user/advertisement">
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/advertisement') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <RiAdvertisementLine size={23} />
                                </ListItemIcon>
                                <ListItemText primary={translate("myAdvertisement")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/projects') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                        <Link href="/user/projects">
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/projects') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <BusinessIcon size={23} />
                                </ListItemIcon>
                                <ListItemText primary={translate("myProjects")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/properties') ? 'drawer_list_item_active' : 'drawer_list_item'} onClick={handleCheckLimits}>
                        <ListItemButton
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className={isRouteActive('/user/properties') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <AddHomeOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("properties")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/add-project') ? 'drawer_list_item_active' : 'drawer_list_item'}
                        onClick={handleCheckLimitsforProject}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className={isRouteActive('/user/add-project') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >

                                <DomainAddIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("projects")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    <Link href="/user/favorites-properties">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/favorites-properties') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/favorites-properties') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FavoriteBorderOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("fav")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    {/* {isMessagingSupported && notificationPermissionGranted && ( */}
                    <ListItem
                        disablePadding
                        sx={{ display: "block" }}
                        className={isRouteActive('/user/chat') ? 'drawer_list_item_active' : 'drawer_list_item'}
                    >
                        <ListItemButton
                            onClick={handleChat}
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className={isRouteActive('/user/chat') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <SmsOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("messages")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/* )} */}

                    <Link href="/user/profile">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/profile') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/profile') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TagFacesOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("myProfile")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/user/personalize-feed">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/personalize-feed') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/personalize-feed') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <StarsIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("personalizeFeed")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Link href="/user/notifications">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/notifications') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/notifications') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <NotificationsNoneIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("notification")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Link href="/user/subscription">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/subscription') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/subscription') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PaidOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("mySub")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Link href="/user/transaction-history">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/transaction-history') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/transaction-history') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("transactionHistory")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <ListItem disablePadding sx={{ display: "block" }} className='drawer_list_item'>
                        <ListItemButton
                            onClick={handleDeleteAcc}
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className='drawer_list_icon'
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <DeleteOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("deleteUser")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }} className='drawer_list_item'>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className="drawer_list_icon"
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("logout")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden", marginBottom: "100px" }}>
                <DrawerHeader
                    sx={{
                        background: "#f5f5f5",
                    }}
                />

                {children}
            </Box>

            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: "#fff",
                    top: "auto",
                    bottom: "0",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <AdminFooter />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
