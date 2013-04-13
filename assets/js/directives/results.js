'use strict';

angular.module('carpickmeup.directives.results', [])
    .directive('pieChart', [function () {
        return function (scope, element, attrs) {
            function updateChart(count) {
                var data = [
                    {
                        value: count.legal,
                        color: "#3a87ad"
                    },
                    {
                        value: count.illegal,
                        color: "#b94a48"
                    }
                ];

                var options = { animation: true, animationEasing: "easeOutQuart" };

                var ctx = element.context.getContext("2d");
                new Chart(ctx).Pie(data, options);
            }

            scope.$watch(attrs.pieChart, function (value) {
                updateChart(value);
            }, true);
        };
    } ]);