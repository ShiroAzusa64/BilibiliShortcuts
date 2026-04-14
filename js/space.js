console.log("Bilibili helper");

var configs=(await chrome.runtime.sendMessage({type: "GET_CONFIG"})).space;

function getUploaders(){
    return document.querySelectorAll('.bili-dyn-up-list__item')
}
function getCurrentIndex() {
    let target = getUploaders();
    return target.findIndex((key)=>{
        return key.className === "bili-dyn-up-list__item active";
    });
}
function switchTo(index){
    var avatar=getUploaders()[index];
    avatar.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
    avatar.click()
}
function handleKey(event){
    console.log(event.key);
    var action=Object.keys(configs).find((key) => {
        return configs[key].includes(event.key);
    });
    switch (action){
        try{
            case "keylist_next":
                switchTo(getCurrentIndex()+1);
                break;
            case "keylist_previous":
                switchTo(getCurrentIndex()-1);
                break;
        }catch(e){
            switchTo(0);
        }
        try{
            case "keylist_like:
                var target=document.querySelectorAll('.bili-dyn-action.like');
                target[0].click();
                break;
            case "keylist_enter:
                document.querySelectorAll('.bili-dyn-card-video__title.bili-ellipsis.fs-medium')[0].click()
                break;
            case "keylist_exit:
                await chrome.runtime.sendMessage({type: "TAB_EXIT"});
                break;
        }catch(e){

        }
    }
}

document.addEventListener("keydown", handleKey, true);
