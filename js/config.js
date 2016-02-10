app.config(['$httpProvider', '$logProvider', function ($httpProvider, $logProvider) {
    //cors
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {
                $('#loading').show();
                return config;
            },

            'response': function (response) {
                $('#loading').hide();
                return response;
            }
        };
    });
    //log
    $logProvider.debugEnabled(true);
}]);
