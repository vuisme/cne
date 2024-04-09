<div class="btn-toolbar float-right" role="toolbar" aria-label="@lang('labels.general.toolbar_btn_groups')">
  @can('page.create')
  <a href="{{ route('admin.page.create') }}" class="btn btn-success ml-1" data-toggle="tooltip"
    title="@lang('labels.general.create_new')"><i class="fa fa-plus-circle"></i></a>
  @endcan
  @can('page.trashed')
  <a href="{{ route('admin.page.trashed', 'page') }}" class="btn btn-danger ml-1" data-toggle="tooltip"
    title="View Trashed"><i class="fa fa-trash-o"></i></a>
  @endcan
</div>