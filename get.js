// chrome.extension.sendMessage({
//     action: "get",
//     source: document.getElementsByClassName('blind')[2].innerText
// });

chrome.runtime.sendMessage({
	action: "write",
    source: null}, function(response) {
    
});

