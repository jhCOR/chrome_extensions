chrome.runtime.sendMessage({
	action: "write2",
    source: document.getElementsByClassName('blind')[2].innerText}, function(response) {
    
});

