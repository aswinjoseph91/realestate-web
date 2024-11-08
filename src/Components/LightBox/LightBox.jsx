"use client"
import React from "react";
import Lightbox from 'react-spring-lightbox';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { store } from "@/store/store";

const LightBox = ({ photos, viewerIsOpen, currentImage, setCurrentImage, onClose, title_image }) => {

    const language = store.getState().Language.languages;
    const isRtl = language.rtl === 1; // Check if the language is RTL

    if (!photos || photos.length === 0) {
        // Handle the case when photos is undefined or empty.
        return null;
    }

    // Create an array to include title_image at index 0
    const lightboxPhotos = title_image ? [{ image_url: title_image, alt: 'Title Image' }, ...photos] : photos;

    // Adjust functions based on RTL setting
    const gotoPrevious = () =>
        isRtl ? currentImage + 1 < lightboxPhotos.length && setCurrentImage(currentImage + 1) : currentImage > 0 && setCurrentImage(currentImage - 1);
    
    const gotoNext = () =>
        isRtl ? currentImage > 0 && setCurrentImage(currentImage - 1) : currentImage + 1 < lightboxPhotos.length && setCurrentImage(currentImage + 1);
    
    return (
        <Lightbox
        images={lightboxPhotos.map(photo => ({ src: photo.image_url, alt: photo.alt }))}
        currentIndex={currentImage}
        isOpen={viewerIsOpen}
        onClose={onClose}
        onPrev={gotoPrevious}
        onNext={gotoNext}
        renderPrevButton={({ canPrev }) => (
            <button
                onClick={gotoPrevious}
                disabled={!canPrev}
                className={`gallarybox_prevButton ${isRtl ? 'rtl' : ''}`}
            >
                <FaChevronLeft />
            </button>
        )}
        renderNextButton={({ canNext }) => (
            <button
                onClick={gotoNext}
                disabled={!canNext}
                className={`gallarybox_nextButton ${isRtl ? 'rtl' : ''}`}
            >
                <FaChevronRight />
            </button>
        )}
        className="cool-class"
        style={{ background: "#000000b3" }}
        singleClickToZoom={true}
        pageTransitionConfig={{
            from: { opacity: 0, transform: 'scale(0.5)' },
            enter: { opacity: 1, transform: 'scale(1)' },
            leave: { opacity: 0, transform: 'scale(0.5)' },
        }}
    />
    );
};

export default LightBox;
