@extends('backend.layouts.app')

@section('title', ' Message Settings ')



@section('content')

<div class="row justify-content-center">
  <div class="col-md-6">
    @include('backend.content.settings.includes.email-message')
  </div> <!-- .col-md-6 -->

  <div class="col-md-6">
    @include('backend.content.settings.includes.sms-message')
  </div> <!-- .col-md-6 -->
</div> <!-- .row -->

@endsection




@push('after-styles')
<style>
  fieldset {
    padding: 10px;
    margin: 0 0 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  legend {
    width: auto;
    font-size: 20px;
  }
</style>

@endpush

@push('after-scripts')
{!! script(asset('assets/plugins/tinymce/jquery.tinymce.min.js')) !!}
{!! script(asset('assets/plugins/tinymce/tinymce.min.js')) !!}
{!! script(asset('assets/plugins/tinymce/editor-helper.js')) !!}

<script>
  small_editor('.editor');
</script>
@endpush