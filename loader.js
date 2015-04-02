(function (baseUrl, src) {
  var done, link, script, head;

  function createLink() {
    var el  = document.createElement('link');
    el.rel  = 'stylesheet';
    el.type = 'text/css';
    el.href = baseUrl + 'oaa-utils.css';
    return el;
  }

  if (typeof window.OAAUtils === 'undefined') {
    done = false;
    link = createLink();
    script = document.createElement('script');
    script.src = baseUrl + 'oaa-utils.js';
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        initMyBookmarklet();
      }
    };
    head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    head.appendChild(link);
  }
  else {
    initMyBookmarklet();
  }

  function initMyBookmarklet() {
    var el=document.createElement('script');
    el.setAttribute('src', baseUrl + src);
    document.body.appendChild(el);
  }

})('http://localhost/bookmarklets/', 'message.js');

(function(baseUrl,src){var done,link,script,head;function createLink(){var el=document.createElement('link');el.rel='stylesheet';el.type='text/css';el.href=baseUrl+'oaa-utils.css';return el}if(typeof window.OAAUtils==='undefined'){done=false;link=createLink();script=document.createElement('script');script.src=baseUrl+'oaa-utils.js';script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=='loaded'||this.readyState=='complete')){done=true;initMyBookmarklet()}};head=document.getElementsByTagName('head')[0];head.appendChild(script);head.appendChild(link)}else{initMyBookmarklet()}function initMyBookmarklet(){var el=document.createElement('script');el.setAttribute('src',baseUrl+src);document.body.appendChild(el)}})('http://localhost/bookmarklets/','message.js');
