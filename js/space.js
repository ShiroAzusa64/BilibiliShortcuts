console.log("Bilibili helper");
function getTarget(){
    return document.querySelectorAll('.bili-dyn-up-list__item')
}
function getIndex() {
    let target = getTarget();
    for (var i = 0; i < target.length; i++) {
        if (target[i].className === "bili-dyn-up-list__item active") {
            return i;
        }
    }
    return null;
}
function switchTo(index){
    var avatar=getTarget()[index];
    avatar.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
    avatar.click()
}
function handleKey(event){
    console.log(event.key);
    switch (true){
        case ["ArrowRight","2"].includes(event.key):
            var index=getIndex();
            if(index!=null){
            switchTo(index+1);
            }else{
                switchTo(0);
            }
            break;
        case ["ArrowLeft","1"].includes(event.key):
            var index=getIndex();
            if(index!=null){
            switchTo(index-1);
            }else{
                switchTo(0);
            }
            break;
        case event.key==='Shift':
            var target=document.querySelectorAll('.bili-dyn-action.like');
            if(target!=[]){
                target[0].click();
            }
            break;
        case ["/","z"].includes(event.key):
            document.querySelectorAll('.bili-dyn-card-video__title.bili-ellipsis.fs-medium')[0].click()
        break;
        case ["Escape"].includes(event.key):
            chrome.runtime.sendMessage({action: "closeCurrentTab"});
        break;
    }
}
document.addEventListener("keydown", handleKey, true);
