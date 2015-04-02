(function (utils) {

  var header = "Test Message";
  var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  function hideMessage () {
    if (window.msgOverlay) {
      utils.deleteMsgOverlay(window.msgOverlay);
      delete(window.msgOverlay);
      window.messageState = false;
    }
  }

  function showMessage (closeHandler, msgHeader, msgText) {
    var h2, div;

    if (!window.msgOverlay)
      window.msgOverlay = utils.createMsgOverlay(closeHandler);

    h2 = document.createElement("h2");
    h2.innerHTML = msgHeader;
    window.msgOverlay.appendChild(h2);

    div = document.createElement("div");
    div.innerHTML = msgText;
    window.msgOverlay.appendChild(div);
  }

  window.accessibility = function (flag) {
    window.messageState = (typeof flag === "undefined") ? true : !flag;
    if (!flag) showMessage(hideMessage, header, message);
    else hideMessage();
  };
  window.accessibility(window.messageState);

  window.onresize = function () {
    if (window.msgOverlay) utils.setBoxGeometry(window.msgOverlay);
  };

})(OAAUtils);
