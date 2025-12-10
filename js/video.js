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

document.addEventListener("keyup", (event) =>{
    if(event.key==="/"){
        document.querySelectorAll('.video-like.video-toolbar-left-item')[0].click()
    }
}, true);
var KeyStatus=true;
document.addEventListener("keydown", (event) => {
    if (['Shift','1','2'].includes(event.key)) { // Key '1'
        event.preventDefault();
        // Simulate pressing the right arrow key
        if(KeyStatus){
            simulateKeyDown(39, 'ArrowRight', 'ArrowRight');
            KeyStatus=false;
        }else{
            simulateKeyup(39, 'ArrowRight', 'ArrowRight');
            KeyStatus=true;
        }
    }else if (['Escape','\\'].includes(event.key)) {
    event.preventDefault();
    chrome.runtime.sendMessage({action: "closeCurrentTab"});
  }
}, true);
