# Developed Chrome Extension Capabilities

- Monitors the current URL of the browser’s focused tab.
- Detects when a tab changes.
- Logs the following details every second:
  - Mouse coordinates.
  - Timestamp.
  - Scrollbar positions (x and y).
  - URL of the focused tab.

# Chrome Extension Documentation

## 1. Introduction

This Chrome extension tracks browser activity in real-time. It detects changes in the active tab, logs mouse coordinates, scrollbar positions, and records the URL every second. This extension helps analyze user interactions by providing a detailed log of browser behavior.

## 2. Features

- Monitors the focused tab’s URL.
- Detects tab changes.
- Logs data every second, including:
  - Mouse coordinates (x, y).
  - Scrollbar positions (scrollX, scrollY).
  - Current URL.
  - Timestamp.

## 3. Installation

Download the following two folders from the GitHub link:

- `npm-ext-2`
- `server-1`

### Install `npm-ext-2`

- Navigate to the `package.json` file (root directory).
- Run the command: `npm install`.
- Run the command: `npm run dist`.
- Add the generated `dist` folder to the Chrome web browser as an unpacked extension file.

### Install `server-1`

- Navigate to the `package.json` file (root directory).
- Run the command: `npm install`.
- Run the command: `npm run start` or `npm run dev`.

### 3.1 Configuration

#### Change data sending point on the extension:

- Navigate to: `npm-ext-2/src/background/background.ts`.
- Function name: `postData`.

#### Change data receive in the server:

- Navigate to: `server-1/app.js`.
- Change the URL at the bottom of the file.

## 4. How It Works

### a. Monitoring the Active Tab

The extension tracks the active tab and updates the URL whenever the user switches to a different tab. It uses Chrome’s `tabs` API to detect the active tab.

### b. Logging Behavior

Every second, the extension collects the following data:

- **Mouse Coordinates**: Tracked using the `mousemove` event listener to record the current position of the mouse on the screen.
- **Scrollbar Position**: Captures the `scrollX` and `scrollY` values, representing the horizontal and vertical scroll positions.
- **URL**: Obtains the current URL of the focused tab via Chrome’s API.
- **Timestamp**: The time at which the logging takes place.

### c. Tab Change Detection

The extension listens for tab changes using the `chrome.tabs.onActivated` API and updates the logs accordingly when a new tab becomes active.

## 5. Core Code Explanation

### a. Background Script

```javascript
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        let currentUrl = tab.url;
        logTabChange(currentUrl);
    });
});

function logTabChange(url) {
    console.log('Tab changed. Current URL: ', url);
}
