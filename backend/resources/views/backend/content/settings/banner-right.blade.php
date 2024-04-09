@extends('backend.layouts.app')

@section('title', ' Baner Right Image and Link Settings ')

@php
$required = html()->span('*')->class('text-danger');
$demoImg = 'img/backend/front-logo.png';
@endphp

@section('content')

<div class="row justify-content-center">
  
  <div class="col-md-8">
    <div class="card">
      <div class="card-header with-border">
        <h3 class="card-title">Baner Right Image and Link Settings </h3>
      </div>
      <div class="card-body">

        @php
          $asmLogo = get_setting('right_banner_image', $demoImg);
        @endphp

        {{ html()->form('POST', route('admin.front-setting.banner.right.store'))->class('form-horizontal')->attribute('enctype', 'multipart/form-data')->open() }}

        <div class="form-group row mb-4">
          {{html()->label('Right Banner Image (370x500)')->class('col-md-4 form-control-label text-right')->for('right_banner_image')}}
          <div class="col-md-8">
            <label for="right_banner_image">
              <img src="{{asset($asmLogo)}}" class="border img-fluid rounded holder" alt="Image upload">
            </label>
            {{html()->file('right_banner_image')->class('form-control-file image d-none')->acceptImage()}}
          </div> <!-- col-->
        </div> <!-- form-group-->

        <div class="form-group row mb-4">
          {{html()->label('Right Banner Image Link')->class('col-md-4 form-control-label text-right')->for('right_banner_image_link')}}
          <div class="col-md-8">
            {{html()->text('right_banner_image_link', $rightBanner->right_banner_image_link ?? '')->placeholder('Right Banner Image Link')->class('form-control')}}
          </div> <!-- col-->
        </div> <!-- form-group-->

        <div class="form-group row mb-4">
          <div class="col-md-8 offset-md-4">
            {{html()->button('Update')->class('btn btn-sm btn-success')}}
          </div> <!-- col-->
        </div> <!-- form-group-->


        {{ html()->form()->close() }}

      </div> <!--  .card-body -->
    </div> <!--  .card -->
  </div> <!-- .col-md-9 -->
</div> <!-- .row -->

@endsection



@push('after-scripts')

<script>
  function readImageURL(input, preview) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            preview.attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

  $(document).ready(function () {
    $(".image").change(function () {
      holder = $(this).closest('.form-group').find('.holder');
        readImageURL(this, holder);
    });
  });

</script>

@endpush
