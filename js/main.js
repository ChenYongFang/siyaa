/*
 * initialize the application
 * autohr: Jeremy
 * date: 2014.05.26
 * requirejs's configuration and initialization functions and some common functions
 * Version: 1.0
 * License: siyaa inc
 */

require.config({
	baseUrl:'/',
	urlArgs:'v=1.0'
});

require(
	[
		'js/app',
        'lib/ui-bootstrap-0.10.0',
        'js/controllers/common',
        'js/services/common',
        'js/directives/common',
        'js/filters/common',
		'lib/angular-touch',
		'js/config'
	],
	function(){
		angular.bootstrap(document,['app']);
	}
);

/*********** EMBS common function section ***********/
angular.element.prototype.width = function(){
    if(this.length === 0)
        return false;

    var computedStyle = window.getComputedStyle(this[0]);
    var value = parseFloat(computedStyle.width) - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    return value;
};
angular.element.prototype.height = function(){
    if(this.length === 0)
        return false;

    var computedStyle = window.getComputedStyle(this[0]);
    var value = parseFloat(computedStyle.height) - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
    return value;
};
 // serialize from object data
 angular.params = function(params){
    if (!params) return;

    var parts = [];

    angular.forEach(params,function(value,key){
        if (value === null || angular.isUndefined(value)) return;
        if (!angular.isArray(value)) value = [value];

        angular.forEach(value,function(v){
            //current unsupport the nesting object or array.
            if (angular.isObject(v)) {
                v = angular.toJson(v);
            }
            parts.push(key + '=' + v);
        })
    });

    return parts.join('&');
}
/* common utils */
function GetRandomNum(Min,Max){

	var range = Max - Min;

	var rand = Math.random();

	return(Min + Math.round(rand * range));
}