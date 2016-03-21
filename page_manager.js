/**
 * Created by jf on 2015/9/11.
 */
var pageManager = {
     $container: $('.js_container'),
     _pageStack: [],
     _pages: [],
     _defaultPage: null,
     _pageIndex: 1,
     setDefault: function (defaultPage) {
         this._defaultPage = this._find('name', defaultPage);
         return this;
     },
     init: function () {
         var self = this;

         $(window).on('hashchange', function () {
             var state = history.state || {};
             var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
             var page = self._find('url', url) || self._defaultPage;
             if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
                 self._back(page);
             } else {
                 self._go(page);
             }
         });

         if (history.state && history.state._pageIndex) {
             this._pageIndex = history.state._pageIndex;
         }

         this._pageIndex--;

         var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
         var page = self._find('url', url) || self._defaultPage;
         this._go(page);
         return this;
     },
     push: function (page) {
         this._pages.push(page);
         return this;
     },
     go: function (to) {
         var page = this._find('name', to);
         if (!page) {
             return;
         }
         location.hash = page.url;
     },
     _go: function (page) {
         this._pageIndex ++;

         history.replaceState && history.replaceState({_pageIndex: this._pageIndex}, '', location.href);

         var html = $(page.html).html();
         var $html = $(html).addClass('slideIn').addClass(page.name);


         this.$container.append($html);

         this._pageStack.push({
             page: page,
             dom: $html
         });

         if (!page.isBind) {
             this._bind(page);
         }

         return this;
     },
     back: function () {
         history.back();
     },
     _back: function (page) {
         this._pageIndex --;

         var stack = this._pageStack.pop();
         if (!stack) {
             return;
         }

         var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
         var found = this._findInStack(url);
         if (!found) {
             var html = $(page.html).html();
             var $html = $(html).css('opacity', 1).addClass(page.name);
             $html.insertBefore(stack.dom);

             if (!page.isBind) {
                 this._bind(page);
             }

             this._pageStack.push({
                 page: page,
                 dom: $html
             });
         }

         stack.dom.addClass('slideOut').on('animationend', function () {
             stack.dom.remove();
         }).on('webkitAnimationEnd', function () {
             stack.dom.remove();
         });

         return this;
     },
     _findInStack: function (url) {
         var found = null;
         for(var i = 0, len = this._pageStack.length; i < len; i++){
             var stack = this._pageStack[i];
             if (stack.page.url === url) {
                 found = stack;
                 break;
             }
         }
         return found;
     },
     _find: function (key, value) {
         var page = null;
         for (var i = 0, len = this._pages.length; i < len; i++) {
             if (this._pages[i][key] === value) {
                 page = this._pages[i];
                 break;
             }
         }
         return page;
     },
     _bind: function (page) {
         var events = page.events || {};
         for (var t in events) {
             for (var type in events[t]) {
                 this.$container.on(type, t, events[t][type]);
             }
         }
         page.isBind = true;
     }
 };

