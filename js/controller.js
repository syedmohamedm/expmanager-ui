// Controllers
var controllers = {};
controllers.MainController = function ($scope, $log, expenseHttpFacade) {
    $log.debug('MainController started');

    $scope.view_exp_title = "View Expense";
    $scope.add_exp_title = "Add Expense";

    $scope.currentYear = new Date().getFullYear();
    $log.debug('MainController ended');
};

controllers.ChartController = function ($scope, $log, expenseHttpFacade) {
    $log.debug('ChartController started');

    expenseHttpFacade.getAllExpensesForChart()
        .success(function (data, status, headers, config) {
            $scope.loadChartJS(data);
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching all expenses for chart');
        });
    expenseHttpFacade.getAllExpensesForBarChart()
        .success(function (data, status, headers, config) {
            $scope.loadBarChartJS(data);
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching all expenses for chart');
        });

    $scope.loadBarChartJS = function (data) {

        var _labels = [];
        var _dataSet = [];
        angular.forEach(data, function (value, key) {
            _labels.push(value[0]);
            _dataSet.push(value[1]);
        });

        var _chartData = {
            labels: _labels,
            datasets: [{
                data: _dataSet
            }]
        };

        var ctx1 = $("#expByDayChart").get(0).getContext("2d");
        var myBarChart = new Chart(ctx1).Bar(_chartData, {});
    }
    $scope.loadChartJS = function (data) {
        var _chartData = [];
        angular.forEach(data, function (value, key) {
            _chartData.push({
                'label': value.category.name,
                'value': value.amount
            });
        });
        var options = {
            segmentShowStroke: false,
            animateRotate: true,
            animateScale: false,
            percentageInnerCutout: 50,
            tooltipTemplate: "<%= value %>%",
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        }

        var ctx = $("#myChart").get(0).getContext("2d");
        var chartDo = new Chart(ctx).Pie(_chartData, options);
        document.getElementById('js-legend').innerHTML = chartDo.generateLegend();
    }

    $log.debug('ChartController ended');
};

controllers.ViewExpController = function ($scope, $http, $log, $filter, $location, $route, expenseHttpFacade, expenseFactory) {
    $log.debug('ViewExpController started');

    $scope.categories = expenseFactory.getCategoryList()
        .success(function (data, status, headers, config) {
            return $scope.categories = data;
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching categories');
        });

    $scope.dateComparator = function (actual, expected) {
        if (!expected) {
            return true;
        }
        actual = $filter('date')(actual, 'dd-MM-yyyy');
        expected = $filter('date')(expected, 'dd-MM-yyyy');
        return angular.equals(expected, actual);
    };

    var data = [];

    expenseHttpFacade.getAllExpenses()
        .success(function (data, status, headers, config) {
            $scope.expenses = data;
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching all expenses');
        });

    $scope.openDeleteExpense = function (expenseId) {
        $scope.deleteExpenseId = expenseId;
        $('#myModal').modal('show');
    };

    $scope.deleteExpense = function (expenseId) {
        expenseFactory.deleteExpense(expenseId)
            .success(function (data, status, headers, config) {
                $route.reload();
                $('#myModal').modal('hide');
            })
            .error(function (data, status, headers, config) {
                $log.debug('Error deleting expense');
            });
    };

    $log.debug('ViewExpController ended');
};

controllers.AddExpController = function ($scope, $log, $http, $filter, $location, $route, expenseFactory) {
    $log.debug('AddExpController started');

    if (!$scope.expense) {
        $scope.expense = {
            'date': new Date()
        };
    }

    $scope.categories = expenseFactory.getCategoryList()
        .success(function (data, status, headers, config) {
            return $scope.categories = data;
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching categories');
        });

    $scope.addExpense = function () {
        $http({
                method: 'POST',
                url: 'http://localhost:9000/expense/add',
                data: $scope.expense
            })
            .success(function (data, status, headers, config) {
                $location.path('/viewExp');
                delete $scope.expense;
            })
            .error(function (data, status, headers, config) {
                $log.debug('Error adding expense');
                alert('Error');
            });
    };

    $scope.addCategory = function () {

        $scope.showCatErrMsg = true;

        $http.post('http://localhost:9000/category/add?name=' +
                $scope.categoryName)
            .success(function (data, status, headers, config) {
                delete $scope.categoryName;
                $('#myModal').modal('hide');
                $route.reload();
            })
            .error(function (data, status, headers, config) {
                $log.debug('Error adding category');
                $scope.errorCategoryMsg = data;
                $scope.showCatErrMsg = false;
            });
    };

    $("#myModal").on('hidden.bs.modal', function () {
        $scope.categoryName = null;
        $scope.errorCategoryMsg = null;
        $scope.showCatErrMsg = true;
        $scope.$apply();
    });


    //    var listenToTick = function () {
    //        $scope.$on('TICK', function (event, tick) {
    //            $scope.expense = {
    //                date: $filter('date')(tick, 'dd-MM-yyyy HH:mm:ss')
    //            }
    //        });
    //    };
    // listenToTick();

    //    $scope.stopTimer = function () {
    //        $scope.$emit('STOP_TICK');
    //    }


    $scope.errorAmount = function () {
        var amount = $scope.addExpenseForm.amount;
        if ((amount.$dirty || amount.$touched) && (amount.$error.required || amount.$error.pattern)) {
            return true;
        }
        return false;
    }

    $scope.errorCategory = function () {
        var category = $scope.addExpenseForm.category;
        if (category.$touched && category.$error.required) {
            return true
        }
        return false;
    }



    $log.debug('AddExpController ended');
};

controllers.EditExpController = function ($scope, $log, $http, $filter, $location, $routeParams, expenseFactory) {
    $log.debug('EditExpController ended');


    $scope.add_exp_title = "Edit Expense";
    var expenseId = $routeParams.expenseId;

    $scope.expense = expenseFactory.getExpense(expenseId)
        .success(function (data, status, headers, config) {
            data.date = new Date(data.date);
            return $scope.expense = data;
        })
        .error(function (data, status, headers, config) {
            $log.debug('Error fetching expense');
        });

    $log.debug('EditExpController ended');

};

app.controller(controllers);
