import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { RiArrowRightSLine, RiUserSmileLine } from 'react-icons/ri';
import { FiPlusCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { truncate } from '@/utils';

const MobileOffcanvas = ({
  show,
  handleClose,
  settingData,
  signupData,
  translate,
  handleOpenModal,
  handleShowDashboard,
  handleLogout,
  handleAddProperty,
  handleLanguageChange,
  LanguageList,
  defaultlang,
  handleOpenAcModal,
  selectedLanguage,
  language
}) => {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const MenuItem = ({ title, onClick, hasSubmenu = false, name }) => (
    <div
      className={`mobile-menu-item ${expandedItem === name ? 'isSelected' : ''}`}
      onClick={onClick}
    >
      <span>{title}</span>
      <RiArrowRightSLine className="mobile-arrow" />
    </div>
  );

  const handlePropertyRoute = (routerPath) => {
    if (routerPath) {
      handleClose();
      router.push(routerPath);
    }
  };

  const handlePageRoute = (routerPath) => {
    if (routerPath) {
      handleClose();
      router.push(routerPath);
    } else {
      handleOpenAcModal();
    }
  };

  const PropertyPages = [
    { name: translate('allProperties'), route: '/properties/all-properties' },
    { name: translate('featuredProp'), route: '/featured-properties' },
    { name: translate('mostViewedProp'), route: '/most-viewed-properties' },
    { name: translate('nearbyCities'), route: '/properties-nearby-city' },
    { name: translate('mostFavProp'), route: '/most-favorite-properties' },
  ];

  const Pages = [
    { name: translate('subscriptionPlan'), route: '/subscription-plan' },
    { name: translate('articles'), route: '/articles' },
    { name: translate('faqs'), route: '/faqs' },
    { name: translate('areaConverter'), route: '' },
    { name: translate('terms&condition'), route: '/terms-and-condition' },
    { name: translate('privacyPolicy'), route: '/privacy-policy' },
  ];

  return (
    <Offcanvas show={show} onHide={handleClose} placement={language.rtl === 1 ? 'start' : 'end'} className="mobile-offcanvas">
      <Offcanvas.Header closeButton className="mobile-offcanvas-header">
        <Offcanvas.Title>
          {settingData?.web_footer_logo && (
            <Link href="/">
              <Image
                src={settingData.web_logo}
                alt="eBroker_logo"
                width={150}
                height={40}
                className="mobile-logo"
              />
            </Link>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="mobile-offcanvas-body">
        <div className="mobile-menu">
          <MenuItem
            title={translate('home')}
            onClick={() => {
              router?.push('/'),
                handleClose()
            }}
          />

          {/* Properties Section */}
          <MenuItem
            title={translate('properties')}
            onClick={() => toggleExpand('properties')}
            hasSubmenu
            name="properties"
          />
          <div
            className={`mobile-submenu ${expandedItem === 'properties' ? 'expanded' : ''
              }`}
            style={{
              maxHeight: expandedItem === 'properties' ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-in-out',
            }}
          >
            {PropertyPages.map((property, index) => (
              <div
                key={index}
                className="mobile-submenu-item"
                onClick={() => handlePropertyRoute(property?.route)}
              >
                <span>{property.name}</span>
                <RiArrowRightSLine className="mobile-arrow" />
              </div>
            ))}
          </div>

          {/* Pages Section */}
          <MenuItem
            title={translate('pages')}
            onClick={() => toggleExpand('pages')}
            hasSubmenu
            name="pages"
          />
          <div
            className={`mobile-submenu ${expandedItem === 'pages' ? 'expanded' : ''
              }`}
            style={{
              maxHeight: expandedItem === 'pages' ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-in-out',
            }}
          >
            {Pages.map((page, index) => (
              <div
                key={index}
                className="mobile-submenu-item"
                onClick={() => handlePageRoute(page?.route)}
              >
                <span>{page.name}</span>
                <RiArrowRightSLine className="mobile-arrow" />
              </div>
            ))}
          </div>

          {/* Contact and About */}
          <MenuItem
            title={translate('contactUs')}
            onClick={() => {
              router?.push('/contact-us'),
                handleClose(); // Navigate to contact us
            }}
          />
          <MenuItem
            title={translate('aboutUs')}
            onClick={() => {
              router?.push('/about-us'),
                handleClose(); // Navigate to about us
            }}
          />

          {/* Language Section */}
          <MenuItem
            title={selectedLanguage || defaultlang}
            onClick={() => toggleExpand('language')}
            hasSubmenu
            name="language"
          />
          <div
            className={`mobile-submenu ${expandedItem === 'language' ? 'expanded' : ''
              }`}
            style={{
              maxHeight: expandedItem === 'language' ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-in-out',
            }}
          >
            {LanguageList &&
              LanguageList.map((ele, index) => (
                <div
                  key={index}
                  onClick={() => handleLanguageChange(ele.code)}
                  className="mobile-submenu-item"
                >
                  <span>{ele.name}</span>
                  <RiArrowRightSLine className="mobile-arrow" />
                </div>
              ))}
          </div>

          {/* User Section */}
          {signupData?.data?.data?.name ? (
            <>
              <MenuItem
                title={truncate(signupData.data.data.name,15)}
                onClick={() => toggleExpand('user')}
                hasSubmenu
                name="user"
              />
              <div
                className={`mobile-submenu ${expandedItem === 'user' ? 'expanded' : ''}`}
                style={{
                  maxHeight: expandedItem === 'user' ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-in-out',
                }}
              >
                <div className="mobile-submenu-item" onClick={handleShowDashboard}>
                  <span>{translate('dashboard')}</span>
                  <RiArrowRightSLine className="mobile-arrow" />
                </div>
                <div className="mobile-submenu-item" onClick={handleLogout}>
                  <span>{translate('logout')}</span>
                  <RiArrowRightSLine className="mobile-arrow" />
                </div>
              </div>
            </>
          ) : (
            <MenuItem
              title={translate('login&Register')}
              onClick={handleOpenModal}
            />

          )}

        </div>

        {/* Add Property Button */}
        {signupData?.data?.data?.name && settingData && (
          <button className="mobile-add-property" onClick={handleAddProperty}>
            <FiPlusCircle size={20} className="mobile-icon" />
            {translate('addProp')}
          </button>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MobileOffcanvas;
