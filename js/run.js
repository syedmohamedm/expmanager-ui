app.run(function ($rootScope, $location, $log, constant) {
    $rootScope.title = "Exp Manager";
    $rootScope.version = "v 0.1"
        // autoGenFactory.startTimer();

    // For changing navbar active state
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        $log.debug('Current route name: ' + $location.path());
        var template = $location.path().substring(1);
        if (template == '')
            template = 'home';
        $('.nav li').removeClass('active');
        $('#' + template).addClass('active');
    });

    //****************************Date Picker***********************************88

    //$rootScope.maxDate = constant.maxDate;

    $rootScope.openDate = function () {
        $rootScope.popupDate.opened = true;
    };

    $rootScope.popupDate = {
        opened: false
    };

    $rootScope.dateOptions = constant.dateOptions;

    //*****************************************************************
});
