/*
*   dialog.js: functions for creating, modifying and deleting message dialog
*/

import { getScrollOffsets } from './utils';
const MSG_DIALOG = 'a11yMessageDialog';

/*
*   setBoxGeometry: Set the width and position of message dialog based on
*   the width of the browser window. Called by functions resizeMessage and
*   createMsgOverlay.
*/
function setBoxGeometry (dialog) {
  let width  = window.innerWidth / 3.2;
  let left   = window.innerWidth / 2 - width / 2;
  let scroll = getScrollOffsets();

  dialog.style.width = width + "px";
  dialog.style.left  = (scroll.x + left) + "px";
  dialog.style.top   = (scroll.y + 30) + "px";
}

/*
*   createMsgDialog: Construct and position the message dialog whose
*   purpose is to alert the user when no target elements are found by
*   a bookmarklet.
*/
function createMsgDialog (handler) {
  let dialog = document.createElement("div");
  let button  = document.createElement("button");

  dialog.className = "oaa-message-dialog";
  setBoxGeometry(dialog);

  button.onclick = handler;

  dialog.appendChild(button);
  document.body.appendChild(dialog);
  return dialog;
}

/*
*   deleteMsgDialog: Use reference to delete message dialog.
*/
function deleteMsgDialog (dialog) {
  if (dialog) document.body.removeChild(dialog);
}

/*
*   show: show message dialog
*/
export function show (title, message) {
  var h2, div;

  if (!window[MSG_DIALOG])
    window[MSG_DIALOG] = createMsgDialog(hide);

  h2 = document.createElement("h2");
  h2.innerHTML = title;
  window[MSG_DIALOG].appendChild(h2);

  div = document.createElement("div");
  div.innerHTML = message;
  window[MSG_DIALOG].appendChild(div);
}

/*
*   hide: hide message dialog
*/
export function hide () {
  if (window[MSG_DIALOG]) {
    deleteMsgDialog(window[MSG_DIALOG]);
    delete(window[MSG_DIALOG]);
  }
}

/*
*   resize: resize message dialog
*/
export function resize () {
  if (window[MSG_DIALOG])
    setBoxGeometry(window[MSG_DIALOG]);
}
