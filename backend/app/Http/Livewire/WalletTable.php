<?php

namespace App\Http\Livewire;

use App\Models\Content\OrderItem;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Str;

class WalletTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 6;
  public $perPageOptions = [6, 10, 20, 30, 50, 100, 200, 500, 1000];

  public $loadingIndicator = false;
  public $clearSearchButton = true;

  protected $options = [
    'bootstrap.classes.table' => 'table table-bordered table-hover ',
    'bootstrap.classes.thead' => null,
    'bootstrap.classes.buttons.export' => 'btn btn-info',
    'bootstrap.container' => true,
    'bootstrap.responsive' => true,
    'bootstrap.classes.responsive' => 'table-scrollable',

    'bootstrap.freeze.enable' => true,
    'bootstrap.freeze.table.columns' => 7,
  ];

  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';

  public $exportFileName = 'Customer-Wallet';
  public $exports = [];


  public $status;
  public $customer;

  public function mount($status, $customer)
  {
    $this->status = $status;
    $this->customer = $customer;
  }

  public function query(): Builder
  {
    $customer = $this->customer;
    $status = $this->status;
    $orderItem = OrderItem::with('user', 'order', 'product');
    if (is_array($status)) {
      $orderItem = count($status) > 0 ? $orderItem->whereIn('status', $status) : $orderItem;
    }
    return $customer ? $orderItem->where('user_id', $customer) : $orderItem;
  }

  public function columns(): array
  {
    return [
      Column::make('<input type="checkbox" id="allSelectCheckbox" value="id">', 'checkbox')
        ->format(function (OrderItem $model) {
          $checkbox = '<input type="checkbox" class="checkboxItem " data-status="' . $model->status . '" data-user="' . $model->user_id . '" name="wallet[]" value="' . $model->id . '">';
          return $this->html($checkbox);
        })->excludeFromExport(),
      Column::make(__('Action'), 'action')
        ->format(function (OrderItem $model) {
          return view('backend.content.wallet.includes.actions', ['wallet' => $model]);
        })
        ->excludeFromExport(),
      Column::make('Status', 'status')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="status" data-status="' . ($model->status) . '">' . ($model->status) . '</span>');
        }),
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (OrderItem $model) {
          return date('d-M-Y', strtotime($model->created_at));
        }),
      Column::make('TransactionNo.', 'order.transaction_id')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->order->transaction_id ?? 'N/A';
        }),
      Column::make('Order Number', 'item_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="item_number">' . ($model->item_number ? $model->item_number : 'N/A') . '</span>');
        }),
      Column::make('Customer', 'user.name')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->user->name ?? 'N/A';
        }),
      Column::make('Source Site',  'ProviderType')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->ProviderType ? ucfirst($model->ProviderType) : 'Unknown';
        }),
      Column::make('Shipping Method',  'shipping_type')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->shipping_type ? ucfirst($model->shipping_type) : 'Express';
        }),
      Column::make('Shipping Rate', 'shipping_rate')
        ->format(function (OrderItem $model) {
          $shipping_rate = $model->shipping_rate ? $model->shipping_rate : 0;
          $shipping_type = $model->shipping_type ? $model->shipping_type : null;
          $rate = $shipping_type === 'regular' ? 'N/A' : $shipping_rate;
          $html = '<span class="shipping_rate">' . ($rate) . '</span>';
          return $this->html($html);
        }),
      Column::make('Source Order Number', 'source_order_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="source_order_number">' . ($model->source_order_number ? $model->source_order_number : 'N/A') . '</span>');
        }),
      Column::make('TrackingNo.', 'tracking_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="tracking_number">' . ($model->tracking_number ? $model->tracking_number : 'N/A') . '</span>');
        }),
      Column::make('ProductTitle', 'Title')
        ->searchable()
        ->format(function (OrderItem $model) {
          $title = strip_tags($model->Title);
          return $this->html('<span class="product_name" data-product-id="' . $model->product_id . '" title="' . $title . '">' . Str::words($title, 6) . '</span>');
        }),
      Column::make('Source Link', '1688_link')
        ->format(function (OrderItem $model) {
          $ItemId = $model->ItemId;
          $itemLink = "https://item.taobao.com/item.htm?id={$ItemId}";
          if ($model->ProviderType == 'aliexpress') {
            $itemLink = "https://www.aliexpress.com/item/{$ItemId}.html";
          }
          $htmlHref = '<a href="' . $itemLink . '" class="btn-info btn-sm" target="_blank"><i class="fa fa-external-link"></i></a>';
          return $this->html($htmlHref);
        }),
      Column::make('Quantity', 'Quantity')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="quantity">' . $model->Quantity . '</span>');
        }),
      Column::make('ProductsValue', 'product_value')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="product_value">' . ($model->product_value ? $model->product_value : 0) . '</span>');
        }),
      Column::make('LocalDelivery', 'DeliveryCost'),
      Column::make('Coupon Value', 'coupon_contribution')
        ->format(function (OrderItem $model) {
          $coupon = $model->coupon_contribution ? $model->coupon_contribution : 0;
          return $this->html('<span class="coupon_contribution">' . $coupon . '</span>');
        }),
      Column::make('Net Product Value', 'net_product_value')
        ->format(function (OrderItem $model) {
          $product_value = $model->product_value ? $model->product_value : 0;
          $DeliveryCost = $model->DeliveryCost ? $model->DeliveryCost : 0;
          $coupon = $model->coupon_contribution ? $model->coupon_contribution : 0;
          return $this->html('<span class="net_product_value">' . ($product_value + $DeliveryCost - $coupon) . '</span>');
        }),
      Column::make('1stPayment', 'first_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="first_payment">' . ($model->first_payment ?  $model->first_payment : 0) . '</span>');
        }),
      Column::make('OutOfStock', 'out_of_stock')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="out_of_stock">' . ($model->out_of_stock ? $model->out_of_stock : 0) . '</span>');
        }),
      Column::make('Missing/Shortage', 'missing')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="missing">' . ($model->missing ? $model->missing : 0) . '</span>');
        }),
      Column::make('Lost in Transit', 'lost_in_transit')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="lost_in_transit">' . ($model->lost_in_transit ?? 0) . '</span>');
        }),
      Column::make('Refunded', 'refunded')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="refunded">' . ($model->refunded ? $model->refunded : 0) . '</span>');
        }),
      Column::make('Adjustment', 'adjustment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="adjustment">' . ($model->adjustment ? $model->adjustment : 0) . '</span>');
        }),
      Column::make('AliExpress Tax', 'customer_tax')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="customer_tax">' . ($model->customer_tax ?? 0) . '</span>');
        }),
      Column::make('Total Weight', 'actual_weight')
        ->format(function (OrderItem $model) {
          $weight = $model->actual_weight ? $model->actual_weight : 0;
          $html = '<span class="actual_weight">' . (floating($weight, 3)) . '</span>';
          return $this->html($html);
        }),
      Column::make('WeightCharges', 'weight_charges')
        ->format(function (OrderItem $model) {
          $shipping_rate = $model->shipping_rate ? $model->shipping_rate : 0;
          $weight = $model->actual_weight;
          $totalShipping = round($shipping_rate * $weight);
          $html = '<span class="weight_charges">' . ($totalShipping) . '</span>';
          return $this->html($html);
        }),
      Column::make('CourierBill', 'courier_bill')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="courier_bill">' . ($model->courier_bill ? $model->courier_bill : 0) . '</span>');
        }),
      Column::make('LastPayment', 'last_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="last_payment">' . ($model->last_payment ? $model->last_payment : 0) . '</span>');
        }),
      Column::make('Closing Balance', 'due_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="due_payment">' . ($model->due_payment ? $model->due_payment : 0) . '</span>');
        }),
      Column::make('Ref.Invoice', 'invoice_no')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="invoice_no">' . ($model->invoice_no ? $model->invoice_no : 'N/A') . '</span>');
        }),
      Column::make('Day Count', 'purchases_at')
        ->format(function (OrderItem $model) {
          $purchases_at = $model->purchases_at;
          $days = $purchases_at ? Carbon::parse($purchases_at)->diffInDays() : 0;
          $value = $days <= 1 ? $days . ' Day' : $days . ' Days';
          return $this->html('<span class="day_count text-danger">' . ($value) . '</span>');
        }),
      Column::make('Update Log', 'update_log')
        ->format(function (OrderItem $model) {
          $htmlHref = '<a href="#" class="btn btn-sm btn-info btn-block"><i class="fa fa-list"></i> Log</a>';
          return $this->html($htmlHref);
        }),
      Column::make('Comments-1', 'comment1')
        ->format(function (OrderItem $model) {
          $htmlHref = $model->comment1 ? $model->comment1 : '';
          return $this->html('<span class="comment1">' . $htmlHref . '</span>');
        }),
      Column::make('Comments-2', 'comment2')
        ->format(function (OrderItem $model) {
          $htmlHref = $model->comment2 ? $model->comment2 : '';
          return $this->html('<span class="comment2">' . $htmlHref . '</span>');
        }),
    ];
  }


  public function setTableHeadAttributes($attribute): array
  {
    if ($attribute == 'action') {
      return ['style' => 'min-width:80px;'];
    } elseif ($attribute == 'Title') {
      return ['style' => 'min-width:200px;'];
    } elseif ($attribute == 'comment1' || $attribute == 'comment2') {
      return ['style' => 'min-width:300px;'];
    }
    return [
      'style' => ''
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['id', 'created_at', 'order.transaction_id', 'order.order_number', 'user.name', 'ProviderType', 'source_order_number', 'shipping_type', 'shipping_rate', 'order_number', '1688_link', 'coupon_contribution', 'net_product_value', 'lost_in_transit', 'customer_tax', 'actual_weight', 'weight_charges', 'order_item_number', 'chinaLocalDelivery', '1688_link', 'status', 'action', 'due_payment', 'checkbox', 'purchases_at', 'update_log', 'comments1', 'comments2'];
    if (in_array($attribute, $array)) {
      $allSelect = $attribute == 'id' ? 'allSelectTitle' : '';
      return ' text-center text-nowrap' . $allSelect;
    }

    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['Title'];
    if (in_array($attribute, $array)) {
      return 'align-middle';
    }
    $array = ['id', 'created_at', 'order.transaction_id', 'order.order_number', 'user.name', 'ProviderType', 'source_order_number', 'shipping_type', 'shipping_rate', 'order_number', '1688_link', 'coupon_contribution', 'net_product_value', 'lost_in_transit', 'customer_tax', 'actual_weight', 'weight_charges', 'order_item_number', 'chinaLocalDelivery', '1688_link', 'status', 'action', 'due_payment', 'checkbox', 'purchases_at', 'update_log'];
    if (in_array($attribute, $array)) {
      return ' text-center align-middle text-nowrap';
    }
    return 'text-center align-middle';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
