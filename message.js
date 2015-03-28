javascript: (function () {

  var header = "Landmarks Message";
  var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  function setLeftAndWidth (overlay) {
    var width = window.innerWidth / 3.2;
    var left = window.innerWidth / 2 - width / 2;

    overlay.style.width = width + "px";
    overlay.style.left = left + "px";
  }

  function createMsgOverlay () {
    var overlay = document.createElement("div");

    overlay.style.position = "absolute";
    overlay.style.overflow = "auto";
    overlay.style.zIndex = 300000;

    overlay.style.top    = "25px";
    setLeftAndWidth(overlay);

    overlay.style.padding = "0 10px 10px";
    overlay.style.border = "2px solid #333";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 1.0)";
    overlay.style.color = "#333";

    document.body.appendChild(overlay);
    return overlay;
  }

  function hideMessage () {
    if (window.msgOverlay)
      window.msgOverlay.style.visibility = "hidden";
  }

  function displayMessage (msgHeader, msgText) {
    var p = '<p style="margin: 10px 0; padding: 0">';
    var h2 = '<h2 style="margin: 10px 0 0 0; padding: 0">';

    if (!window.msgOverlay) window.msgOverlay = createMsgOverlay();
    window.msgOverlay.innerHTML = h2 + msgHeader + "</h2>" + p + msgText + "</p>";
    window.msgOverlay.style.visibility = "visible";
  }

  window.accessibility = function (flag) {
    window.messageVisibility = (typeof flag === "undefined") ? true : !flag;
    if (!flag) displayMessage(header, message);
    else hideMessage();
  };
  window.accessibility(window.messageVisibility);

  window.onresize = function () {
    if (window.msgOverlay) setLeftAndWidth(window.msgOverlay);
  };

  window.onclick = function () {
    if (window.msgOverlay && window.msgOverlay.style.visibility === "visible") {
      window.messageVisibility = false;
      hideMessage();
    }
  }

})();
