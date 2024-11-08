"use client"
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { toast } from "react-hot-toast";
import { handleFirebaseAuthError, translate } from "@/utils";
import { useSelector } from "react-redux";
import { Fcmtoken, settingsData } from "@/store/reducer/settingsSlice";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import { signupLoaded } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import { PhoneNumberUtil } from "google-libphonenumber";
import Swal from "sweetalert2";
import Link from "next/link";
import { GetOTPApi, verifyOTPApi } from "@/store/actions/campaign";
import Countdown from "react-countdown";

const LoginModal = ({ isOpen, onClose }) => {
    const SettingsData = useSelector(settingsData);

    const isDemo = SettingsData?.demo_mode;
    const CompanyName = SettingsData?.company_name
    const ShowPhoneLogin = SettingsData?.number_with_otp_login === "1";
    const ShowGoogleLogin = SettingsData?.social_login === "1";

    const isFirebaseOtp = SettingsData?.otp_service_provider === "firebase"
    const isTwilloOtp = SettingsData?.otp_service_provider === "twilio"

    // If both are "0", default to showing the phone login
    const DefaultToPhoneLogin = !ShowPhoneLogin && !ShowGoogleLogin;


    const navigate = useRouter();
    const { authentication } = FirebaseData();
    const FcmToken = useSelector(Fcmtoken);

    const DemoNumber = "+911234567890";
    const DemoOTP = "123456";
    const [showOTPContent, setShowOtpContent] = useState(false);
    const [phonenum, setPhonenum] = useState();
    const [value, setValue] = useState(isDemo ? DemoNumber : "");
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [otp, setOTP] = useState("");
    const [resendTimer, setResendTimer] = useState(120);
    const [showLoader, setShowLoader] = useState(true);

    const inputRefs = useRef([]);
    const otpInputRef = useRef(null);

    const generateRecaptcha = () => {
        if (!window?.recaptchaVerifier) {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer) {
                window.recaptchaVerifier = new RecaptchaVerifier(authentication, recaptchaContainer, {
                    size: 'invisible',
                    'callback': (response) => {
                        // Recaptcha callback if needed
                    }
                });
            } else {
                console.error('recaptcha-container element not found');
            }
        }
    };

    useEffect(() => {
        generateRecaptcha();
        setShowLoader(true);
        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                } catch (error) {
                    console.error("Error clearing recaptchaVerifier:", error);
                }
            }

            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (recaptchaContainer) {
                recaptchaContainer.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (showOTPContent) {
            generateRecaptcha();
        }

    }, []);

    const generateOTPWithTwilio = async (phoneNumber) => {
        // Parse the phone number to get formatted number without '+'
        const parsedNumber = parsePhoneNumber(phoneNumber);
        const formattedNumber = parsedNumber.format('E.164').slice(1); // Remove the '+' sign
        try {
            GetOTPApi({
                number: formattedNumber,
                onSuccess: (res) => {
                    setShowLoader(false)
                    setShowOtpContent(true)
                    toast.success(res?.message)
                },
                onError: (error) => {
                    setShowLoader(false)
                    console.log(error)
                    toast.error(error?.message)
                }
            })
        } catch (error) {
            console.error("Error generating OTP with Twilio:", error);
            toast.error(error.message || translate("otpSendFailed"));
            setShowLoader(false);
        }
    };

    const onSignUp = (e) => {
        e.preventDefault();
        if (!value) {
            toast.error(translate("enterPhoneNumber"));
            return;
        }
        try {
            const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'ZZ');
            if (!phoneUtil.isValidNumber(phoneNumber)) {
                toast.error(translate("validPhonenum"));
                return;
            }
            setPhonenum(value)
            setShowOtpContent(true);
            setShowLoader(true);

            if (isFirebaseOtp) {
                generateOTP(value);
            } else if (isTwilloOtp) {
                generateOTPWithTwilio(value);
            }

            if (isDemo) {
                setValue(DemoNumber);
            } else {
                setValue("");
            }
        } catch (error) {
            console.error("Error parsing phone number:", error);
            toast.error(translate("validPhonenum"));
        }
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const response = await signInWithPopup(authentication, provider);
            signupLoaded({
                name: response?.user?.displayName,
                email: response?.user?.email,
                type: "0",
                auth_id: response?.user?.uid,
                profile: response?.user?.photoURL,
                fcm_id: FcmToken,
                onSuccess: (res) => {
                    let signupData = res.data;
                    if (!res.error) {
                        if (signupData.mobile === "") {
                            navigate.push("/user-register");
                            onCloseLogin();
                        } else {
                            toast.success(res.message);
                            onCloseLogin();
                        }
                    }
                },
                onError: (err) => {
                    if (err === 'Account Deactivated by Administrative please connect to them') {
                        onCloseLogin();
                        Swal.fire({
                            title: translate("opps"),
                            text: translate("accountDeactivatedByAdmin"),
                            icon: "warning",
                            showCancelButton: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                            confirmButtonText: translate("ok"),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate.push("/contact-us");
                            }
                        });
                    }
                }
            }
            );
        } catch (error) {
            console.error(error);
            toast.error(translate("popupCancel"));
        }
    };

    const onCloseLogin = (e) => {
        if (e) {
            e.stopPropagation();
        }
        onClose();
        setShowOtpContent(false)
        setOTP(""); // Clear the OTP value
        setResendTimer(120)
    };

    useEffect(() => {

    }, [phonenum])

    const generateOTP = (phoneNumber) => {


        if (!window.recaptchaVerifier) {
            console.error('window.recaptchaVerifier is null, unable to generate OTP');
            return;
        }
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                toast.success(translate("otpSentsuccess"));
                setShowLoader(false);
                if (isDemo) {
                    setOTP(DemoOTP)
                }
                // Handle success
            })
            .catch((error) => {
                console.error("Error generating OTP:", error);
                const errorCode = error.code
                handleFirebaseAuthError(errorCode)
                setShowLoader(false);
            });
    };


    const handleConfirm = (e) => {
        e.preventDefault();

        if (otp === "") {
            toast.error(translate("pleaseEnterOtp"));
            return;
        }
        setShowLoader(true);
        if (isFirebaseOtp) {
            let confirmationResult = window.confirmationResult;
            confirmationResult
                .confirm(otp)
                .then(async (result) => {
                    signupLoaded({
                        mobile: result.user.phoneNumber.replace("+", ""),
                        type: "1",
                        auth_id: result.user.uid,
                        fcm_id: FcmToken,
                        onSuccess: (res) => {
                            let signupData = res.data;
                            setShowLoader(false);
                            if (!res.error) {
                                if (signupData.name === "" || signupData.email === "") {
                                    navigate.push("/user-register");
                                    onCloseLogin();

                                } else {
                                    toast.success(res.message);
                                    onCloseLogin();
                                }
                            }
                        },
                        onError: (err) => {
                            console.log(err);
                            if (err === 'Account Deactivated by Administrative please connect to them') {
                                onCloseLogin();
                                Swal.fire({
                                    title: translate("opps"),
                                    text: translate("accountDeactivatedByAdmin"),
                                    icon: "warning",
                                    showCancelButton: false,
                                    customClass: {
                                        confirmButton: 'Swal-confirm-buttons',
                                        cancelButton: "Swal-cancel-buttons"
                                    },
                                    confirmButtonText: translate("ok"),
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        navigate.push("/contact-us");
                                    }
                                });
                            }
                        }
                    }
                    );
                })
                .catch((error) => {
                    console.log(error);
                    const errorCode = error.code
                    handleFirebaseAuthError(errorCode)
                    setShowLoader(false);
                });
        } else if (isTwilloOtp) {
            try {
                verifyOTPApi({
                    number: phonenum,
                    otp: otp,
                    onSuccess: (res) => {
                        signupLoaded({
                            mobile: phonenum?.replace("+", ""),
                            type: '1',
                            auth_id: res.auth_id,
                            onSuccess: (res) => {
                                let signupData = res.data;
                                setShowLoader(false);
                                if (!res.error) {
                                    if (signupData.name === "" || signupData.email === "") {
                                        navigate.push("/user-register");
                                        onCloseLogin();

                                    } else {
                                        toast.success(res.message);
                                        onCloseLogin();
                                    }
                                }
                            },
                            onError: (err) => {
                                console.log(err);
                                toast.error(err)
                                if (err === 'Account Deactivated by Administrative please connect to them') {
                                    onCloseLogin();
                                    Swal.fire({
                                        title: translate("opps"),
                                        text: translate("accountDeactivatedByAdmin"),
                                        icon: "warning",
                                        showCancelButton: false,
                                        customClass: {
                                            confirmButton: 'Swal-confirm-buttons',
                                            cancelButton: "Swal-cancel-buttons"
                                        },
                                        confirmButtonText: translate("ok"),
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            navigate.push("/contact-us");
                                        }
                                    });
                                }
                            }
                        }
                        )
                    },
                    onError: (error) => {
                        console.log(error)
                        toast.error(error)
                        setShowLoader(false);
                    }

                })
            } catch (error) {
                console.error("Error verifying OTP with Twilio:", error);
                toast.error(error.message || translate("otpVerificationFailed"));
                setShowLoader(false);
            }
        }
    };

    const handleChange = (event, index) => {
        const value = event.target.value;
        if (!isNaN(value) && value !== "") {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index] = value;
                return newOTP.join("");
            });
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && index > 0) {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index - 1] = "";
                return newOTP.join("");
            });
            inputRefs.current[index - 1].focus();
        } else if (event.key === "Backspace" && index === 0) {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[0] = "";
                return newOTP.join("");
            });
        }
    };
    useEffect(() => {
        let intervalId;

        if (resendTimer > 0) {
            // Decrement the timer immediately without waiting for the first interval
            setResendTimer((prevTimer) => prevTimer - 1);

            intervalId = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [resendTimer]);

    // const handleResendOTP = () => {
    //     setResendTimer(120);
    //     if (isFirebaseOtp) {
    //         generateOTP(phonenum);
    //     } else {
    //         generateOTPWithTwilio(phonenum)
    //     }
    // };
    // // Function to format time into mm:ss
    // const formatTime = (timer) => {
    //     const minutes = Math.floor(timer / 60);
    //     const seconds = timer % 60;
    //     return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    // };



    useEffect(() => {
        if (!showOTPContent && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [showOTPContent]);


    const [resendAllowed, setResendAllowed] = useState(false);

    const handleResendOTP = () => {
        if (isFirebaseOtp) {
            generateOTP(phonenum);
        } else {
            generateOTPWithTwilio(phonenum);
        }

        setResendAllowed(false); // Disable resend button after OTP is sent
    };

    // Countdown renderer for formatting the time as mm:ss
    const countdownRenderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            // When countdown completes, enable resend button
            setResendAllowed(true);
            return (
                <span id="re-text" onClick={handleResendOTP}>
                    {translate('resendOtp')}
                </span>
            );
        } else {
            // Display remaining time in mm:ss format
            return (
                <div>
                    <span className="resend-text"> {translate('resendCodeIn')} </span>
                    <span className="resend-time">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds} {translate('seconds')}
                    </span>
                </div>
            );
        }
    };
    return (
        <>
            <Modal
                show={isOpen}
                onHide={onCloseLogin}
                ize="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered className={`${!showOTPContent ? 'login-modal' : "otp-modal"}`}
                backdrop="static">
                <Modal.Header>
                    {!showOTPContent ? (
                        <Modal.Title>{translate("login&Register")}</Modal.Title>

                    ) : (
                        <Modal.Title>{translate("verification")}</Modal.Title>
                    )}
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onCloseLogin} />
                </Modal.Header>
                <Modal.Body>
                    {!showOTPContent ? (

                        <>
                            {(ShowPhoneLogin || DefaultToPhoneLogin) && (
                                <form>
                                    <div className="modal-body-heading">
                                        <h4>{translate("enterMobile")}</h4>
                                        <span>{translate("sendCode")}</span>
                                    </div>
                                    <div className="mobile-number">
                                        <label htmlFor="phone">{translate("phoneNumber")}</label>
                                        <PhoneInput
                                            defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
                                            disabledCountryCode={false}
                                            countryCallingCodeEditable={true}
                                            international={true}
                                            value={value}
                                            onChange={setValue}
                                            className="custom-phone-input"
                                        />
                                    </div>
                                    <div className="continue">
                                        <button
                                            type="submit"
                                            className="continue-button"
                                            onClick={onSignUp}
                                        >
                                            {translate("continue")}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Show the divider only if both login options are enabled */}
                            {ShowPhoneLogin && ShowGoogleLogin && (
                                <div className="or_devider">
                                    <hr />
                                    <span>{translate("or")}</span>
                                    <hr />
                                </div>
                            )}

                            {ShowGoogleLogin && (
                                <>
                                    {!ShowPhoneLogin &&
                                        <div className="modal-body-heading">
                                            <h4>{translate("loginTo")} {CompanyName}</h4>
                                            <span>{translate("connectWithGoogle")}</span>
                                        </div>
                                    }
                                    <div className={`google_signup ${!ShowPhoneLogin ? "mt-5" : "mt-3"}`} onClick={handleGoogleSignup}>
                                        <button className="google_signup_button">
                                            <div className="google_icon">
                                                <FcGoogle size={25} />
                                            </div>
                                            <span className="google_text">{translate("CWG")}</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <form>
                                <div className="modal-body-heading">
                                    <h4>{translate("otpVerification")}</h4>
                                    <span>
                                        {translate("enterOtp")} {phonenum}
                                    </span>
                                </div>
                                <div className="userInput">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <input
                                            key={index}
                                            className="otp-field"
                                            type="text"
                                            maxLength={1}
                                            value={otp[index] || ""}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={(inputRef) => (inputRefs.current[index] = inputRef)}
                                        />
                                    ))}
                                </div>

                                <div className="resend-code">
                                    {/* {resendTimer > 0 ? (
                                        <div>
                                            <span className="resend-text"> {translate("resendCodeIn")}</span>
                                            <span className="resend-time">
                                                {" "}
                                                {formatTime(resendTimer)} {translate("seconds")}
                                            </span>
                                        </div>
                                    ) : (
                                        <span id="re-text" onClick={handleResendOTP}>
                                            {translate("resendOtp")}
                                        </span>
                                    )} */}
                                    {resendAllowed ? (
                                        <span id="re-text" onClick={handleResendOTP} style={{ cursor: 'pointer', color: 'blue' }}>
                                            {translate('resendOtp')}
                                        </span>
                                    ) : (
                                        <Countdown
                                            date={Date.now() + 120000} // Countdown for 2 minutes (120000 ms)
                                            renderer={countdownRenderer}
                                            onComplete={() => setResendAllowed(true)}
                                        />
                                    )}
                                </div>
                                <div className="continue">
                                    <button type="submit" className="continue-button" onClick={handleConfirm}>
                                        {showLoader ? (
                                            <div className="loader-container-otp">
                                                <div className="loader-otp"></div>
                                            </div>
                                        ) : (
                                            <span>{translate("confirm")}</span>
                                        )}
                                    </button>
                                </div>
                            </form>

                        </>
                    )}
                </Modal.Body>
                {!showOTPContent &&
                    <Modal.Footer>
                        <span>
                            {translate("byclick")} <Link href="/terms-and-condition">{translate("terms&condition")}</Link> <span className="mx-1"> {translate("and")} </span> <Link href="/privacy-policy"> {translate("privacyPolicy")} </Link>
                        </span>
                    </Modal.Footer>
                }
            </Modal>
            <div id="recaptcha-container"></div>
        </>
    );
};

export default LoginModal;
