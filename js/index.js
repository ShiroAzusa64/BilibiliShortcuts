console.log("Bilibili helper");

let shortcuts=[]
shortcuts.push('.wer'.split(''))
shortcuts.push(';styu'.split(''))
shortcuts.push('[xiop'.split(''))
shortcuts.push('/qcv'.split(''))
shortcuts.push('\'ab'.split(''))
shortcuts.push(']znm'.split(''))
let space='Backspace'
let flip=['Control','Shift','Alt','\\','1'];
let cancel=['2'];

class videoHistory{
    videoHistorys=[];
    index=0;
    maxLength=10;
    constructor(){
        console.log("constructed")
        pageLoaded().then(() => {
                let node=getVideoCardList().map(a => {return a.cloneNode(true);});
                node.forEach(a=>{a.className = " history";});
                this.push(node);
            });
        console.log(this.videoHistorys[0])
    }
    push(slice){
        if(this.videoHistorys.length<this.maxLength){
                this.videoHistorys.unshift(slice);
            }else{
                this.videoHistorys.pop();
                this.videoHistorys.unshift(slice);
        }
    }
    checkout(indexa){

            var tmp=document.querySelector(".container")
            switch(true){
                case indexa==0: //logically only -1 -> 0
                    Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
                    getVideoCardList().forEach((item)=>{item.style.display=''});
                    break;
                case indexa==1:
                    getVideoCardList().forEach((item)=>{item.style.display='none'});
                    Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
                    insertBeforeFirstChild(tmp,this.videoHistorys[indexa].map(a=>{return a}))
                    break;
                default:
                    console.log('general case')
                    Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
                    Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
                    insertBeforeFirstChild(tmp,this.videoHistorys[indexa].map(a=>{return a}))

                    break;
            }
    }
    advance(){
        this.index--;
        if(this.index<0){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            getVideoCardList().forEach((item)=>{item.style.display=''});
            refreshVideos();
            pageLoaded().then(() => {
                let node=getVideoCardList().map(a => {return a.cloneNode(true);});
                node.forEach(a=>{a.className = " history";});
                this.push(node);
                console.log(this.videoHistorys[0])
            this.index=0
            });
        }else{
            console.log("advance head:"+this.index)
            console.log("access: "+(this.index)+" all: "+(this.videoHistorys.length));
            this.checkout(this.index);
        }
    }
    rewind(){
        this.index++;
        if(this.index<this.videoHistorys.length){
            console.log("rewind head:"+this.index)
            console.log("access: "+(this.index)+" all: "+(this.videoHistorys.length));
            this.checkout(this.index);
        }else{
            this.index--;
            return;
        }
    }
}

function pageLoaded() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}

function insertBeforeFirstChild(targetNode, domArray) {
    if (!targetNode || !domArray || domArray.length === 0) {
        return;
    }

    // 获取第一个子元素
    const firstChild = targetNode.firstChild;

    if (firstChild) {
        // 从最后一个元素开始插入，确保顺序正确
        for (let i = 0;i< domArray.length; i++) {
            targetNode.insertBefore(domArray[i], firstChild);
        }
    } else {
        // 如果没有子元素，直接追加到末尾
        domArray.forEach(element => {
            targetNode.appendChild(element);
        });
    }
}

function getVideoList(){
    return document.querySelectorAll('.bili-video-card__info--tit > a');
}
function getVideoCardList(){
    var result= Array.from(document.querySelectorAll('.container > .feed-card'));
    return result
}
function refreshVideos(){
    document.querySelectorAll('.primary-btn.roll-btn')[0].click();
}

const historyStack=new videoHistory();

function handleKey(event) {
    index=null
    for(i in shortcuts){
        if(shortcuts[i].includes(event.key)){
            index=i;
        }
    }
    switch(true){
        case index!=null:
            getVideoList()[index].click();
            break;
        case space.includes(event.key):
            document.querySelectorAll('.right-entry .v-popover-wrap > a')[2].click();
            break;
        case flip.includes(event.key):
            historyStack.advance();
            break;
        case cancel.includes(event.key):
            historyStack.rewind();
            break;
    }
}

document.addEventListener("keydown", handleKey, true);
