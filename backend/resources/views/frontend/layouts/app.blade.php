<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @langrtl dir="rtl" @endlangrtl>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  @php
  $metaTitle = get_setting('meta_title',"taobao.com products selling website ");
  $metaDescription = get_setting('meta_description',"This app developed by sumon4skf@gmail.com");
  @endphp
  <title>@yield('title', $metaTitle)</title>
  <meta name="description" content="@yield('meta_description', $metaDescription)">
  <meta name="author" content="@yield('meta_author', 'Developed by sumon4skf')">


  <link rel="shortcut icon" href="{{asset('img/brand/favicon.ico')}}" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="{{asset('img/brand/apple-touch-icon.png')}}">
  <link rel="icon" type="image/png" sizes="192x192" href="{{asset('img/brand/android-chrome-192x192.png')}}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{asset('img/brand/favicon-32x32.png')}}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{asset('img/brand/favicon-16x16.png')}}">
  <link rel="manifest" href="{{asset('img/brand/site.webmanifest')}}">


  @yield('meta')

  @stack('before-styles')
  <link rel="stylesheet" href="{{asset('css/bootstrap.min.css')}}">
  @stack('middle-styles')

  <link href="{{ asset('css/backend.css') }}" rel="stylesheet">

  @stack('after-styles')


</head>

<body class="loginPageBody">

  @include('includes.partials.fb-chat')

  @include('includes.partials.read-only')

  @include('includes.partials.logged-in-as')

  @include('frontend.includes.nav')

  @include('includes.partials.messages')

  <main>
    @yield('content')
  </main>


  @stack('before-scripts')
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"
    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-fQybjgWLrvvRgtW6bFlB7jaZrFsaBXjsOMm/tB9LTS58ONXgqbR9W8oWht/amnpF" crossorigin="anonymous">
  </script>


</body>

</html>