"use client"
import { BadgeSvg, placeholderImage, translate } from '@/utils'
import Image from 'next/image'
import React from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { FiMail, FiMessageSquare, FiPhoneCall, FiThumbsUp } from 'react-icons/fi'
import { MdReport } from 'react-icons/md'
import { RiMailSendLine, RiThumbUpFill } from 'react-icons/ri'

const OwnerDeatilsCard = (
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
        handleReportProperty,
        PlaceHolderImg
    }) => {

    return (
        <>
            <div className="card" id="owner-deatils-card">
                <div className="card-header" id="card-owner-header">
                    <div>
                        <Image loading="lazy" width={200} height={200} src={getPropData && getPropData?.profile ? getPropData?.profile : PlaceHolderImg} className="owner-img" alt="no_img" onError={placeholderImage} />
                    </div>
                    <div className="owner-deatils">
                        <div className="verified-owner">

                            <span className="owner-name"> {getPropData && getPropData?.customer_name}</span>
                            {getPropData?.is_verified &&
                                <span >{BadgeSvg}</span>
                            }
                        </div>

                        {getPropData && getPropData?.email &&
                            <a href={`mailto:${getPropData && getPropData?.email}`}>
                                <span className="owner-add">
                                    {" "}
                                    <RiMailSendLine size={15} />
                                    {getPropData && getPropData?.email}
                                </span>
                            </a>
                        }
                    </div>
                </div>
                <div className="card-body">
                    <a href={`tel:${getPropData && getPropData?.mobile}`}>
                        <div className="owner-contact">
                            <div>
                                <FiPhoneCall id="call-o" size={60} />
                            </div>
                            <div className="deatilss">
                                <span className="o-d"> {translate("call")}</span>
                                <span className="value">{getPropData && getPropData?.mobile}</span>
                            </div>
                        </div>
                    </a>
                    <div className="owner-contact">
                        <div>
                            <CiLocationOn id="mail-o" size={60} />
                        </div>
                        <div className="deatilss">
                            <span className="o-d"> {translate("location")}</span>
                            <span className="value">{getPropData && getPropData?.client_address}</span>
                        </div>
                    </div>
                    {showChat && isMessagingSupported && notificationPermissionGranted && (
                        <div className='owner-contact' onClick={handleChat}>
                            <div>
                                <FiMessageSquare id='chat-o' size={60} />
                            </div>
                            <div className='deatilss'>
                                <span className='o-d'> {translate("chat")}</span>
                                <p className='value'> {translate("startAChat")}</p>
                            </div>
                        </div>
                    )}
                    {handleReportProperty && handleInterested &&
                        <div className="enquiry">
                            {!isReported && userCurrentId !== getPropData?.added_by ? (
                                <button className='enquiry-buttons' onClick={handleReportProperty}> <MdReport className='mx-1' size={20} />{translate("reportProp")}</button>
                            ) : null}

                            {userCurrentId !== getPropData?.added_by ? (

                                interested || getPropData?.is_interested === 1 ? (
                                    <button className="enquiry-buttons" onClick={handleNotInterested}>
                                        <RiThumbUpFill className="mx-1" size={20} />
                                        {translate("intrested")}
                                    </button>
                                ) : (
                                    <button className="enquiry-buttons" onClick={handleInterested}>
                                        <FiThumbsUp className="mx-1" size={20} />
                                        {translate("intrest")}
                                    </button>
                                )
                            ) : null
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default OwnerDeatilsCard
