
document.body.oncontextmenu = e => {
	inserScript(e);
	console.log(`当前是右键模式`);
    return true;
    // e.preventDefault();
}

document.body.onselectstart = e => {
	setTimeout(function(e){
		console.log(`当前是选择模式`);
		inserScript(e);
	},1200)
	return true;
	// e.preventDefault();
};

var inserScript = function(e){
	if(window.getSelection().toString()){
		let location = window.getSelection().getRangeAt(0).getBoundingClientRect();
		`bottom: 361	height: 14	left: 475.5	right: 595.5	top: 347	width: 120	x: 475.5	y: 347`
		console.log('选中内容=>',window.getSelection().toString())
		chrome.extension.sendRequest({
			selected:window.getSelection().toString()
			}, 
			function(response) {
				if (response.status === 'stop'){
					console.log("插件未启用")
				}else if (response.status === 'copy'){
					copyPage(response,location);
				} else {
					baiduPage(response);
				}
		})	
	} else if (!window.getSelection().toString()){
		console.log('没有选中的文本');
		let node_data = document.getElementById("baidu-result");
		if(node_data){
			console.log('即将移除元素',node_data.id);
			document.body.removeChild(node_data);
		};	
	};
}

var baiduPage = function(response){
	removeCopy();
	var iframe = document.createElement('iframe'); //动态创建框架
	iframe.setAttribute("style",`z-index:1;position: fixed;right: 0 !important; bottom: 100px !important; width: 33% !important; height: 75% !important;`);
	iframe.setAttribute("id","baidu-result");
	iframe.srcdoc=response.result;            //框架中加载的页面
	document.body.appendChild(iframe);
}

var copyPage = function(response,location){
	removeCopy();
	let x = location.right < 800 ? location.right + 20 : location.left + 250;
	let y = location.top < 200 ? location.top + 20 : location.top - 66;
	console.log(`实际位置left: ${x}px; top: ${y}px \n光标位置left: ${location.right}px  top: ${location.top}px`);
	// console.log(`实际位置left: ${x}px; top: ${y}px \n光标位置left: ${location.x}px  top: ${location.y}px`);
	var iframe = document.createElement('iframe'); //动态创建框架
	iframe.setAttribute("style",`z-index:1;position: fixed;right: ${20}px !important; top: ${200}px !important; width: 24% !important; height: 60% `);
	iframe.setAttribute("id","baidu-result");
	iframe.setAttribute("frameborder","no");
	iframe.srcdoc=response.result;            //框架中加载的页面
	document.body.appendChild(iframe);
}

var removeCopy = function(){
	let node_data = document.getElementById("baidu-result");
		if(node_data){
			console.log('即将移除元素',node_data.id);
			document.body.removeChild(node_data);
		};
}
