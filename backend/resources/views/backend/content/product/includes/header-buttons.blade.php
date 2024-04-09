@can('product.trashed')
<div class="btn-toolbar float-right" role="toolbar" aria-label="@lang('labels.general.toolbar_btn_groups')">
  @if(request('status') == 'trashed')
  <a href="{{ route('admin.product.index') }}" class="btn btn-outline-primary" data-toggle="tooltip"
    title="Back to all products">All Products</a>
  @else
  <a href="{{ route('admin.product.index',['status' => 'trashed']) }}" class="btn btn-outline-danger" data-toggle="tooltip"
    title="View Trashed"><i class="fa fa-trash-o"></i> Trashed Products</a>
  @endif
</div>
@endcan