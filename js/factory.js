//factories
app.factory('expenseFactory', function ($http, $filter, expenseHttpFacade) {
    var factory = {};

    factory.getCategoryList = function () {
        return expenseHttpFacade.getCategories();
    }

    factory.getExpense = function (id) {
        return expenseHttpFacade.getExpense(id);
    }

    factory.deleteExpense = function (id) {
        return expenseHttpFacade.deleteExpense(id);
    }

    return factory;
});

app.factory('autoGenFactory', function ($rootScope, $interval) {
    var factory = {};

    var _startTimer = function () {
        _stopTimer = $interval(timeGenerator, 1000);
    }

    var _stopTimer;

    var timeGenerator = function () {
        $rootScope.$broadcast('TICK', new Date());
    }

    factory.startTimer = function () {
        return _startTimer();
    }

    factory.stopTimer = function () {
        $rootScope.$on("STOP_TICK", function (event, data) {
            $interval.cancel(_stopTimer);
        });
    }

    factory.stopTimer();

    return factory;
});