$(function () {
    var home = {
        name: 'home',
        url: '#',
        html: '#tpl_home',
        events: {
            '.js_grid': {
                click: function (e) {
                    var id = $(this).data('id');
                    pageManager.go(id);
                }
            }
        }
    };
    var panel = {
        name: 'panel',
        url: '#panel',
        html: '#tpl_panel'
    };
    var button = {
        name: 'button',
        url: '#button',
        html: '#tpl_button'
    };
    var cell = {
        name: 'cell',
        url: '#cell',
        html: '#tpl_cell',
        events: {
            '#showTooltips': {
                click: function () {
                    var $tooltips = $('.js_tooltips');
                    if ($tooltips.css('display') != 'none') {
                        return;
                    }

                    // 如果有`animation`, `position: fixed`不生
                    $('.page.cell').removeClass('slideIn');
                    $tooltips.show();
                    setTimeout(function () {
                        $tooltips.hide();
                    }, 2000);
                }
            }
        }
    };
    var toast = {
        name: 'toast',
        url: '#toast',
        html: '#tpl_toast',
        events: {
            '#showToast': {
                click: function (e) {
                    var $toast = $('#toast');
                    if ($toast.css('display') != 'none') {
                        return;
                    }

                    $toast.show();
                    setTimeout(function () {
                        $toast.hide();
                    }, 2000);
                }
            },
            '#showLoadingToast': {
                click: function (e) {
                    var $loadingToast = $('#loadingToast');
                    if ($loadingToast.css('display') != 'none') {
                        return;
                    }

                    $loadingToast.show();
                    setTimeout(function () {
                        $loadingToast.hide();
                    }, 2000);
                }
            }
        }
    };
    var dialog = {
        name: 'dialog',
        url: '#dialog',
        html: '#tpl_dialog',
        events: {
            '#showDialog1': {
                click: function (e) {
                    var $dialog = $('#dialog1');
                    $dialog.show();
                    $dialog.find('.weui_btn_dialog').one('click', function () {
                        $dialog.hide();
                    });
                }
            },
            '#showDialog2': {
                click: function (e) {
                    var $dialog = $('#dialog2');
                    $dialog.show();
                    $dialog.find('.weui_btn_dialog').one('click', function () {
                        $dialog.hide();
                    });
                }
            }
        }
    };
    var progress = {
        name: 'progress',
        url: '#progress',
        html: '#tpl_progress',
        events: {
            '#btnStartProgress': {
                click: function () {

                    if ($(this).hasClass('weui_btn_disabled')) {
                        return;
                    }

                    $(this).addClass('weui_btn_disabled');

                    var progress = 0;
                    var $progress = $('.js_progress');

                    function next() {
                        $progress.css({width: progress + '%'});
                        progress = ++progress % 100;
                        setTimeout(next, 30);
                    }

                    next();
                }
            }
        }
    };
    var msg = {
        name: 'msg',
        url: '#msg',
        html: '#tpl_msg',
        events: {}
    };
    var article = {
        name: 'article',
        url: '#article',
        html: '#tpl_article',
        events: {}
    };
    var tab = {
        name: 'tab',
        url: '#tab',
        html: '#tpl_tab',
        events: {
            '.js_tab': {
                click: function (){
                    var id = $(this).data('id');
                    pageManager.go(id);
                }
            }
        }
    };
    var navbar = {
        name: 'navbar',
        url: '#navbar',
        html: '#tpl_navbar',
        events: {}
    };
    var tabbar = {
        name: 'tabbar',
        url: '#tabbar',
        html: '#tpl_tabbar',
        events: {}
    };
    var actionSheet = {
        name: 'actionsheet',
        url: '#actionsheet',
        html: '#tpl_actionsheet',
        events: {
            '#showActionSheet': {
                click: function () {
                    var mask = $('#mask');
                    var weuiActionsheet = $('#weui_actionsheet');
                    weuiActionsheet.addClass('weui_actionsheet_toggle');
                    mask.show().addClass('weui_fade_toggle').one('click', function () {
                        hideActionSheet(weuiActionsheet, mask);
                    });
                    $('#actionsheet_cancel').one('click', function () {
                        hideActionSheet(weuiActionsheet, mask);
                    });
                    weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');

                    function hideActionSheet(weuiActionsheet, mask) {
                        weuiActionsheet.removeClass('weui_actionsheet_toggle');
                        mask.removeClass('weui_fade_toggle');
                        weuiActionsheet.on('transitionend', function () {
                            mask.hide();
                        }).on('webkitTransitionEnd', function () {
                            mask.hide();
                        })
                    }
                }
            }
        }
    };
    var searchbar = {
        name:"searchbar",
        url:"#searchbar",
        html: '#tpl_searchbar',
        events:{
            '#search_input':{
                focus:function(){
                    //searchBar
                    var $weuiSearchBar = $('#search_bar');
                    $weuiSearchBar.addClass('weui_search_focusing');
                },
                blur:function(){
                    var $weuiSearchBar = $('#search_bar');
                    $weuiSearchBar.removeClass('weui_search_focusing');
                    if($(this).val()){
                        $('#search_text').hide();
                    }else{
                        $('#search_text').show();
                    }
                },
                input:function(){
                    var $searchShow = $("#search_show");
                    if($(this).val()){
                        $searchShow.show();
                    }else{
                        $searchShow.hide();
                    }
                }
            },
            "#search_cancel":{
                touchend:function(){
                    $("#search_show").hide();
                    $('#search_input').val('');
                }
            },
            "#search_clear":{
                touchend:function(){
                    $("#search_show").hide();
                    $('#search_input').val('');
                }
            }
        }
    };
    var icons = {
        name: 'icons',
        url: '#icons',
        template: '#tpl_icons',
        events: {}
    };

    pageManager.push(home)
        .push(button)
        .push(cell)
        .push(toast)
        .push(dialog)
        .push(progress)
        .push(msg)
        .push(article)
        .push(tab)
        .push(navbar)
        .push(tabbar)
        .push(panel)
        .push(actionSheet)
        .push(icons)
        .push(searchbar)
        .push(page_groupon)
        .push(page_groupon_excel)
        .setDefault('home')
        .init();
});
