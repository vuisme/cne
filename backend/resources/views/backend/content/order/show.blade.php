@php
$currency = currency_icon();
@endphp
@extends('backend.layouts.app')

@section('title', ' Package Management | Edit page')

@section('content')
<main class="container-fluid">
  <div class="row">
    <div class="col-sm-12">

      <div class="card my-3">
        <div class="card-header">
          <h4 class="my-2">@lang('Order Details') #{{$order->order_number}}</h4>
        </div> <!-- card-header -->
        <div class="card-body pb-0">
          <div class="row">
            <div class="col-sm-6">
              <table class="table table-bordered table-sm">
                <tr>
                  <th colspan="2" class="text-center">Customer Details</th>
                </tr>
                <tr>
                  <td>Transaction Id#</td>
                  <td>{{$order->transaction_id}}</td>
                </tr>
                <tr>
                  <td>Customer Name</td>
                  <td>{{ $order->name ?? 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Customer Phone</td>
                  <td>{{ $order->phone ?? 'N/A' }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6">
              <table class="table table-bordered table-sm">
                <tr>
                  <th colspan="2" class="text-center">Shipping Details</th>
                </tr>
                @php
                $address = json_decode($order->shipping) ?? null;
                @endphp
                <tr>
                  <td style="width: 50%">Shipping Name</td>
                  <td>{{ $address ? $address->name : 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{{ $address->phone ?? 'N/A' }}</td>
                </tr>
                <tr>
                  <td>District</td>
                  <td>{{ $address->city ?? 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{{ $address->address ?? 'N/A' }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="card-body pt-0">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="text-center">SL</th>
                  <th class="text-center" style="width: 130px;">#</th>
                  <th class="text-center">Details</th>
                  <th class="text-center" style="width:80px">Quantity</th>
                  <th class="text-center" style="width:100px">Total</th>
                </tr>
              </thead>
              <tbody>
                @foreach ($order->orderItems as $item)
                <tr>
                  <td class="text-center  align-middle" rowspan="{{$item->itemVariations->count() + 3}}">
                    {{$loop->iteration}}
                  </td>
                  <td class="text-left" colspan="4">
                    @php
                    $Title =$item->Title;
                    $ItemId =$item->ItemId;
                    $ProviderType =$item->ProviderType;
                    $shipping_rate =$item->shipping_rate;
                    $shipping_type =$item->shipping_type;
                    $itemLink = ($ProviderType == 'aliexpress') ? "https://www.aliexpress.com/item/{$ItemId}.html" :
                    "https://item.taobao.com/item.htm?id={$ItemId}";
                    $interNalLink = ($ProviderType == 'aliexpress') ?
                    "https://www.chinaexpress.com.bd/aliexpress/product/{$ItemId}" :
                    "https://www.chinaexpress.com.bd/product/{$ItemId}";
                    @endphp
                    <a href="{{$interNalLink}}" target="_blank">{{strip_tags($Title)}}</a> <br>
                    <p class="m-0"><b>Product Id : </b> <span class="ml-2">{{$ItemId}}</span></p>
                    <p class="m-0"><b>Source:</b><span class="ml-2">{{$ProviderType}}</span> </p>
                    <p class="m-0"><b>Shipping Type:</b> <span class="text-danger ml-2">
                        {{$shipping_type == 'regular' ? 'Regular' : 'Express'}}</span>
                    </p>
                    @if ($shipping_type != 'regular')
                    <p class="m-0"><b>Express Shipping Rate:</b> <span class="text-danger ml-2">
                        {{$shipping_rate ? $shipping_rate : 0}} Per KG</span>
                    </p>
                    @endif
                    <p class="m-0"><b>Source Link:</b> <a href="{{$itemLink}}" class="ml-2" target="_blank"> Click
                        Here</a></p>
                    <p class="m-0"><b>Item/Wallet Number:</b> {{$item->item_number}}</p>
                  </td>
                </tr>
                @php
                $itemTotalPrice = 0;
                @endphp
                @foreach($item->itemVariations as $variationKey => $variation)
                @php
                $attributes = json_decode($variation->attributes, true);
                $DeliveryCost = $item->DeliveryCost;
                $product_value = $item->product_value;
                $product_total = ($product_value + $DeliveryCost);
                @endphp
                <tr>
                  <td class="align-middle text-center p-1">
                    @php
                    $img = check_attribute_image($attributes, $item->MainPictureUrl);
                    @endphp
                    <img src="{{asset($img)}}" class="img-fluid">
                  </td>
                  <td>
                    @forelse ($attributes as $attribute)
                    @php
                    $PropertyName = $attribute['PropertyName'] ?? 'Unknown';
                    $Value = $attribute['ValueAlias'] ?? $attribute['Value'] ?? 'Unknown';
                    @endphp
                    <p class="m-0"><b>{!! $PropertyName !!}:</b> {!! $Value !!}</p>
                    @empty
                    <p class="m-0">No Attributes</p>
                    @endforelse
                    <p class="m-0"><b>Price:</b> {{$variation->price}}</p>
                  </td>
                  <td class="text-center align-middle"> {{$variation->qty}}</td>
                  <td class="text-right align-middle">{{$variation->subTotal}}</td>
                </tr>
                @endforeach
                <tr>
                  <td class="text-right align-middle" colspan="3">
                    @if ($shipping_type == 'regular')
                    China to BD Shipping Charge
                    @else
                    China Local Shipping
                    @endif
                  </td>
                  <td class="text-right align-middle">{{$DeliveryCost}}</td>
                </tr>
                <tr>
                  <td class="text-right" colspan="3">Product Total</td>
                  <td class="text-right">{{$product_total}}</td>
                </tr>
                @endforeach
                @php                    
                $firstPayment = $order->orderItems->sum('first_payment');
                $duePayment = $order->orderItems->sum('due_payment');
                $invoiceTotal = ($order->orderItems->sum('product_value') + $order->orderItems->sum('DeliveryCost'));
                @endphp
                <tr>
                  <td class="text-right" colspan="4">Order Total</td>
                  <td class="text-right">{{$invoiceTotal}}</td>
                </tr>
                @if ($order->coupon_victory)
                <tr>
                  <td class="text-right" colspan="4">Coupon</td>
                  <td class="text-right">{{$order->orderItems->sum('coupon_contribution')}}</td>
                </tr>
                @endif
                <tr>
                  @php
                  $percent = ($firstPayment / $invoiceTotal) * 100;
                  @endphp
                  <td class="text-right" colspan="4">Initial Payment ({{round($percent)}}%)</td>
                  <td class="text-right">{{$firstPayment}}</td>
                </tr>
                <tr>
                  <td class="text-right text-danger" colspan="4">Due After Calculate</td>
                  <td class="text-right text-danger">{{$duePayment}}</td>
                </tr>
              </tbody>
            </table>


          </div>
        </div> <!-- card-body -->
      </div> <!-- card -->

    </div>
  </div>
</main>

@endsection