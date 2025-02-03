"use strict"

export class StorageUtil {
    // Function to store information in local storage
    storeInfo(key, value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(key, value);
        } else {
            console.error("Local storage is not supported by this browser.");
        }
    }

    // Function to get information from local storage
    getInfo(key) {
        if (typeof (Storage) !== "undefined") {
            return localStorage.getItem(key);
        } else {
            console.error("Local storage is not supported by this browser.");
            return null;
        }
    }
}