<?php

namespace App\Http\Livewire\Backend;

use App\Models\Backend\BlockWords;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class BlockWordsTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 10;
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

  public $exportFileName = 'BlockWordsTable';
  public $exports = [];

  public function query(): Builder
  {
    return BlockWords::with('user');
  }

  public function columns(): array
  {
    return [
      Column::make('#ID', 'id')
        ->searchable(),
      Column::make('Word', 'word')
        ->searchable(),
      Column::make('Sentence', 'sentence')
        ->searchable(),
      Column::make('Block Count', 'block_count')
        ->searchable(),
      Column::make('Created By', 'user.name'),
      Column::make('Created At', 'created_at')
        ->searchable()
        ->format(function (BlockWords $model) {
          return $model->created_at->diffForHumans();
        }),
      Column::make('Actions', 'action')
        ->format(function (BlockWords $model) {
          return view('backend.content.settings.block.includes.actions', ['block' => $model]);
        })
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['action', 'word', 'sentence', 'block_count'];
    if (in_array($attribute, $array)) {
      return 'text-nowrap text-center';
    }
    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['action', 'word', 'sentence', 'block_count'];
    if (in_array($attribute, $array)) {
      return 'align-middle text-center';
    }
    return 'align-middle';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
