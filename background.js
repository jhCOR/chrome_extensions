var timer;
var what;

function play() {
	console.log(">");
   chrome.extension.sendMessage({
    action: "get",
    source: what
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.action == "write"){
		what=request.source;
		play(what);
		console.log("what:"+what);
	}
      
});