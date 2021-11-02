var box="";
var timer;
var request='';
var input;

function getHTML() {
chrome.tabs.executeScript(null, {
code : 'console.log("extraction excuted")'
}, function() {
gethtml();
});
}

function STOP() {
chrome.tabs.executeScript(null, {
code : 'console.log("extraction stoped")'
}, function() {
stop();
});
}

function CLEAN() {
 box="";
	document.getElementById('agc').innerText = box;
	document.getElementById('alarm').innerText="clean every database data "
	clear_data();
}

function gethtml() {
	document.getElementById('alarm').innerText='-';
	timer =	setInterval(extraction,2000)
}

function stop(){
	clearInterval(timer);
	box=box+"---extraction stop---";
	document.getElementById('agc').innerText = box;
}

function extraction(){
	
	chrome.tabs.executeScript(null, {
        file: "get.js"
    }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = chrome.extension.lastError.message;
            }
    });
}

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

function clear_data(){
	chrome.storage.local.get(['agc'], function(result) {
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

function save_To_local(){
	
	chrome.storage.local.set({'agc': box.substring(box.length-100,box.length)}, function() {
  console.log('Value is set to ');
});
}

function restore_To_local(){
	
	chrome.storage.local.get(['agc'], function(result) {
		if(result.agc){
			box=result.agc;
			document.getElementById('agc').innerText=box;
		}else{
			document.getElementById('agc').innerText='-';
		}

	});
	
}

var count = 0;
var counter=0;
chrome.extension.onMessage.addListener(function(request, sender) {

    if (request.action == "get") {
	
		count++;
		counter++;
		if(count>7){
			var time= new Date();
			
			box=box+'( '+'date: '+time.getDate()+'hour: '+time.getHours()+' )'+'\r\n';
			count=0;
		}				
		
		box=box+request.source+',';
		if(counter>20){
			// box.replaceAll('\n','\r\n');
			save_To_Txt("sample_file",box);
			counter=0;
			save_To_local();
		}
        document.getElementById('agc').innerText = box;
    }
});


document.addEventListener('DOMContentLoaded', function () {
restore_To_local();
clear_data();
var start_btn=document.getElementById('gethtml');
	start_btn.addEventListener("click",getHTML);
var stop_btn=document.getElementById('stop');
	stop_btn.addEventListener("click",STOP);
var clear_btn=document.getElementById('clear');
	clear_btn.addEventListener("click",CLEAN);

	
});

