"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("service-worker.js").catch(t=>{console.error("service-worker not installed")})});const minutesToMilliseconds=t=>6e4*t;class CallFunctionOnDeviceRotate{constructor(t,e,i,s){this.previousOrientation=void 0,this.rotateCounter=0,this.threshold=s,this.functionToCall=t,this.functionContext=i,this.functionArgumets="string"==typeof e?[e]:e,window.addEventListener("deviceorientation",t=>{this.ifRotatedCallFunction(t)})}ifRotatedCallFunction(t){this.checkIfRotated(t.alpha)&&this.invokeFunction()}invokeFunction(){this.functionToCall.apply(this.functionContext,this.functionArgumets)}checkIfRotated(t){return!this.previousOrientation||this.isUnderRotated(t)?(this.updatePreviousOrientation(t),!1):(this.rotateCounter++,this.updatePreviousOrientation(t),this.rotateCounter>=2&&(this.rotateCounter=0,!0))}updatePreviousOrientation(t){this.previousOrientation=t}isUnderRotated(t){return Math.abs(this.previousOrientation-t)<=this.threshold}}class RainSoundPlayer{constructor(){this.audio=document.querySelector("#rainAudio"),this.audio.volume=0,this.playBtn=document.querySelector("#playBtn"),this.playBtn.addEventListener("click",()=>{this.run("btn")}),window.DeviceOrientationEvent&&new CallFunctionOnDeviceRotate(this.run,"rotation",this,60)}startPlayback(t){this.gradualVolumeChange("fadeIn"),this.playbackStatus="started",this.stopPlaybackTime=Date.now()+minutesToMilliseconds(t),this.adjustRefreshTime(t),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval)}stopPlayback(){this.audio.volume=0,this.playbackStatus="stopped",setTimeout(()=>{this.blockPlayback()},minutesToMilliseconds(15))}restartTimer(){this.stopPlaybackTime=Date.now()+minutesToMilliseconds(15),this.audio.volume<1&&this.gradualVolumeChange("fadeIn"),this.adjustRefreshTime(15),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval)}refresh(){const t=(this.stopPlaybackTime-Date.now())/minutesToMilliseconds(1);t<=3&&this.gradualVolumeChange("fadeOut"),t<=0?this.stopPlayback():(this.adjustRefreshTime(t),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval))}adjustRefreshTime(t){t>=minutesToMilliseconds(5)?this.refreshInterval=minutesToMilliseconds(5):this.refreshInterval=minutesToMilliseconds(.5)}gradualVolumeChange(t){if("fadeIn"===t){if(this.audio.volume>=.95)return void(this.audio.volume=1);this.audio.volume+=.05}else{if(this.audio.volume<=.05)return void(this.audio.volume=0);this.audio.volume-=.05}let e;e=minutesToMilliseconds("fadeIn"===t?.02:.15),clearTimeout(this.volumeChangeTimeout),this.volumeChangeTimeout=setTimeout(()=>{this.gradualVolumeChange(t)},e)}blockPlayback(){"stopped"===this.playbackStatus&&(this.playBtn.classList.add("push-to-unlock"),this.playbackStatus="blocked")}run(t){switch(this.playbackStatus){case"started":this.restartTimer();break;case"blocked":"btn"===t&&(this.playBtn.classList.remove("push-to-unlock"),this.startPlayback(15));break;default:this.startPlayback(15)}}}new RainSoundPlayer;