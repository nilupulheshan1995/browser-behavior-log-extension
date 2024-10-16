"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let logIntervals = [];
function getMaxScroll() {
    var limit = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    return limit;
}
var mouse_possision = {};
function makeLogs(logFunction) {
    const interval = setInterval(function () {
        logFunction();
    }, 1000);
    logIntervals.push(interval);
}
function getTimeStamp() {
    const now = new Date();
    return now.toISOString();
}
function logObject() {
    let temp = {
        logType: "REGULAR",
        timeStamp: getTimeStamp(),
        scrolly: window.scrollY,
        maxScroll: getMaxScroll(),
        mouseLocation: mouse_possision,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        scrollTop: window.document.documentElement.scrollTop,
        screenContent: "",
        urlDetails: "",
        elements: [],
    };
    return temp;
}
window.addEventListener("scroll", function (event) {
    const logString = { ...logObject(), logType: "EVENT_SCROLL" };
    // console.log("Scroll Log:", logString);
});
window.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX; // Horizontal position
    const mouseY = event.clientY; // Vertical position
    mouse_possision = { mouseX: mouseX, mouseY: mouseY };
});
function run() {
    makeLogs(async function () {
        const [visibleTextContent, elements] = collectVisibleText();
        // const visibleTextContent = textContent;
        const currentURLDetails = window.location;
        const logString = {
            ...logObject(),
            logType: "REGULAR",
            // screenContent: visibleTextContent,
            urlDetails: currentURLDetails,
            elements: elements,
        };
        console.log("regular Log:", logString);
        // saveDataToIndexedDB(JSON.stringify(logString));
        let retried = false;
        try {
            const response = postData({ logObject: logString });
            console.log("Success. Log:", response);
        }
        catch (error) {
            if (error.message === 'PAYLOAD_TOO_LARGE') {
                console.log(`${error.message} - retrying without elements`);
                if (!retried) {
                    postData({ logObject: { ...logString, elements: "TOO_LARGE" } });
                    retried = true;
                }
                // Handle the 413 error specifically here
            }
            else {
                console.error('An unexpected error occurred:', error);
                // Handle other errors here
            }
        }
    });
}
//------------------------------------------ content save approch ---------------------------------
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
function isVisible(el) {
    return !(window.getComputedStyle(el).display === "none");
}
function collectVisibleText() {
    const allElements = document.querySelectorAll("*");
    let visibleText = "";
    let elementArray = [];
    allElements.forEach((el) => {
        if (isElementInViewport(el) &&
            isVisible(el) &&
            el.hasChildNodes() &&
            getVisibleHeightPx(el) !== 0 &&
            el.nodeType === Node.ELEMENT_NODE) {
            elementArray.push({
                element: el,
                viewPercentage: getVisibleHeightPx(el),
                text: el.textContent.trim(),
            });
            visibleText += " " + el.textContent.trim();
        }
    });
    return [visibleText, elementArray];
}
// ---------------------------------- using intersection observer API ---------------------------
// Define the callback function
const observerCallback = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio === 1) {
            // Element is fully visible in the viewport
            const visibleText = entry.target.textContent.trim();
            // console.log("+++++++++++++ Visible text:", visibleText.replace(/\s+/g, ''));
        }
    });
};
// Create the observer
const observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: "0px",
    threshold: 1, // Trigger when 100% of the element is visible
});
// Observe the elements you're interested in
const elements = document.querySelectorAll("body *");
elements.forEach((element) => {
    observer.observe(element);
});
// -------------------------------------------- view percentage ----------------------------------
function getVisibleHeightPx(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // Check if the element is not in the viewport
    if (rect.bottom < 0 || rect.top > windowHeight) {
        return 0; // The element is not visible
    }
    // Calculate the visible height of the element
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(rect.bottom, windowHeight);
    return visibleBottom - visibleTop;
}
function postData(logData) {
    chrome.runtime.sendMessage({ type: 'SEND_LOG', logData });
}
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'GREETING') {
//     console.log("Received GREETING from background.js:", message.text);
//     sendResponse({ status: "Greeting received" });
//   } else if (message.type === 'PAGE_UPDATED') {
//     console.log("Received PAGE_UPDATED from background.js:", message.text);
//     sendResponse({ status: "Page update received" });
//   }
// });
run();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.greeting === "STOP_LOGGING") {
        logIntervals.forEach(element => {
            console.log("Clearing interval", element);
            window.clearInterval(element);
        });
        sendResponse({ farewell: "goodbye.." });
    }
    if (request.greeting === "START_LOGGING") {
        run();
    }
});
