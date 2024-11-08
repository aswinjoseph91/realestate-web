import { store } from "@/store/store"

export const GET_SETTINGS = "get_system_settings"
export const WEB_SETTINGS = "web-settings"
export const USER_SIGNUP = "user_signup"
export const UPDATE_PROFILE = "update_profile"
export const GET_SLIDERS = "get_slider"
export const GET_CATEGORES = "get_categories"
export const GET_PROPETRES = "get_property"
export const GET_ARTICLES = "get_articles"
export const GET_CITYS_DATA = "get-cities-data"
export const ADD_FAVOURITE = "add_favourite"
export const GET_LANGUAGES = "get_languages"
export const CONTACT_US = "contct_us"
export const GET_FAV = "get_favourite_property"
export const GET_PACKAGES = "get_package";
export const GET_PAYMENT_SETTINGS = "get_payment_settings";
export const CREATEPAYMENT = "createPaymentIntent";
export const CONFIRMPAYMENT = "confirmPayment"
export const POST_PROPERTY = "post_property"
export const GET_FACILITITES = "get_facilities"
export const GET_LIMITS = "get_limits"
export const GET_PAYMENT_DETAILS = "get_payment_details";
export const UPDATE_POST_PROPERTY = "update_post_property";
export const DELETE_PROPERTY = "delete_property"
export const DELETE_PROJECT = "delete_project"
export const INTEREST_PROPERTY = "interested_users"
export const STORE_ADVERTISEMENT = "store_advertisement"
export const GET_NOTIFICATION_LIST = "get_notification_list"
export const ASSIGN_FREE_PACKAGE = "assign_package"
export const GET_CHATS = "get_chats"
export const GET_CHATS_MESSAGES = "get_messages"
export const SEND_MESSAGE = "send_message"
export const DELETE_MESSAGES = "delete_chat_message"
export const DELETE_USER = "delete_user"
export const GET_REPORT_REASONS = "get_report_reasons"
export const ADD_REPORT = "add_reports"
export const GET_NEARBY_PROPERTIES = "get_nearby_properties"
export const GET_SEO_SETTINGS = "get_seo_settings"
export const SET_PROPERTY_TOTAL_CLICKS = "set_property_total_click"
export const UPDATE_PROPERTYY_STATUS = "update_property_status"
export const GET_INTREESTED_USERS = "get_interested_users"
export const POST_PROJECT = "post_project"
export const GET_PROJECTS = "get_projects"
export const USER_INTREST = "personalised-fields"
export const GET_USER_RECOMMENDATION = "get_user_recommendation"
export const GET_ADDED_PROPERTIES = "get-added-properties"
export const HOMEPAGE_DATA = "homepage-data"
export const AGENT_LIST = "agent-list"
export const AGENT_PROPERTIES = "agent-properties"
export const FAQS = "faqs"
export const PAYPAL = "paypal"
export const PAYPAL_APP_PAYMENT_STATUS = "app_payment_status"
export const BEFORE_LOGOUT = "before-logout"
export const GET_OTP = "get-otp"
export const VERIFY_OTP = "verify-otp"
export const DELETE_ADVERTISEMENT = "delete_advertisement"
export const GET_PROPERTY_LIST = "get-property-list"
export const GET_AGENT_VERIFICATION_FORM_FIELDS = "get-agent-verification-form-fields"
export const APPLY_AGENT_VERIFICATIOON = "apply-agent-verification"
export const GET_AGENT_VERIFICATION_FORM_VALUE = "get-agent-verification-form-values"








// is login user check
export const getUserID = () => {
    let user = store.getState()?.User_signup
    if (user) {
        try {
            return user?.data?.data?.id
        } catch (error) {
            return null;
        }
    } else {
        return null
    }

}


// GET SETTINGS
export const getSettingApi = () => {
    let getuserid = getUserID()
    return {
        url: `${GET_SETTINGS}`,
        method: "POST",
        data: {},
        authorizationHeader: getuserid ? true : false,

    }
}
// GET SETTINGS
export const getWebSettings = () => {
    let getuserid = getUserID()
    return {
        url: `${WEB_SETTINGS}`,
        method: "GET",
        params: {},
        authorizationHeader: getuserid ? true : false,

    }
}

