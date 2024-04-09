<?php

namespace App\Http\Livewire;

use App\Models\Content\OrderItem;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class TrackingOrderTable extends TableComponent
{
    use HtmlComponents;
    /**
     * @var string
     */
    public $sortField = 'id';
    public $sortDirection = 'desc';

    public $perPage = 10;
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

    public $status;


    public function mount($status)
    {
        $this->status = $status;
    }


    public function query(): Builder
    {
        return OrderItem::with('orderTracking')
            ->whereHas('orderTracking')
            ->orderByDesc('id');
    }

    public function columns(): array
    {
        return [
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
        ];
    }


    public function setTableRowId($model): ?string
    {
        return $model->id;
    }
}
