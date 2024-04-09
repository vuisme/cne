{{ html()->modelForm($order, 'POST', route('admin.setting.bkash.refund.submit', $order))->class('bkash_refund_form')->open() }}

<div class="form-group row">
  {{html()->label('paymentID')->class('col-md-4 text-right col-form-label')->for('bkash_payment_id')}}
  <div class="col-md-7">
    {{html()->text('bkash_payment_id')
    ->class('form-control')
    ->attributes(['max' => '255'])
    ->readOnly(true)
    ->placeholder('paymentID')}}
  </div>
</div> <!-- form-group -->

<div class="form-group row">
  {{html()->label('trxID')->class('col-md-4 text-right col-form-label')->for('bkash_trx_id')}}
  <div class="col-md-7">
    {{html()->text('bkash_trx_id')
    ->class('form-control')
    ->attributes(['max' => '255'])
    ->readOnly(true)
    ->placeholder('trxID')}}
  </div>
</div> <!-- form-group -->

<div class="form-group row">
  {{html()->label('Amount')->class('col-md-4 text-right col-form-label')->for('amount')}}
  <div class="col-md-7">
    {{html()->text('amount')
    ->class('form-control')
    ->value(round($order->orderItems->sum('first_payment') ?? 0))
    ->readOnly(true)
    ->placeholder('SKU')}}
  </div>
</div> <!-- form-group -->

<div class="form-group row">
  {{html()->label('Product SKU')->class('col-md-4 text-right col-form-label')->for('sku')}}
  <div class="col-md-7">
    {{html()->text('sku')
    ->class('form-control')
    ->value($order->transaction_id)
    ->readOnly(true)
    ->placeholder('SKU')}}
  </div>
</div> <!-- form-group -->

<div class="form-group row">
  {{html()->label('Refund Reason')->class('col-md-4 text-right col-form-label')->for('reason')}}
  <div class="col-md-7">
    {{html()->text('reason')
    ->class('form-control')
    ->attributes(['max' => '255'])
    ->value('product not received')
    ->placeholder('Reason')}}
  </div>
</div> <!-- form-group -->

<div class="form-group">
  {{ form_submit(__('Refund Process'), 'btn btn-danger btn-block') }}
</div>

{{ html()->closeModelForm() }}