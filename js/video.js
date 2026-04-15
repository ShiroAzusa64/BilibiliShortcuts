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

var configs=(await chrome.runtime.sendMessage({type: "GET_CONFIG"})).video;

document.addEventListener("keyup", (event) =>{
    var action=Object.keys(configs).find((key) => {
        return configs[key].includes(event.key);
    });
    switch (action){
        try{
            case "keylist_like":
                document.querySelectorAll('.video-like.video-toolbar-left-item')[0].click()
                break;
        }catch(e){

        }
    }
}, true);
var toggleVideoPlaybackRate=false;
document.addEventListener("keydown", (event) => {
    var action=Object.keys(configs).find((key) => {
        return configs[key].includes(event.key);
    });
    switch (action){
        try{
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
                    chrome.runtime.sendMessage({action: "closeCurrentTab"});
                }
                break;
        }catch(e){

        }
    }
}, true);