// USER SIGNUP
export const user_signupApi = (name, email, mobile, type, address, auth_id, logintype, profile, fcm_id) => {
    let data = new FormData();
    if (name) { data.append("name", name); }
    if (email) { data.append("email", email); }
    if (mobile) { data.append("mobile", mobile); }
    if (auth_id) { data.append("auth_id", auth_id); }
    if (address) { data.append("address", address); }
    if (logintype) { data.append("logintype", logintype); }
    if (type) { data.append("type", type); }
    if (profile) { data.append("profile", profile); }
    if (fcm_id) { data.append("fcm_id", fcm_id); }
    return {
        url: `${USER_SIGNUP}`,
        method: 'POST',
        data,
        authorizationHeader: false,

    }
}
// UPDATE PROFILE
export const update_profile = (userid, name, email, mobile, address, firebase_id, profile, latitude, longitude, about_me, facebook_id, twiiter_id, instagram_id, youtube_id, fcm_id, notification, city, state, country) => {
    let data = new FormData();
    let getuserid = getUserID()
    data.append("userid", userid);
    data.append("name", name);
    data.append("email", email);
    data.append("mobile", mobile);
    data.append("firebase_id", firebase_id);
    data.append("address", address);
    data.append("profile", profile);
    data.append("latitude", latitude);
    data.append("longitude", longitude);
    data.append("about_me", about_me);
    data.append("facebook_id", facebook_id);
    data.append("twiiter_id", twiiter_id);
    data.append("instagram_id", instagram_id);
    data.append("youtube_id", youtube_id);
    data.append("fcm_id", fcm_id);
    data.append("notification", notification);
    data.append("city", city);
    data.append("state", state);
    data.append("country", country);
    return {
        url: `${UPDATE_PROFILE}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}

// GET Slider 

export const getSliderApi = () => {

    return {
        url: `${GET_SLIDERS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// GET CATEGORIES

export const getCategorieApi = (limit, offset, search, has_property) => {
    let params = new URLSearchParams();
    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);
    if (search) params.append("search", search);
    if (has_property) params.append("has_property", has_property);
    return {
        url: `${GET_CATEGORES}`,
        method: "GET",
        params: params,
        authorizationHeader: false,

    }
}

// get Propertyes 
export const getAllProperties = (promoted, top_rated, id, category_id, most_liked, city, get_simiilar, offset, limit, current_user, property_type, max_price, min_price, posted_since, state, country, search, userid, users_promoted, slug_id, category_slug_id) => {
    let getuserid = getUserID();
    return {
        url: `${GET_PROPETRES}`,
        method: "GET",
        params: {
            promoted: promoted,
            top_rated: top_rated,
            id: id,
            category_id: category_id,
            most_liked: most_liked,
            city: city,
            get_simiilar: get_simiilar,
            offset: offset,
            limit: limit,
            current_user: current_user,
            property_type: property_type,
            max_price: max_price,
            min_price: min_price,
            posted_since: posted_since,
            state: state,
            country: country,
            search: search,
            userid: userid,
            users_promoted: users_promoted,
            slug_id: slug_id,
            category_slug_id: category_slug_id,
        },
        authorizationHeader: getuserid ? true : false,

    }
}

// GET ARTICLES
export const getArticlesApi = (id, category_id, slug_id, limit, offset) => {

    return {
        url: `${GET_ARTICLES}`,
        method: "GET",
        params: {
            id: id,
            category_id: category_id,
            slug_id: slug_id,
            limit: limit,
            offset: offset
        },
        authorizationHeader: false,

    }
}

// GET_CITYS_DATA
export const getCountByCitys = (offset, limit) => {
    return {
        url: `${GET_CITYS_DATA}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: false,

    }
}

// ADD_FAVOURITE
export const addFavourite = (property_id, type) => {
    return {
        url: `${ADD_FAVOURITE}`,
        method: "POST",
        data: {
            property_id: property_id,
            type: type
        },
        authorizationHeader: true,

    }
}

// GET_LANGUAGES

export const getLanguages = (language_code, web_language_file) => {
    return {
        url: `${GET_LANGUAGES}`,
        method: "GET",
        params: {
            language_code: language_code,
            web_language_file: web_language_file
        },
        authorizationHeader: false,

    }
}


// CONTACT US 
export const ContactUs = (first_name, last_name, email, subject, message) => {
    let data = new FormData();
    data.append("first_name", first_name);
    data.append("last_name", last_name);
    data.append("email", email);
    data.append("subject", subject);
    data.append("message", message);
    return {
        url: `${CONTACT_US}`,
        method: 'POST',
        data,
        authorizationHeader: false,

    }
}

// GET_FAV_PROPERTY

export const getFav = (offset, limit) => {
    return {
        url: `${GET_FAV}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,

    }
}

// GET_PACKAGES

export const getPackages = () => {
    let getuserid = getUserID();
    return {
        url: `${GET_PACKAGES}`,
        method: "GET",
        params: {
        },
        authorizationHeader: getuserid ? true : false,
    }
}

// GET_PAYMENT_SETTINGS
export const getPaymentSettings = () => {
    return {
        url: `${GET_PAYMENT_SETTINGS}`,
        method: "GET",
        params: {},
        authorizationHeader: true,
    }
}

// CREATEPAYMENT
export const createPaymentIntent = (description, name, address1, postalcode, city, state, country, amount, currency, card, packageID) => {
    let data = new FormData();
    data.append("description", description);
    data.append("shipping[name]", name);
    data.append("shipping[address][line1]", address1);
    data.append("shipping[address][postal_code]", postalcode);
    data.append("shipping[address][city]", city);
    data.append("shipping[address][state]", state);
    data.append("shipping[address][country]", country);
    data.append("amount", amount);
    data.append("currency", currency);
    data.append("payment_method_types[]", card);
    data.append("package_id", packageID);
    return {
        url: `${CREATEPAYMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// CONFIRMPAYMENT
export const confirmPayment = (paymentIntentId) => {
    let data = new FormData();
    data.append("paymentIntentId", paymentIntentId);

    return {
        url: `${CONFIRMPAYMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// POST PROPERTY
export const postProperty = (userid, title, description, city, state, country, latitude, longitude, address, price, category_id, property_type, video_link, parameters, facilities, title_image, three_d_image, gallery_images, meta_title, meta_description, meta_keywords, meta_image, rentduration, is_premium, client_address, slug_id, documents) => {
    let data = new FormData();

    // Append the property data to the FormData object
    if (userid) { data.append('userid', userid); }
    if (title) { data.append('title', title); }
    if (description) { data.append('description', description); }
    if (city) { data.append('city', city); }
    if (state) { data.append('state', state); }
    if (country) { data.append('country', country); }
    if (latitude) { data.append('latitude', latitude); }
    if (longitude) { data.append('longitude', longitude); }
    if (address) { data.append('address', address); }
    if (price) { data.append('price', price); }
    if (category_id) { data.append('category_id', category_id); }
    if (property_type) { data.append('property_type', property_type); }
    if (video_link) { data.append('video_link', video_link); }
    if (meta_title) { data.append('meta_title', meta_title); }
    if (meta_description) { data.append('meta_description', meta_description); }
    if (meta_keywords) { data.append('meta_keywords', meta_keywords); }
    if (meta_image) { data.append('meta_image', meta_image); }
    if (rentduration) { data.append('rentduration', rentduration); }
    if (is_premium) { data.append('is_premium', is_premium); }
    if (client_address) { data.append('client_address', client_address); }
    if (slug_id) { data.append('slug_id', slug_id); }
    if (title_image) { data.append('title_image', title_image); }
    if (three_d_image) { data.append('three_d_image', three_d_image); }

    // Append the parameters array if it is an array
    if (Array.isArray(parameters)) {
        parameters.forEach((parameter, index) => {
            data.append(`parameters[${index}][parameter_id]`, parameter.parameter_id);
            data.append(`parameters[${index}][value]`, parameter.value);
        });
    }
    // Append the facilities array if it is an array
    if (Array.isArray(facilities)) {
        facilities.forEach((facility, index) => {
            data.append(`facilities[${index}][facility_id]`, facility.facility_id);
            data.append(`facilities[${index}][distance]`, facility.distance);
        });
    }

    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(gallery_images)) {
        gallery_images.forEach((image, index) => {
            data.append(`gallery_images[${index}]`, image);
        });
    }
    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(documents)) {
        documents.forEach((image, index) => {
            data.append(`documents[${index}]`, image);
        });
    }

    return {
        url: `${POST_PROPERTY}`,
        method: 'POST',
        data,
        authorizationHeader: true,
    };
};


// get faciliti api
export const getFacilities = () => {
    return {
        url: `${GET_FACILITITES}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// get limits api 
export const getLimits = (package_type) => {
    return {
        url: `${GET_LIMITS}`,
        method: "GET",
        params: {
            package_type: package_type
        },
        authorizationHeader: true,

    }
}

// get payment detaisl
export const getPaymentDetials = (offset, limit) => {
    return {
        url: `${GET_PAYMENT_DETAILS}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,
    }
}


// UPDATE POST PROPERTY
export const updatePostProperty = (action_type, id, title, description, city, state, country, latitude, longitude, address, price, category_id, property_type, video_link, parameters, facilities, title_image, three_d_image, gallery_images, slug_id, meta_title, meta_description, meta_keywords, meta_image, rentduration, is_premium, client_address, remove_gallery_images, documents, remove_documents, remove_three_d_image) => {
    let data = new FormData();

    // Append the property data to the FormData object
    if (action_type) { data.append('action_type', action_type); }
    if (id) { data.append('id', id); }
    if (title) { data.append('title', title); }
    if (description) { data.append('description', description); }
    if (city) { data.append('city', city); }
    if (state) { data.append('state', state); }
    if (country) { data.append('country', country); }
    if (latitude) { data.append('latitude', latitude); }
    if (longitude) { data.append('longitude', longitude); }
    if (address) { data.append('address', address); }
    if (price) { data.append('price', price); }
    if (category_id) { data.append('category_id', category_id); }
    if (property_type) { data.append('property_type', property_type); }
    if (video_link) { data.append('video_link', video_link); }
    if (title_image) { data.append('title_image', title_image); }
    if (three_d_image) { data.append('three_d_image', three_d_image); }
    if (slug_id) { data.append('slug_id', slug_id); }
    if (meta_title) { data.append('meta_title', meta_title); }
    if (meta_description) { data.append('meta_description', meta_description); }
    if (meta_keywords) { data.append('meta_keywords', meta_keywords); }
    // Only append meta_image if it's a File or empty, skip if it's a string
    if (meta_image instanceof File) {
        data.append('meta_image', meta_image); // Pass file if it's a File
    } else if (!meta_image) {
        data.append('meta_image', ""); // Pass empty string if meta_image is null/undefined
    }
    if (rentduration) { data.append('rentduration', rentduration); }
    if (is_premium) { data.append('is_premium', is_premium); }
    if (client_address) { data.append('client_address', client_address); }
    if (remove_three_d_image) { data.append('remove_three_d_image', remove_three_d_image); }


    // Append the parameters array if it is an array
    if (Array.isArray(parameters)) {
        parameters.forEach((parameter, index) => {
            data.append(`parameters[${index}][parameter_id]`, parameter.parameter_id);
            data.append(`parameters[${index}][value]`, parameter.value);
        });
    }
    // Append the facilities array if it is an array
    if (Array.isArray(facilities)) {
        facilities.forEach((facility, index) => {
            data.append(`facilities[${index}][facility_id]`, facility.facility_id);
            data.append(`facilities[${index}][distance]`, facility.distance);
        });
    }

    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(documents)) {
        documents.forEach((image, index) => {
            data.append(`documents[${index}]`, image);
        });
    }
    if (Array.isArray(gallery_images)) {
        gallery_images.forEach((image, index) => {
            data.append(`gallery_images[${index}]`, image);
        });
    }
    if (Array.isArray(remove_gallery_images)) {
        remove_gallery_images.forEach((image, index) => {
            data.append(`remove_gallery_images[${index}]`, image);
        });
    }
    if (Array.isArray(remove_documents)) {
        remove_documents.forEach((image, index) => {
            data.append(`remove_documents[${index}]`, image);
        });
    }


    return {
        url: `${UPDATE_POST_PROPERTY}`,
        method: 'POST',
        data,
        authorizationHeader: true,
    };
};


// DELETE_PROPERTY
export const deleteProperty = (id) => {
    let data = new FormData();
    data.append("id", id);

    return {
        url: `${DELETE_PROPERTY}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// DELETE_PROJECT
export const deleteProject = (id) => {
    let data = new FormData();
    data.append("id", id);

    return {
        url: `${DELETE_PROJECT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// FEATURE PROPERTY
export const featureProperty = (property_id, type, image) => {
    let data = new FormData();
    data.append("property_id", property_id);
    data.append("type", type);
    data.append("image", image);

    return {
        url: `${STORE_ADVERTISEMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}


// Intrested Property
export const intrestedProperty = (property_id, type) => {
    let data = new FormData();
    data.append("property_id", property_id);
    data.append("type", type);

    return {
        url: `${INTEREST_PROPERTY}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// get notification list
export const getNotificationList = (offset, limit) => {

    // data.append("userid", userid);

    return {
        url: `${GET_NOTIFICATION_LIST}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,
    }
}
// assign free package 
export const assignFreePackage = (package_id) => {
    let data = new FormData();
    data.append("package_id", package_id);

    return {
        url: `${ASSIGN_FREE_PACKAGE}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// GET CHAT LIST
export const getChatList = () => {

    return {
        url: `${GET_CHATS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: true,

    }
}
// GET CHAT messages
export const getChatMessages = (property_id, page, per_page) => {

    return {
        url: `${GET_CHATS_MESSAGES}`,
        method: "GET",
        params: {
            // user_id: user_id,
            property_id: property_id,
            page: page,
            per_page: per_page
        },
        authorizationHeader: true,

    }
}

// USER SIGNUP
export const sendMessage = (sender_id, receiver_id, message, property_id, file, audio) => {
    let data = new FormData();

    data.append("sender_id", sender_id);
    data.append("receiver_id", receiver_id);
    data.append("message", message);
    data.append("property_id", property_id);
    data.append("file", file);
    data.append("audio", audio);
    return {
        url: `${SEND_MESSAGE}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}
// DELETE CHAT messages
export const deleteChatMessages = (sender_id, receiver_id, property_id) => {
    let data = new FormData();

    data.append("sender_id", sender_id);
    data.append("receiver_id", receiver_id);
    data.append("property_id", property_id);
    return {
        url: `${DELETE_MESSAGES}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}
// Delete user api 
export const deleteUser = (userid) => {
    let data = new FormData();
    data.append("userid", userid);

    return {
        url: `${DELETE_USER}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// Get Report Reasons list 
export const getReportReasons = () => {
    return {
        url: `${GET_REPORT_REASONS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}
// ADD Report 
export const addReport = (reason_id, property_id, other_message) => {
    let data = new FormData();
    data.append("reason_id", reason_id);
    data.append("property_id", property_id);
    data.append("other_message", other_message);
    return {
        url: `${ADD_REPORT}`,
        method: "POST",
        data,
        authorizationHeader: true,

    }
}
// GET_NEARBY_PROPERTIES    
export const getNearbyProperties = (city, state, type) => {
    return {
        url: `${GET_NEARBY_PROPERTIES}`,
        method: "GET",
        params: {
            city: city,
            state: state,
            type: type,
        },
        authorizationHeader: false,
    }
}
// set property clicks     
export const setPropertyTotalClicks = (project_slug_id, property_slug_id) => {
    let data = new FormData();
    data.append("project_slug_id", project_slug_id);
    data.append("property_slug_id", property_slug_id);
    return {
        url: `${SET_PROPERTY_TOTAL_CLICKS}`,
        method: "POST",
        data,
        authorizationHeader: false,
    }
}
// set property status     
export const changePropertyStatus = (property_id, status) => {
    let data = new FormData();
    data.append("property_id", property_id);
    data.append("status", status);
    return {
        url: `${UPDATE_PROPERTYY_STATUS}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}


// get details of intrested users 
export const getIntretsedUsers = (property_id, slug_id, limit, offset) => {

    return {
        url: `${GET_INTREESTED_USERS}`,
        method: "GET",
        params: {
            property_id: property_id,
            slug_id: slug_id,
            limit: limit,
            offset: property_id
        },
        authorizationHeader: true,
    }
}



// POST PROJECT
export const postProject = (id, title, description, category_id, type, meta_title, meta_description, meta_keywords, meta_image, city, state, country, latitude, longitude, location, video_link, image, plans, documents, gallery_images, remove_documents, remove_gallery_images, remove_plans, slug_id) => {
    let data = new FormData();

    // Append the property data to the FormData object
    if (id) { data.append('id', id); }
    if (title) { data.append('title', title); }
    if (description) { data.append('description', description); }
    if (category_id) { data.append('category_id', category_id); }
    if (type) { data.append('type', type); }
    if (meta_title) { data.append('meta_title', meta_title); }
    if (meta_description) { data.append('meta_description', meta_description); }
    if (meta_keywords) { data.append('meta_keywords', meta_keywords); }

    // Only append meta_image if it's a File or empty, skip if it's a string
    if (meta_image instanceof File) {
        data.append('meta_image', meta_image); // Pass file if it's a File
    } else if (!meta_image) {
        data.append('meta_image', ""); // Pass empty string if meta_image is null/undefined
    }

    if (city) { data.append('city', city); }
    if (state) { data.append('state', state); }
    if (country) { data.append('country', country); }
    if (latitude) { data.append('latitude', latitude); }
    if (longitude) { data.append('longitude', longitude); }
    if (location) { data.append('location', location); }
    if (video_link) { data.append('video_link', video_link); }
    if (image) { data.append('image', image); }
    if (remove_documents) { data.append('remove_documents', remove_documents); }
    if (remove_gallery_images) { data.append('remove_gallery_images', remove_gallery_images); }
    if (remove_plans) { data.append('remove_plans', remove_plans); }
    if (slug_id) { data.append('slug_id', slug_id); }

    // Append the parameters array if it is an array
    if (Array.isArray(plans)) {
        plans.forEach((plans, index) => {
            data.append(`plans[${index}][id]`, plans.id);
            data.append(`plans[${index}][title]`, plans.title);
            data.append(`plans[${index}][document]`, plans.document);
        });
    }

    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(documents)) {
        documents.forEach((image, index) => {
            data.append(`documents[${index}]`, image);
        });
    }
    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(gallery_images)) {
        gallery_images.forEach((image, index) => {
            data.append(`gallery_images[${index}]`, image);
        });
    }



    return {
        url: `${POST_PROJECT}`,
        method: 'POST',
        data,
        authorizationHeader: true,
    };
};

// get Propertyes 
export const getAllProjects = (userid, id, slug_id, search, get_similar, category_id, city, state, country, posted_since, offset, limit) => {

    return {
        url: `${GET_PROJECTS}`,
        method: "GET",
        params: {
            userid: userid,
            id: id,
            slug_id: slug_id,
            search: search,
            get_similar: get_similar,
            category_id: category_id,
            city: city,
            state: state,
            country: country,
            posted_since: posted_since,
            offset: offset,
            limit: limit

        },
        authorizationHeader: false,

    }
}


// AddUserIntrest   
export const AddUserIntrest = (category_ids, outdoor_facilitiy_ids, price_range, property_type, city) => {
    let data = new FormData();
    data.append("category_ids", category_ids);
    data.append("outdoor_facilitiy_ids", outdoor_facilitiy_ids);
    data.append("price_range", price_range);
    data.append("property_type", property_type);
    data.append("city", city);
    return {
        url: `${USER_INTREST}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// getUser intrest 
export const GetUserIntrest = () => {

    return {
        url: `${USER_INTREST}`,
        method: "GET",
        params: {},
        authorizationHeader: true,
    }
}
// getUser intrest 
export const DeleteUserIntrest = () => {

    return {
        url: `${USER_INTREST}`,
        method: "DELETE",
        params: {},
        authorizationHeader: true,
    }
}

// GET get_user_recommendation
export const getUserRecommendation = (offset, limit) => {
    return {
        url: `${GET_USER_RECOMMENDATION}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,

    }
}
// GET getAddedProperties
export const getAddedProperties = (slug_id, is_promoted, offset, limit) => {
    return {
        url: `${GET_ADDED_PROPERTIES}`,
        method: "GET",
        params: {
            slug_id: slug_id,
            is_promoted: is_promoted,
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,

    }
}
// GET home page api
export const getHomePage = () => {
    let getuserid = getUserID()
    return {
        url: `${HOMEPAGE_DATA}`,
        method: "GET",
        params: {
        },
        authorizationHeader: getuserid ? true : false,

    }
}
// GET home page api
export const getAgentList = (limit, offset) => {
    return {
        url: `${AGENT_LIST}`,
        method: "GET",
        params: {
            limit,
            offset
        },
        authorizationHeader: false,

    }
}
// GET agent properties
export const getAgentProperties = (slug_id, is_projects, limit, offset) => {
    let getuserid = getUserID()

    return {
        url: `${AGENT_PROPERTIES}`,
        method: "GET",
        params: {
            slug_id,
            is_projects,
            limit,
            offset
        },
        authorizationHeader: getuserid ? true : false,

    }
}
// GET FAQS
export const getFAQS = (limit, offset) => {
    return {
        url: `${FAQS}`,
        method: "GET",
        params: {
            limit,
            offset
        },
        authorizationHeader: false,

    }
}
// paypal
export const paypal = (amount, package_id) => {
    return {
        url: `${PAYPAL}`,
        method: "GET",
        params: {
            amount,
            package_id
        },
        authorizationHeader: true,

    }
}
// BEFORE_LOGOUT
export const beforeLogout = (fcm_id) => {
    let data = new FormData();
    if (fcm_id) { data.append("fcm_id", fcm_id); }
    return {
        url: `${BEFORE_LOGOUT}`,
        method: "POST",
        data,
        authorizationHeader: true,

    }
}

// get-otp
export const getOtp = (number) => {
    return {
        url: `${GET_OTP}`,
        method: "GET",
        params: {
            number
        },
        authorizationHeader: false,

    }
}
// get-otp
export const verifyOTP = (number, otp) => {
    return {
        url: `${VERIFY_OTP}`,
        method: "GET",
        params: {
            number,
            otp
        },
        authorizationHeader: false,

    }
}
// DELETE_ADVERTISEMENT
export const deletAdvertisement = (id) => {
    let data = new FormData();
    data.append("id", id);
    return {
        url: `${DELETE_ADVERTISEMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,

    }
}
export const getPropertyList = (property_type, category_id, category_slug_id, city, state, country, min_price, max_price, posted_since, most_viewed, most_liked, promoted, limit, offset,search) => {
    let getuserid = getUserID();

    // Create an object with all the potential params
    let params = {
        property_type,
        category_id,
        category_slug_id,
        city,
        state,
        country,
        min_price,
        max_price,
        posted_since,
        most_viewed,
        most_liked,
        promoted,
        limit,
        offset,
        search
    };

    // Filter out any params that are empty strings or undefined
    let filteredParams = Object.fromEntries(
        Object.entries(params).filter(([key, value]) => value !== "" && value !== undefined)
    );

    return {
        url: `${GET_PROPERTY_LIST}`,
        method: "GET",
        params: filteredParams,
        authorizationHeader: getuserid ? true : false,
    };
};
export const getAgentVerificationFormFiels = () => {

    return {
        url: `${GET_AGENT_VERIFICATION_FORM_FIELDS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: true,
    };
};

// ApplayAgentVerification   
export const ApplayAgentVerification = (form_fields) => {
    let data = new FormData();
     // Append the parameters array if it is an array
     if (Array.isArray(form_fields)) {
        form_fields.forEach((field, index) => {
            data.append(`form_fields[${index}][id]`, field.id);
            data.append(`form_fields[${index}][value]`, field.value);
        });
    }
    return {
        url: `${APPLY_AGENT_VERIFICATIOON}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
export const getAgentVerificationFormValue = () => {

    return {
        url: `${GET_AGENT_VERIFICATION_FORM_VALUE}`,
        method: "GET",
        params: {

        },
        authorizationHeader: true,
    };
};