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
    var textContent = countListItems(element, target);
    return target.label + ": " + textContent;
    }
    
    function countListItems (element, target) {
        /*var listArray = [];
        var i = 0;
        var iterations = target.getElementsByTagName().length;
        console.log(iterations);
        while (iterations >=  0) { 
            listArray[i] = $(target.selector).children("li").length;
            i++;
            iterations--;
            console.log("writing " + i + "th element");
        }
        return listArray; */
        vm = this;
        var listItems = $(target.selector).children("li").length;
        console.log(target.selector);
        var temp = "with " +  listItems + " items";
        return temp;
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

