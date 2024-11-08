"use client"
import React, { useCallback, useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import { Button, Form, Input, Select } from "antd";
import { BiSolidCheckCircle } from "react-icons/bi";
import { languageData } from "@/store/reducer/languageSlice";
import { useSelector } from "react-redux";
import { isLogin, loadPayStackApiKey, loadStripeApiKey, translate } from "@/utils";
import { store } from "@/store/store";
import { assignFreePackageApi, createPaymentIntentApi, getPackagesApi, getPaymentSettingsApi, paypalApi } from "@/store/actions/campaign";
import PackageCard from "@/Components/Skeleton/PackageCard";
import { settingsData } from "@/store/reducer/settingsSlice";
import { Modal } from "antd";
import InjectCheckout from "@/Components/Payment/StripeModal";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import countryLookup from "country-code-lookup";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Swal from "sweetalert2";
import NoData from "@/Components/NoDataFound/NoData";
import { useRouter } from "next/router";
import Layout from '../Layout/Layout';
import { userSignUpData } from '@/store/reducer/authSlice';
import LoginModal from '../LoginModal/LoginModal';
// Import Razorpay component
import useRazorpay from "react-razorpay";
import PaystackButton from 'react-paystack';
import { usePaystackPayment } from 'react-paystack';
import PaystackPop from '@paystack/inline-js';

const stripeLoadKey = loadStripeApiKey()
const stripePromise = loadStripe(stripeLoadKey);

const paystackLoadKey = loadPayStackApiKey()

const { Option } = Select;

const SubscriptionPlan = () => {
    const router = useRouter();

    const [packagedata, setPackageData] = useState([]);

    const userData = useSelector(userSignUpData);

    const user = userData?.data?.data

    const [loading, setLoading] = useState(false);

    const [paymentSettingsdata, setPaymentSettingsData] = useState([]);

    const [clientKey, setclientKey] = useState("");

    const [priceData, setPriceData] = useState("");

    const [stripeForm, setStripeForm] = useState({
        description: "",
        name: user?.name ? user?.name : "",
        address: user?.address ? user?.address : "",
        postalcode: "",
        city: user?.city ? user?.city : "",
        state: user?.state ? user?.state : "",
        country: "",
        amount: "",
        currency: "",
        payemnttypes: "",
        packageid: "",
    });

    const [stripeformModal, setStripeFormModal] = useState(false);

    const [showRazorpayModal, setShowRazorpayModal] = useState(false);

    const [showPaystackModal, setShowPaystackModal] = useState(false);

    const [showPaypalModal, setShowPaypal] = useState(false);

    const [paymentModal, setPaymentModal] = useState(false);

    const language = store.getState().Language.languages;

    const systemsettings = useSelector(settingsData);
    const [showModal, setShowModal] = useState(false);

    const lang = useSelector(languageData);
    // useSelector(languageData)
    useEffect(() => {

    }, [lang]);

    // Check if Stripe gateway is active
    const stripeActive = paymentSettingsdata.some(item => item.type === 'stripe_gateway' && item.data === '1');

    // Check if Razorpay gateway is active
    const razorpayActive = paymentSettingsdata.some(item => item.type === 'razorpay_gateway' && item.data === '1');

    // Check if PayStack gateway is active
    const payStackActive = paymentSettingsdata.some(item => item.type === 'paystack_gateway' && item.data === '1');

    // Check if PayStack gateway is active
    const payPalActive = paymentSettingsdata.some(item => item.type === "paypal_gateway" && item.data === '1');

    const getPaystackCurrency = (paymentSettings) => {
        const paystackCurrencySetting = paymentSettings.find(setting => setting.type === 'paystack_currency');
        return paystackCurrencySetting ? paystackCurrencySetting.data : null;
    };

    const paystackCurrency = getPaystackCurrency(paymentSettingsdata);

    const razorKeyObject = paymentSettingsdata.find(item => item.type === 'razor_key');
    const razorKey = razorKeyObject ? razorKeyObject.data : null;

    const payStackKeyObject = paymentSettingsdata.find(item => item.type === "paystack_public_key");
    const payStackPublicKey = payStackKeyObject ? payStackKeyObject.data : null;

    const stripeKeyObject = paymentSettingsdata.find(item => item.type === "stripe_publishable_key");
    const stripePublicKey = stripeKeyObject ? stripeKeyObject.data : null;

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleCountryCodeChange = (value) => {
        setStripeForm({ ...stripeForm, country: value });
    };
    const closeStripeModal = async () => {
        console.error("Payment canceled by the user.");

        // Close all modals
        setStripeFormModal(false);
        setPaymentModal(false);
        // setLoading(false);

        // Additional logic for handling payment cancellation
        // You can show a toast message or perform any other actions as needed
        toast.error(translate("paymentCanceled"));
    };
    const handleRazorpayModalClose = async () => {
        console.error("Payment canceled by the user.");

        // Close all modals
        setShowRazorpayModal(false);
        // setLoading(false);

        // Additional logic for handling payment cancellation
        // You can show a toast message or perform any other actions as needed
        toast.error(translate("paymentCanceled"));
    };


    // country codes
    const countryCodes = countryLookup.countries.map((elem) => ({
        value: elem.iso2,
        label: `${elem.iso2} (${elem.country})`,
    }));

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        },
    };
    const isUserLogin = isLogin();

    // get packages api
    useEffect(() => {
        setLoading(true);
        getPackagesApi(
            (res) => {
                setLoading(false);
                setPackageData(res.data);
            },
            (err) => {
                setLoading(false);
                console.log(err);
            }
        );
    }, [isUserLogin]);

    // payment settings api
    useEffect(() => {
        if (isLogin()) {
            getPaymentSettingsApi(
                (res) => {
                    setPaymentSettingsData(res.data);
                },
                (err) => {
                    toast.error(err);
                }
            );
        }
    }, []);
    // subscribe payment
    const subscribePayment = (e, data) => {
        e.preventDefault();

        if (!isUserLogin) {
            Swal.fire({
                title: translate("opps"),
                text: "You need to login!",
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: translate("ok"),
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowModal(true)
                }
            });
            return false;
        }
        if (systemsettings.demo_mode) {
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
            return false;
        }
        setPriceData(data);
        // here condition based on if before subscription is active
        if (isUserLogin) {
            paymentModalChecker(e, data);
        }


    };

    // paymentModalChecker
    const paymentModalChecker = (e, data) => {
        e.preventDefault();
        if (data?.price === 0) {
            assignFreePackageApi(
                data.id,
                (res) => {
                    router.push("/");
                    toast.success(res.message);
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            if (!stripeActive && !razorpayActive && !payStackActive && !payPalActive) {
                Swal.fire({
                    title: translate("opps"),
                    text: translate("noPaymenetActive"),
                    icon: "warning",
                    showCancelButton: false,
                    customClass: {
                        confirmButton: 'Swal-confirm-buttons',
                        cancelButton: "Swal-cancel-buttons"
                    },
                    confirmButtonText: translate("ok"),
                }).then(() => {
                    // Redirect to contact us page or handle accordingly
                    router.push("/contact-us");
                });
            } else {
                if (stripeActive) {
                    setStripeFormModal(true);
                } else if (razorpayActive) {
                    setShowRazorpayModal(true);
                } else if (payStackActive) {
                    setShowPaystackModal(true);
                } else if (payPalActive) {
                    setShowPaypal(true);
                }
            }
        }
    };



    // stripe submit
    const onStripeFormSubmit = async () => {
        // Update the form values
        setStripeForm({
            ...stripeForm,
            description: priceData.name,
            packageid: priceData.id,
            amount: priceData.price,
            currency: systemsettings?.currency_symbol,
            payemnttypes: "card",
        });

        try {
            // Display success toast
            // toast.success("Successfully Added");

            // create payment api
            createPaymentIntentApi(
                priceData.name,
                stripeForm.name,
                stripeForm.address,
                stripeForm.postalcode,
                stripeForm.city,
                stripeForm.state,
                stripeForm.country,
                priceData.price,
                systemsettings?.currency_symbol,
                "card",
                priceData.id,
                (res) => {
                    setclientKey(res?.data);
                    // on confirm close modal
                    setStripeFormModal(false);
                    setPaymentModal(true);
                },
                (err) => {
                    console.log(err);
                    // Set loading state to false in case of error
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("An error occurred during payment submission:", error);
            // Set loading state to false in case of an exception
            setLoading(false);
        }
    };


    // error
    const onFinishFailed = (errorInfo) => {
        const errorMessage = errorInfo.errorFields[0]?.errors[0]
        toast.error(errorMessage);
        setLoading(false);
    };

    // Example usage of the filter function
    const stripe_currency = systemsettings?.currency_symbol;

    // Packages with is_active === 1 come first
    const sortedPackageData = packagedata.sort((a, b) => {
        return b.is_active - a.is_active;
    });
    const handlePaymentFailure = async (error) => {
        // Close all modals
        setStripeFormModal(false);
        setPaymentModal(false);
    };
    const resetFormAndCardNumber = (elements) => {
        setStripeForm({
            description: "",
            name: "",
            address: "",
            postalcode: "",
            city: "",
            state: "",
            country: "",
            amount: "",
            currency: "",
            payemnttypes: "",
            packageid: "",
        });

        // Clear the card number
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
            cardElement.clear();
        }
    };

    useEffect(() => {
    }, [priceData])


    const [Razorpay, isLoaded] = useRazorpay();
    const handlePayment = useCallback(async () => {
        const options = {
            key: razorKey,
            amount: priceData?.price * 100,
            // currency: "INR",
            name: systemsettings?.company_name,
            description: systemsettings?.company_name,
            image: systemsettings?.web_logo,
            handler: (res) => {
                router.push("/")
                toast.success('Payment successful!');
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: user?.mobile,
            },
            notes: {
                address: user?.address,
                user_id: user?.id,
                package_id: priceData?.id
            },
            theme: {
                color: systemsettings?.system_color,
            },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();

        // Reset the showRazorpayModal state after payment completion
        rzpay.on('payment.failed', function (response) {
            setShowRazorpayModal(false);
            console.error(response.error.description);
            toast.error(response.error.description)
        });
    }, [systemsettings, priceData, user]);

    useEffect(() => {
        if (showRazorpayModal) {
            handlePayment();
        }
    }, [showRazorpayModal, handlePayment]);


    // paystack submit
    const handlePayStackPayment = async () => {
        try {
            // Initialize Paystack payment
            const handler = PaystackPop.setup({
                key: payStackPublicKey,
                email: user?.email,
                amount: priceData?.price * 100, // Paystack requires the amount in kobo (for NGN) or the lowest currency unit
                currency: paystackCurrency,
                ref: '' + Math.floor((Math.random() * 1000000000) + 1),
                callback: function (response) {
                    if (response.status === "success") {
                        // Handle successful payment here
                        toast.success("Payment successful!");
                        router.push('/');
                    } else {
                        // Handle unsuccessful payment here
                        toast.error("Payment failed. Please try again.");
                    }
                },
                onClose: function () {
                    // Handle the event when payment window is closed
                    toast.error("Payment window closed.");
                    setShowPaystackModal(false);
                },
                metadata: {
                    // Add metadata such as user_id
                    user_id: user?.id,
                    package_id: priceData?.id
                }
            });

            // Open the payment iframe
            handler.openIframe();
        } catch (error) {
            // Handle unexpected errors
            console.error("An error occurred while processing the payment:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };
    // paypal payment method 
    const handlePaypalPayment = async () => {
        try {
            await new Promise((resolve, reject) => {
                paypalApi({
                    package_id: priceData?.id,
                    amount: priceData?.price,
                    onSuccess: (res) => {
                        // Create a temporary DOM element to parse the HTML
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res, 'text/html');

                        // Find the form
                        const form = doc.querySelector('form[name="paypal_auto_form"]');

                        if (form) {
                            // Get the form action URL
                            const paypalUrl = form.action;

                            // Collect form data
                            const formData = new FormData(form);
                            const urlParams = new URLSearchParams(formData);

                            // Redirect to PayPal with the form data
                            window.location.href = `${paypalUrl}?${urlParams.toString()}`;
                        } else {
                            reject(new Error("PayPal form not found in the response"));
                        }
                    },
                    onError: (error) => {
                        console.log("error", error);
                        reject(new Error("PayPal API error: " + error));
                    }
                });
            });

        } catch (error) {
            console.error("PayPal payment error:", error);
            alert(`Payment error: ${error.message}`);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    useEffect(() => {
        if (showPaystackModal) {
            handlePayStackPayment()
        }
        if (showPaypalModal) {
            handlePaypalPayment()
        }
    }, [showPaystackModal, showPaypalModal, priceData.price, user?.email, priceData.id]);


    return (
        <Layout>
            <Breadcrumb title={translate("subscriptionPlan")} />

            <section id="subscription" className="mb-5">
                <div className="container">
                    <div>
                        <span className="headline">
                            {translate("chooseA")}{" "}
                            <span>
                                <span className=""> {translate("plan")}</span>
                            </span>{" "}
                            {translate("thatsRightForYou")}
                        </span>
                    </div>

                    <div className="subsCards-Wrapper pt-3">
                        {/* this is for packages buy */}
                        <Swiper
                            dir={language.rtl === 1 ? "rtl" : "ltr"}
                            slidesPerView={4}
                            // loop={true}
                            spaceBetween={30}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className="subscription-swiper"
                            breakpoints={breakpoints}
                        >
                            {loading ? (
                                <>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Swiper
                                            dir={language.rtl === 1 ? "rtl" : "ltr"}
                                            slidesPerView={4}
                                            // loop={true}
                                            spaceBetween={30}
                                            freeMode={true}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[FreeMode, Pagination]}
                                            className="subscription-swiper"
                                            breakpoints={breakpoints}
                                        >
                                            <SwiperSlide key={index}>

                                                <div className="col-lg-3 col-md-6 col-12 main_box" key={index}>
                                                    <PackageCard />
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {sortedPackageData.length > 0 ? (
                                        sortedPackageData.map((elem, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="card text-white" id={`${elem.is_active ? "current_package_card" : "other_package_card"}`}>
                                                    <div id="package_headlines">
                                                        <span className={`${elem.is_active ? "current_package_card_title" : "other_card_title"}`}>{elem?.name}</span>
                                                        <h1 className="card_text">
                                                            {
                                                                elem.price !== 0
                                                                    ? systemsettings?.currency_symbol + elem.price
                                                                    : "Free"
                                                            }

                                                        </h1>
                                                    </div>

                                                    <div className="subs_other_content">
                                                        <div className="limits">
                                                            {elem.type !== "premium_user" && elem?.advertisement_limit !== "not_available" ? (
                                                                <span className="limits_content">
                                                                    <span>
                                                                        <BiSolidCheckCircle size={20} />{" "}
                                                                    </span>
                                                                    <span> {translate("Advertisement limit is :")} {elem.advertisement_limit === "unlimited" ? "Unlimited" : elem.advertisement_limit} </span>
                                                                </span>
                                                            ) : null}
                                                            {elem.type !== "premium_user" && elem?.property_limit !== "not_available"
                                                                ? (
                                                                    <span className="limits_content">
                                                                        <span>
                                                                            <BiSolidCheckCircle size={20} />{" "}
                                                                        </span>
                                                                        <span> {translate("Property limit is :")} {elem.property_limit === "unlimited" ? "Unlimited" : elem.property_limit}</span>
                                                                    </span>
                                                                ) :
                                                                null
                                                            }
                                                            <span className="limits_content">
                                                                <span>
                                                                    <BiSolidCheckCircle size={20} />{" "}
                                                                </span>
                                                                <span> {translate("Validity")} {elem.duration} {translate("days")}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {elem.is_active ? (
                                                        <div className="spacer"></div>
                                                    ) : (
                                                        <div className="card-footer">
                                                            <div className="subscribe_button">
                                                                <button type="submit" onClick={(e) => subscribePayment(e, elem)}>
                                                                    {translate("Subscribe")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <>
                                            <div className="noDataFoundDiv">
                                                <NoData />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </Swiper>
                    </div>
                </div>
            </section>


            {/* Stripe Modal  */}
            {stripeActive &&
                <>
                    {/* stripe element */}
                    <Modal centered open={paymentModal} footer={null} onCancel={closeStripeModal}>
                        <Elements stripe={stripePromise} client_key={clientKey} currency={stripe_currency} orderID={priceData.id} amount={priceData.price}>
                            <InjectCheckout
                                stripeForm={stripeForm}
                                orderID={priceData.id}
                                currency={stripe_currency}
                                client_key={clientKey}
                                amount={priceData.price}
                                onFailure={handlePaymentFailure}
                                setPaymentModal={setPaymentModal}
                                resetFormAndCardNumber={resetFormAndCardNumber}
                            />
                        </Elements>
                    </Modal>

                    {/* stripe form address */}
                    <Modal className="stripemodal" onCancel={() => setStripeFormModal(false)} centered open={stripeformModal} footer={null}>
                        <Form
                            name="basic"
                            initialValues={stripeForm}
                            onFinish={onStripeFormSubmit}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className="stripeform pt-5"
                        >
                            <Form.Item
                                label={translate("Name")}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your name!")
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setStripeForm({ ...stripeForm, name: e.target.value })} />
                            </Form.Item>

                            <Form.Item
                                label={translate("address")}
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your address!"),
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setStripeForm({ ...stripeForm, address: e.target.value })} />
                            </Form.Item>

                            <Form.Item
                                label={translate("PostalCode")}
                                name="postalcode"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your postal code!"),
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    pattern="[0-9]{6}"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                                        setStripeForm({ ...stripeForm, statePostalCode: e.target.value });
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={translate("city")}
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your city"),
                                    },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: "Please enter only letters for the city",
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setStripeForm({ ...stripeForm, city: e.target.value })} />
                            </Form.Item>

                            <Form.Item
                                label={translate("state")}
                                name="state"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your state"),
                                    },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: "Please enter only letters for the state",
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setStripeForm({ ...stripeForm, state: e.target.value })} />
                            </Form.Item>

                            <Form.Item
                                label={translate("country")}
                                name="country"
                                rules={[
                                    {
                                        required: true,
                                        message: translate("Please enter your country"),
                                    },
                                ]}
                            >
                                {countryCodes.length > 0 ? (
                                    <Select
                                        showSearch // Enable search functionality
                                        filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={handleCountryCodeChange}
                                        placeholder={translate("Select a country code")}
                                        value={stripeForm.country}
                                        className="w-100"
                                    >
                                        {countryCodes.map((country) => (
                                            <Option key={country.value} value={country.value} label={country.label}>
                                                {country.label}
                                            </Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <p>{translate("Loading country codes...")}</p>
                                )}
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button className="w-100 stripebtn" type="primary" htmlType="submit">
                                    {translate("submit")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>

            }

            {
                showModal &&
                <LoginModal isOpen={showModal} onClose={handleCloseModal} />
            }
        </Layout >
    )
}

export default SubscriptionPlan
