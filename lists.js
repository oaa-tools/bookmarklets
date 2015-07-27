(function (utils) {
    var targetList = [
        {selector: "ul", color: "navy", label: "ul", numberOfChildren: 0},
        {selector: "ol", color: "purple", label: "ol", numberOfChildren: 0}
    ];

    var selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');
    var msgTitle  = "Lists";
    var msgText   = "No list elements (" + selectors + ") found.";
    var className = "a11yGfdXALm2";

    function getTooltipText (element, target) {
      var textContent = countListItems(element, target);
      return target.label + ": with " + textContent + " items";
    }
    
    function countListItems (element, target) {
      var totalChildCount = [];
      var currentElement = element;
      var currentId = currentElement.id;
      var child = currentElement.firstChild;
      var childCount = 0;

        while (child) {
            if((child.nodeType == 1) && (child.tagName == "LI")){
                childCount++;
            }
            child = child.nextElementSibling;
        }

        totalChildCount.push(childCount);

        return totalChildCount;
    }

    
    window.accessibility = function (flag){
        utils.hideMessage();
        window.a11yShowLists = (typeof flag === "undefined") ? true : !flag;
        if (window.a11yShowLists){
            if (utils.addNodes(targetList, className, getTooltipText) === 0) {
                utils.showMessage(msgTitle, msgText);
                window.a11yShowLists = false;
            }  
        }
        else {
            utils.removeNodes(className);
        }
    };
    
    window.addEventListener('resize', function (event) {
        utils.removeNodes(className);
        utils.resizeMessage();
        window.a11yShowLists = false;
    });

   window.accessibility(window.a11yShowLists);
})(OAAUtils);

