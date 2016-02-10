app.directive('formerror', function () {
    return {
        templateUrl: '../html/errorBox.html',
        replace: true,
        restrict: 'E',
        scope: {
            errormsg: '@errormsg'
        }
    }
});
