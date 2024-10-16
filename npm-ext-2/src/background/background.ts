console.log("hello from background.ts")

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    // Get the active tab details
    const tab = await chrome.tabs.get(activeInfo.tabId);
    
    if (tab.url) {
      console.log(`Switching to tab: ${tab.url}`);
  

    //   (async () => {
    //     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    //     const response = chrome.tabs.sendMessage(tab.id || 0, { greeting: "hello" });
    //     // do something with response here, not outside the function
    //     console.log(response);
    //   })();
    // ======================================================================================================
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        const response = chrome.tabs.sendMessage(tabs[0].id || 0, { greeting: "START_LOGGING" });
        // do something with response here, not outside the function
        console.log('from background:',response);

    });



    chrome.tabs.query({}, (tabs) => {
        chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
          const activeTabId = activeTabs[0]?.id;
          
          tabs.forEach((tab) => {
            if (tab.id !== activeTabId) {
              chrome.tabs.sendMessage(tab.id || 0, { greeting: "STOP_LOGGING" }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError);
                } else {
                  console.log(`Response from tab ${tab.id}:`, response);
                }
              });
            }
          });
        });
    });


      
    }
  });
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      console.log(`Tab updated: ${tab.url}`);
      
      
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs:any) {
    //     chrome.tabs.sendMessage(tabs[0].id, {mesasge: "message_from_background"}, function(response) {
    //       console.log('background:',tabs);
    //       console.log('background:',response);
    //     });
    // });
    // ====================================================================================================
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        const response = chrome.tabs.sendMessage(tabs[0].id || 0, { greeting: "START_LOGGING" });
        // do something with response here, not outside the function
        console.log('from backgound: ',response);

    });



    chrome.tabs.query({}, (tabs) => {
        chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
          const activeTabId = activeTabs[0]?.id;
          
          tabs.forEach((tab) => {
            if (tab.id !== activeTabId) {
              chrome.tabs.sendMessage(tab.id || 0, { greeting: "STOP_LOGGING" }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError);
                } else {
                  console.log(`Response from tab ${tab.id}:`, response);
                }
              });
            }
          });
        });
    });


    }
});




chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SEND_LOG') {
      console.log('--->',message);
      postData(message);
    }

});



async function postData(data: any): Promise<Response> {
    const URL = "http://localhost:5005/"
    try {
      const response = await fetch(URL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 413) {
        throw new Error('PAYLOAD_TOO_LARGE');
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      console.log('api response:',response);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  