var config;
async function getConfig() {
    config=await chrome.storage.local.get()
}

getConfig();

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch(msg.type){
    case 'GET_CONFIG':
      sendResponse({ success: true, data:config});
      break;
    case 'CONFIG_SAVED':
      getConfig();
      break;
    case 'PAGE_EXIT':
      if(sender.tab && sender.tab.id){
        chrome.tabs.remove(sender.tab.id);
      }
  }
});
