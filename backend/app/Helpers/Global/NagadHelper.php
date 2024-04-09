<?php


if (!function_exists('generateRandomString')) {
  function generateRandomString($length = 40)
  {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }
}


if (!function_exists('EncryptDataWithPublicKey')) {
  function EncryptDataWithPublicKey($data)
  {
    $pgPublicKey = config('nagad.public_key');
    $public_key = "-----BEGIN PUBLIC KEY-----\n" . $pgPublicKey . "\n-----END PUBLIC KEY-----";
    // echo $public_key;
    // exit();
    $key_resource = openssl_get_publickey($public_key);
    openssl_public_encrypt($data, $cryptText, $key_resource);
    return base64_encode($cryptText);
  }
}

if (!function_exists('SignatureGenerate')) {
  function SignatureGenerate($data)
  {
    $merchantPrivateKey = config('nagad.private_key');
    $private_key = "-----BEGIN RSA PRIVATE KEY-----\n" . $merchantPrivateKey . "\n-----END RSA PRIVATE KEY-----";
    // echo $private_key;
    // exit();
    openssl_sign($data, $signature, $private_key, OPENSSL_ALGO_SHA256);
    return base64_encode($signature);
  }
}


if (!function_exists('HttpPostMethod')) {
  function HttpPostMethod($PostURL, $PostData)
  {
    $url = curl_init($PostURL);
    $postToken = json_encode($PostData);
    $header = array(
      'Content-Type:application/json',
      'X-KM-Api-Version:v-0.2.0',
      'X-KM-IP-V4:' . get_client_ip(),
      'X-KM-Client-Type:PC_WEB'
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_POSTFIELDS, $postToken);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($url, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($url, CURLOPT_HEADER, 1);


    $resultData = curl_exec($url);
    $ResultArray = json_decode($resultData, true);
    $header_size = curl_getinfo($url, CURLINFO_HEADER_SIZE);
    curl_close($url);
    $headers = substr($resultData, 0, $header_size);
    $body = substr($resultData, $header_size);
//    print_r($body);
//    print_r($headers);
    return $ResultArray;

  }
}


if (!function_exists('get_client_ip')) {
  function get_client_ip()
  {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
      $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
      $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
      $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
      $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
      $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
      $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
      $ipaddress = 'UNKNOWN';
    return $ipaddress;
  }
}


if (!function_exists('DecryptDataWithPrivateKey')) {
  function DecryptDataWithPrivateKey($cryptText)
  {
    $merchantPrivateKey = config('nagad.private_key');
    $private_key = "-----BEGIN RSA PRIVATE KEY-----\n" . $merchantPrivateKey . "\n-----END RSA PRIVATE KEY-----";
    openssl_private_decrypt(base64_decode($cryptText), $plain_text, $private_key);
    return $plain_text;
  }
}

if (!function_exists('HttpGet')) {
  function HttpGet($url)
  {
    $ch = curl_init();
    $timeout = 10;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/0 (Windows; U; Windows NT 0; zh-CN; rv:3)");
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $file_contents = curl_exec($ch);
    echo curl_error($ch);
    curl_close($ch);
    return $file_contents;
  }
}


