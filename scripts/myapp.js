(function () {

    window.myapp = window.myapp || {};

    window.onload = function () {

        var myapp = window.myapp,
            username = "ramirocartodb",
            mapname = "London Faith",
            diJSON = myapp.viz(username, mapname);

        cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
            no_cdn: false,
            cartodb_logo: false,
            zoom: 11,
            center: [51.507351, 0.093727]
        }, function (err, dashboard) {

            myapp.dashboard = dashboard;

            myapp.map = dashboard.getMap();

            myapp.Cmap = myapp.map.map;

            myapp.wcontainer = cdb.$('#' + dashboard._dashboard.dashboardView.$el.context.id + ' .CDB-Widget-canvasInner').get(0);

            myapp.addWidget = function (type, layer_index, options) {
                try {
                    var layer = myapp.layers[layer_index];
                    switch (type) {
                    case 'category':
                        dashboard.createCategoryWidget(options, layer);
                        break;
                    case 'formula':
                        dashboard.createFormulaWidget(options, layer);
                        break;
                    case 'histogram':
                        dashboard.createHistogramWidget(options, layer);
                        break;
                    case 'timeseries':
                        dashboard.createTimeSeriesWidget(options, layer);
                        break;
                    }
                    myapp.widgets = dashboard.getWidgets();
                    myapp.widgetsdata = myapp.widgets.map(function (a) {
                        return a.dataviewModel
                    });
                    return 'OK';
                } catch (error) {
                    return error;
                }
            }

            myapp.removeWidget = function (index) {
                myapp.widgets[index].remove();
                myapp.widgets = dashboard.getWidgets();
                myapp.widgetsdata = myapp.widgets.map(function (a) {
                    return a.dataviewModel
                });
            }

            myapp.addNode = function (options) {
                return myapp.map.analysis.analyse(options);
            }


            // add layer

            myapp.addNode({
                "id": "a0",
                "type": "source",
                "params": {
                    "query": "SELECT * FROM ramirocartodb.london_religion"
                },
                "options": {
                    "table_name": "ramirocartodb.london_religion"
                }
            });

            myapp.Cmap.createCartoDBLayer({
                "source": 'a0',
                "name": 'london_religion',
                "cartocss": "#layer {polygon-fill: ramp([chr], (#f3e79b, #eb7f86, #5c53a5), quantiles); line-width: 1; line-color: #fff; line-opacity: 0.5; }"});
            
            window.myapp.layers = myapp.map.getLayers();


            // add widgets

            myapp.addWidget('category',1, {
                "source": {"id":'a0'},
                "column":'name',
                "title":'Name',
                "operation":'count'
            });
            myapp.addWidget('category',1, {
                "source": {"id":'a0'},
                "column":'borough',
                "title":'borough',
                "operation":'count'
            });
            myapp.addWidget('formula',1, {
                "source": {"id":'a0'},
                "column":'chr',
                "title":'Number of Christians',
                "operation":'sum'
            });
            myapp.addWidget('histogram',1, {
                "source": {"id":'a0'},
                "column":'chr',
                "title":'Distribution of Christians',
                "bins":'25'
            });


        });
    }

})();
