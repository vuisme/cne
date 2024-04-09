@extends('backend.layouts.app')

@section('title', 'Manage Order tracking')



@section('content')

  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-6">
          <h4 class="d-inline mr-3">@lang('Manage Order Tracking')</h4>
        </div> <!-- col-->
        <div class="col-md-6 text-right">
          <div class="btn-group" role="group" aria-label="header_button_group">
            @can('order.tracking.index', ['status' => 'trashed'])
              <button type="button" class="btn btn-danger">
                @lang('Trashed Tracking')
              </button>
            @endcan
          </div> <!-- btn-group-->
        </div> <!-- col-->
      </div> <!-- row-->
    </div>
    <div class="card-body p-0">
      <div class="main-tracking-table">
        @livewire('tracking-order-table', ['status' => request('status')])
      </div>
    </div> <!-- card-body-->
  </div> <!-- card-->


  <div class="modal fade" id="trackingInfoModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="trackingInfoModalTitle">Tracking Information</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          {{-- tracking information will be displayed here --}}

          <div class="timeline">
            <div>
              <i class="fa fa-check-circle bg-blue"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Delivered</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>On Transit to Customer</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Received in BD Warehouse</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Shipped from China Warehouse</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Received in China Warehouse</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Shipped from Seller</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Received in China Warehouse</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <!-- END timeline item -->
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Shipped from Seller</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-gray"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Purchased</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
            <div>
              <i class="fa fa-check-circle bg-blue"></i>
              <div class="timeline-item">
                <div class="timeline-body">
                  <h6>Partial Paid</h6>
                  <span>10 Feb. 2022</span>
                </div>
              </div>
            </div>
          </div>

          {{--  --}}
        </div>
      </div>
    </div>
  </div> <!-- changeStatusButton -->


@endsection



@push('after-styles')
  @livewireStyles
@endpush

@push('after-scripts')
  @livewireScripts
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js"></script>
  <script src="{{ asset('assets/plugins/select2/js/select2.full.min.js') }}"></script>
  <script src="{{ asset('assets/plugins/table2excel/jquery.table2excel.min.js') }}"></script>
@endpush
