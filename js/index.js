console.log("Bilibili helper");
let g0='.wer'.split('')
let g1=';styu'.split('')
let g2='[xiop'.split('')
let g3='/qcv'.split('')
let g4='\'ab'.split('')
let g5=']znm'.split('')
let g6='Backspace'
let flip=['Control','Shift','Alt','\\'];
function switchTo(id){
const links = document.querySelectorAll('.bili-video-card__info--tit > a');
links[id].click();
}
function handleKey(event) {
        if(g0.includes(event.key)){
            switchTo(0);
        }else if(g1.includes(event.key)){
            switchTo(1);
        }else if(g2.includes(event.key)){
            switchTo(2);
        }else if(g3.includes(event.key)){
            switchTo(3);
        }else if(g4.includes(event.key)){
            switchTo(4);
        }else if(g5.includes(event.key)){
            switchTo(5);
        }else if(g6.includes(event.key)){
            document.querySelectorAll('.right-entry .v-popover-wrap > a')[2].click();
        }else if(flip.includes(event.key)){
            document.querySelectorAll('.primary-btn.roll-btn')[0].click()
        }
}

document.addEventListener("keydown", handleKey, true);
