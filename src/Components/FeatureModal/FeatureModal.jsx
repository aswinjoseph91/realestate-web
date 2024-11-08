"use client"
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { RiCloseCircleLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { featurePropertyApi } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { translate } from "@/utils";
import Image from "next/image";

const FeatureModal = ({ show, onHide, propertyId }) => {
    const [selectedOption, setSelectedOption] = useState("HomeScreen");
    const [uploadedImages, setUploadedImages] = useState([]);

    const router = useRouter();

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleImageUpload = (acceptedFiles) => {
        // Append the uploaded files to the uploadedImages state
        setUploadedImages((prevImages) => [...prevImages, ...acceptedFiles]);
    };
    useEffect(() => { }, [uploadedImages]);

    const handleFeature = () => {
        featurePropertyApi(
            propertyId,
            selectedOption,
            uploadedImages[0] ? uploadedImages[0] : "",
            (response) => {
                toast.success(response.message);
                onHide();
                router.push("/user/advertisement");
            },
            (error) => {
                console.log(error);
                toast.error(error);
            }
        );
        // Close the modal
    };

    const removeImage = (index) => {
        // Remove an image from the uploadedImages state by index
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleImageUpload,
        accept: "image/*", // Accept only image files
    });

    const files = useMemo(
        () =>
            uploadedImages && uploadedImages.map((file, index) => (
                <div key={index} className="dropbox_img_div">
                    <Image loading="lazy" className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} width={200} height={200} />
                    <div className="dropbox_d">
                        <button className="dropbox_remove_img" onClick={() => removeImage(index)}>
                            <RiCloseCircleLine size="25px" />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} {translate("KB")}</span>
                        </div>
                    </div>
                </div>
            )),
        [uploadedImages]
    );

    return (
        <Modal show={show} onHide={onHide} centered className="feature-modal" backdrop="static">
            <Modal.Header>
                <Modal.Title>{translate("featureProp")}</Modal.Title>
                <RiCloseCircleLine className="close-icon" size={40} onClick={onHide} />
            </Modal.Header>
            <Modal.Body>
                <div className="feature_div">
                    <span className="feature_form_titles">{translate("selectType")}</span>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <div className={selectedOption === "HomeScreen" ? "selectedOptionStyles" : "optionStyles"} onClick={() => handleOptionChange("HomeScreen")}>
                                {translate("home")}
                            </div>
                        </div>
                        {/* <div className="col-sm-12 col-md-6">
                            <div className={selectedOption === "Slider" ? "selectedOptionStyles" : "optionStyles"} onClick={() => handleOptionChange("Slider")}>
                                {translate("slider")}
                            </div>
                        </div> */}
                        <div className="col-sm-12 col-md-6">
                            <div className={selectedOption === "ProductListing" ? "selectedOptionStyles" : "optionStyles"} onClick={() => handleOptionChange("ProductListing")}>
                                {translate("list")}
                            </div>
                        </div>
                    </div>
                </div>
                {/* {selectedOption === "Slider" && (
                    <div className="slider_img">
                        <span className="feature_form_titles">{translate("pickUpSliderImg")}</span>
                        <div className="dropbox">
                            <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                                <input {...getInputProps()} />
                                {uploadedImages && uploadedImages.length === 0 ? (
                                    isDragActive ? (
                                        <span>{translate("dropFiles")}</span>
                                    ) : (
                                        <span>
                                            {translate("dragFiles")} <span style={{ textDecoration: "underline" }}> {translate("browse")}</span>
                                        </span>
                                    )
                                ) : null}
                            </div>
                            <div>{files}</div>
                        </div>
                    </div>
                )} */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="" id="promote_button" onClick={handleFeature}>
                    {translate("promote")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FeatureModal;
