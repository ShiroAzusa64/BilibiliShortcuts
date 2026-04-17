console.log('Bilibili helper');
function simulateKeyDown(keyCode, code, key) {
    const event = new KeyboardEvent('keydown', {
        keyCode: keyCode,
        code: code,
        key: key,
        charCode: keyCode,
        which: keyCode,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        bubbles: true,
        cancelable: true,
        composed: true
    });

    return document.activeElement.dispatchEvent(event);
}
function simulateKeyup(keyCode, code, key) {
    const event = new KeyboardEvent('keyup', {
        keyCode: keyCode,
        code: code,
        key: key,
        charCode: keyCode,
        which: keyCode,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        bubbles: true,
        cancelable: true,
        composed: true
    });

    return document.activeElement.dispatchEvent(event);
}

document.addEventListener("keyup", async (event) =>{
    var config=await chrome.runtime.sendMessage({type: "GET_CONFIG"});
    config=config.data.video;
    var action=Object.keys(config).find((key) => {
        return config[key].includes(event.key);
    });
    try{
        switch (action){
            case "keylist_like":
                document.querySelectorAll('.video-like.video-toolbar-left-item')[0].click()
            break;
        }
    }catch(e){
        console.log(e);
    }

}, true);
var toggleVideoPlaybackRate=false;
document.addEventListener("keydown", async (event) => {
    var config=await chrome.runtime.sendMessage({type: "GET_CONFIG"});
    config=config.data.video;
    var action=Object.keys(config).find((key) => {
        return config[key].includes(event.key);
    });
    switch (action){
        case "keylist_accelate":
            event.preventDefault();
            if(toggleVideoPlaybackRate){
                simulateKeyup(39, 'ArrowRight', 'ArrowRight');
                toggleVideoPlaybackRate=false;
            }else{
                simulateKeyDown(39, 'ArrowRight', 'ArrowRight');
                toggleVideoPlaybackRate=true;
            }
            break;
        case "keylist_exit":
            if(document.querySelectorAll(".pswp").length<1){
                event.preventDefault();
                await chrome.runtime.sendMessage({type: "PAGE_EXIT"});
            }
        break;
    }
}, true);
