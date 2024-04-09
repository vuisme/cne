<div class="dropdown">
  <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
    <i class="fa fa-cog"></i>
  </button>
  <div class="dropdown-menu dropdown-menu-right">
    <a class="dropdown-item payment_status" href="{{route('admin.setting.bkash.payment.status', $order)}}">Payment Status</a>
    <a class="dropdown-item refund_order" href="{{route('admin.setting.bkash.refund.process', $order)}}">Refund Order</a>
    <a class="dropdown-item refund_status" href="{{route('admin.setting.bkash.refund.status', $order)}}">Refund Status</a>
  </div>
</div>