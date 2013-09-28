(function () {
	if (window.hjpBookmarklet !== undefined) {
		window.hjpJQuery('#hjp-bookmarklet-introduction').dialog('open');
		return;
	}
	window.hjpBookmarklet = {
		version: '1.0',
		baseUrl: 'http://hjp-bookmarklet.listup.co:82/'
	};
	
	var loadCounter = 0,
		loadingJQuery = false,
		loadingJQueryUI = false,
		oldJQuery = window.jQuery,
		oldJQueryUi = (window.jQuery !== undefined)?window.jQuery.ui:undefined;
	
	function insertScript (url, onload) {
		var script = document.createElement('script');
		script.src = url;
		script.onload = onload;
		script.className = 'hjp-bookmarklet-external';
		document.body.appendChild(script);
	}
	
	function insertLink (url, onload) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		link.className = 'hjp-bookmarklet-external';
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	
	loadingJQuery = (window.jQuery === undefined || window.jQuery.fn.jquery.split('.')[0] !== 1 || window.jQuery.fn.jquery.split('.')[1] < 10);
	loadingJQueryUI = (loadingJQuery || window.jQuery.ui === undefined || window.jQuery.ui.version.split('.')[0] !== 1 || window.jQuery.ui.version.split('.')[1] < 10);
	
	
	if (loadingJQuery) {
		loadCounter++;
		insertScript('http://code.jquery.com/jquery-1.10.1.min.js', function () {
			if (loadingJQueryUI) {
				insertScript('http://code.jquery.com/ui/1.10.3/jquery-ui.min.js', scriptLoadFinished);
			}
			
			scriptLoadFinished();
		});
	}
	
	if (loadingJQueryUI) {
		loadCounter++;
		insertLink('http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.min.css');
		
		if (!loadingJQuery) {
			insertScript('http://code.jquery.com/ui/1.10.3/jquery-ui.min.js', scriptLoadFinished);
		}
	}
	
	if (loadCounter === 0) {
		loadHjpBookmarklet();
	}
	
	insertLink(hjpBookmarklet.baseUrl+'css/hjp-bookmarklet.min.css');
	
	function scriptLoadFinished () {
		loadCounter--;
		if (loadCounter === 0) {
			loadHjpBookmarklet();
		}
	}
	
	function loadHjpBookmarklet () {	
		//restore jquery and ui
		window.hjpJQuery = window.jQuery;
		window.jQuery = oldJQuery;
		window.$ = oldJQuery;
		if (oldJQueryUi !== undefined) {
			window.jQuery.ui = oldJQueryUi;
		}
		
		insertScript(hjpBookmarklet.baseUrl+'js/hjp-bookmarklet.min.js');
	}
	
	//init load icon
	var img = document.createElement('img');
	img.src = hjpBookmarklet.baseUrl+'img/ajax-loader.gif';
	img.id = 'hjp-loading-image';
	img.alt = '';
	img.style.position = 'fixed';
	img.style.top = 0;
	img.style.right = 0;
	img.style.zIndex = 999999;
	document.body.appendChild(img);
}());