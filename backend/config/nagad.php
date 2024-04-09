<?php

return [
  'sandbox_mode' => env('NAGAD_MODE', 'sandbox'),
  'merchant_id' => env('NAGAD_MERCHANT_ID', '683002007104225'),
  'merchant_number' => env('NAGAD_MERCHANT_NUMBER', '01611878514'),
  'callback_url' => env('NAGAD_CALLBACK_URL', '/nagad/callback'),
  'public_key' => env('NAGAD_PUBLIC_KEY', ''),
  'private_key' => env('NAGAD_PRIVATE_KEY', '')
];
