@extends('backend.layouts.app')

@section('title', 'Recent Orders')
@php
$status = request('status');
$allOrdersCount = $orders->count();
$partialCount = $orders->where('status', 'partial-paid')->count();
$icompleteCount = $orders->where('status', 'waiting-for-payment')->count();
$refundedCount = $orders->where('status', 'refunded')->count();
$processingCount = $orders->where('status', 'processing')->count();
$purchasedCount = $orders->where('status', 'purchased')->count();
@endphp

@section('content')

<div class="card">

  <div class="card-header">
    <h5 class="d-inline-block mr-2">@lang('Recent Orders')</h5>
    <div class="status-control d-inline">
      <a href="#" class="btn btn-outline-info btn-sm mr-1 process_multiple_delete" data-table="orders"><i
        class="fa fa-trash-o"></i> Multiple Delete</a>
      <a href="{{ route('admin.order.index') }}" class="btn btn-outline-info btn-sm mr-1 @if(!$status) active @endif">
        @lang('All Orders') ({{$allOrdersCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'partial-paid']) }}"
        class="btn btn-outline-info btn-sm mr-1 @if($status == 'partial-paid') active @endif">
        @lang('Partial Paid') ({{$partialCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'waiting-for-payment']) }}"
        class="btn btn-outline-danger btn-sm mr-1 @if($status == 'waiting-for-payment') active @endif">
        @lang('Incomplete') ({{$icompleteCount}})
      </a>
      @can('recent.order.trash')
      <a href="{{ route('admin.order.index', ['status' => 'trashed']) }}"
        class="btn btn-outline-danger btn-sm mr-1 @if($status == 'trashed') active @endif">
        @lang('Trashed Orders') ({{$trashedOrders->count()}})
      </a>
      @endcan
    </div>
  </div>
  <div class="card-body">
    @livewire('order-table', ['status' => $status])
  </div> <!-- card-body-->
</div> <!-- card-->
@endsection


@push('after-styles')
@livewireStyles
@endpush

@push('after-scripts')
@livewireScripts
<script>
  const popupCenter = ({url, title, w, h}) => {        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const newWindow = window.open(url, title, `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top},left=${left}`)
        if (window.focus) newWindow.focus();
     }

     $(function () {
        $(document).on('click', '.btn_details', function (event) {
           event.preventDefault();
           var href = $(this).attr('href');
           popupCenter({url: href, title: 'Print Order', w: 1080, h: 720});
        });
     });
</script>
@endpush
