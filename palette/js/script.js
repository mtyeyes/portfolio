let touchStartX,touchStartY,touchEndX,touchEndY;"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("service-worker.js").catch(e=>{alert("There has been a problem with Service Worker registration. This application may require internet connection to function properly.")})});let chosenFavoriteColor,btnHold,isLongPress,helpBtn=document.querySelector(".help__btn"),helpContainer=document.querySelector(".help__container"),paletteBtn=document.querySelector(".palette__btn"),paletteContainer=document.querySelector(".palette__container"),sliders=document.querySelectorAll(".palette__slider"),favoriteColorContainers=document.querySelectorAll(".palette__favorite-color");hslStringToArr=e=>(hslArr=e.split(","),hslArr[0]=+hslArr[0].replace("hsl(",""),hslArr[1]=+hslArr[1].replace("%",""),hslArr[2]=+hslArr[2].replace("%)",""),hslArr),hslArrToString=e=>"hsl("+e[0]+","+e[1]+"%,"+e[2]+"%)",getCustomProperty=e=>window.getComputedStyle(document.documentElement).getPropertyValue(e),setCustomProperty=(e,t)=>{document.documentElement.style.setProperty(e,t)},setScreenColor=(e,t)=>{if(setCustomProperty("--screen-light",e),localStorage.setItem("--screen-light",e),void 0===t){e.slice(e.lastIndexOf(",")+1).replace("%)","")}t<=30?(setCustomProperty("--secondary-color","hsl(0, 0%, 73%)"),localStorage.setItem("--secondary-color","hsl(0, 0%, 73%)")):(setCustomProperty("--secondary-color","hsl(44, 10%, 13%)"),localStorage.setItem("--secondary-color","hsl(44, 10%, 13%)"))},synchronizeSliders=e=>{sliders[0].value=e[0],sliders[1].value=e[1],sliders[2].value=e[2]},changeHue=e=>{hslArr=hslStringToArr(getCustomProperty("--screen-light")),hslArr[0]+e>360?hslArr[0]=hslArr[0]+e-360:hslArr[0]+e<0?hslArr[0]=hslArr[0]+e+360:hslArr[0]=hslArr[0]+e,resultedColor=hslArrToString(hslArr),setScreenColor(resultedColor,hslArr[2]),synchronizeSliders(hslArr)},changeLightness=e=>{hslArr=hslStringToArr(getCustomProperty("--screen-light")),hslArr[2]+e>100||hslArr[2]+e<0||(hslArr[2]=hslArr[2]+e,resultedColor=hslArrToString(hslArr),setScreenColor(resultedColor,hslArr[2]),synchronizeSliders(hslArr))},adjustColorsBySlider=()=>{let e=[];e[0]=sliders[0].value,e[1]=sliders[1].value,e[2]=sliders[2].value,resultedColor=hslArrToString(e),setScreenColor(resultedColor,e[2]),chosenFavoriteColor&&(setCustomProperty(chosenFavoriteColor,resultedColor),localStorage.setItem(chosenFavoriteColor,resultedColor))},selectFavoriteColor=e=>{let t=getCustomProperty(e.dataset.propertyName),r=hslStringToArr(t);setScreenColor(t,r[2]),synchronizeSliders(r),chosenFavoriteColor=e.dataset.propertyName},toggleHelp=()=>{paletteContainer.classList.remove("palette__container--show"),helpContainer.classList.toggle("help__container--show"),chosenFavoriteColor=null},togglePalette=()=>{helpContainer.classList.remove("help__container--show"),paletteContainer.classList.toggle("palette__container--show"),chosenFavoriteColor=null},changeBtnsVisibility=()=>{document.querySelector(".help__icon").classList.toggle("help__icon--hide"),document.querySelector(".palette__icon").classList.toggle("palette__icon--hide"),document.querySelector(".help__icon").classList.contains("help__icon--hide")?localStorage.setItem("hide-btns",!0):localStorage.removeItem("hide-btns"),isLongPress=!0},btnReleased=e=>{clearTimeout(btnHold),isLongPress||(e===helpBtn?toggleHelp():togglePalette())},touchEnded=()=>{clearTimeout(btnHold)},document.addEventListener("keydown",function(e){switch(e.code){case"ArrowRight":changeHue(30);break;case"ArrowLeft":changeHue(-30);break;case"ArrowUp":changeLightness(10);break;case"ArrowDown":changeLightness(-10)}}),swipe=()=>{if(paletteContainer.classList.contains("palette__container--show"))return;let e=touchEndX-touchStartX,t=touchEndY-touchStartY;Math.abs(e)<80&&Math.abs(t)<80||(Math.abs(e)>Math.abs(t)?e>0?changeHue(30):changeHue(-30):t>0?changeLightness(10):changeLightness(-10))},document.addEventListener("touchstart",function(e){touchStartX=e.changedTouches[0].screenX,touchStartY=e.changedTouches[0].screenY}),document.addEventListener("touchend",function(e){touchEndX=e.changedTouches[0].screenX,touchEndY=e.changedTouches[0].screenY,swipe()}),document.querySelector(".palette__container").addEventListener("touchstart",function(e){e.stopPropagation()}),document.querySelector(".palette__container").addEventListener("touchend",function(e){e.stopPropagation()}),helpBtn.addEventListener("touchstart",function(e){isLongPress=!1,btnHold=setTimeout(changeBtnsVisibility,1300)}),helpBtn.addEventListener("touchend",function(e){touchEnded()}),helpBtn.addEventListener("mousedown",function(e){isLongPress=!1,btnHold=setTimeout(changeBtnsVisibility,1300)}),helpBtn.addEventListener("mouseup",function(e){btnReleased(e.currentTarget)}),paletteBtn.addEventListener("touchstart",function(e){isLongPress=!1,btnHold=setTimeout(changeBtnsVisibility,1300)}),paletteBtn.addEventListener("touchend",function(e){touchEnded()}),paletteBtn.addEventListener("mousedown",function(e){isLongPress=!1,btnHold=setTimeout(changeBtnsVisibility,1300)}),paletteBtn.addEventListener("mouseup",function(e){btnReleased(e.currentTarget)}),document.addEventListener("mouseup",function(e){clearTimeout(btnHold)});for(let e of sliders)e.addEventListener("input",function(e){adjustColorsBySlider()});for(let e of favoriteColorContainers)e.addEventListener("click",function(e){selectFavoriteColor(e.target)});!function(){if(localStorage.getItem("--screen-light")){setCustomProperty("--screen-light",localStorage.getItem("--screen-light")),setCustomProperty("--secondary-color",localStorage.getItem("--secondary-color"));let e=hslStringToArr(localStorage.getItem("--screen-light"));synchronizeSliders(e)}localStorage.getItem("hide-btns")&&(document.querySelector(".help__icon").classList.add("help__icon--hide"),document.querySelector(".palette__icon").classList.add("palette__icon--hide"));for(let e of favoriteColorContainers)localStorage.getItem(e.dataset.propertyName)&&setCustomProperty(e.dataset.propertyName,localStorage.getItem(e.dataset.propertyName))}();