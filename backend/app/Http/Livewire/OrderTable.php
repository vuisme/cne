<?php

namespace App\Http\Livewire;

use App\Models\Content\Order;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class OrderTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 20;
  public $perPageOptions = [10, 20, 50, 100, 150];
  public $loadingIndicator = true;

  protected $options = [
    'bootstrap.classes.table' => 'table table-bordered table-hover',
    'bootstrap.classes.thead' => null,
    'bootstrap.classes.buttons.export' => 'btn btn-info',
    'bootstrap.container' => true,
    'bootstrap.responsive' => true,
  ];

  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';

  public $exportFileName = 'Order-table';
  public $exports = [];

  public $status  = null;

  public function mount($status)
  {
    $this->status = $status;
  }

  public function query(): Builder
  {
    $order =  Order::with(['user', 'orderItems']);
    $status = $this->status;
    if ($status) {
      if ($status == 'trashed') {
        $order->onlyTrashed();
      } else {
        $order->where('status', $status);
      }
    }
    return $order;
  }

  public function columns(): array
  {
    return [
      Column::make('<input type="checkbox" id="allSelectCheckbox">', 'checkbox')
        ->format(function (Order $model) {
          $checkbox = '<input type="checkbox" class="checkboxItem " data-status="' . $model->status . '" data-user="' . $model->user_id . '" name="wallet[]" value="' . $model->id . '">';
          return $this->html($checkbox);
        })->excludeFromExport(),
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (Order $model) {
          return date('d-m-Y', strtotime($model->created_at));
        }),
      Column::make('Order Number', 'order_number')
        ->searchable(),
      Column::make('Transaction Number', 'transaction_id')
        ->searchable(),
      Column::make('Customer Name', 'user.name')
        ->searchable()
        ->format(function (Order $model) {
          return $model->user ? $model->user->name : 'Unknown';
        }),
      Column::make('Customer Phone', 'user.phone')
        ->searchable(),
      Column::make('Amount', 'amount')
        ->format(function (Order $model) {
          $product_value = $model->orderItems->sum('product_value');
          $DeliveryCost = $model->orderItems->sum('DeliveryCost');

          return '৳ ' . floating($product_value + $DeliveryCost);
        }),
      Column::make('Coupon', 'coupon_victory')
        ->format(function (Order $model) {
          return '৳ ' . floating($model->orderItems->sum('coupon_contribution'));
        }),
      Column::make('Initial Payment', 'first_payment')
        ->searchable(function ($builder, $term) {
          return $builder->orWhereHas('orderItems', function ($query) use ($term) {
            return $query->where('first_payment', $term);
          });
        })
        ->format(function (Order $model) {
          return '৳ ' . floating($model->orderItems->sum('first_payment'));
        }),
      Column::make('Due', 'due_payment')
        ->searchable(function ($builder, $term) {
          return $builder->orWhereHas('orderItems', function ($query) use ($term) {
            return $query->where('due_payment', $term);
          });
        })
        ->format(function (Order $model) {
          return '৳ ' . floating($model->orderItems->sum('due_payment'));
        }),
      Column::make('Payment Method', 'payment_method')
        ->searchable(),
      Column::make('Status', 'status')
        ->searchable(),
      Column::make('Action', 'action')
        ->format(function (Order $model) {
          $status = $this->status;
          if ($status == 'trashed') {
            return view('backend.content.order.includes.actions-trash', ['order' => $model]);
          }
          return view('backend.content.order.includes.actions', ['order' => $model]);
        })
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['action', 'status', 'order_number', 'payment_method', 'dueForProducts', 'needToPay', 'dueForProducts', 'coupon_victory', 'amount', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return ' text-center  align-middle';
    }
    return $attribute . '  align-middle';
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['action', 'status', 'order_number', 'payment_method', 'dueForProducts', 'needToPay', 'dueForProducts', 'coupon_victory', 'amount', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return 'text-center align-middle  text-nowrap';
    }
    return 'align-middle text-nowrap';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
