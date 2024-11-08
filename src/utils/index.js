

import { store } from '@/store/store';
import localeTranslations from './locale/en.json';
import { useJsApiLoader } from '@react-google-maps/api';
import * as forge from 'node-forge';
import { privateKeyPEM } from './secureKeys';
import CryptoJS from 'crypto-js'
import toast from 'react-hot-toast';


// transalte strings 

export const translate = (label) => {
  const langLabel = store.getState().Language.languages.file_name &&
    store.getState().Language.languages.file_name[label];

  const enTranslation = localeTranslations;

  if (langLabel) {
    return langLabel;
  } else {
    return enTranslation[label];
  }
};

// is login user check
export const isLogin = () => {
  let user = store.getState()?.User_signup
  if (user) {
    try {
      if (user?.data?.token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}


// Load Google Maps
export const loadGoogleMaps = () => {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
    libraries: ['geometry', 'drawing', 'places'], // Include 'places' library
  });
};

//  LOAD STRIPE API KEY 
export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key
  if (StripeKey) {
    ``
    return StripeKey
  }
  return false;
}
//  LOAD Paystack API KEY 
export const loadPayStackApiKey = () => {
  const PaystackData = store.getState()?.Settings;
  const PayStackKey = PaystackData?.data?.paystack_public_key
  if (PayStackKey) {
    ``
    return PayStackKey
  }
  return false;
}


// export const isDemoMode = (store) => {
//   const systemSettingsData = store.getState()?.Settings?.data;
//   return systemSettingsData?.data?.demo_mode;
// };


// Function to format large numbers as strings with K, M, and B abbreviations
export const formatPriceAbbreviated = (price) => {
  const systemSettingsData = store.getState()?.Settings?.data;
  const FullPriceShow = systemSettingsData?.number_with_suffix === "1"
  if (FullPriceShow) {

    if (price >= 1000000000000) {
      return (price / 1000000000000).toFixed(1) + 'T';
    } else if (price >= 1000000000) {
      return (price / 1000000000).toFixed(1) + 'B';
    } else if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1) + 'K';
    } else {
      return price.toString();
    }
  } else {
    return price
  }
};


export const formatPriceAbbreviatedIndian = (price) => {
  if (price >= 1000000000) {
    return (price / 1000000000).toFixed(1) + 'Ab';
  } else if (price >= 10000000) {
    return (price / 10000000).toFixed(1) + 'Cr';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(1) + 'L';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K';
  } else {
    return price.toString();
  }
};



// Check if the theme color is true
export const isThemeEnabled = () => {
  const systemSettingsData = store.getState().Settings?.data
  return systemSettingsData?.svg_clr === '1';
};


export const formatNumberWithCommas = (number) => {
  if (number == null) {
    return ''; // or any default value you want
  }
  return number.toLocaleString();
};

export const placeholderImage = (e) => {
  const systemSettingsData = store.getState()?.Settings?.data;
  const placeholderLogo = systemSettingsData?.web_placeholder_logo;
  if (placeholderLogo) {
    e.target.src = placeholderLogo;
  }
};

// utils/stickyNote.js
export const createStickyNote = () => {
  const systemSettingsData = store.getState()?.Settings?.data;
  const appUrl = systemSettingsData?.appstore_id

  const stickyNote = document.createElement('div');
  stickyNote.style.position = 'fixed';
  stickyNote.style.bottom = '0';
  stickyNote.style.width = '100%';
  stickyNote.style.backgroundColor = '#ffffff';
  stickyNote.style.color = '#000000';
  stickyNote.style.padding = '10px';
  stickyNote.style.textAlign = 'center';
  stickyNote.style.fontSize = '14px';
  stickyNote.style.zIndex = '99999';

  const closeButton = document.createElement('span');
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
  closeButton.innerHTML = '&times;';

  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  const link = document.createElement('a');
  link.style.textDecoration = 'underline';
  link.style.color = '#3498db';
  link.innerText = translate("downloadNow");

  link.href = appUrl ? appUrl : process.env.NEXT_PUBLIC_APPSTORE_ID;
  stickyNote.innerHTML = translate("ChatandNotiNote");
  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(link);

  document.body.appendChild(stickyNote);
};




