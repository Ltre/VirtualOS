<?php

function curlz($url, $data = array(), $isPost = false, $hostip = null, $header = '', $timeout = 5, $ssl_verify = false){
    $h = "User-Agent:Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12\r\n";
    $h .= "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n";
    $h .= "Accept-language: zh-cn,zh;q=0.5\r\n";
    $h .= "Accept-Charset: GB2312,utf-8;q=0.7,*;q=0.7\r\n";
    $h .= "Content-type: application/x-www-form-urlencoded; charset=UTF-8\r\n";
    if (! empty($hostip)) {
        $p = parse_url($url);
        if (preg_match('/:\/\/('.str_replace('.', '\\.', $p['host']).')(\:|\/)?/', $url, $matches)) {
            $domain = $matches[1];
            $url = str_replace('//'.$domain, '//'.$hostip, $url);
            $h .= "Host: {$domain}\r\n";
        }
    }
    $header = $header ?: $h;
    $ch = curl_init();
    $opt = array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        //CURLOPT_POST => $isPost,
        CURLOPT_NOSIGNAL=>true,
        CURLOPT_CONNECTTIMEOUT_MS => 200,
        CURLOPT_TIMEOUT_MS => 2000,
        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
        CURLOPT_SSL_VERIFYPEER => $ssl_verify,
        CURLOPT_SSL_VERIFYHOST => $ssl_verify,
        CURLOPT_HTTPHEADER => explode("\r\n", $header),
        CURLOPT_POSTFIELDS => http_build_query($data),
    );
    if ($isPost) {
        $opt[CURLOPT_URL] = $url;
        $opt[CURLOPT_POST] = true;
        $opt[CURLOPT_POSTFIELDS] = http_build_query($data);
    } else {
        if (! empty($data)) {
            $glue = preg_match('/\?/', $url) ? '&' : '?';
            $url .= $glue . http_build_query($data);
        }
        $opt[CURLOPT_URL] = $url;
    }
    curl_setopt_array($ch, $opt);
    $ret = curl_exec($ch);
    curl_close($ch);
    return $ret;
}

function arg($name = null, $default = null, $callback_funcname = null) {
    $req = $_GET + $_POST;
	if ($name) {
		if(!isset($req[$name]))return $default;
		$arg = $req[$name];
	} else {
		$arg = $req;
	}
	if ($callback_funcname) array_walk_recursive($arg, $callback_funcname);
	return $arg;
}

$data = arg('data', array());
if (arg('callback')) $data['callback'] = arg('callback');
$url = arg('url');
$dataType = arg('dataType', 'html');
$isPost = strtolower(arg('method')) == 'POST';
$hostip = arg('hostip', null);
echo curlz($url, $data, $isPost, $hostip);

