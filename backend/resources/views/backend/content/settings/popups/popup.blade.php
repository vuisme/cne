@extends('backend.layouts.app')

@section('title', 'Manage popus messages')


@section('content')

<div class="row justify-content-center">
  <div class="col-md-4">
    {{ html()->form('POST', route('admin.setting.popup-message'))->attribute('enctype', 'multipart/form-data')->open()
    }}
    <div class="card mb-3">
      <div class="card-header with-border">
        <h3 class="card-title">Taobao Popup Message <small class="ml-2">(Add to cart Popup)</small></h3>
      </div>
      <div class="card-body">
        @php
        $cart_msg = get_setting('cart_popup_message', []);
        $cart_msg = $cart_msg ? json_decode($cart_msg, true) : [];
        $popup_message = getArrayKeyData($cart_msg, 'popup_message');
        $popup_option = getArrayKeyData($cart_msg, 'popup_option');
        $option = old('popup_option', $popup_option);
        @endphp
        <div class="form-group">
          {{html()->label('Popup Message')->for('popup_message')}}
          {{ html()->textarea('popup_message', $popup_message)
          ->placeholder('Popup Message')
          ->class('form-control')
          ->rows(4) }}
        </div> <!-- form-group -->

        <div class="form-group">
          {{html()->label('Popup Image')->for('popup_image')}}
          {{html()->file('popup_image')->class('form-control-file')}}
        </div> <!-- form-group -->

        <div class="form-group ">
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'both', 'both')
            ->id('both')
            ->checked(true)
            ->class('form-check-input')}}
            {{ html()->label("Both")->class('form-check-label')->for('both') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_text', 'only_text')
            ->id('only_text')
            ->class('form-check-input')}}
            {{ html()->label("Only Text")->class('form-check-label')->for('only_text') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_image', 'only_image')
            ->id('only_image')
            ->class('form-check-input')}}
            {{ html()->label("Only Image")->class('form-check-label')->for('only_image') }}
          </div>
        </div> <!-- form-group-->

      </div> <!--  .card-body -->
      <div class="card-footer">
        <div class="form-group">
          {{html()->button('Update')->class('btn btn-success')}}
        </div> <!-- form-group-->
      </div> <!--  .card-footer -->
    </div> <!--  .card -->
    {{ html()->form()->close() }}
  </div> <!-- .col-md-4 -->


  <div class="col-md-4">
    {{ html()->form('POST', route('admin.setting.popup-message-aliexpress'))->attribute('enctype',
    'multipart/form-data')->open()
    }}
    <div class="card mb-3">
      <div class="card-header with-border">
        <h3 class="card-title">AliExpress Popup Message <small class="ml-2">(Add to cart Popup)</small></h3>
      </div>
      <div class="card-body">
        @php
        $cart_msg = get_setting('cart_aliexpress_popup_message', []);
        $cart_msg = $cart_msg ? json_decode($cart_msg, true) : [];
        $popup_message = getArrayKeyData($cart_msg, 'popup_message');
        $popup_option = getArrayKeyData($cart_msg, 'popup_option');
        $option = old('popup_option', $popup_option);
        @endphp
        <div class="form-group">
          {{html()->label('Popup Message')->for('popup_message')}}
          {{ html()->textarea('popup_message', $popup_message)
          ->placeholder('Popup Message')
          ->class('form-control')
          ->rows(4) }}
        </div> <!-- form-group -->

        <div class="form-group">
          {{html()->label('Popup Image')->for('popup_image')}}
          {{html()->file('popup_image')->class('form-control-file')}}
        </div> <!-- form-group -->

        <div class="form-group ">
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'both', 'both')
            ->id('both')
            ->checked(true)
            ->class('form-check-input')}}
            {{ html()->label("Both")->class('form-check-label')->for('both') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_text', 'only_text')
            ->id('only_text')
            ->class('form-check-input')}}
            {{ html()->label("Only Text")->class('form-check-label')->for('only_text') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_image', 'only_image')
            ->id('only_image')
            ->class('form-check-input')}}
            {{ html()->label("Only Image")->class('form-check-label')->for('only_image') }}
          </div>
        </div> <!-- form-group-->

      </div> <!--  .card-body -->
      <div class="card-footer">
        <div class="form-group">
          {{html()->button('Update')->class('btn btn-success')}}
        </div> <!-- form-group-->
      </div> <!--  .card-footer -->
    </div> <!--  .card -->
    {{ html()->form()->close() }}
  </div> <!-- .col-md-4 -->


  <div class="col-md-4">
    {{ html()->form('POST', route('admin.setting.aliexpress-express-button'))->attribute('enctype',
    'multipart/form-data')->open()
    }}
    <div class="card mb-3">
      <div class="card-header with-border">
        <h3 class="card-title">AliExpress Express Button Popup Message <small class="ml-2">(Add to cart Popup)</small>
        </h3>
      </div>
      <div class="card-body">
        @php
        $cart_msg = get_setting('aliexpress_express_popup_message', []);
        $cart_msg = $cart_msg ? json_decode($cart_msg, true) : [];
        $popup_message = getArrayKeyData($cart_msg, 'popup_message');
        $popup_option = getArrayKeyData($cart_msg, 'popup_option');
        $option = old('popup_option', $popup_option);
        @endphp
        <div class="form-group">
          {{html()->label('Popup Message')->for('popup_message')}}
          {{ html()->textarea('popup_message', $popup_message)
          ->placeholder('Popup Message')
          ->class('form-control')
          ->rows(4) }}
        </div> <!-- form-group -->

        <div class="form-group">
          {{html()->label('Popup Image')->for('popup_image')}}
          {{html()->file('popup_image')->class('form-control-file')}}
        </div> <!-- form-group -->

        <div class="form-group ">
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'both', 'both')
            ->id('both')
            ->checked(true)
            ->class('form-check-input')}}
            {{ html()->label("Both")->class('form-check-label')->for('both') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_text', 'only_text')
            ->id('only_text')
            ->class('form-check-input')}}
            {{ html()->label("Only Text")->class('form-check-label')->for('only_text') }}
          </div>
          <div class="form-check form-check-inline">
            {{html()->radio('popup_option', $option == 'only_image', 'only_image')
            ->id('only_image')
            ->class('form-check-input')}}
            {{ html()->label("Only Image")->class('form-check-label')->for('only_image') }}
          </div>
        </div> <!-- form-group-->

      </div> <!--  .card-body -->
      <div class="card-footer">
        <div class="form-group">
          {{html()->button('Update')->class('btn btn-success')}}
        </div> <!-- form-group-->
      </div> <!--  .card-footer -->
    </div> <!--  .card -->
    {{ html()->form()->close() }}
  </div> <!-- .col-md-4 -->

</div> <!-- .row -->

@endsection