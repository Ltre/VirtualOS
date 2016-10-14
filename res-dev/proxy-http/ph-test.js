var Ph = require('./ph-core');
var View = require('./ph-view');
var $ = require('jquery');

var TestCase = {
    run: function(){
        var ph = new Ph;
        ph.init();
        
        //TEST JQ HOOK
        $.get('http://fm.miku.us/loadOne', function(j){
            console.log({j:j});
        }, 'jsonp');
        
        //TEST JQ HOSTS HOOK
        ph.hosts['fm.danmu.me'] = '172.26.42.222';
        $.get('http://fm.danmu.me/loadOne', function(j){
            console.log({jj:j});
        }, 'jsonp');
        
        //TEST REGULAR HOOK
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost/webstorm/VirtualOS/bin.js', true);
        xhr.send();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log({xhr:xhr})
                    console.log(xhr.responseText);
                } else {
                    console.log('wtf!');
                }
            }
        };
        
    }
};

//TestCase.run();//暂停测试
