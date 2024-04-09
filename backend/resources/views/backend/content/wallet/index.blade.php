@extends('backend.layouts.app')

@section('title', 'Manage Customer Wallet')

@php
$options = [
    'purchased' => 'Purchased',
    'shipped-from-suppliers' => 'Shipped from Suppliers',
    'received-in-china-warehouse' => 'Received in China Warehouse',
    'shipped-from-china-warehouse' => 'Shipped from China Warehouse',
    'received-in-BD-warehouse' => 'Received in BD Warehouse',
    'on-transit-to-customer' => 'On Transit to Customer',
    'out-of-stock' => 'Out of Stock',
    'adjustment' => 'Adjustment',
    'customer_tax' => 'Customer Tax',
    'refunded' => 'Refunded',
    'delivered' => 'Delivered',
    'lost_in_transit' => 'Lost in Transit',
    'waiting-for-payment' => 'Waiting for Payment',
    'partial-paid' => 'Partial Paid',
];
@endphp


@section('content')

  <div id="root"></div>

  <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="searchModalLabel">Search Wallet</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form id="filterWalletForm" action="{{ route('admin.order.wallet.index') }}" method="get">
            <div class="form-group">
              <label for="customer">Customer</label>
              {{ html()->select('customer', $findable, request('customer'))->class('form-control mr-sm-2 select2') }}
            </div>
            <div class="form-group">
              <label for="wallet_status">Wallet Status</label>
              <br>
              <div class="form-check">
                {{ html()->checkbox('all_select')->class('form-check-input') }}
                {{ html()->label('Select All')->class('form-check-label')->for('all_select') }}
              </div>
              @php
                $requ_status = request('status', []);
              @endphp
              @foreach ($options as $key => $option)
                <div class="form-check">
                  {{ html()->checkbox('status[]', in_array($key, $requ_status), $key)->id($key)->class('form-check-input status_checkbox') }}
                  {{ html()->label($option)->class('form-check-label')->for($key) }}
                </div>
              @endforeach
            </div> <!-- form-group -->
            <div class="form-group">
              <button type="submit" class="btn btn-block btn-info"><i class="fa fa-search"></i> Search</button>
            </div>
          </form> <!-- form-inline -->
        </div>
      </div>
    </div>
  </div>


  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-6">
          <h4 class="d-inline mr-3">@lang('Manage Wallet')</h4>
          <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#searchModal"><i class="fa fa-filter"></i> Filter</button>
        </div> <!-- col-->
        <div class="col-md-6 text-right">
          <div class="btn-group" role="group" aria-label="header_button_group">
            @can('wallet.generate.invoice')
              <button type="button" class="btn btn-danger" id="generateInvoiceButton" data-toggle="tooltip" title="Generate Invoice" disabled="true">
                @lang('Generate')
              </button>
            @endcan
            @can('wallet.download')
              <a href="/export-wallet" class="btn btn-warning exportWalletTable" data-toggle="tooltip" title="Export wallet">
                <i class="fa fa-download"></i> Export xlsx
              </a>
            @endcan
          </div> <!-- btn-group-->
        </div> <!-- col-->
      </div> <!-- row-->
    </div>
    <div class="card-body p-0">
      <div class="main-wallet-table">
        @livewire('wallet-table', ['status' => request('status'), 'customer' => request('customer')])
      </div>
    </div> <!-- card-body-->
  </div> <!-- card-->


  <div class="modal fade" id="detailsModal" tabindex="-1" role="dialog" aria-labelledby="detailsModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Wallet details loading...</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          {{-- details modal info append here --}}
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="changeStatusModal" tabindex="-1" role="dialog" aria-labelledby="changeStatusModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changeStatusModalCenterTitle">Change Status <span class="orderId"></span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form action="#" id="updateWalletStatus" method="post">
            <div class="form-group">
              @php
                unset($options['Waiting for Payment'], $options['Partial Paid']);
              @endphp
              {{ html()->select('status', $options)->class('form-control')->attribute('maxlength', 255)->required() }}
            </div> <!--  form-group-->

            <div id="additionInputStatusForm">
              {{-- status element form will append here --}}
            </div> <!-- additionInputStatusForm -->

            <div class="form-group">
              <div class="form-check form-check-inline">
                <input type="checkbox" name="notify" value="1" class="form-check-input" id="notify">
                <label class="form-check-label" for="notify">Notify User</label>
              </div>
            </div>
            <div class="form-group">
              {{ html()->label('Tracking Comment')->for('tracking_comment') }}
              {{ html()->textarea('tracking_comment')->placeholder('Tracking Comment')->rows(2)->class('form-control') }}
            </div>

            <div class="form-group">
              <button type="submit" class="btn btn-block btn-primary">Update</button>
            </div>
          </form>

        </div>

      </div>
    </div>
  </div> <!-- changeStatusButton -->


  <div class="modal fade" id="generateInvoiceModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog  modal-xl" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Generate Invoice</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="hiddenField">
            {{-- hidden input field append here --}}
          </div>

          <table class="table table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">SL</th>
                <th scope="col">Item No.</th>
                <th scope="col" class="text-left">Product</th>
                <th scope="col">Status</th>
                <th scope="col">Weight</th>
                <th scope="col">Due</th>
              </tr>
            </thead>
            <tbody id="invoiceItem"></tbody>
            <tfoot id="invoiceFooter">
              <tr>
                <td colspan="4" class="text-right">Total Due</td>
                <td class="text-right"><span class="total_weight">0.000</span></td>
                <td class="text-right"><span class="total_due">0.00</span></td>
              </tr>
              <tr>
                <td colspan="4" class="align-middle text-right">
                  <div class="row">
                    <div class="col">
                      @php
                        $payment_method = [
                            '' => '- Payment Method -',
                            'Cash' => 'Cash',
                            'Bkash' => 'Bkash',
                            'Cash on Delivery' => 'Cash on Delivery',
                            'Bank' => 'Bank',
                            'sslcommerz' => 'SSLcommerz',
                            'Nagod' => 'Nagod',
                            'Rocket' => 'Rocket',
                            'others' => 'Others',
                        ];
                      @endphp
                      {{ html()->select('payment_method', $payment_method)->class('form-control')->required() }}
                    </div>
                    <div class="col">
                      @php
                        $delivery_method = [
                            '' => '- Delivery Method -',
                            'office_delivery' => 'Office Delivery',
                            'sundarban' => 'Sundarban',
                            'sa_poribohon' => 'SA Poribohon',
                            'papperfly' => 'Papperfly',
                            'pathao' => 'Pathao',
                            'tiger' => 'Tiger',
                            'others' => 'Others',
                        ];
                      @endphp
                      {{ html()->select('delivery_method', $delivery_method)->class('form-control')->required() }}
                    </div>
                    <div class="col">
                      <p class="courier_bill_text m-0" style="display: none">
                        Courier Bill <a href="#" class="ml-3 removeCourierBtn text-danger">Remove</a>
                      </p>
                      <div class="input-group courierSubmitForm">
                        <input type="text" class="form-control" placeholder="Courier Bill" aria-label="Courier Bill"
                          aria-describedby="Courier-addon2">
                        <div class="input-group-append applyCourierBtn" style="cursor: pointer">
                          <span class="input-group-text" id="Courier-addon2">Apply</span>
                        </div>
                      </div>
                    </div>
                  </div> <!-- row -->
                </td>
                <td class="text-center">-</td>
                <td class="text-right"><span class="courier_bill">0.00</span></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right">Total Payable</td>
                <td class="text-center">-</td>
                <td class="text-right"><span class="total_payable">0.00</span></td>
              </tr>
            </tfoot>
          </table>
          <div class="notify-checkbox">
            <div class="form-group form-check">
              <input type="checkbox" name="notify" value="1" class="form-check-input" id="notifyUser" checked="true">
              <label class="form-check-label" for="notifyUser">Notify User</label>
            </div>
            <div class="form-group form-check">
              <input type="checkbox" name="tracking" value="1" class="form-check-input" id="tracking" checked="true">
              <label class="form-check-label" for="tracking">Tracking Update</label>
            </div>
          </div>
        </div>
        <div class="modal-footer justify-content-start">
          <button type="submit" class="btn btn-success" data-action="{{ route('admin.invoice.store') }}" id="generateSubmitBtn">Generate
          </button>
          <button type="button" data-dismiss="modal" class="btn btn-primary">Cancel</button>
        </div>

      </div>
    </div>
  </div> <!-- changeStatusButton -->


  <div class="modal fade" id="commentsModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="commentsModalTitle">Add Your Comments</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form action="#" id="submitCommentsForm" method="POST">
            <input type="hidden" name="type" value="">
            <div class="form-group">
              <label for="comments">Your Comment</label>
              <textarea name="comments" id="comments" rows="5" class="form-control" placeholder="Your Comment"></textarea>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-block btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div> <!-- changeStatusButton -->

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
                  <p class="m-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat fugit aliquid tenetur?</p>
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
  <link rel="stylesheet" href="{{ asset('assets/plugins/select2/css/select2.min.css') }}">

  @push('after-styles')
    @livewireStyles
  @endpush

  @push('after-scripts')
    <script src="{{ asset('assets/plugins/jquery-freeze-table/dist/js/freeze-table.min.js') }}"></script>
    @livewireScripts
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js"></script>
    <script src="{{ asset('assets/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/table2excel/jquery.table2excel.min.js') }}"></script>
    <script>
      $(document).ready(function() {
        $(document).on('click', '.exportWalletTable', function(e) {
          e.preventDefault()
          var table = $('.table');
          if (table.length) {
            var preserveColors = (table.hasClass('table') ? true : false);
            var dateTime = moment().format('DD-MM-YYYY-hh-mm-ss-a');
            $(table).table2excel({
              exclude: ".noExl",
              name: "Wallet-export",
              filename: "wallet-export-" + dateTime + ".xls",
              fileext: ".xls",
              exclude_img: true,
              exclude_links: true,
              exclude_inputs: true,
              preserveColors: preserveColors
            });
          }
        });
      });
    </script>
  @endpush
