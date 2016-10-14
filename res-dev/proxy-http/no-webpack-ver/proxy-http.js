
function Ph(){

    var _proxyPath = '/webstorm/VirtualOS/proxy-http.php';
    
    var _bindProxyInIE = function(){
        var createActiveXAgent = function(ao) {
            var agent = new Object;
            agent.activeXObject = ao; //被包裹的内核，是真正的通信对象
            agent.syncAttribute = function() { //syncAttribute是用来同步属性的	
                try {
                    this.readyState = this.activeXObject.readystate;
                    this.responseText = this.activeXObject.responseText;
                    this.responseXML = this.activeXObject.responseXML;
                    this.status = this.activeXObject.status;
                    this.statusText = this.activeXObject.statusText;
                } catch(e) {}
            };
            agent.trigStateChange = function() { //模拟onreadystatechange
                agent.syncAttribute();
                if(agent.onreadystatechange != null) {
                    agent.onreadystatechange();
                }
            };
            agent.activeXObject.onreadystatechange = agent.trigStateChange;
            agent.abort = function() { //模拟abort
                this.activeXObject.abort();
                this.syncAttribute();
            };
            agent.getAllResponseHeaders =function() 	{ //模拟内核对应的方法
                var result = this.activeXObject.getAllResponseHeaders();
                this.syncAttribute();  
                return result;
            };
            agent.getResponseHeader = function(headerLabel) { //模拟内核对应的方法
                var result = this.activeXObject.getResponseHeader(headerLabel);
                this.syncAttribute(); 
                return result;
            };
            agent.open = function(method,url,asyncFlag,userName,password) {
                if (_urlNeedPack(url)) {
                    alert('IS IE, URL = ' + url);
                    var pack = {
                        url: url,
                        data: {},
                        dataType: '',
                        method: method
                    };
                    var domain = new URL(url).hostname;
                    if (domain in _hosts) pack.hostip = _hosts[domain];
                    url = location.protocol + '//' + location.host + '/proxy-http.php?' + $.param(pack);
                }
                this.activeXObject.open(method,url,asyncFlag,userName,password);
                this.syncAttribute(); 
            };
            agent.send = function(content) { //模拟内核对应的方法
                this.activeXObject.send(content);
                this.syncAttribute(); 
            };
            agent.setRequestHeader = function (label,value) { //模拟内核对应的方法
                this.activeXObject.setRequestHeader(label,value);
                this.syncAttribute(); 
            };
            return agent;
        };
        var oriActiveXObject = ActiveXObject; 
        ActiveXObject = function(param) {
            var obj = new oriActiveXObject(param);
            if(param == "Microsoft.XMLHTTP" || 
                param=="Msxml2.XMLHTTP" || 
                param == "Msxml2.XMLHTTP.4.0") { 
                    return createActiveXAgent(obj); 
            }
            return obj; 
        };
    };
    
    var _bindProxyNotIE = function(){
        var oriXOpen = XMLHttpRequest.prototype.open; 
        XMLHttpRequest.prototype.open = function(method,url,asncFlag,user,password) {
            if (_urlNeedPack(url)) {
                alert('NOT IE, URL = ' + url);
                var pack = {
                    url: url,
                    data: {},
                    dataType: '',
                    method: method
                };
                var domain = new URL(url).hostname;
                if (domain in _hosts) pack.hostip = _hosts[domain];
                url = location.protocol + '//' + location.host + _proxyPath + '?' + $.param(pack);
            }
            oriXOpen.call(this,method,url,asncFlag,user,password); 
        };
    };
    
    var _bindProxy = function(){
        if ('ActiveXObject' in window) {
            _bindProxyInIE();
        } else {
            _bindProxyNotIE();
        }
        var rawAjax = $.ajax;
        $.ajax = function(){
            var pack = {
                url: arguments[0].url,
                data: arguments[0].data || {},
                dataType: arguments[0].dataType,
                method: arguments[0].type
            };
            var domain = new URL(arguments[0].url).hostname;
            if (domain in _hosts) pack.hostip = _hosts[domain];
            arguments[0].url = location.protocol + '//' + location.host + _proxyPath;
            arguments[0].data = pack;
            rawAjax.apply(this, arguments);
        };
    };
    
    var _urlNeedPack = function(url){
        var sameDomain = RegExp('://'+location.host+'/').test(url);
        var samePath = new URL(url).pathname == _proxyPath;
        return ! sameDomain || ! samePath;
    };
    
    var _inited = false;
    
    var _hosts = {};
    
    return {
        hosts: _hosts,//domain - ip
        init: function(){
            if (! _inited) {
                _bindProxy();
                _inited = true;
            }
        }
    };
}





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
                    alert(xhr.responseText);
                } else {
                    alert('wtf!');
                }
            }
        };
        
    }
};

TestCase.run();