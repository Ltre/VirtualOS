/**
 * 可执行文件
 */
function exec(binFile){
    var code = fileCont(binFile);
    return eval(code);
}

function fileCont(binFile){
    // ...
    return 'alert("test")';
}

var bin = '/home/test.bin';
exec(bin);


//模拟一个进程的信号
function Process(binFile){

    //可能需要在初始化时获取CPU资源, 还需在外部设置进程资源分配(如时间片轮转算法)
    var _cpuSource = null;



    var _time = (new Date) + parseInt(Math.random()*1000);
    window[_time] = this;
    var _sign = 1;
    this.setSign = function (sign) {
        _sign = sign;
    };
    this.pause = function () {
        _sign = 2;
    };
    this.wait = function () {
        _sign = 3;
    };
    this.kill = function(){
        clearInterval(_pid);
        delete window[_time];
    };
    var _pid = setInterval(function(){
        switch (_sign) {
            case 1: break;//进行中
            case 2: _cpuSource = null; return;//挂起或暂停
            case 3:
                {
                    //@todo 设置3状态后,每次interval必须判断上次是否设置过,若有,则不再执行此处;否则需要执行此处。

                    _cpuSource = null;//暂时放弃系统资源
                    break;
                };//等待分配资源
        }
        if (_cpuSource) exec(binFile);
    }, 10);
};

//进程优先级可用setInterval第二参数、或自定义轮班队列来配置


//模拟资源分配
function Dispatch(pid, cpuSource){
    window.processList[pid].setCpuSource(cpuSource);
}


var p = new Process(bin);