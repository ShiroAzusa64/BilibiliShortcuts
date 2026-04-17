console.log("Bilibili helper");

var configs;

let refreshButton=document.querySelector('.feed-roll-btn button');

class videoHistory{
    videoHistorys;
    depth=0;
    status="head";
    constructor(length){
        this.videoHistorys=new fixedArray(length);
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
            var hash=getVideoBVList().join();
            refreshVideos();
            while(hash==hashCode(getVideoBVList().join())){
                    await new Promise((resolve)=>{setTimeout(resolve,100)});
            }
            this.status="head";
            return;
        }
        if(this.status=="history->head"){
            getVideoCardList().forEach((item)=>{item.style.display=''});
            this.status="head";
            return;
        }
        if(this.status=="head->history"){
            checkout(this.videoHistorys.refprev());
            this.status="history";
        }
        if(this.status=="history->history+"){
            checkout(this.videoHistorys.refnext());
            this.status="history";
        }
        if(this.status=="history->history-"){
            checkout(this.videoHistorys.refprev());
            this.status="history";
        }
    }
    #recordCurrentCard(){
        this.videoHistorys.push(getVideoCardList().map(videos => { var video=videos.cloneNode(true);
                video.className="history";
                return video;
            }));
    }
    #removeOldCard(){
        if(this.status=="history->history+"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(this.status=="history->history-"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(this.status=="history->head"){
            Array.from(document.querySelectorAll('.history')).forEach(a =>{a.remove()});
            return;
        }
        if(this.status=="head->history"){
            getVideoCardList().forEach((item)=>{item.style.display='none'});
            return;
        }
    }
    async advance(){
        if(this.status=="head"){
            this.status="head->refresh"
            this.#recordCurrentCard();
            this.#getNewVideo();
            return;
        }
        if(this.status=="history"){
            this.depth--;
            var targetStatus;
            if(this.depth==0){
                this.status="history->head";
                targetStatus="head";
            }else{
                this.status="history->history+";
                targetStatus="history";
            }
            this.#removeOldCard();
            this.#getNewVideo();
            this.status=targetStatus;
        }
    }
    rewind(){
        if(this.status=="head"){
            this.status="head->history"
            this.depth++;
            this.#removeOldCard();
            this.#getNewVideo();
            return;
        }
        if(this.status=="history"){
            var targetStatus;
            if(Math.abs(this.depth)==this.videoHistorys.length){
                return;
            }else{
                this.depth++;
                this.status="history->history-";
                targetStatus="history";
            }
            this.#removeOldCard();
            this.#getNewVideo();
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
    const firstChild = targetNode.firstChild;

    if (firstChild) {
        for (let i = 0;i< domArray.length; i++) {
            targetNode.insertBefore(domArray[i], firstChild);
        }
    } else {
        domArray.forEach(element => {
            targetNode.appendChild(element);
        });
    }
}

function getVideoBVList(){
    return Array.from(document.querySelectorAll('.bili-video-card__info--tit > a')).map((node)=>{return node.getAttribute("href").split("?")[0].match(/BV.*/)});
}
function getVideoCardList(){
    var result= Array.from(document.querySelectorAll('.container > .feed-card'));
    return result
}

function getVideoList(){
    return document.querySelectorAll('.bili-video-card__info--tit > a');
}

function refreshVideos(){
    refreshButton.dispatchEvent(new Event('click'));
}

const historyStack=new videoHistory();

async function handleKey(event) {
    config=await chrome.runtime.sendMessage({type: "GET_CONFIG"});
    config=config.data.index;
    var index;
    var action=Object.keys(config).find((key) => {
        if(key.includes("keystruct")){
            index=config.keystruct_enter.findIndex((key)=>{return key.includes(event.key)});
            return index<0?false:true;
        }
        return config[key].includes(event.key);
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
