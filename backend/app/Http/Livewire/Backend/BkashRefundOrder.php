<?php

namespace App\Http\Livewire\Backend;

use App\Models\Content\Order;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class BkashRefundOrder extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 15;
  public $perPageOptions = [];
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

  public function query(): Builder
  {
    return Order::with('user')->where('payment_method', 'bkash');
  }

  public function columns(): array
  {
    return [
      Column::make('#ID', 'id')
        ->searchable(),
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (Order $model) {
          return date('d-M-Y', strtotime($model->created_at));
        }),
      Column::make('OrderNumber', 'order_number')
        ->searchable(),
      Column::make('Transaction No', 'transaction_id')
        ->searchable(),
      Column::make('Customer', 'name')
        ->searchable(),
      Column::make('Amount', 'amount')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->amount);
        }),
      Column::make('1stPayment', 'needToPay')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->needToPay);
        }),
      Column::make('paymentID', 'bkash_payment_id')
        ->searchable(),
      Column::make('trxID', 'bkash_trx_id')
        ->searchable(),
      Column::make('Status', 'status')
        ->searchable(),
      Column::make('Actions', 'action')
        ->format(function (Order $model) {
          return view('backend.content.bkash.includes.actions', ['order' => $model]);
        })
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['action', 'status', 'dueForProducts', 'needToPay', 'amount', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return ' text-center';
    }
    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['action', 'status', 'dueForProducts', 'needToPay', 'amount', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return 'text-center align-middle';
    }
    return 'align-middle';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
