(function () {
	//bootstrap navigation fix
	$('ul.navbar-nav li a').click(function (e) {
		$('ul.navbar-nav li.active').removeClass('active');
		$(this).parent('li').addClass('active');
	});
	
	//
	$('.navbar-brand').click(function (e) {
		$('ul.navbar-nav li.active').removeClass('active');
		$('ul.navbar-nav li:first').addClass('active');
	});
	
	
	//fix active menu on init
	(function () {
		var hash = window.location.hash || '#',
			$activeElement = $('ul.navbar-nav li a[href='+hash+']');
	
		if ($activeElement.length === 1) {
			$activeElement.parents('li:first').addClass('active');
		} else {
			$('ul.navbar-nav li:first').addClass('active');
		}
	})();
	
	//load bookmarklet
	(function () {
		var link = document.getElementById('hjp-bookmarklet-link-1');
		if (link.click !== undefined) {
			link.click();
		} else {
			link.onclick();
		}
	})();
})();