export const truncate = (input, maxLength) => {
  // Check if input is undefined or null
  if (!input) {
    return ""; // or handle the case as per your requirement
  }
  // Convert input to string to handle both numbers and text
  let text = String(input);
  // If the text length is less than or equal to maxLength, return the original text
  if (text.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return text.slice(0, maxLength) + "...";
  }
}

export const truncateArrayItems = (itemsArray, maxLength) => {
  // Check if input is an array
  if (!Array.isArray(itemsArray)) {
    return "";
  }

  // Initialize an empty array to hold the truncated items
  let truncatedItems = [];

  // Iterate over the items in the array
  for (let i = 0; i < itemsArray.length; i++) {
    // Apply the truncate function to each item
    let truncatedItem = truncate(itemsArray[i], maxLength);

    // Add the truncated item to the array
    truncatedItems.push(truncatedItem);
  }

  // Join the truncated items with a comma and add "..." after the second item
  let result = truncatedItems.join(", ");

  // If there are more than two items, add "..."
  if (truncatedItems.length > 2) {
    result += "...";
  }

  return result;
};

// utils/timeAgo.js

export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}


const DECRYPT_KEY = privateKeyPEM;

export const decrypt = (encryptedText) => {
  try {

    // Decode the base64 encoded string
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedText);
    // Create a key object
    const key = CryptoJS.enc.Utf8.parse(DECRYPT_KEY);
    // Decryption options
    const options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };

    // Perform decryption
    const decryptedBytes = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      key,
      options
    );
    // Convert to UTF-8 string
    const decryptedText = decryptedBytes.toString();
    const base64key = CryptoJS.enc.Base64.parse(decryptedText.toString());

    return base64key;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};


export const decryptWithWebCrypto = async (encryptedData, privateKeyPEM) => {
  try {
    // Remove header and footer from PEM
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = privateKeyPEM
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');


    // Convert base64 to ArrayBuffer
    const binaryDer = str2ab(atob(pemContents));

    // Import the private key
    let privateKey;
    try {
      privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['decrypt']
      );
    } catch (importError) {
      console.error('Error importing private key:', importError);
      throw importError;
    }

    // Decode the encrypted data
    const encryptedBytes = base64ToArrayBuffer(encryptedData);

    // Attempt decryption
    let decrypted;
    try {
      decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedBytes
      );
    } catch (decryptError) {
      console.error('Error during decryption:', decryptError);
      throw decryptError;
    }

    // Convert the decrypted ArrayBuffer to a string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

// Helper function to convert string to ArrayBuffer
const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}


export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
  // .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
};

