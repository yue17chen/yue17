var page_groupon = {
    name: 'groupon',
    url: '#groupon',
    html: '#page_groupon',
    events: {
        '#page_groupon_prev': {
            click: function (e) {
                pageManager.back();
            }
        },
        '#page_groupon_next': {
            click: function (e) {
                pageManager.go("groupon_excel");
            }
        }
    }        
};
var page_groupon_excel = {
    name: 'groupon_excel',
    url: '#groupon_excel',
    html: '#page_groupon_excel',
    events: {
        '#page_groupon_excel_prev': {
            click: function (e) {
                pageManager.back();
            }
        },
        '#page_groupon_excel_next': {
            click: function (e) {
                pageManager.go("groupon_release");
            }
        }        
    }
};

var page_groupon_release = {
    name: 'groupon_release',
    url: '#groupon_release',
    html: '#page_groupon_release',
};
