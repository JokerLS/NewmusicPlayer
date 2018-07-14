var musicList = []
var currentIndex = 0
var clock
var audio = new Audio()
audio.autoplay = true
audio.crossOrigin = "anonymous"

getMusicList(function(list){
    musicList = list
    loadMusic(list[currentIndex])
})

audio.ontimeupdate = function() {
    $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
}
audio.onplay = function() {
    clock = setInterval(function() {
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60 + ''
        sec = sec.length === 2? sec : '0' + sec
        $('.musicbox .time').innerText = min + ':' +sec
    }, 1000)
}

audio.onpause = function() {
    clearInterval(clock)
}

audio.onended = function() {
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .play').onclick = function() {
    if(audio.paused) {
        audio.play()
        this.querySelector('.fa').classList.remove('fa-play')
        this.querySelector('.fa').classList.add('fa-pause')
    }else {
    audio.pause()
        this.querySelector('.fa').classList.remove('fa-pause')
        this.querySelector('.fa').classList.add('fa-play')
    }
}

$('.musicbox .forward').onclick = function() {
    currentIndex =  (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .back').onclick = function() {
    currentIndex =  (musicList.length + --currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .bar').onclick = function(e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent
}

function $(selector) {
    return document.querySelector(selector)
}

function getMusicList(callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', './musiclist.json', true)
    response.setHeader("Access-Control-Allow-Origin", "*")
    xhr.onload = function(){
      if((xhr.status >=200 && xhr.status < 300) || xhr.status === 304) {
        callback(JSON.parse(this.responseText))
      }else {
        console.log('获取数据失败')
      }
    }
    xhr.onerror = function(){
      console.log('网络异常')
    }
    xhr.send()
}

function loadMusic(musicObj) {
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .auther').innerText = musicObj.auther
    $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
    audio.src = musicObj.src
}
