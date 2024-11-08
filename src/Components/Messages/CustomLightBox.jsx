
import { placeholderImage } from '@/utils';
import { IoMdClose } from 'react-icons/io';

const CustomLightBox = ({ lightboxOpen, handleCloseLightbox, currentImage }) => {



    return (
        lightboxOpen &&

        <div className="lightbox-overlay">
            <div className="lightbox-modal">
                <div className="lightbox-header">
                    <button onClick={handleCloseLightbox} className="lightbox-close-button">
                        <IoMdClose size={24} />
                    </button>
                </div>
                <div className="lightbox-content">
                    <img src={currentImage} alt={`Image`} className="lightbox-image" onError={placeholderImage} />

                </div>
            </div>
        </div>
    );
};

export default CustomLightBox;
