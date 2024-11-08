"use client"
import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Location from "@/Components/Location/Location";
import { useRouter } from "next/router";
import { loadUpdateData, loadUpdateUserData, userSignUpData } from "../../store/reducer/authSlice";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { UpdateProfileApi } from "@/store/actions/campaign";
import dummyimg from "../../assets/Images/user_profile.png";
import { languageData } from "@/store/reducer/languageSlice";
import { placeholderImage, translate } from "@/utils";
import LocationSearchBox from "@/Components/Location/LocationSearchBox";
import Image from "next/image";
import { Fcmtoken } from '@/store/reducer/settingsSlice';
import Layout from '../Layout/Layout';

const UserRegister = () => {

    const navigate = useRouter();
    const signupData = useSelector(userSignUpData);
    const FcmToken = useSelector(Fcmtoken)
    const navigateToHome = () => {
        navigate.push("/");
    };

    useEffect(() => {
        if (signupData.data === null) {
            navigate.push("/");
        }
    }, [signupData])
    const [showCurrentLoc, setShowCurrentLoc] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [username, setUsername] = useState(signupData?.data?.data?.name ? signupData?.data?.data?.name : "");
    const [email, setEmail] = useState(signupData?.data?.data?.email ? signupData?.data?.data?.email : "");
    const [mobile, setMobile] = useState(signupData?.data?.data?.mobile ? signupData?.data?.data?.mobile : "");
    const [address, setAddress] = useState();
    const [image, setImage] = useState();
    const fileInputRef = useRef(null);

    const [uploadedImage, setUploadedImage] = useState(signupData?.data?.data?.profile ? signupData?.data?.data?.profile : null);

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const handleOpenLocModal = () => {
        // onClose()
        setShowCurrentLoc(true);
    };
    const handleCloseLocModal = () => {
        setShowCurrentLoc(false);
    };
    const handleSelectLocation = (location) => {

        setSelectedLocation(location);
    };
    const modalStyle = {
        display: showCurrentLoc ? "none" : "block",
    };
    const handleUploadButtonClick = () => {
        fileInputRef.current.click(); // Trigger the file input click event
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];


        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // const imageBlob = new Blob([e.target.result], { type: file.type });

                setImage(file);
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmitInfo = (e) => {
        e.preventDefault();

        if (signupData.data.data.logintype === "1") {
            if (!email.trim()) {
                toast.error(translate("fillEmail"));
                return; // Stop further execution
            }
        } else {
            if (!mobile.trim()) {
                toast.error(translate("fillMobile"));
                return; // Stop further execution
            }
        }


        UpdateProfileApi({
            // userid: signupData.data.data.id,
            name: username,
            email: email,
            mobile: mobile,
            address: address,
            firebase_id: signupData.data.data.firebase_id,
            profile: image,
            fcm_id: FcmToken,
            notification: "1",
            city: selectedLocation && selectedLocation.city ? selectedLocation.city : "",
            state: selectedLocation && selectedLocation.state ? selectedLocation.state : "",
            country: selectedLocation && selectedLocation.country ? selectedLocation.country : "",
            onSuccess: (res) => {
                toast.success(translate("userRegister"));
                loadUpdateUserData(res.data);
                navigate.push("/");
            },
            onError: (err) => {
                toast.error(err);
            }
        });
    };

    return (
        <Layout>
            <Breadcrumb title={translate("basicInfo")} />
            <section id="user_register">
                <div className="container">
                    <div className="row" id="register_main_card">
                        <div className="col-sm-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">{translate("addInfo")}</div>
                                </div>
                                <div className="card-body">
                                    <form action="">
                                        <div className="form_all_fields">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="add_profile_div">
                                                        <div className="image_div">
                                                            <Image loading="lazy" src={uploadedImage || dummyimg.src} alt="no_img" width={200} height={200} onError={placeholderImage} />
                                                        </div>
                                                        <div className="add_profile">
                                                            <input type="file" accept="image/jpeg, image/png" id="add_img" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
                                                            <button type="button" onClick={handleUploadButtonClick}>
                                                                {translate("uploadImg")}
                                                            </button>

                                                            <p>{translate("Note:")}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-sm-12 col-md-6">
                                                    <div className="user_fields">
                                                        <span>{translate("userName")}</span>
                                                        <input type="text" name="uname" placeholder={translate("Enter Your Name")} value={username} onChange={(e) => setUsername(e.target.value)} required />
                                                    </div>
                                                </div>
                                                {signupData?.data?.data?.logintype === "1" ? (

                                                    <div className="col-sm-12 col-md-6">
                                                        <div className="user_fields">
                                                            <span>{translate("email")}</span>
                                                            <input type="email" name="email" placeholder={translate("Enter Your Email")} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-sm-12 col-md-6">
                                                        <div className="user_fields">
                                                            <span>{translate("phoneNumber")}</span>
                                                            <input
                                                                type="text"
                                                                name="mobile"
                                                                placeholder={translate("Enter Your Number")}
                                                                value={mobile}
                                                                onChange={(e) => setMobile(e.target.value)}
                                                                required
                                                                onKeyPress={(e) => {
                                                                    // Allow only digits
                                                                    if (!/^\d$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>



                                                )}
                                                <div className="col-sm-12 col-md-12">
                                                    <div className="user_fields">
                                                        <span>{translate("location")}</span>

                                                        <LocationSearchBox onLocationSelected={handleSelectLocation} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12">
                                                    <div className="user_fields">
                                                        <span>{translate("address")}</span>
                                                        <textarea rows={4} className="current_address" placeholder={translate("Enter address")} value={address} onChange={(e) => setAddress(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer">
                                    <div className="basic_submit">
                                        <button onClick={handleSubmitInfo}>{translate("submit")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showCurrentLoc && <Location isOpen={true} onClose={handleCloseLocModal} onSelectLocation={handleSelectLocation} />}
        </Layout>
    )
}

export default UserRegister
