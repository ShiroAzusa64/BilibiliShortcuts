const $ = id => document.getElementById(id);
const status = $('status');
const button = $('save');
const getValue = name => $(name).value;

async function save(config){
    await chrome.storage.local.set(config).then(()=>{chrome.runtime.sendMessage({type: 'CONFIG_SAVED'});});
}
async function load(config){
    return await chrome.storage.local.get(config);
}
async function save_manual(){
    var config_text=$('textarea').value;
    try{
        if(config_text){
            var config=await load();
            config.json=JSON.parse(config);
            save(config);
        }else{
            var config=await load();
            config_text=await getDefaultConfig()
            config.json=JSON.parse(config_text);
            config.text=config.text;
            save(config);
            $('textarea').value=config_text;
        }
    }catch(e){
        status.textContent = 'Invailed JSON syntax';
        return;
    }
    status.textContent = 'Config Saved';
    setTimeout(() => status.textContent = '', 2000);
};
button.onclick=save_manual;

async function autoSave(){
    var config_text=$('textarea').value;
    var config=await load();
    config.text=config_text;
    save(config);
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get().then(async (item) => {$('textarea').value=item.text;});
});

const autosave = () => setInterval(()=>{autoSave();autosave()}, 1000);
autosave();

window.addEventListener('unload', () => {
clearInterval(autoSave);
save_manual()
});

async function getDefaultConfig(){
const fileUrl = chrome.runtime.getURL('js/default_key.json');
const response = await fetch(fileUrl);
const data = await response.text();
return data;
}
