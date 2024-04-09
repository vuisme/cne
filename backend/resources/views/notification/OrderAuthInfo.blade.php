@component('mail::message')
# Customer Placed an Order

Customer {{$full_name}}, recently placed an order with partial payment.

@php 
$amount = floating($amount);
$needToPay = floating($needToPay);
@endphp

## Amount: {{$amount}}
## Paid: {{$needToPay}}
## Due: {{$dueForProducts ? $dueForProducts : ($amount - $needToPay)}}


@component('mail::button', ['url' => url("/admin/order/{$order_id}")])
View Order
@endcomponent

Thanks,<br>
<a href="{{url('/')}}">
  {{ config('app.name') }}
</a>
@endcomponent
