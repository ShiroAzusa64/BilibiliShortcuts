console.log("Bilibili helper");

let shortcuts=[]
shortcuts.push('.wer'.split(''))
shortcuts.push(';styu'.split(''))
shortcuts.push('[xiop'.split(''))
shortcuts.push('/qcv'.split(''))
shortcuts.push('\'ab'.split(''))
shortcuts.push(']znm'.split(''))
let space='\\'
let flip=['Control','Shift','Alt','1','ArrowUp','ArrowRight'];
let cancel=['2','ArrowLeft','ArrowDown'];

var configs=(await chrome.runtime.sendMessage({type: "GET_CONFIG"})).index;

let refreshButton=document.querySelector('.feed-roll-btn button');

class videoHistory{
    videoHistorys;
    depth=0;
    status="head";
    constructor(length){
        videoHistorys=fixedArray(length);
    }
    async advance(){
        if(this.status=="head"){
            this.status="head->refresh"
            #recordCurrentCard();
            #getNewVideo();
            return;
        }
        if(this.status=="history"){
            depth--;
            var targetStatus;
            if(depth==0){
                this.status="history->head";
                targetStatus="head";
            }else{
                this.status="history->history+";
                targetStatus="history";
            }
            #removeOldCard();
            #getNewVideo();
            this.status=targetStatus;
        }
    }
    async #getNewVideo(){
        if(this.status=="head->refresh"){
            function hashCode(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = (hash << 5) - hash + char;
                    hash = hash & hash;
                }
                return hash;
            }
            var hash=hashCode(getVideoBVList().join());
            refreshVideos();
            while(hash==hashCode(getVideoBVList().join())){
                    await new Promise((resolve)=>{setTimeout(50,resolve)});
            }
            this.status="head";
            return;
        }
        if(this.status=="history->head"){
            getVideoCardList().forEach((item)=>{item.style.display=''});
            return;
        }
        if(this.status=="head->history"){
            checkout(this.videoHistorys.refprev());
        }
        if(this.status=="history->history+"){
            checkout(this.videoHistorys.refnext());
        }
        if(this.status=="history->history-"){
            checkout(this.videoHistorys.refprev());
        }
    }
    #recordCurrentCard(){
        this.push(getVideoCardList().map(videos => { var video=videos.cloneNode(true);
                video.className="history";
                return video;
            }));
    }
    #removeOldCard(){
        if(status=="history->history+"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(status=="history->history-"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(status=="history->head"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(status=="head->history"){
            getVideoCardList().forEach((item)=>{item.style.display='none'});
            return;
        }
    }
    rewind(){
        if(this.status=="head"){
            this.status="head->history"
            depth++;
            #removeOldCard();
            #getNewVideo();
            return;
        }
        if(this.status=="history"){
            var targetStatus;
            if(Math.abs(depth)==videoHistorys.length){
                return;
            }else{
                depth++;
                this.status="history->history-";
                targetStatus="history";
            }
            #removeOldCard();
            #getNewVideo();
            this.status=targetStatus;
        }
    }
}

function checkout(nodelist){
        var container=document.querySelector(".container");
        insertBeforeFirstChild(container,nodelist);
}
class fixedArray extends Array{
    constructor(maxLength=100, ...initialItems){
        super(...initialItems);
        this.maxLength=maxLength;
        this.pointer=0;
    }
    push(...items) {
        var length=this.length + items.length;
        if (length > this.maxLength) {
            this.splice(0, this.maxLength - length);
        }
        return super.push(...items);
    }
    refnext(){
        this.pointer++;
        this.pointer=Math.abs(this.pointer)%this.length;
        return this.at(this.pointer);
    }
    refprev(){
        this.pointer--;
        this.pointer=Math.abs(this.pointer+this.length)%this.length;
        return this.at(this.pointer);
    }
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

function getVideoBVList(){
    return Array.from(document.querySelectorAll('.bili-video-card__info--tit > a')).map((node)=>{return node.childNodes[0].getAttribute("href").split("?")[0].match(/BV.*/)[0]});;
}
function getVideoCardList(){
    var result= Array.from(document.querySelectorAll('.container > .feed-card'));
    return result
}

function refreshVideos(){
    refreshButton.dispatchEvent(new Event('click'));
}

const historyStack=new videoHistory();

function handleKey(event) {
    var index;
    var action=Object.keys(configs).find((key) => {
        if(key.includes("keystruct")){
            index=config.keystruct_enter.findIndex((key)=>{return shortcuts[i].includes(event.key)});
            return index<0?false:true;
        }
        return configs[key].includes(event.key);
    });
    switch(action){
        case "keystruct_enter":
            getVideoList()[index].click();
            break;
        case "keylist_space":
            document.querySelectorAll('.right-entry .v-popover-wrap > a')[2].click();
            break;
        case "keylist_next":
            historyStack.advance();
            break;
        case "keylist_prev":
            historyStack.rewind();
            break;
    }
}
document.addEventListener("keydown", handleKey, true);
refreshButton.addEventListener('click', function(e) {
  if (e.isTrusted) {
    e.stopImmediatePropagation();
    historyStack.advance()
  }
}, true);
