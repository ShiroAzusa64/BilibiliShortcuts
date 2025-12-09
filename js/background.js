chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeCurrentTab") {
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  }
});
