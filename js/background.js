async function getConfig() {
    var config=await chrome.storage.local.get()
    var config_object=await JSON.parse(config);
    return config_object;
}

loadConfig();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch(msg.type){
    case 'GET_CONFIG':
      sendResponse({ success: true, data:await getConfig()});
      break;
    case 'CONFIG_SAVED':
      loadConfig();
      break;
    case 'PAGE_EXIT':
      if(sender.tab && sender.tab.id){
        chrome.tabs.remove(sender.tab.id);
      }
  }
});
