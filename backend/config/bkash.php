<?php

return [
  'sandbox_mode' => env('BKASH_CHECKOUT_SANDBOX', 'sandbox'),
  'tokenInfo' => env('BKASH_SHOW_TOKEN_INFO', false),
  'app_key' => env('BKASH_CHECKOUT_APP_KEY', ''),
  'app_secret' => env('BKASH_CHECKOUT_APP_SECRET', ''),
  'username' => env('BKASH_CHECKOUT_USER_NAME', ''),
  'password' => env('BKASH_CHECKOUT_PASSWORD', ''),
  'proxy' => env('BKASH_PROXY', ""),
  'base_url' => env('BKASH_BASE_URL', 'https://checkout.pay.bka.sh/v1.2.0-beta')

];
