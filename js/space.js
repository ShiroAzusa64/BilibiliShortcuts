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
    getTarget()[index].click();
}
function handleKey(event){
    console.log(event.key);
    switch (true){
        case ["ArrowRight","Digit1"].includes(event.key):
            var index=getIndex();
            if(index!=null){
            switchTo(index+1);
            }else{
                switchTo(0);
            }
            break;
        case ["ArrowLeft","Digit2"].includes(event.key):
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
    }
}
document.addEventListener("keyup", handleKey, true);
