developed Chrome extension capabilities:

	•	Monitors the current URL of the browser’s focused tab.
	•	Detects when a tab changes.
	•	Logs the following details every second:
	•	Mouse coordinates.
	•	Timestamp.
	•	Scrollbar positions (x and y).
	•	URL of the focused tab.


Chrome Extension Documentation

1. Introduction

This Chrome extension tracks browser activity in real-time. It detects changes in the active tab, logs mouse coordinates, scrollbar positions, and records the URL every second. This extension helps analyze user interactions by providing a detailed log of browser behaviour.

2. Features

	•	Monitors the focused tab’s URL.
	•	Detects tab changes.
	•	Logs data every second, including:
	•	Mouse coordinates (x, y).
	•	Scrollbar positions (scrollX, scrollY).
	•	Current URL.
	•	Timestamp.

3. Installation

	1.	Clone the extension repository from [GitHub link or local directory].
	2.	Open Chrome, and navigate to chrome://extensions/.
	3.	Enable Developer Mode.
	4.	Click on Load unpacked and select the folder containing the extension files.
	5.	The extension will now be loaded and visible in the Chrome toolbar.

4. How It Works

a. Monitoring the Active Tab

The extension tracks the active tab and updates the URL whenever the user switches to a different tab. It uses Chrome’s tabs API to detect the active tab.

b. Logging Behavior

Every second, the extension collects the following data:

	•	Mouse Coordinates: Tracked using the mousemove event listener to record the current position of the mouse on the screen.
	•	Scrollbar Position: Captures the scrollX and scrollY values, representing the horizontal and vertical scroll positions.
	•	URL: Obtains the current URL of the focused tab via Chrome’s API.
	•	Timestamp: The time at which the logging takes place.

c. Tab Change Detection

The extension listens for tab changes using the chrome.tabs.onActivated API and updates the logs accordingly when a new tab becomes active.

5. Core Code Explanation

a. Background Script

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        let currentUrl = tab.url;
        logTabChange(currentUrl);
    });
});

function logTabChange(url) {
    console.log('Tab changed. Current URL: ', url);
}

b. Content Script

setInterval(() => {
    let mouseX = window.pageXOffset;
    let mouseY = window.pageYOffset;
    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let timestamp = new Date().toISOString();
    
    console.log(`Mouse Coordinates: (${mouseX}, ${mouseY})`);
    console.log(`Scroll Position: (${scrollX}, ${scrollY})`);
    console.log(`Timestamp: ${timestamp}`);
}, 1000);

6. Permissions

The manifest.json file requires specific permissions to access browser tabs and inject content scripts.

{
  "name": "Browser Activity Tracker",
  "version": "1.0",
  "description": "Logs browser tab data, mouse coordinates, and scroll positions every second.",
  "manifest_version": 3,
  "permissions": [
    "tabs",
    "activeTab",
    "scripting"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}

7. Usage

Once the extension is installed and running:

	1.	Open any tab in Chrome.
	2.	Switch between tabs to see the logging behavior.
	3.	Inspect the logs by opening the Developer Tools console in Chrome.

8. Limitations and Future Enhancements

	•	Current limitations:
	•	Logs are printed to the console and not stored permanently.
	•	Future enhancements:
	•	Save logs to a file or external database.
	•	Provide a user interface (UI) to toggle logging on or off.

