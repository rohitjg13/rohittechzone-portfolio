window.addEventListener("load", function () {
  jQuery.get(`http://worldtimeapi.org/api/timezone/Asia/Kolkata`, function(response) {
        let data = response.datetime;
        document.cookie = `time_in=${data}`;
    }, "json")
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
  }
  return "";
  }
function isMobileUser(){
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    return true
    }
  else{
  return false
  }
}
  jQuery.get(`http://api.userstack.com/api/detect?access_key=df23ee423c21d95c8e22d9da000ecdc8&ua=${navigator.userAgent}`, function(response) {
        let data = {response, time_in: getCookie("time_in"), isMobileUser: isMobileUser(), screen_size: `${window.innerWidth}x${window.innerHeight}`};
        fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/924630327526305812/Nb-XGarFJfCKTXkeLVH4Tu6_VJVa3vTC418vZn87Nn4BB7FbrPDZJA8TQp7kbEiNEShR", {
        method: "POST",
        body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
        });
    }, "json")
});
var $ = function(id) {
    return document.getElementById(id);
  };
  var inc = 0;
  var out = 0;
  var str = 'Unboxing 2022...';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%&';
  var t;
  var loaded_var = 0;
  function loaded() {
    if (loaded_var == 0) {
      // console.log(navigator.share);
      // if (navigator.share) {
      //   navigator.share({
      //     title: document.title,
      //     text: "Hello World",
      //     url: window.location.href
      //   })
      //   .then(() => console.log('Successful share'))
      //   .catch(error => console.log('Error sharing:', error));
      // }
      $('loading_element').style.display = 'none';
      $('unbox_text').style.display = 'none';
      $('skip_button').style.display = 'none';

      var cssFile = document.createElement('link');
      cssFile.rel = 'stylesheet';
      cssFile.href = "newyear.css";
      document.head.appendChild(cssFile);

      loaded_var = 1;
      $('canvas').style.display = 'block';
      $('main_text').style.display = 'block';
      $('year_text').style.display = 'block';
      $('c-make-container').style.display = 'block';
      $('greeting_text').style.display = 'block';
    }
  }
  let params = (new URL(window.location.href)).searchParams;
  if(params.get('skip') == 'true'){
    loaded();
  }
  var anim = function() {
    inc++;
    let skip_button = $('skip_button');
    if(skip_button.clicked){
      loaded();
    }
    if (inc % 7 === 0 && out < str.length) {
      $('anim').appendChild(document.createTextNode(str[out]));
      out++;
    } else if (out >= str.length) {
      $('shuffle').innerHTML = '';
      setTimeout(function() {
        loaded();
        // skip_button = document.getElementById('skip_button')
        // skip_button.click();
        //window.open("/newyear/newyear.html", '_blank').focus();

        // window.location.href = '/newyear/newyear.html';
       }, 1000);
      if(loaded_var == 0){
       removeInterval(t);
      }
    }
    $('shuffle').innerHTML =
      chars[Math.floor(Math.random() * chars.length)];
  };
  t = setInterval(anim, 50);
  $('anim').innerHTML = '';
  console.log('%cUnboxing 2022...', 'color: #fff; background: #000; padding: 5px;');