@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.passwords.reset_password_box_title'))

@section('content')
<div class="container">
  <div class="align-items-center justify-content-center row" style="height: 85vh;">
    <div class=" col-md-6 col-lg-5">
      <div class="card">
        <div class="card-body">
          <h3 class="my-4 text-center">Reset Password</h3>

          @if(session('status'))
          <div class="alert alert-success">
            {{ session('status') }}
          </div>
          @endif

          {{ html()->form('POST', route('frontend.auth.password.email.post'))->open() }}

          <div class="form-group">
            {{ html()->label(__('validation.attributes.frontend.email'))->for('email') }}
            {{ html()->email('email')
            ->class('form-control')
            ->placeholder(__('validation.attributes.frontend.email'))
            ->attribute('maxlength', 191)
            ->required()
            ->autofocus() }}
          </div>
          <div class="form-group">
            {{ form_submit(__('labels.frontend.passwords.send_password_reset_link_button'),'btn btn-block btn-secondary') }}
          </div>
          {{ html()->form()->close() }}
          <div class="text-center">
            <span> or</span>
          </div>
          <div class="form-note text-center"> Have an Account? <a href="{{route('frontend.auth.login')}}">Sign In
              now</a></div>
        </div>
      </div>
    </div>
  </div><!-- row -->
</div>
@endsection