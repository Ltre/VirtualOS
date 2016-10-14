define(function(require, exports){
   
    var $ = require('jquery');
    var Ph = require('./ph-core');
    ph = new Ph;
    
    $('#go').click(function(){
        var rawUrl = $('#url').val();
        var url = ph.tool.getProxyUrl(rawUrl);
        //window.webview.document.body.onload = function(){alert('ifr load')}
        $('#webview').attr('src', url);
        var ctx = $(window.webview.document.body);
        var iv = setInterval(function(){
            if (ctx.html() != '') {
                var ru = new URL(rawUrl);                
                //$(window.webview.document.head).append('<base href="' + ru.protocol + '//' + ru.host + '/' + '"/>');
                //ctx.append('<script src="res-dist/ph-test-dist.js"></script>');
                
                //这里需要改造成：服务端篡改HTML内容的方式
                
                clearInterval(iv);
            }
        }, 100);
    });
   
});