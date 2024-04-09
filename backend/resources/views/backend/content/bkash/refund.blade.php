@extends('backend.layouts.app')

@section('title', 'Bkash Api Response Testing')

@section('content')
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-sm-5">
          <h4 class="my-1">
            @lang('Bkash Refund Orders')
          </h4>
        </div> <!-- col-->
      </div> <!-- row-->
    </div>
    <div class="card-body">
      @livewire('backend.bkash-refund-order')
    </div> <!-- card-body-->
  </div> <!-- card-->



  <div class="modal fade" id="refundProcessModal" tabindex="-1" aria-labelledby="refundProcessModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="refundProcessModalLabel">Refund Response Status</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="text-center my-5">
            <div class="spinner-border text-secondary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

@endsection