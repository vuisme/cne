<?php

namespace App\Traits;

use App\Models\Content\Order;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\GuzzleException;


trait BkashApiResponse
{
  public $sandboxMode = null;
  public $tokenInfo = null;
  public $appKey = null;
  public $appSecret = null;
  public $username = null;
  public $password = null;
  public $proxy = null;
  public $baseUrl = null;
  public $idToken = null;
  public $refreshToken = null;

  public function __construct()
  {
    $this->sandboxMode = config('bkash.sandbox_mode');
    $this->tokenInfo = config('bkash.tokenInfo');
    $this->appKey = config('bkash.app_key');
    $this->appSecret = config('bkash.app_secret');
    $this->username = config('bkash.username');
    $this->password = config('bkash.password');
    $this->proxy = config('bkash.proxy');
    $this->baseUrl = config('bkash.base_url');
  }


  public function tokenHeader()
  {
    return [
      'Accept' => 'application/json',
      'Content-Type' => 'application/json',
      'password' => $this->password,
      'username' => $this->username
    ];
  }

  public function authHeader()
  {
    return [
      'Accept' => 'application/json',
      'Authorization' => $this->idToken,
      'x-app-key' => $this->appKey,
    ];
  }

  public function getResponse(string $url, array $headers, array $body = [], $method = "POST", $timeout = 60)
  {
    $client = new Client([
      'headers' => $headers
    ]);

    $message = '';

    try {
      $body = Psr7\Utils::streamFor(json_encode($body));
      $response = $client->request($method, $url, ['body' => $body, 'timeout' => $timeout]);
      $data = json_decode($response->getBody(), true);
      $data['status'] = true;
      return $data;
    } catch (GuzzleException $e) {
      $message = $e->getMessage();
    }

    return ['status' => false, 'message' => $message];
  }

  public function bkashGrantToken()
  {
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/token/grant";
    $headers = $this->tokenHeader();
    $body = [
      'app_key' => $this->appKey,
      'app_secret' => $this->appSecret
    ];
    return $this->getResponse($url, $headers, $body);
  }

  public function initializeBkashToken($full = false)
  {
    $sessionToken = session()->get('bkash_token', []);
    if (!empty($sessionToken) & is_array($sessionToken)) {
      $response = $sessionToken['response'] ?? [];
      $expired = $sessionToken['expired'] ?? null;
      $this->idToken = $response['id_token'] ?? null;
      $this->refreshToken = $response['refresh_token'] ?? null;
      if (now()->greaterThanOrEqualTo($expired)) {
        $resFresh = $this->bkashRefreshToken();
        $this->idToken = $resFresh['id_token'] ?? null;
        $expires_in = $resFresh['expires_in'] ?? 3600;
        if (!empty($resFresh) & is_array($resFresh)) {
          session()->put('bkash_token', ['response' => $resFresh, 'expired' => now()->addSeconds($expires_in)]);
          return $full ? $resFresh : $this->idToken;
        }
      } else {
        return $full ? $response : $this->idToken;
      }
    }
    $resData = $this->bkashGrantToken();
    if (!empty($resData) & is_array($resData)) {
      $this->idToken = $resData['id_token'] ?? null;
      $this->refreshToken = $resData['refresh_token'] ?? null;
      $expires_in = $resData['expires_in'] ?? null;
      session()->put('bkash_token', ['response' => $resData, 'expired' => now()->addSeconds($expires_in)]);
      return $full ? $resData : $this->idToken;
    }
    return null;
  }

  public function bkashRefreshToken()
  {
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/token/refresh";
    $headers = $this->tokenHeader();
    $body = [
      'app_key' => $this->appKey,
      'app_secret' => $this->appSecret,
      'refresh_token' => $this->refreshToken
    ];
    return $this->getResponse($url, $headers, $body);
  }


  public function CreatePayment($body)
  {
    $this->initializeBkashToken();
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/create";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, $body);
  }

  public function ExecutePayment($paymentID)
  {
    $this->initializeBkashToken();
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/execute/{$paymentID}";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, [], "POST", 30);
  }

  public function QueryPayment($paymentID)
  {
    $this->initializeBkashToken();
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/query/{$paymentID}";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, [], 'GET');
  }

  public function SearchTransaction($trxID)
  {
    $this->initializeBkashToken();
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/search/{$trxID}";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, [], 'GET');
  }

  public function RefundTransaction($execute)
  {
    $this->initializeBkashToken();
    $trxID = getArrayKeyData($execute, 'trxID');
    $paymentID = getArrayKeyData($execute, 'paymentID');
    $amount = getArrayKeyData($execute, 'amount');
    $transaction_id = getArrayKeyData($execute, 'transaction_id');
    $reason = getArrayKeyData($execute, 'reason', 'Product Fault');
    $transaction_id = $transaction_id ? $transaction_id : (Order::where('bkash_payment_id', $paymentID)->first()->transaction_id ?? '');
    $body = [
      'paymentID' => $paymentID,
      'amount' => ceil($amount),
      'trxID' => $trxID,
      'sku' => $transaction_id ? $transaction_id : 'abb-562346076929',
      'reason' => $reason
    ];
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/refund";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, $body, "POST");
  }

  public function RefundStatus($execute)
  {
    $this->initializeBkashToken();
    $trxID = getArrayKeyData($execute, 'trxID');
    $paymentID = getArrayKeyData($execute, 'paymentID');
    $body = [
      'paymentID' => $paymentID,
      'trxID' => $trxID
    ];
    $base_url = $this->baseUrl;
    $url = "{$base_url}/checkout/payment/refund";
    $headers = $this->authHeader();
    return $this->getResponse($url, $headers, $body, "POST");
  }
}
