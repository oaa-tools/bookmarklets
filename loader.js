(function(baseUrl, src){
  var done, script;

  if (typeof window.OAAUtils === 'undefined') {
    done = false;
    script = document.createElement('script');
    script.src = baseUrl + 'oaa-utils.js';
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        initMyBookmarklet();
      }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  else {
    initMyBookmarklet();
  }

  function initMyBookmarklet() {
    var el=document.createElement('script');el.setAttribute('src', baseUrl + src);document.body.appendChild(el);
  }

})('http://localhost/bookmarklets/', 'message.js');

javascript:(function(baseUrl,src){var done,script;if(typeof window.OAAUtils==='undefined'){done=false;script=document.createElement('script');script.src=baseUrl+'oaa-utils.js';script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=='loaded'||this.readyState=='complete')){done=true;initMyBookmarklet()}};document.getElementsByTagName('head')[0].appendChild(script)}else{initMyBookmarklet()}function initMyBookmarklet(){var el=document.createElement('script');el.setAttribute('src',baseUrl+src);document.body.appendChild(el)}})('http://localhost/bookmarklets/','message.js');
