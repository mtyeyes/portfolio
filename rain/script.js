"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("service-worker.js").catch(e=>{console.error("service-worker not installed")})});const minutesToMilliseconds=e=>6e4*e;class RainSoundPlayer{constructor(){this.audio=document.querySelector("#rainAudio"),this.audio.volume=0,this.playBtn=document.querySelector("#playBtn"),this.playBtn.addEventListener("click",()=>{this.run("btn")})}startPlayback(e){this.playbackStatus="started",this.gradualVolumeChange("fadeIn"),this.stopPlaybackTime=Date.now()+minutesToMilliseconds(e),this.adjustRefreshTime(e),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval)}stopPlayback(){this.audio.volume=0,setTimeout(()=>{this.blockPlayback()},minutesToMilliseconds(10))}restartTimer(){this.stopPlaybackTime=Date.now()+minutesToMilliseconds(15),this.audio.volume<1&&this.gradualVolumeChange("fadeIn"),this.adjustRefreshTime(15),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval)}refresh(){console.log(this.audio.volume);const e=(this.stopPlaybackTime-Date.now())/minutesToMilliseconds(1);e<=3&&this.gradualVolumeChange("fadeOut"),e<=0?this.stopPlayback():(this.adjustRefreshTime(e),this.refreshTimeout=setTimeout(()=>{this.refresh()},this.refreshInterval))}adjustRefreshTime(e){e>=minutesToMilliseconds(5)?this.refreshInterval=minutesToMilliseconds(5):this.refreshInterval=minutesToMilliseconds(.5)}gradualVolumeChange(e){if("fadeIn"===e){if(this.audio.volume>=.95)return void(this.audio.volume=1);this.audio.volume+=.05}else{if(this.audio.volume<=.05)return void(this.audio.volume=0);this.audio.volume-=.05}let t;t=minutesToMilliseconds("fadeIn"===e?.02:.15),clearTimeout(this.volumeChangeTimeout),this.volumeChangeTimeout=setTimeout(()=>{this.gradualVolumeChange(e)},t)}blockPlayback(){"stopped"===this.playbackStatus&&(this.playbackStatus="blocked")}run(e){switch(this.playbackStatus){case"started":this.restartTimer();break;case"blocked":"btn"===e&&this.startPlayback(30);break;default:this.startPlayback(30)}}}new RainSoundPlayer;