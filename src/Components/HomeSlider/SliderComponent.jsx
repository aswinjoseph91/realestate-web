"use client"
import React, { useState, useEffect } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import { FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { GoPlay } from 'react-icons/go';
import VideoPlayerModal from '../PlayerModal/VideoPlayerModal';
import { useSelector } from 'react-redux';
import { settingsData } from '@/store/reducer/settingsSlice';
import { formatNumberWithCommas, placeholderImage, translate } from '@/utils';
import { BiLeftArrowCircle, BiRightArrowCircle } from 'react-icons/bi';
import { useRouter } from 'next/router';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const SliderComponent = ({ sliderData }) => {
  const router = useRouter()
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // Add state for controlling autoplay
  const systemSetttings = useSelector(settingsData);
  const CurrencySymbol = systemSetttings && systemSetttings.currency_symbol;
  const PlaceHolderImg = systemSetttings && systemSetttings?.web_placeholder_logo;

  const handleCloseModal = () => {
    setShowVideoModal(false);
    setAutoplay(true); // Enable autoplay when the video player is closed
  };

  const handleOpenModal = () => {
    setShowVideoModal(true);
    setAutoplay(false); // Disable autoplay when the video player is open
  };

  const ButtonContentLeft = <BiLeftArrowCircle className='custom_icons_slider' />;
  const ButtonContentRight = <BiRightArrowCircle className='custom_icons_slider' />;

  const handleImageClick = (data) => {
    setAutoplay(false);
    let dynamicLink = '/'; // Default link
  
    if (data?.slider_type === '1') {
      dynamicLink = '/';
      setAutoplay(true);
    } else if (data?.slider_type === '2') {
      dynamicLink = `/properties/categories/${data?.category?.slug_id}`;
    } else if (data?.slider_type === '3') {
      dynamicLink = `/properties-details/${data?.property?.slug_id}`;
    } else if (data?.slider_type === '4') {
      dynamicLink = data?.link;
    } else {
      dynamicLink = '/';
      setAutoplay(true);
    }
  
    router.push(dynamicLink); // Navigate to the determined link
  };
  

  return (
    <div className="slider-container"> {/* Ensure container size */}
      <AutoplaySlider
        animation="cube"
        buttonContentRight={ButtonContentRight}
        buttonContentLeft={ButtonContentLeft}
        organicArrows={false}
        bullets={false}
        play={autoplay} // Use the state to control autoplay
        interval={3000}
        disableProgressBar={true}
      >
        {sliderData.map((single, index) => {

          return (
            <div
              key={index}
              data-src={single?.image ? single?.image : PlaceHolderImg}
              className='main_slider_div'
              onClick={() => handleImageClick(single)}
            >
              {single?.show_property_details === 1 &&
                <div className="container">
                  <div id="herotexts">
                    <div>
                      <span id="priceteg">
                        <span>{CurrencySymbol}</span>
                        <span>{formatNumberWithCommas(single?.property?.price)}</span>
                      </span>
                      <h1 id="hero_headlines">{single?.property?.title}</h1>
                      <div className="hero_text_parameters">
                        {single?.parameters &&
                          single?.parameters.slice(0, 4).map((elem, index) => (
                            elem.value !== 0 && elem.value !== null && elem.value !== undefined && elem.value !== "" && (
                              <span key={index} id="specification">
                                {elem.name} : {elem.value}{index < 3 ? ', ' : ''}
                              </span>
                            )
                          ))}
                      </div>
                    </div>
                    <div id="viewall_hero_prop">
                      <Link href="/properties-details/[slug]" as={`/properties-details/${single?.property?.slug_id}`} passHref>
                        <button className="view_prop">
                          <FaEye size={20} className="icon" />
                          {translate("viewProperty")}
                        </button>
                      </Link>
                      {single?.property?.video_link ? (
                        <>
                          <div>
                            <GoPlay
                              className="playbutton"
                              size={50}
                              onClick={handleOpenModal} // Open the video player
                            />
                          </div>
                          <VideoPlayerModal isOpen={showVideoModal} onClose={handleCloseModal} data={single} />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              }
            </div>
            // </Link>
          );
        })}
      </AutoplaySlider>
    </div>

  );
};

export default SliderComponent;
