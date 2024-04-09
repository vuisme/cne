@extends('backend.layouts.app')

@section('title', ' Price Settings ')

@section('content')
    <div id="root"></div>
    <div class="row">
        <div class="col-md-4">
            {{ html()->form('POST', route('admin.setting.socialStore'))->class('form-horizontal')->open() }}
            <div class="card">
                <div class="card-header with-border">
                    <h3 class="card-title">Price Settings <small class="ml-2">(update information anytime)</small></h3>
                </div>
                <div class="card-body">

                    <div class="form-group row mb-4">
                        {{html()->label('Website Currency Icon')->class('col-md-4 col-form-label text-right')->for('currency_icon')}}
                        <div class="col-md-8">
                            {{html()->select('currency_icon', [ '৳' => '৳','BDT' => 'BDT'], get_setting('currency_icon'))
                            ->class('form-control')
                            ->attribute('style', 'font-family: sans-serif;')}}
                            <small id="baseCurrency" class="form-text text-muted">This icon will show the prefix of
                                price.</small>
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('Taobao Base Currency')->class('col-md-4 col-form-label text-right')->for('base_currency')}}
                        <div class="col-md-8">
                            {{html()->text('base_currency', get_setting('base_currency'))
                            ->class('form-control')
                            ->placeholder('CNY')
                            ->disabled(true)
                            ->attribute('aria-describedby', 'baseCurrency')}}
                            <small id="baseCurrency" class="form-text text-muted">This is the base currency of
                                OTC.</small>
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('Taobao Currency Rate After Increase')->class('col-md-4 col-form-label
                        text-right')->for('increase_rate')}}
                        <div class="col-md-8">
                            {{html()->text('increase_rate')
                            ->class('form-control')
                            ->value(get_setting('increase_rate'))
                            ->placeholder(22.02)
                            ->attribute('aria-describedby', 'increase_rate')}}
                            <small id="increase_rate" class="form-text text-muted">Example: &nbsp; This rate will
                                multiple the CNY
                                price and 1 CNY to BDT. 13.02</small>
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('AliExpress Base Currency')->class('col-md-4 col-form-label
                        text-right')->for('ali_base_currency')}}
                        <div class="col-md-8">
                            {{html()->text('ali_base_currency', get_setting('ali_base_currency'))
                            ->class('form-control')
                            ->placeholder('Us Dollar')
                            ->disabled(true)}}
                            <small id="baseCurrency" class="form-text text-muted">This is the base currency of
                                AliExpress.</small>
                        </div> <!-- col-->
                    </div> <!-- form-group-->

                    <div class="form-group row mb-4">
                        {{html()->label('AliExpress Currency Rate After Increase')->class('col-md-4 col-form-label
                        text-right')->for('ali_increase_rate')}}
                        <div class="col-md-8">
                            {{html()->text('ali_increase_rate')
                            ->class('form-control')
                            ->value(get_setting('ali_increase_rate'))
                            ->placeholder(90)}}
                            <small id="increase_rate" class="form-text text-muted">Example: &nbsp; This rate will
                                multiple the Us Dollar
                                price and 1 Us Dollar to BDT. 87.00</small>
                        </div> <!-- col-->
                    </div> <!-- form-group-->


                    <div class="form-group row mb-4">
                        <div class="col-md-8 offset-md-4">
                            {{html()->button('Update')->class('btn btn-sm btn-success')}}
                        </div> <!-- col-->
                    </div> <!-- form-group-->
                </div> <!--  .card-body -->
            </div> <!--  .card -->
            {{ html()->form()->close() }}
        </div> <!-- .col-md-4 -->
        <div class="col-md-4">
            <div class="card mb-3">
                {{ html()->form('POST', route('admin.setting.airShippingStore'))->class('form-horizontal')->open() }}
                <div class="card-header with-border">
                    <h3 class="card-title">Price Conversion Slab (For AliExpress Only)</h3>
                </div>
                <div class="card-body">
                    <table class="table-bordered table-sm table-striped text-center">
                        <tr>
                            <th style="width: 25%">Minimum</th>
                            <th style="width: 25%">Maximum</th>
                            <th style="width: 25%">Conversion Rate($)</th>
                            <th style="width: 25%">Option</th>
                        </tr>
                        <tbody class="shippLimitBody">
                        @php
                            $pricing_slabs = json_decode(get_setting('ali_pricing_conversion')) ?? collect([]);
                        @endphp
                        @forelse($pricing_slabs as $key => $slab)
                            <tr>
                                <td>
                                    {{html()->number('ali_pricing_conversion['.$key.'][minimum]', $slab->minimum)->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('ali_pricing_conversion['.$key.'][maximum]',$slab->maximum)
                                    ->class('form-control form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    <div class="input-group input-group-sm mb-2">
                                        {{html()->number('ali_pricing_conversion['.$key.'][rate]', $slab->rate)->class('form-control')->attribute('min',0)->placeholder('Rate')}}
                                    </div>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-danger removeField">Remove
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td>
                                    {{html()->number('ali_pricing_conversion[0][minimum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Minimum')}}
                                </td>
                                <td>
                                    {{html()->number('ali_pricing_conversion[0][maximum]')->class('form-control
                                    form-control-sm')->attribute('min',0)->placeholder('Maximum')}}
                                </td>
                                <td>
                                    <div class="input-group input-group-sm mb-2">
                                        {{html()->number('ali_pricing_conversion[0][rate]', 0)->class('form-control')->attribute('min',0)->placeholder('Rate')}}
                                    </div>
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
                            <button type="button" class="btn btn-sm btn-primary addField"
                                    data-name="ali_pricing_conversion">
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
    </div> <!-- .row -->

@endsection




@push('after-scripts')
    <script>
        function limitationField(name, length) {
            return `<tr><td><input class="form-control" type="number" name="${name}[${length}][minimum]" id="minimum" placeholder="Minimum"></td><td>
                <input class="form-control form-control-sm" type="number" name="${name}[${length}][maximum]" id="maximum" placeholder="Maximum"></td>
<td>
<div class="input-group input-group-sm mb-2">
<input class="form-control" type="number" name="${name}[${length}][rate]" id="rate" placeholder="Rate">
</div>
</td>
<td><button type="button" class="btn btn-sm btn-danger removeField">Remove</button>
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

