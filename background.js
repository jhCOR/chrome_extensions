var timer;
var what;
var box='';
var TABID;
function save_To_Txt(fileName, content) {
    var blob = new Blob([content], { type: 'text/plain' });
    objURL = window.URL.createObjectURL(blob);
            
    // 이전에 생성된 메모리 해제
    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = fileName+".cell";
    a.href = objURL;
    a.click();
}

chrome.tabs.onRemoved.addListener(function(tabId, info) {
        if(tabId==TABID){
			stop();
			console.log("target TAB is closed");
        }
});

function save_To_local(box){
	chrome.storage.local.get(['AGC'], function(result) {
		if(result){
			chrome.storage.local.clear(function() {
				
				chrome.storage.local.set({'AGC': box.substring(0,box.length)}, function() {
				  console.log('successfully save');
				});
				var error = chrome.runtime.lastError;
				if (error) {
					console.error(error);
				}

			});	
		}
	});
	
}

function restore_To_local(){
	
	chrome.storage.local.get(['AGC'], function(result) {
		if(result.AGC){
			box=result.AGC;
		}

	});
}


var COUNTER=0;
function play() {
	getHTML();
	
}

function stop(){
	COUNTER=0;
	clearInterval(timer);
	save_To_local(box);
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
function getHTML() {
chrome.tabs.executeScript(TABID, {
code : 'console.log("extraction excuted")'
}, function() {

	execute( "get2.js");
});
}
function click() {
	chrome.tabs.executeScript(TABID, {
        file: "reload.js"
    }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = chrome.extension.lastError.message;
            }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    console.log(request.action );
		if (request.action == "write"){
		restore_To_local();
		TABID=sender.tab.id;
			timer=setInterval(play,2000)
		}else if(request.action == "write2"){
			what=request.source;
			console.log(box);
			COUNTER++;			
		box=box+what+',';
		if(COUNTER>10){
			COUNTER=0;
			save_To_local(box);
		}
		console.log(box);
		}else if(request.action == "stop"){
			stop();
		}else if(request.action == "open_tab"){
			console.log(TABID);
		chrome.tabs.reload(TABID,null,function(){
			click();
			// if(sender.tab.url=="https://www.naver.com/")
			// setTimeout(click, 1000);
			// console.log("+++");
			
		}
);
			// chrome.tabs.create({ url: "https://www.naver.com/" },(tab) => {TABID=tab.id; timer=setInterval(play,2000)});
			
		}
});

