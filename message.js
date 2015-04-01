javascript: (function (utils) {

  var header = "Landmarks Message";
  var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  function hideMessage () {
    if (window.msgOverlay) {
      utils.deleteMsgOverlay(window.msgOverlay)
      delete(window.msgOverlay);
      window.messageState = false;
    }
  }

  function showMessage (msgHeader, msgText) {
    var p = '<p style="margin: 10px 0; padding: 0">';
    var h2 = '<h2 style="margin: 10px 0 0 0; padding: 0">';

    if (!window.msgOverlay) window.msgOverlay = utils.createMsgOverlay();
    window.msgOverlay.innerHTML = h2 + msgHeader + "</h2>" + p + msgText + "</p>";
  }

  window.accessibility = function (flag) {
    window.messageState = (typeof flag === "undefined") ? true : !flag;
    if (!flag) showMessage(header, message);
    else hideMessage();
  };
  window.accessibility(window.messageState);

  window.onresize = function () {
    if (window.msgOverlay) utils.setBoxGeometry(window.msgOverlay);
  };

  window.onclick = function () {
    hideMessage();
  }

})(OAAUtils);
