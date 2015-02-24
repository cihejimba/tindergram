angular.module('Style', [])

.factory('common.style', function() {
	var
		WINDOWS_TAG = '-ms-',
		WEBKIT_TAG = '-webkit-',
		FIREFOX_TAG = '-moz-',
		OPERA_TAG = '-o-';


	// returns an object to be set as prop.css for ng-style directive
	function setProperty (property, style, currentCSS) {
		currentCSS = currentCSS ? _.clone(currentCSS) : {};
		currentCSS[property] = style;
		currentCSS[WINDOWS_TAG + property] = style;
		currentCSS[WEBKIT_TAG + property]  = style;
		currentCSS[FIREFOX_TAG + property] = style;
		currentCSS[OPERA_TAG + property]   = style;
		// console.log(JSON.stringify(currentCSS));
		return currentCSS;
	}

	return {
		css : setProperty
	};
});
