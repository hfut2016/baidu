
document.body.oncontextmenu = e => {
	inserScript(e);
    return true;
    // e.preventDefault();
}

// document.body.onselectstart = e => {
	// setTimeout(function(){
		// console.log(`文字选择事件=>${window.getSelection().toString()}`);
	// },1200)
	// return true;
	// // e.preventDefault();
// };

var inserScript = function(e){
	if(window.getSelection().toString()){
		console.log('右键选中内容=>',window.getSelection().toString())
		chrome.extension.sendRequest({
			all: e.target.innerText,
			selected:window.getSelection().toString()
			}, 
			function(response) {
				if(response.status){
					console.log("插件未启用")
				}else if(!document.getElementById("baidu-result")){
					var iframe = document.createElement('iframe'); //动态创建框架
					iframe.setAttribute("style","z-index:1;position: fixed;right: 0 !important; bottom: 100px !important; width: 33% !important; height: 75% !important;");
					iframe.setAttribute("id","baidu-result");
					iframe.srcdoc=response.result;            //框架中加载的页面
					document.body.appendChild(iframe);
				} else {
					let node_data = document.getElementById("baidu-result");
					node_data.srcdoc=response.result;
				}
			// console.log(document.readyState);
		})	
	} else if (!window.getSelection().toString()){
		console.log('没有选中的文本');
		let node_data = document.getElementById("baidu-result");
		if(node_data){
			console.log('即将移除元素',node_data);
			document.body.removeChild(node_data);
		};	
	};
}

