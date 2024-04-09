<?php


return [

  /*
  |--------------------------------------------------------------------------
  | Cross-Origin Resource Sharing (CORS) Configuration
  |--------------------------------------------------------------------------
  |
  | Here you may configure your settings for cross-origin resource sharing
  | or "CORS". This determines what cross-origin operations may execute
  | in web browsers. You are free to adjust these settings as needed.
  |
  | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  |
  */

  'paths' => [
    'api/*',
    '/login',
    '/logout',
    '/sanctum/csrf-cookie'
  ],

  'allowed_methods' => ['GET, POST, PUT, PATCH, DELETE, OPTIONS'],

  'allowed_origins' => [
    config('app.frontend_url'),
    'https://www.chinaexpress.com.bd',
    'https://chinaexpress.com.bd',
    'http://chinaexpress.com.bd',
    'chinaexpress.com.bd',
  ],

  'allowed_origins_patterns' => [],

  'allowed_headers' => ['Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range'],

  'exposed_headers' => [],

  'max_age' => 0,

  'supports_credentials' => true,

];
