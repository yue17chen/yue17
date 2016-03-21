var page_groupon = {
    name: 'groupon',
    url: '#groupon',
    html: '#page_groupon',
    events: {
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
    }        
};
