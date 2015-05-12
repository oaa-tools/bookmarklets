(function (utils) {
    var targetList = [
        {selector: "ul", color: "navy", label: "ul"},
        {selector: "ol", color: "purple", label: "ol"}
    ];
    var selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');
    var msgTitle  = "Lists";
    var msgText   = "No list elements (" + selectors + ") found.";
    var className = "a11yGfdXALm2";

    function getTooltipText (element, target) {
    var textContent = utils.getElementText(element);
    return target.label + ": " + textContent;
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
