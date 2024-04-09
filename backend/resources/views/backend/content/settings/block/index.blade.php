@extends('backend.layouts.app')

@section('title', 'Block words manage')


@section('content')

<div class="row justify-content-center">

  <div class="col-md-12">
    <div class="card mb-3">
      <div class="card-header with-border">
        <h3 class="card-title">Manage Block Words <small class="ml-2">(update information anytime)</small></h3>
      </div>
      <div class="card-body">
        {{ html()->form('POST', route('admin.setting.block-words.store'))->open() }}
        <div class="form-group row">
          <div class="col-md-4">
            {{html()->label('Block Word')->for('word')}}
            {{html()->text('word')
            ->class('form-control')
            ->placeholder('Block Word')}}
          </div>
          <div class="col-md-4">
            {{html()->label('Block Small Sentence')->for('sentence')}}
            {{html()->text('sentence')
            ->class('form-control')
            ->placeholder('Block Sentence')}}
          </div>
          <div class="col-md-4">
            {{html()->label('Block Word')->class('invisible')}} <br>
            {{html()->button('Update')->class('btn btn-success')}}
          </div>
        </div> <!-- form-group-->
        {{ html()->form()->close() }}

      </div> <!--  .card-body -->

      <div class="card-body">
        <div class="table-responsive-sm">
          @livewire('backend.block-words-table')
        </div>
      </div> <!--  .card-body -->


    </div> <!--  .card -->
  </div> <!-- .col-md-4 -->

</div> <!-- .row -->

@endsection


@push('after-styles')
@livewireStyles
@endpush

@push('after-scripts')
@livewireScripts
@endpush