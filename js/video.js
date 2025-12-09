function handleKey(event){
    if(event.key==="Shift"){
        document.querySelectorAll('.video-like.video-toolbar-left-item')[0].click()
    }else if (event.code === 'Digit2') { // Key '1'
        event.preventDefault();

        // Simulate pressing the right arrow key
        simulateKeyup(39, 'ArrowRight', 'ArrowRight');
    }
}
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

document.addEventListener("keyup", handleKey, true);
document.addEventListener("keydown", function(event) {
    if (event.code === 'Digit1') { // Key '1'
        event.preventDefault();

        // Simulate pressing the right arrow key
        simulateKeyDown(39, 'ArrowRight', 'ArrowRight');
    }
}, true);
