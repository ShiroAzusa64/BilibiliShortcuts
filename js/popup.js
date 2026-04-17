const $ = id => document.getElementById(id);
const status = $('status');
const button = $('save');
const getValue = name => $(name).value;

async function save(){
  let config = getValue('textarea');
  try{
    config=await JSON.parse(config);
  }catch(e){
    config=await getDefaultConfig()
  }
  chrome.storage.local.set(config).then(()=>{chrome.runtime.sendMessage({type: 'CONFIG_SAVED'});});
}
button.onclick = () => {
  save();
  status.textContent = 'Config Saved';
  setTimeout(() => status.textContent = '', 2000);
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get().then(async (item) => {
    $('textarea').value=JSON.stringify(item) || await getDefaultConfig()});
});
const autoSave = setInterval(save, 1000);
window.addEventListener('unload', () => {
    clearInterval(autoSave);
});
async function getDefaultConfig(){
    const fileUrl = chrome.runtime.getURL('js/default_key.json');
    const response = await fetch(fileUrl);
    const data = await response.json();
    return data;
}
