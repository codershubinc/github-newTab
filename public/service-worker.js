// service-worker.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchLeetCode") {
        const { query, variables } = request.payload;

        fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables })
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ success: true, data });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.toString() });
            });

        return true; // Keep the message channel open for async response
    }
});