(function () {
	var	$ = window.hjpJQuery,
		bookmarkletBaseUrl = window.hjpBookmarklet.baseUrl,
		introductionTemplate = '<div id="hjp-bookmarklet-introduction" class="introduction" style="display:none"><h3 class="title">Bookmarklet za Hrvatski Jezični Portal</h3><div class="instructions"><p>Ovaj bookmarklet omogućava korištenje rječnika <a target="_blank" href="http://hjp.novi-liber.hr/?referer=hjp_bookmarklet">Hrvatskog Jezičnog Portala</a> na svim internetskim stranicama pomoću dvostrukog klika na odabranu riječ.</p></div></div>',
		disableClassName = 'hjp-bookmarklet-popup',
		onlyOnePopup = true,
		idCounter = 0,
		listupUrl = bookmarkletBaseUrl,
		hjpHomeUrl = 'http://hjp.novi-liber.hr/',
		hjpSearchByIdUrl = hjpHomeUrl+'index.php?referer=hjp_bookmarklet&show=search_by_id&id=',
		serviceUrl = 'http://listup.co:9615/',
		load = function (word, position) {
			if (wordsCache[word] === undefined) {
				$.ajax({
					url: serviceUrl,
					data: {'word': word},
					success: function (json) {
						wordsCache[word] = json['results'];
						displayResult.call(this, word, wordsCache[word], position);
					},
					dataType: 'jsonp'
				});
			} else {
				displayResult.call(this, word, wordsCache[word], position);
			}
		},
		processInput = function (data) {
			var $data;
			
			try {
				$data = $('<span>'+data+'</span>');
			} catch (e) {
				//ignore
			}

			if ($data !== undefined) {
				//remove links
				$data.find('a').each(function () {
					var $a = $(this);
					$a.removeAttr('href');
				});
				return $data.html();
			} else {
				return data;
			}
		},
		wordsCache = {},
		displayResult = function (word, results, position) {
			var popupContent = '',
				href,
				foundWord,
				$popup;
			
			if (results.length == 1) {
				foundWord = processInput.call(this, results[0].word);
				popupContent += '<h3 class="word">'+foundWord+'</h3>';
				
				popupContent += '<ol class="definition">';
				$.each(results[0].definition, function () {
					var definition = processInput.call(this, this);
					popupContent += '<li>'+definition+'</li>';
				});
				popupContent += '</ol>';
				
				href = (results[0].id)?(hjpSearchByIdUrl+encodeURIComponent(results[0].id)):hjpHomeUrl;
				
				popupContent += '<p class="link">Više na <a target="_blank" href="'+href+'">Hrvatskom Jezičnom Portalu</a>!</p>';
			} else { //ambigious
				popupContent += '<p class="ambigious">Pronađeno je više rezultata za riječ <em>'+word+'</em>.</p>';
				
				popupContent += '<ul class="definition">';
				$.each(results, function () {
					var foundWord = processInput.call(this, this.word),
						definition = processInput.call(this, this.definition[0]);
					
					href = (this.id)?(hjpSearchByIdUrl+encodeURIComponent(this.id)):hjpHomeUrl;
					
					popupContent += '<li><b class="word">'+foundWord+'</a></b>: <span class="definition">'+definition+'<span>, <span class="ambigious-link">Više na <a target="_blank" href="'+href+'">Hrvatskom Jezičnom Portalu</a></span></li>';
				});
				popupContent += '</ul>';
			}
			
			$popup = $('<span>'+popupContent+'</span>');
			$popup.attr('id', disableClassName+'-'+idCounter);
			$popup.addClass(disableClassName);
			$('body').append($popup);
			$popup.dialog({
				modal: false,
				dialogClass: 'hjp-bookmarklet-popup-jquery-ui',
				buttons: {
					'Zatvori': function () {
						$(this).dialog("destroy").remove();
					}
				},
				'position': position
			});
			
			$popup.parents('.ui-dialog:first').find('.ui-dialog-buttonpane').append('<span class="powered-by"><a target="_blank" class="hjp-logo" href="'+hjpHomeUrl+'?referer=hjp_bookmarklet"><img class="hjp-logo" src="'+bookmarkletBaseUrl+'img/hjp-logo.png" alt="Hrvatski Jezični Portal" /></a><a target="_blank" class="listup-logo" href="'+listupUrl+'?referer=hjp_bookmarklet"><img class="listup-logo" src="'+bookmarkletBaseUrl+'img/listup-logo.png" alt="Listup" /></a></span>');
		},
		dblclickHandler = function (e) {
			//check if popup
			var $self = $(e.target),
				word;
			if($self.hasClass(disableClassName) || $self.parents('.'+disableClassName+':first').length !== 0) {
				return;
			}
			
			word = window.getSelection().toString().trim();
			if (word !== '' && word.split(/\s+/).length <= 4) { //no more than 4 words
				load.call(this, word, [e.pageX-$(window).scrollLeft(), e.pageY-$(window).scrollTop()]);
			}
		},
		clickHandler = function (e) {
			var $self;
			if (onlyOnePopup) {
				$self = $(e.target);
					if ($self.hasClass('ui-dialog') || $self.parents('.ui-dialog').length !== 0) {
						return;
				}
				
				$('.'+disableClassName).dialog('close').remove();
			}
		},
		destroyBookmarklet = function () {
			$(this).dialog("destroy").remove();
			$popupLink.remove();
			
			$(document).unbind('dblclick', dblclickHandler);
			$(document).unbind('click', clickHandler);
			
			$('.hjp-bookmarklet-external').remove();
			
			delete window.hjpBookmarklet;
			delete window.hjpJQuery;
		},
		$popupLink,
		$popup
	;
	
	$(document).bind('dblclick', dblclickHandler);
	$(document).bind('click', clickHandler);
	
	/*
	$(document).bind('mouseup', function () {
		word = window.getSelection().toString().trim();
		console.log('load.call for ', word);
		//this would perhaps be too intrusive for the user
	});
	*/
	
	//init introduction
	$('#hjp-loading-image').remove();
	$popupLink = $('<a href="#" style="position:fixed;top:0;right:0;z-index:999999"><img src="'+bookmarkletBaseUrl+'img/hjp-logo-small.png" alt="HJP - Bookmarklet" /></a>');
	$popupLink.bind('click', function (e) {
		e.preventDefault();
		$('#hjp-bookmarklet-introduction').dialog('open');
	});
	
	$('body').append($popupLink).append(introductionTemplate);
	$popup = $("#hjp-bookmarklet-introduction").dialog({
		modal: true,
		autoOpen: false,
		width: 450,
		dialogClass: 'hjp-bookmarklet-introduction',
		buttons: {
			'Kreni!': function () {
				$(this).dialog("close");
			},
			'Ukloni': function () {
				destroyBookmarklet.call(this);
			}
		}
	});
	
	$popup.parents('.ui-dialog:first').find('.ui-dialog-buttonpane').append('<div class="powered-by"><a target="_blank" class="hjp-logo" href="'+hjpHomeUrl+'?referer=hjp_bookmarklet"><img class="hjp-logo" src="'+bookmarkletBaseUrl+'img/hjp-logo.png" alt="Hrvatski Jezični Portal" /></a><a target="_blank" class="listup-logo" href="'+listupUrl+'?referer=hjp_bookmarklet"><img class="listup-logo" src="'+bookmarkletBaseUrl+'img/listup-logo.png" alt="Listup" /></a></div>');
}());