const ERROR_CODES = {
  'auth/user-not-found': translate('userNotFound'),
  'auth/wrong-password': translate('invalidPassword'),
  'auth/email-already-in-use': translate('emailInUse'),
  'auth/invalid-email': translate('invalidEmail'),
  'auth/user-disabled': translate('userAccountDisabled'),
  'auth/too-many-requests': translate('tooManyRequests'),
  'auth/operation-not-allowed': translate('operationNotAllowed'),
  'auth/internal-error': translate('internalError'),
  'auth/invalid-login-credentials': translate('incorrectDetails'),
  'auth/invalid-credential': translate('incorrectDetails'),
  'auth/admin-restricted-operation': translate('adminOnlyOperation'),
  'auth/already-initialized': translate('alreadyInitialized'),
  'auth/app-not-authorized': translate('appNotAuthorized'),
  'auth/app-not-installed': translate('appNotInstalled'),
  'auth/argument-error': translate('argumentError'),
  'auth/captcha-check-failed': translate('captchaCheckFailed'),
  'auth/code-expired': translate('codeExpired'),
  'auth/cordova-not-ready': translate('cordovaNotReady'),
  'auth/cors-unsupported': translate('corsUnsupported'),
  'auth/credential-already-in-use': translate('credentialAlreadyInUse'),
  'auth/custom-token-mismatch': translate('customTokenMismatch'),
  'auth/requires-recent-login': translate('requiresRecentLogin'),
  'auth/dependent-sdk-initialized-before-auth': translate('dependentSdkInitializedBeforeAuth'),
  'auth/dynamic-link-not-activated': translate('dynamicLinkNotActivated'),
  'auth/email-change-needs-verification': translate('emailChangeNeedsVerification'),
  'auth/emulator-config-failed': translate('emulatorConfigFailed'),
  'auth/expired-action-code': translate('expiredActionCode'),
  'auth/cancelled-popup-request': translate('cancelledPopupRequest'),
  'auth/invalid-api-key': translate('invalidApiKey'),
  'auth/invalid-app-credential': translate('invalidAppCredential'),
  'auth/invalid-app-id': translate('invalidAppId'),
  'auth/invalid-user-token': translate('invalidUserToken'),
  'auth/invalid-auth-event': translate('invalidAuthEvent'),
  'auth/invalid-cert-hash': translate('invalidCertHash'),
  'auth/invalid-verification-code': translate('invalidVerificationCode'),
  'auth/invalid-continue-uri': translate('invalidContinueUri'),
  'auth/invalid-cordova-configuration': translate('invalidCordovaConfiguration'),
  'auth/invalid-custom-token': translate('invalidCustomToken'),
  'auth/invalid-dynamic-link-domain': translate('invalidDynamicLinkDomain'),
  'auth/invalid-emulator-scheme': translate('invalidEmulatorScheme'),
  'auth/invalid-message-payload': translate('invalidMessagePayload'),
  'auth/invalid-multi-factor-session': translate('invalidMultiFactorSession'),
  'auth/invalid-oauth-client-id': translate('invalidOauthClientId'),
  'auth/invalid-oauth-provider': translate('invalidOauthProvider'),
  'auth/invalid-action-code': translate('invalidActionCode'),
  'auth/unauthorized-domain': translate('unauthorizedDomain'),
  'auth/invalid-persistence-type': translate('invalidPersistenceType'),
  'auth/invalid-phone-number': translate('invalidPhoneNumber'),
  'auth/invalid-provider-id': translate('invalidProviderId'),
  'auth/invalid-recaptcha-action': translate('invalidRecaptchaAction'),
  'auth/invalid-recaptcha-token': translate('invalidRecaptchaToken'),
  'auth/invalid-recaptcha-version': translate('invalidRecaptchaVersion'),
  'auth/invalid-recipient-email': translate('invalidRecipientEmail'),
  'auth/invalid-req-type': translate('invalidReqType'),
  'auth/invalid-sender': translate('invalidSender'),
  'auth/invalid-verification-id': translate('invalidVerificationId'),
  'auth/invalid-tenant-id': translate('invalidTenantId'),
  'auth/multi-factor-info-not-found': translate('multiFactorInfoNotFound'),
  'auth/multi-factor-auth-required': translate('multiFactorAuthRequired'),
  'auth/missing-android-pkg-name': translate('missingAndroidPkgName'),
  'auth/missing-app-credential': translate('missingAppCredential'),
  'auth/auth-domain-config-required': translate('authDomainConfigRequired'),
  'auth/missing-client-type': translate('missingClientType'),
  'auth/missing-verification-code': translate('missingVerificationCode'),
  'auth/missing-continue-uri': translate('missingContinueUri'),
  'auth/missing-iframe-start': translate('missingIframeStart'),
  'auth/missing-ios-bundle-id': translate('missingIosBundleId'),
  'auth/missing-multi-factor-info': translate('missingMultiFactorInfo'),
  'auth/missing-multi-factor-session': translate('missingMultiFactorSession'),
  'auth/missing-or-invalid-nonce': translate('missingOrInvalidNonce'),
  'auth/missing-phone-number': translate('missingPhoneNumber'),
  'auth/missing-recaptcha-token': translate('missingRecaptchaToken'),
  'auth/missing-recaptcha-version': translate('missingRecaptchaVersion'),
  'auth/missing-verification-id': translate('missingVerificationId'),
  'auth/app-deleted': translate('appDeleted'),
  'auth/account-exists-with-different-credential': translate('accountExistsWithDifferentCredential'),
  'auth/network-request-failed': translate('networkRequestFailed'),
  'auth/no-auth-event': translate('noAuthEvent'),
  'auth/no-such-provider': translate('noSuchProvider'),
  'auth/null-user': translate('nullUser'),
  'auth/operation-not-supported-in-this-environment': translate('operationNotSupportedInThisEnvironment'),
  'auth/popup-blocked': translate('popupBlocked'),
  'auth/popup-closed-by-user': translate('popupClosedByUser'),
  'auth/provider-already-linked': translate('providerAlreadyLinked'),
  'auth/quota-exceeded': translate('quotaExceeded'),
  'auth/recaptcha-not-enabled': translate('recaptchaNotEnabled'),
  'auth/redirect-cancelled-by-user': translate('redirectCancelledByUser'),
  'auth/redirect-operation-pending': translate('redirectOperationPending'),
  'auth/rejected-credential': translate('rejectedCredential'),
  'auth/second-factor-already-in-use': translate('secondFactorAlreadyInUse'),
  'auth/maximum-second-factor-count-exceeded': translate('maximumSecondFactorCountExceeded'),
  'auth/tenant-id-mismatch': translate('tenantIdMismatch'),
  'auth/timeout': translate('timeout'),
  'auth/user-token-expired': translate('userTokenExpired'),
  'auth/unauthorized-continue-uri': translate('unauthorizedContinueUri'),
  'auth/unsupported-first-factor': translate('unsupportedFirstFactor'),
  'auth/unsupported-persistence-type': translate('unsupportedPersistenceType'),
  'auth/unsupported-tenant-operation': translate('unsupportedTenantOperation'),
  'auth/unverified-email': translate('unverifiedEmail'),
  'auth/user-cancelled': translate('userCancelled'),
  'auth/user-mismatch': translate('userMismatch'),
  'auth/user-signed-out': translate('userSignedOut'),
  'auth/weak-password': translate('weakPassword'),
  'auth/web-storage-unsupported': translate('webStorageUnsupported')
};


