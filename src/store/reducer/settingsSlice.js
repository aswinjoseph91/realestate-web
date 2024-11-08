// settingsSlice.js
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import { getSettingApi, getWebSettings } from "@/utils/api";
import moment from "moment";

const initialState = {
    data: null,
    lastFetch: null,
    loading: false,
    fcmToken: null,
};

export const settingsSlice = createSlice({
    name: "Settings",
    initialState,
    reducers: {
        settingsRequested: (settings, action) => {
            settings.loading = true;
        },
        settingsSuccess: (settings, action) => {
            settings.data = action.payload.data;
            settings.loading = false;
            settings.lastFetch = Date.now();
        },
        settingsFailure: (settings, action) => {
            settings.loading = false;
        },
        getToken: (settings, action) => {
            settings.fcmToken = action.payload.data;
        },
        clearReloadFlag: () => {
            sessionStorage.removeItem("lastFetch");
        }
    },
});

export const { settingsRequested, settingsSuccess, settingsFailure, getToken, clearReloadFlag } = settingsSlice.actions;
export default settingsSlice.reducer;

// API CALLS
export const loadSystemSettings = ({
    onSuccess = () => { },
    onError = () => { },
    onStart = () => { }
}) => {
    // const lastFetchString = sessionStorage.getItem("lastFetch");
    // const lastFetch = lastFetchString ? parseInt(lastFetchString) : null;

    // const diffInMinutes = lastFetch ? moment().diff(moment(lastFetch), "minutes") : null;

    // // Check if the data needs to be fetched
    // const shouldFetchData = !lastFetch || diffInMinutes >= 10 || isManualRefresh();

    // if (!shouldFetchData) {
    //     onSuccess(store.getState().Settings); // Invoke onSuccess with the existing data
    //     return;
    // }

    store.dispatch(
        apiCallBegan({
            ...getWebSettings(),
            displayToast: false,
            onStartDispatch: settingsRequested.type,
            onSuccessDispatch: settingsSuccess.type,
            onErrorDispatch: settingsFailure.type,
            onStart,
            onSuccess: (res) => {
                onSuccess(res);
                // sessionStorage.setItem("lastFetch", Date.now());
            },
            onError
        })
    );
};

// Helper function to check if the page has been manually refreshed
const isManualRefresh = () => {
    const manualRefresh = sessionStorage.getItem("manualRefresh");
    sessionStorage.removeItem("manualRefresh");
    return manualRefresh === "true";
};

// Event listener to set manualRefresh flag when page is manually refreshed
if (typeof window !== 'undefined') {
    window.addEventListener("load", () => {
        if (navigator.userAgent.includes("Mozilla")) {
            // This is likely a manual refresh
            sessionStorage.setItem("manualRefresh", "true");
        } else {
            // This is the initial page load
            sessionStorage.removeItem("manualRefresh");
        }
    });
}

// store token 
export const getFcmToken = (data) => {
    store.dispatch(getToken({ data }));
}

// Selectors
export const settingsData = createSelector(
    (state) => state.Settings,
    (settings) => settings?.data
);

export const Fcmtoken = createSelector(
    state => state.Settings,
    settings => settings?.fcmToken
);
