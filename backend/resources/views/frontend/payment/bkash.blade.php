<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  {{--
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> --}}
  <meta name="viewport"
    content="width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no;user-scalable=0;" />

  <meta name="csrf-token" content="{{ csrf_token() }}">


  <title>Bkash Checkout</title>

  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('img/brand/apple-touch-icon.png')}}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('img/brand/favicon-32x32.png')}}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('img/brand/favicon-16x16.png')}}">
  <link rel="manifest" href="{{ asset('img/brand/site.webmanifest')}}">

  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

  @if(config('bkash.sandbox_mode') === 'sandbox')
  <script src="https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js"></script>
  @else
  <script src="https://scripts.pay.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout.js"></script>
  @endif
</head>

<body>

  <span style="display:none" id="paymentInfo">@json($data)</span>
  <div class="container">
    <button type="button" id="bKash_button" style="display: none">Pay With bKash</button>
  </div>

  <script src="{{asset('assets/js/bkash.js')}}"></script>

</body>

</html>