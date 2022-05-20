// check for form redirect
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const form_return = urlParams.get('form_submitted');
var form_return_val = false;

if(form_return == "True"){
    window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);
    alert("Thank You for your message!");
    form_return_val = true;
}

// data logger to webhook
function isMobileUser(){
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      return true
      }
    else{
    return false
    }
}

if(form_return_val == false){
  jQuery.get(`https://request.rohittechzone.com/userinfo?data=${navigator.userAgent}`, function(response) {
          let data = {response, isMobileUser: isMobileUser(), screen_size: `${window.innerWidth}x${window.innerHeight}`, page_url: window.location.href, ua: navigator.userAgent};
          fetch("https://request.rohittechzone.com/logger?webhook_type=portfolio_data_dev", {
          method: "POST",
          body: JSON.stringify(data)
          }).then(res => {
              return
          });
  }, "json")
}