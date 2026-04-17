console.log("Bilibili helper");

function getUploaders(){
    return Array.from(document.querySelectorAll('.bili-dyn-up-list__item'));
}
function getCurrentIndex() {
    let target = getUploaders();
    return target.findIndex((key)=>{
        return key.className === "bili-dyn-up-list__item active";
    });
}
function switchTo(index){
    try{
        var avatar=getUploaders()[index];
        avatar.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        avatar.click()
    }catch(e){
        switchTo(0);
    }
}
async function handleKey(event){
    var config=await chrome.runtime.sendMessage({type: "GET_CONFIG"});
    config=config.data.space;
    var action=Object.keys(config).find((key) => {
        return config[key].includes(event.key);
    });
    switch (action){
        case "keylist_next":
            switchTo(getCurrentIndex()+1);
            break;
        case "keylist_previous":
            switchTo(getCurrentIndex()-1);
            break;
        case "keylist_like":
            var target=document.querySelectorAll('.bili-dyn-action.like');
            target[0].click();
            break;
        case "keylist_enter":
            document.querySelectorAll('.bili-dyn-card-video__title.bili-ellipsis.fs-medium')[0].click()
            break;
        case "keylist_exit":
            await chrome.runtime.sendMessage({type: "PAGE_EXIT"});
            break;
    }
}

document.addEventListener("keydown", handleKey, true);
