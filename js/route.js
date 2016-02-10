//Routes
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ChartController',
            templateUrl: '../html/homeExp.html'
        })
        .when('/viewExp', {
            controller: 'ViewExpController',
            templateUrl: '../html/viewExp.html'
        })
        .when('/addExp', {
            templateUrl: '../html/addExp.html'
        })
        .when('/editExp/:expenseId', {
            controller: 'EditExpController',
            templateUrl: '../html/addExp.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
