"use client"
import { placeholderImage, translate } from '@/utils'
import Image from 'next/image'
import React from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { FiMail, FiMessageSquare, FiPhoneCall, FiThumbsUp } from 'react-icons/fi'
import { MdReport } from 'react-icons/md'
import { RiMailSendLine, RiThumbUpFill } from 'react-icons/ri'
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const PremiumOwnerDetailsCard = (
    {
        getPropData,
        showChat,
        interested,
        isReported,
        handleInterested,
        isMessagingSupported,
        handleNotInterested,
        notificationPermissionGranted,
        handleChat,
        userCurrentId,
        handleReportProperty
    }) => {

    const router = useRouter()

    const handleCheckPremium = (e) => {
        e.preventDefault()
        Swal.fire({
            title: translate("opps"),
            text: translate("itsPrivatePrperty"),
            icon: "warning",
            allowOutsideClick: true,
            showCancelButton: false,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.push("/subscription-plan");
            }
        });
    }
    const handleNavigateSubScribe = (e) => {
        e.preventDefault()
        router.push('/subscription-plan')
    }
    return (
        <>
            <div className="card" id="owner-deatils-card">
                <div className="card-header" id="card-owner-header">
                    <div>
                        <Image loading="lazy" width={200} height={200} src={getPropData && getPropData?.profile} onError={placeholderImage} className="owner-img" alt="no_img" />
                    </div>
                    <div className="owner-deatils">
                        <div className="verified-owner">

                            <span className="owner-name"> {getPropData && getPropData?.customer_name}</span>
                            {getPropData?.is_verified &&
                                <span >{BadgeSvg}</span>
                            }
                        </div>

                        {getPropData && getPropData?.email &&
                            <span className="owner-add" onClick={handleCheckPremium}>
                                {" "}
                                <RiMailSendLine size={15} />
                                {getPropData && `${getPropData?.email.slice(0, 2)}${'*'.repeat(getPropData?.email.length - 2)}`}
                            </span>
                        }
                    </div>
                </div>
                <div className="card-body">
                    {getPropData?.mobile &&
                        <div className="owner-contact">
                            <div>
                                <FiPhoneCall id="call-o" size={60} />
                            </div>
                            <div className="deatilss">
                                <span className="o-d"> {translate("call")}</span>
                                <span className="value" onClick={handleCheckPremium}>
                                    {getPropData && `${getPropData?.mobile.slice(0, 4)}${'*'.repeat(getPropData?.mobile.length - 4)}`}
                                </span>
                            </div>
                        </div>
                    }
                    {getPropData?.client_address &&
                        <div className="owner-contact">
                            <div>
                                <CiLocationOn id="mail-o" size={60} />
                            </div>
                            <div className="deatilss">
                                <span className="o-d"> {translate("location")}</span>
                                <span className='value' onClick={handleCheckPremium}>
                                    {getPropData && `${getPropData?.client_address.slice(0, 2)}***********`}
                                </span>
                            </div>
                        </div>
                    }
                    {showChat && isMessagingSupported && notificationPermissionGranted && (
                        <div className='owner-contact' onClick={handleCheckPremium}>
                            <div>
                                <FiMessageSquare id='chat-o' size={60} />
                            </div>
                            <div className='deatilss'>
                                <span className='o-d'> {translate("chat")}</span>
                                <p className='value'> {translate("startAChat")}</p>
                            </div>
                        </div>
                    )}
                    <div className="enquiry">
                        {!isReported && userCurrentId !== getPropData?.added_by ? (
                            <button className='enquiry-buttons' onClick={handleReportProperty}> <MdReport className='mx-1' size={20} />{translate("reportProp")}</button>
                        ) : null}

                        {interested || getPropData?.is_interested === 1 ? (
                            <button className="enquiry-buttons" onClick={handleNotInterested}>
                                <RiThumbUpFill className="mx-1" size={20} />
                                {translate("intrested")}
                            </button>
                        ) : (
                            <button className="enquiry-buttons" onClick={handleInterested}>
                                <FiThumbsUp className="mx-1" size={20} />
                                {translate("intrest")}
                            </button>
                        )}
                    </div>

                    <div className="is_premium_user">
                        <span>{translate("SubscribetoAccess")}</span>
                        <button onClick={handleNavigateSubScribe}>
                            <span>{translate("subscribeNow")}</span>
                            <span>
                                <FaArrowRight size={20} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PremiumOwnerDetailsCard
