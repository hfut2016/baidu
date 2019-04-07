let serchNewsUrl = `https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&rsv_dl=ns_pc&word=` ;
let serchPageUrl =`https://www.baidu.com/s?ie=utf-8&f=8&wd=`;
let nowUrl = serchPageUrl; 
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	console.log(request)
	chrome.storage.sync.get('enabled', function(result) {  
		let responseData = '';
		// console.log(result)
		if (result.enabled){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", nowUrl + request.selected, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					responseData = checkHtml(xhr.responseText);
					sendResponse({result: responseData, status:false});
					}
			}
			xhr.send();
		} else {
			sendResponse({result: responseData, status:true});
		}
	});
	// chrome.storage.sync.get('searchUrl', function(result) {
		// console.log(result);
		// nowUrl = result.searchUrl ? serchPageUrl : serchNewsUrl ;
	  // })
 });
 
 function checkHtml(html) {
	 // console.log(html.match(/\)\);<\/script>[\s\S\w\W\d\D]*?<body link="#0000cc">/g))
	 if (html.match(/#content_left{width:540px;padding-left:121px;padding-top:5px}/g)){
		 return html.replace(/#content_left{width:540px;padding-left:121px;padding-top:5px}/,"#content_left{width:540px;padding-left:1px;padding-top:5px}")
		 .replace(/<a href="\/" id="result_logo" onmousedown=.* alt="到百度首页" title="到百度首页"><\/a>/, myButton)
		 .replace(/\)\);<\/script>[\s\S\w\W\d\D]*?<body link="#0000cc">/, insertScript)
	 } else {
		 return html;
	 }
 }
 
 var myButton = `<p id="result_logo" onmousedown="return c({'fm':'tab','tab':'logo'})">
	<input class="index-logo-src" id="copy-btn" type="button" value="一键复制" title="点击复制到剪贴版">
	<input class="index-logo-srcnew" type="button" value="到百度首页" title="到百度2首页"></p>`
 
 var insertScript = `));</script><script type="text/javascript" data-for="result">
	var copyToTipe = function(obj){
			if(document.getElementById("kw")){
				document.getElementById("kw").select();  
				console.log(document.execCommand("Copy")?'复制成功':'复制失败');
	}}
	var iframeLoad = function(){
		document.getElementById("copy-btn").setAttribute("onclick","copyToTipe(this)")}
	</script></head><body link="#0000cc" onload="iframeLoad()">`
  