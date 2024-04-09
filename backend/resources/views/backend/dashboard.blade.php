@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
<div class="row">
  <div class="col">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-md-8">
            <strong>Daoshboard Summary</strong>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar"></i>
                  </span>
                </div>
                <input type="text" class="form-control float-right" id="reservation"
                  placeholder="Select Your Date Range">
              </div>
            </div>
          </div>
        </div>

      </div> <!-- card-header-->
      <div class="card-body">

        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-success">
              <div class="inner py-3">
                <h3 id="product_value">0</h3>
                <h5>Sales</h5>
              </div>
              <div class="icon">
                <i class="fa fa-bar-chart"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-warning">
              <div class="inner py-3">
                <h3 id="first_payment">0</h3>
                <h5>Payment Received</h5>
              </div>
              <div class="icon">
                <i class="fa fa-credit-card"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-info">
              <div class="inner py-3">
                <h3><span id="weight">0</span>/<span id="shipping_rate">0</span></h3>
                <h5>Shipping Charges</h5>
              </div>
              <div class="icon">
                <i class="fa fa-truck"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-danger">
              <div class="inner py-3">
                <h3 id="customer_due">0</h3>
                <h5>Customer Due</h5>
              </div>
              <div class="icon">
                <i class="fa fa-users"></i>
              </div>
            </div>
          </div> <!-- ./col -->
        </div>

        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-gradient-olive">
              <div class="inner py-3">
                <h3 id="invoice_count">0</h3>
                <h5>Invoice Generated</h5>
              </div>
              <div class="icon">
                <i class="fa fa-newspaper-o"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-gradient-maroon">
              <div class="inner py-3">
                <h3 id="refunded">0</h3>
                <h5>Refund</h5>
              </div>
              <div class="icon">
                <i class="fa fa-undo"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-orange">
              <div class="inner py-3">
                <h3><span id="invoice_count">0</span>/<span id="courier_charge">0</span></h3>
                <h5>Courier Charges</h5>
              </div>
              <div class="icon">
                <i class="fa fa-truck"></i>
              </div>
            </div>
          </div> <!-- ./col -->
          <div class="col-lg-3 col-6">
            <div class="small-box mb-3 bg-teal">
              <div class="inner py-3">
                <h3 id="stock_value">0</h3>
                <h5>Stock Value</h5>
              </div>
              <div class="icon">
                <i class="fa fa-home"></i>
              </div>
            </div>
          </div> <!-- ./col -->
        </div>


      </div> <!-- card-body-->
    </div> <!-- card-->
  </div> <!-- col-->
</div> <!-- row-->
@endsection


@push('middle-styles')
<link rel="stylesheet" href="{{asset('assets/plugins/daterangepicker/daterangepicker.css')}}">
@endpush

@push('after-scripts')
<script src="{{asset('assets/plugins/daterangepicker/moment.min.js')}}"></script>
<script src="{{asset('assets/plugins/daterangepicker/daterangepicker.js')}}"></script>
<script>
  $(document).ready(function() {


    function loadDashboardParamerters(startDate,endDate){
      var base_url = $("#app_base_url").val()+`/admin/dashboard/report/data`;
      axios.post(base_url,{startDate,endDate})
      .then((response) => {
        let data = response.data;
        for(let item in data){
          $("#"+item).text(data[item]);
        }
      })
    }

    setTimeout(() => {
      var startDate = moment().format('YYYY-MM-DD');
      var endDate = moment().format('YYYY-MM-DD');
      loadDashboardParamerters(startDate,endDate)
    }, 300);

    //Date range picker
    $('#reservation').daterangepicker();

    $('#reservation').on('apply.daterangepicker', function(ev, picker) {
      var startDate = picker.startDate.format('YYYY-MM-DD');
      var endDate = picker.endDate.format('YYYY-MM-DD');
      loadDashboardParamerters(startDate,endDate);
    });
  })
  
</script>
@endpush