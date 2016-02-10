app.factory('expenseHttpFacade', function ($http) {
    var _getCategories = function () {
        return $http.get('http://localhost:9000/category/list');
    }

    var _getAllExpenses = function () {
        return $http.get('http://localhost:9000/expense/list');
    }

    var _postExpense = function () {
        return $http.get('http://localhost:9000/expense/add');
    }

    var _getExpense = function (id) {
        return $http.get('http://localhost:9000/expense/find/' + id);
    }

    var _getAllExpensesForChart = function (id) {
        return $http.get('http://localhost:9000/expense/chart/pie');
    }

    var _deleteExpense = function (id) {
        return $http.get('http://localhost:9000/expense/delete/' + id);
    }

    var _getAllExpensesForBarChart = function (id) {
        return $http.get('http://localhost:9000/expense/chart/bar');
    }

    return {
        getCategories: _getCategories,
        getAllExpenses: _getAllExpenses,
        postExpense: _postExpense,
        getExpense: _getExpense,
        getAllExpensesForChart: _getAllExpensesForChart,
        deleteExpense: _deleteExpense,
        getAllExpensesForBarChart: _getAllExpensesForBarChart
    };
});