// Error handling function
export const handleFirebaseAuthError = (errorCode) => {

  // Check if the error code exists in the global ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`${translate('errorOccurred')}:${errorCode}`)
  }
  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
}



export const BadgeSvg =
  <svg width="26" height="26" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2.9165H5C4.46957 2.9165 3.96086 3.12923 3.58579 3.50788C3.21071 3.88654 3 4.4001 3 4.9356V13.8592C3.00019 14.2151 3.09353 14.5646 3.27057 14.8723C3.44762 15.18 3.70208 15.435 4.00817 15.6115L9.50409 18.7832C9.65504 18.8705 9.82601 18.9165 10 18.9165C10.174 18.9165 10.345 18.8705 10.4959 18.7832L15.9918 15.6115C16.298 15.4351 16.5526 15.1802 16.7296 14.8724C16.9067 14.5647 17 14.2151 17 13.8592V4.9356C17 4.4001 16.7893 3.88654 16.4142 3.50788C16.0391 3.12923 15.5304 2.9165 15 2.9165ZM13.9223 9.31352L9.63897 13.6447L6.71662 10.6889C6.53155 10.4991 6.42828 10.2431 6.42933 9.97675C6.43038 9.7104 6.53565 9.45525 6.72222 9.2669C6.90878 9.07856 7.16151 8.97228 7.42535 8.97122C7.68919 8.97016 7.94275 9.07441 8.13079 9.26126L9.63897 10.7825L12.515 7.88585C12.703 7.69901 12.9566 7.59476 13.2204 7.59582C13.4843 7.59687 13.737 7.70315 13.9236 7.8915C14.1101 8.07984 14.2154 8.33499 14.2164 8.60135C14.2175 8.8677 14.1142 9.12369 13.9292 9.31352H13.9223Z" fill="#fff" />
  </svg>
