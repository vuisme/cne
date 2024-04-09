@extends('backend.layouts.app')

@section('title', 'Bkash Api Response Testing')


@section('content')
@php
$grand = get_setting('bkash_grant_token');
$create = get_setting('bkash_create_api');
$execute = get_setting('bkash_execute_api');
$query = get_setting('bkash_query_payment');
$search = get_setting('bkash_search_api');
$refund = get_setting('bkash_refund_api');
$refund_status = get_setting('bkash_refund_status_api');

$createResponse = ($create ? json_decode($create, true) : []);
$paymentID = getArrayKeyData($createResponse, 'paymentID');
$amount = getArrayKeyData($createResponse, 'amount');
$merchantInvoiceNumber = getArrayKeyData($createResponse, 'merchantInvoiceNumber');
$trxID = getArrayKeyData(($execute ? json_decode($execute, true) : []), 'trxID');


$userName = config('bkash.username');
$password = config('bkash.password');
$app_key = config('bkash.app_key');
$app_secret = config('bkash.app_secret');
$authorization = getArrayKeyData(($grand ? json_decode($grand, true) : []), 'id_token');
@endphp

<div class="row justify-content-center">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header with-border">
        <h2>Bkash Api Response Testing </h2>
      </div>

      <div class="card-body border-bottom mb-3">
        <h3 class="text-center">API Request/Response</h3>
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Grant Token </b>
            <a href="{{route('admin.setting.bkash.api.grant.token')}}" class=" ml-2">Generate</a>
            <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                username: {{$userName}},
                password: {{$password}}
              },
            body params:{
                app_key: {{$app_key}},
                app_secret: {{$app_secret}}
              }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$grand}}
        </div> <!-- form-group-->
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Create Payment </b><a href="{{route('admin.setting.bkash.api.create')}}"
              class=" ml-2">Generate</a> <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              },
            body params:{
              "amount":"{{$amount}}",
              "currency":"BDT",
              "intent":"sale",
              "merchantInvoiceNumber":"{{$merchantInvoiceNumber}}"
            }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$create}}
        </div> <!-- form-group-->
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Execute Payment </b><br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/{{$paymentID}} <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$execute}}
        </div> <!-- form-group-->
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Query Payment </b>
            <a href="{{route('admin.setting.bkash.api.query')}}" class=" ml-2">Query Payment</a>
            <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query/{{$paymentID}} <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$query}}
        </div> <!-- form-group-->
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Search Transaction Details </b>
            <a href="{{route('admin.setting.bkash.api.search')}}" class=" ml-2">Search</a>
            <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/search/{{$trxID}} <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$search}}
        </div> <!-- form-group-->

        <br>
        <br>
        <br>
        <br>
        <br>
        <br>

        <h3 class="text-center">API Request/Response</h3>

        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Refund API </b>
            <a href="{{route('admin.setting.bkash.api.refund')}}" class=" ml-2">Refund</a>
            <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/refund <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              },
            body params: {
              "paymentID":"{{$paymentID}}",
              "amount":"{{$amount}}",
              "trxID":"{{$trxID}}",
              "sku":"abb-562346076929",
              "reason":" Product Fault",
            }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$refund}}
        </div> <!-- form-group-->
        <div class="form-group">
          <p class="mb-2">
            <b>API Title : Refund Status API </b>
            <a href="{{route('admin.setting.bkash.api.refund.status')}}" class=" ml-2">Refund Status</a>
            <br>
            <b>API URL :</b> https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/refund <br>
            <b>Request Body :</b>
          </p>
          <pre>
            headers:
              {
                authorization: {{$authorization}},
                x-app-key: {{$app_key}}
              },
            body params: {
              "paymentID":"{{$paymentID}}",
              "trxID":"{{$trxID}}"
            }
          </pre>
          <p class="mb-2"><b>API Response :</b></p>
          {{$refund_status}}
        </div> <!-- form-group-->
      </div> <!--  .card-body -->


    </div> <!--  .card -->
  </div> <!-- .col-md-9 -->
</div> <!-- .row -->

@endsection