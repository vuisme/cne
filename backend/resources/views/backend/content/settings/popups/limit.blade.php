@extends('backend.layouts.app')

@section('title', 'Order Limitation')


@section('content')
    <div class="row">
        <div class="col-md-4">
            <div class="card mb-3">
                {{ html()->form('POST', route('admin.setting.limitationStore'))->class('form-horizontal')->open() }}
                <div class="card-header with-border">
                    <h3 class="card-title">Order Limitation <small class="ml-2">(update information
                            anytime)</small>
                    </h3>
                </div>
                <div class="card-body">
                    <div class="form-group row mb-4">
                        {{html()->label('Minimum Order Quantity')->class('col-md-7 col-form-label
                        text-right')->for('min_order_quantity')}}
                        <div class="col-md-5">
                            {{html()->number('min_order_quantity', get_setting('min_order_quantity'))
                            ->class('form-control')
                            ->attribute('min', 1)
                            ->autofocus(true)
                            ->placeholder('Minimum Order Quantity')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('Minimum Order Amount (BDT.)')->class('col-md-7 col-form-label
                        text-right')->for('min_order_amount')}}
                        <div class="col-md-5">
                            {{html()->number('min_order_amount', get_setting('min_order_amount'))
                            ->class('form-control')
                            ->attribute('min', 100)
                            ->placeholder('Minimum Order Amount')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('China Local Delivery Charge (BDT.)')->class('col-md-7 col-form-label
                        text-right')->for('china_local_delivery_charge')}}
                        <div class="col-md-5">
                            {{html()->number('china_local_delivery_charge', get_setting('china_local_delivery_charge'))
                            ->class('form-control')
                            ->attribute('min', 0)
                            ->placeholder('Charge')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('China Local Delivery Charge Limit (BDT.)')->class('col-md-7 col-form-label
                        text-right')->for('china_local_delivery_charge_limit')}}
                        <div class="col-md-5">
                            {{html()->number('china_local_delivery_charge_limit', get_setting('china_local_delivery_charge_limit'))
                            ->class('form-control')
                            ->attribute('min', 0)
                            ->placeholder('Charge Limit')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->


                    <div class="form-group row mb-4">
                        {{html()->label('Payment Advanched Rate (%)')->class('col-md-7 col-form-label
                        text-right')->for('payment_advanched_rate')}}
                        <div class="col-md-5">
                            {{html()->number('payment_advanched_rate', get_setting('payment_advanched_rate'))
                            ->class('form-control')
                            ->attributes(['min' => 0, 'max' => 100])
                            ->placeholder('Payment advanched rate %')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('Incomplete Order Deletion After (Days)')->class('col-md-7 col-form-label
                        text-right')->for('incomplete_order_deletion_after_day')}}
                        <div class="col-md-5">
                            {{html()->number('incomplete_order_deletion_after_day', get_setting('incomplete_order_deletion_after_day'))
                            ->class('form-control')
                            ->placeholder('Incomplete Order Deletion After Day')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        <div class="col-md-5 offset-md-7">
                            {{html()->button('Update')->class('btn btn-success')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->
                </div> <!--  .card-body -->
                {{ html()->form()->close() }}
            </div> <!--  .card -->
        </div> <!-- .col-md-4 -->
        <div class="col-md-4">
            <div class="card mb-3">
                {{ html()->form('POST', route('admin.setting.airShippingStore'))->open() }}
                <div class="card-header with-border">
                    <h3 class="card-title">Payment Advanced Rate</h3>
                </div>
                <div class="card-body">
                    <table class="table-bordered table-sm table-striped text-center">
                        <tr>
                            <th style="width: 25%">Minimum</th>
                            <th style="width: 25%">Maximum</th>
                            <th style="width: 25%">Advanced Rate(%)</th>
                            <th style="width: 25%">Option</th>
                        </tr>
                        <tbody class="shippLimitBody">
                        @php
                            $advanced_rates = json_decode(get_setting('advanced_rates')) ?? collect([]);
                        @endphp
                        @forelse($advanced_rates as $key => $rates)
                            <tr>
                                <td>
                                    {{html()->number('advanced_rates['.$key.'][minimum]', $rates->minimum)->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('advanced_rates['.$key.'][maximum]',$rates->maximum)
                                    ->class('form-control form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    {{html()->number('advanced_rates['.$key.'][rate]', $rates->rate)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger removeField">Remove
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td>
                                    {{html()->number('advanced_rates[0][minimum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('advanced_rates[0][maximum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    {{html()->number('advanced_rates[0][rate]', 0)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger removeField">Remove
                                    </button>
                                </td>
                            </tr>
                        @endforelse
                        </tbody>
                        <tfoot>
                        <td colspan="3"></td>
                        <td>
                            <button type="button" class="btn btn-sm btn-primary addField" data-name="advanced_rates">
                                Add New
                            </button>
                        </td>
                        </tfoot>
                    </table>
                </div> <!--  .card-body -->
                <div class="card-footer">
                    <div class="form-group">
                        {{html()->button('Update')->class('btn btn-success')}}
                    </div> <!-- form-group-->
                </div> <!--  .card-footer -->
                {{ html()->form()->close() }}
            </div> <!--  .card -->
        </div>
        <div class="col-md-4">
            {{ html()->form('POST', route('admin.setting.airShippingStore'))->class('form-horizontal')->open() }}
            <div class="card mb-3">
                <div class="card-header with-border">
                    <h3 class="card-title">Shipping Limitation <small class="ml-2">(Air Shipping Rate)</small></h3>
                </div>
                <div class="card-body">
                    <table class="table-bordered table-sm table-striped text-center">
                        <tr>
                            <th style="width: 25%">Minimum</th>
                            <th style="width: 25%">Maximum</th>
                            <th style="width: 25%">Rate</th>
                            <th style="width: 25%">Option</th>
                        </tr>
                        <tbody class="shippLimitBody">
                        @php
                            $shipping_charges = json_decode(get_setting('air_shipping_charges')) ?? collect([]);
                        @endphp
                        @forelse($shipping_charges as $key => $charges)
                            <tr>
                                <td>
                                    {{html()->number('shipping['.$key.'][minimum]', $charges->minimum)->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('shipping['.$key.'][maximum]',$charges->maximum)->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    {{html()->number('shipping['.$key.'][rate]', $charges->rate)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td>
                                    {{html()->number('shipping[0][minimum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('shipping[0][maximum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    {{html()->number('shipping[0][rate]', 0)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
                                </td>
                            </tr>
                        @endforelse
                        </tbody>
                        <tfoot>
                        <td colspan="3"></td>
                        <td>
                            <button type="button" class="btn btn-sm btn-primary addField" data-name="shipping">Add New
                            </button>
                        </td>
                        </tfoot>
                    </table>
                </div> <!--  .card-body -->
                <div class="card-footer">
                    <div class="form-group">
                        {{html()->button('Update')->class('btn btn-success')}}
                    </div> <!-- form-group-->
                </div> <!--  .card-footer -->
            </div> <!--  .card -->
            {{ html()->form()->close() }}
        </div> <!-- .col-md-6 -->
    </div> <!-- .row -->
    <div class="row">
        <div class="col-md-6">
            {{ html()->form('POST', route('admin.setting.aliexpress.limitation.store'))->open() }}
            <div class="card mb-3">
                <div class="card-header with-border">
                    <h3 class="card-title">AliExpress Order Limitation <small class="ml-2">(update information
                            anytime)</small></h3>
                </div>
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-md-6">
                            {{html()->label('AliExpress minimum order Amount  (BDT.)')->for('ali_min_order_value')}}
                            {{html()->number('ali_min_order_value', get_setting('ali_min_order_value'))
                            ->class('form-control')
                            ->placeholder('AliExpress minimum order')}}
                        </div>
                        <div class="col-md-6">
                            {{html()->label('Express shipping minimum order (BDT.)')->for('express_shipping_min_value')}}
                            {{html()->number('express_shipping_min_value', get_setting('express_shipping_min_value'))
                            ->class('form-control')
                            ->placeholder('Express shipping Minimum Order Amount')}}
                        </div>
                    </div> <!-- form-group-->
                    <div class="form-group row">
                        <div class="col-md-6">
                            {{html()->label('Express Shipping Weight Rate (per kg)')->for('express_shipping_weight_rate')}}
                            {{html()->number('express_shipping_weight_rate', get_setting('express_shipping_weight_rate'))
                            ->class('form-control')
                            ->placeholder('Weight Rate')}}
                        </div> <!-- col-md-6 -->
                        <div class="col-md-6">
                            {{html()->label('Express Shipping Weight Minimum Charges')->for('express_shipping_weight_min_charge')}}
                            {{html()->number('express_shipping_weight_min_charge', get_setting('express_shipping_weight_min_charge'))
                            ->class('form-control')
                            ->placeholder('Weight Minimum Charges')}}
                        </div> <!-- col-md-6 -->
                    </div> <!-- form-group-->
                    <div class="form-group">
                        <label for="weight_charges">Express Shipping Weight charges</label>
                        <table class="table-bordered table-sm table-striped text-center w-100">
                            <tr>
                                <th style="width: 25%">Minimum</th>
                                <th style="width: 25%">Maximum</th>
                                <th style="width: 25%">Rate</th>
                                <th style="width: 25%">Option</th>
                            </tr>
                            <tbody class="shippLimitBody">
                            @php
                                $shipping_charges = json_decode(get_setting('ali_air_shipping_charges')) ?? collect([]);
                            @endphp
                            @forelse($shipping_charges as $key => $charges)
                                <tr>
                                    <td>
                                        {{html()->number('ali_shipping['.$key.'][minimum]', $charges->minimum)->class('form-control
                                        form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                    </td>
                                    <td>
                                        {{html()->number('ali_shipping['.$key.'][maximum]',$charges->maximum)->class('form-control
                                        form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                    </td>
                                    <td>
                                        {{html()->number('ali_shipping['.$key.'][rate]', $charges->rate)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
                                    </td>
                                </tr>
                            @empty
                                <tr class="blank_field">
                                    <td>
                                        {{html()->number('ali_shipping[0][minimum]')->class('form-control
                                        form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                    </td>
                                    <td>
                                        {{html()->number('ali_shipping[0][maximum]')->class('form-control
                                        form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                    </td>
                                    <td>
                                        {{html()->number('ali_shipping[0][rate]', 0)->class('form-control form-control-sm')->attribute('min',0)->placeholder('Rate')}}
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
                                    </td>
                                </tr>
                            @endforelse
                            </tbody>
                            <tfoot>
                            <td colspan="3"></td>
                            <td>
                                <button type="button" class="btn btn-sm btn-primary addField" data-name="ali_shipping">
                                    Add New
                                </button>
                            </td>
                            </tfoot>
                        </table>
                    </div> <!-- form-group-->

                    <div class="form-group">
                        {{html()->button('Update')->class('btn btn-block btn-success')}}
                    </div> <!-- form-group-->
                </div> <!--  .card-body -->
            </div> <!--  .card -->
            {{ html()->form()->close() }}
        </div> <!-- .col-md-6 -->
    </div> <!-- .row -->

@endsection

@push('after-scripts')
    <script>
        function limitationField(name, length) {
            return `<tr><td><input class="form-control" type="number" name="${name}[${length}][minimum]" id="minimum" placeholder="Minimum"></td><td>
                <input class="form-control form-control-sm" type="number" name="${name}[${length}][maximum]" id="maximum" placeholder="Maximum"></td><td><input class="form-control form-control-sm" type="number" name="${name}[${length}][rate]" id="rate" placeholder="Rate"></td><td><button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
              </td></tr>`;
        }


        $(document).on('click', '.removeField', function () {
            var tbody = $(this).closest('table').find('.shippLimitBody').find('tr');
            if (tbody.length > 1) {
                $(this).closest('tr').remove();
            } else if (tbody.length === 1) {
                $(this).addClass('disabled');
            }
        });

        $(document).on('click', '.addField', function () {
            var shippLimitBody = $(this).closest('table').find('.shippLimitBody');
            var dataFieldName = $(this).attr('data-name')
            var rowLength = shippLimitBody.find('tr').length;
            var tableRow = limitationField(dataFieldName, rowLength);
            if (rowLength < 10) {
                shippLimitBody.append(tableRow);
            }
        });
    </script>
@endpush
