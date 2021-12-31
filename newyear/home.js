async function copyInside(){
    let name_text = params.get('text');
    var original_url = `${window.location.origin.replace("http:", "https:")}${window.location.pathname}`
    if(name_text == null){
        navigator.clipboard.writeText(`Wishing you a happy new year! 🎇🎆\n${await shortUrl(original_url)}`);
    }
    else{
        navigator.clipboard.writeText(`Wishing you a happy new year! 🎇🎆\n${await shortUrl(original_url+'?text='+params.get('text'))}`);
    }
    alert("Copied to clipboard!");

    let data = {event_type: "Copy From Site",name_entered: params.get('text'), time_in: getCookie("time_in"), isMobile: isMobileUser()};

    fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/925949513594712084/yLe4la31jVR5VCtnOQNh996mh6V1t5ohthl9vOUXoDjuEMLZ-r2Q_pZgH-fAXlfwxyyR", {
    method: "POST",
    body: JSON.stringify(data)
    }).then(res => {
        console.log(res);
    });
}

async function shareInside(){
    var original_url = `${window.location.origin.replace("http:", "https:")}${window.location.pathname}`
    var bool_nav_data = false;
    if(navigator.share){
    bool_nav_data = true;
    }

    let data = {event_type: "Share From Site", share_success: bool_nav_data, name_entered: params.get('text'), time_in: getCookie("time_in"), isMobile: isMobileUser()};

    fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/925949513594712084/yLe4la31jVR5VCtnOQNh996mh6V1t5ohthl9vOUXoDjuEMLZ-r2Q_pZgH-fAXlfwxyyR", {
    method: "POST",
    body: JSON.stringify(data)
    }).then(res => {
    console.log(res);
    });
    if (navigator.share) {
    if(params.get('text') == null){
        navigator.share({
        title: 'New Year Wishes',
        text: `Wishing you a happy new year! 🎇🎆`,
        url: await shortUrl(original_url)
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
    else{
        navigator.share({
            title: 'New Year Wishes',
            text: `Wishing you a happy new year! 🎇🎆`,
            url: await shortUrl(original_url+'?text='+params.get('text'))
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
    } else {
    if(params.get('text') == null){
        var url_copy = await shortUrl(original_url);
        navigator.clipboard.writeText(`Wishing you a happy new year! 🎇🎆\n${url_copy}`);
    }
    else{
        var url_copy = shortUrl(original_url+'?text='+params.get('text'));
        navigator.clipboard.writeText(`Wishing you a happy new year! 🎇🎆\n${url_copy}`);
    }
    alert("Share is not available in your browser! Instead copied it to your clipboard!");
    }
}

async function shortUrl(originalUrl){
    return new Promise(function (resolve, reject) {
    jQuery.ajax({
        url: 'https://api-ssl.bitly.com/v4/shorten',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer 3d156547d3bd264dbf476aebbf528ca143296755',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            'long_url': originalUrl
        })
    }).done(function(data){
        resolve(data.link);
    }, function(error){
        reject(originalUrl);
    });
});
}
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