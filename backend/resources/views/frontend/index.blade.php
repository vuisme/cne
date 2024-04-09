@extends('frontend.layouts.app')

@section('title', '...')


@section('content')
<div class="container">
  <div class="align-items-center justify-content-center row" style="height: 85vh;">
    <div class=" col-md-6 col-lg-5">
      <div class="card">
        <div class="card-body">

          @guest
          <h2 class="my-4 text-center">Login</h2>

          @include('frontend.auth.includes.socialite')

          <div class="loginWithEmail">
            {{ html()->form('POST', route('frontend.auth.login.post'))->open() }}
            <div class="form-group">
              {{html()->label('Email Address')->for('email')}}
              {{ html()->email('email')
              ->class('form-control')
              ->placeholder(__('validation.attributes.frontend.email'))
              ->attributes(['maxlength'=> 191, 'autocomplete' => 'email'])
              ->required() }}
            </div>
            <div class="form-group">
              {{html()->label('Password')->for('password')}}
              {{ html()->password('password')
              ->class('form-control')
              ->placeholder(__('validation.attributes.frontend.password'))
              ->attributes(['maxlength'=> 191, 'autocomplete' => 'password'])
              ->required() }}
            </div>
            <div class="login_footer form-group">
              {{html()->checkbox('remember')->value(1)->checked(true)}}
              {{html()->label('Remember me')->for('remember')}}
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-secondary btn-block" name="login">Login
              </button>
            </div>
            {{ html()->form()->close() }}
          </div>

          <div class="form-note text-center">
            <a href="{{ route('frontend.auth.password.reset') }}">@lang('labels.frontend.passwords.forgot_password')</a>
          </div>

          @else

          <h2 class="my-4 text-center">You are logedIn...</h2>
          @endguest

        </div>
      </div>
    </div>
  </div>
</div>

@endsection