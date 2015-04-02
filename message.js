(function (utils) {

  var header = "Test Message";
  var message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  window.accessibility = function (flag) {
    window.messageState = (typeof flag === "undefined") ? true : !flag;
    if (!flag) utils.showMessage(header, message);
    else utils.hideMessage();
  };

  window.accessibility(window.messageState);

  window.onresize = function () { utils.resizeMessage(); };

})(OAAUtils);
