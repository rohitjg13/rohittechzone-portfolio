const button_make = document.getElementById('c-form__button')

if(params.get('text') != null){
	document.getElementById('greeting_text').innerHTML = `From <br/> ${params.get('text')}!`;
}

function updatePointer(){
    var makeInputValue = document.getElementById("c-form__input").value;

    if (makeInputValue.length > 0) {
        button_make.disabled = false;
        button_make.style.cursor = "pointer";
    } else {
        button_make.disabled = true;
        button_make.style.cursor = "no-drop";
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

async function functionConfirm(msg) {
    var confirmBox = jQuery("#confirm");
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
    jQuery.get(`https://request.rohittechzone.com/timeapiindia`, function(response) {

        let data = {name_entered: jQuery("#c-form__input").val(), time_in: getCookie("time_in"), time_now: response.datetime, isMobile: isMobileUser()};

        fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/925752405889544193/wzp1hFg9OEoBJVZ9vtgnvd3mWY7ZgWCdwnBEPbwFamOaK_nuunzWGwxFtGpOgo4JDPCI", {
        method: "POST",
        body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
        });
    }, "json")
    confirmBox.find(".message").text(msg);
	//`${window.location.origin.replace("http:", "https:")}${window.location.pathname}?text=${jQuery('#c-form__input').val()}`
    jQuery('#link_url').val(await shortUrl(`${window.location.origin.replace("http:", "https:")}${window.location.pathname}?text=${jQuery('#c-form__input').val()}`));
    confirmBox.find(".copy,.share").unbind().click(function() {
       confirmBox.hide();
       document.getElementById('blank_bg').style.display = "none";
    });
    confirmBox.find(".copy").click(function() {
     navigator.clipboard.writeText(`${jQuery('#c-form__input').val()} Wishing you a happy new year! 🎇🎆\n${jQuery('#link_url').val()}`);

	 jQuery.get(`https://request.rohittechzone.com/timeapiindia`, function(response) {

        let data = {event_type: "Copy",name_entered: jQuery("#c-form__input").val(), time_in: getCookie("time_in"), time_now: response.datetime, isMobile: isMobileUser()};

        fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/925949513594712084/yLe4la31jVR5VCtnOQNh996mh6V1t5ohthl9vOUXoDjuEMLZ-r2Q_pZgH-fAXlfwxyyR", {
        method: "POST",
        body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
        });
    }, "json")
	alert("Copied to clipboard!");
	document.location.href = `${window.location.origin.replace("http:", "https:")}${window.location.pathname}?text=${jQuery('#c-form__input').val()}&skip=true`;
   });
    confirmBox.find(".share").click(function() {
      //open share option if available
	  jQuery.get(`https://request.rohittechzone.com/timeapiindia`, function(response) {
		var bool_nav_data = false;
		if(navigator.share){
			bool_nav_data = true;
		}

        let data = {event_type: "Share", share_success: bool_nav_data, name_entered: jQuery("#c-form__input").val(), time_in: getCookie("time_in"), time_now: response.datetime, isMobile: isMobileUser()};

        fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/925949513594712084/yLe4la31jVR5VCtnOQNh996mh6V1t5ohthl9vOUXoDjuEMLZ-r2Q_pZgH-fAXlfwxyyR", {
        method: "POST",
        body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
        });
    }, "json")
       if (navigator.share) {
         navigator.share({
           title: 'New Year Wishes',
           text: `${jQuery('#c-form__input').val()} Wishing you a happy new year! 🎇🎆`,
           url: jQuery('#link_url').val()
         })
         .then(() => console.log('Successful share'))
         .catch((error) => console.log('Error sharing', error));
       } else {
			navigator.clipboard.writeText(`${jQuery('#c-form__input').val()} Wishing you a happy new year! 🎇🎆\n${jQuery('#link_url').val()}`);
        	alert("Share is not available in your browser! Instead copied it to your clipboard!");
       }
	   document.location.href = `${window.location.origin.replace("http:", "https:")}${window.location.pathname}?text=${jQuery('#c-form__input').val()}&skip=true`
    });
    document.getElementById('blank_bg').style.display = "block";
    confirmBox.show();
 }