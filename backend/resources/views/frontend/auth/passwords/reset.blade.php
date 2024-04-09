@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.passwords.reset_password_box_title'))

@section('content')

<div class="container">
  <div class="align-items-center justify-content-center row" style="height: 88vh;">
    <div class=" col-md-6 col-lg-5">
      <div class="card">
        <div class="card-body">
          <h3 class="my-4 text-center">@lang('labels.frontend.passwords.reset_password_box_title')</h3>

          @if(session('status'))
          <div class="alert alert-success">
            {{ session('status') }}
          </div>
          @endif

          {{ html()->form('POST', route('frontend.auth.password.reset'))->class('form-horizontal')->open() }}
          {{ html()->hidden('token', $token) }}

          <div class="form-group">
            {{ html()->label(__('validation.attributes.frontend.email'))->for('email') }}
            {{ html()->email('email')
            ->class('form-control')
            ->placeholder(__('validation.attributes.frontend.email'))
            ->attribute('maxlength', 191)
            ->required() }}
          </div>

          <div class="form-group">
            {{ html()->label(__('validation.attributes.frontend.password'))->for('password') }}
            {{ html()->password('password')
            ->class('form-control')
            ->placeholder(__('validation.attributes.frontend.password'))
            ->required() }}
          </div> <!-- form-group-->

          <div class="form-group">
            {{
            html()->label(__('validation.attributes.frontend.password_confirmation'))->for('password_confirmation')
            }}
            {{ html()->password('password_confirmation')
            ->class('form-control')
            ->placeholder(__('validation.attributes.frontend.password_confirmation'))
            ->required() }}
          </div> <!-- form-group-->

          <div class="form-group">
            {{ form_submit(__('labels.frontend.passwords.reset_password_button'),'btn btn-block btn-secondary') }}
          </div>
          {{ html()->form()->close() }}

        </div>
      </div>
    </div>
  </div><!-- row -->
</div><!-- container -->
@endsection