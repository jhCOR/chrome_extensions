var box="";
var timer;
var request='';
var input;

function getHTML() {
chrome.tabs.executeScript(null, {
code : 'console.log("extraction excuted")'
}, function() {
	box="---extraction start---";
	document.getElementById('alarm').innerText = box;
	execute( "get.js");
});
}

function STOP() {
chrome.tabs.executeScript(null, {
code : 'console.log("extraction stoped")'
}, function() {
	execute("stop.js");
	box="---extraction stop---";
	document.getElementById('alarm').innerText = box;
});
}

function OPEN() {
chrome.tabs.executeScript(null, {
code : 'console.log("extraction stoped")'
}, function() {
	execute("open.js");
});
}

function execute(file){
	chrome.tabs.executeScript(null, {
        file: file
    }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = chrome.extension.lastError.message;
            }
    });
}

function CLEAN() {
	document.getElementById('alarm').innerText="clean every database data";
	
	chrome.storage.local.get(['AGC'], function(result) {
		if(result){
			chrome.storage.local.clear(function() {
				var error = chrome.runtime.lastError;
				if (error) {
					console.error(error);
				}

			});	
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {

var start_btn=document.getElementById('gethtml');
	start_btn.addEventListener("click",getHTML);
var stop_btn=document.getElementById('stop');
	stop_btn.addEventListener("click",STOP);
var clear_btn=document.getElementById('clear');
	clear_btn.addEventListener("click",CLEAN);
var open_btn=document.getElementById('open');
	open_btn.addEventListener("click",OPEN);
});

