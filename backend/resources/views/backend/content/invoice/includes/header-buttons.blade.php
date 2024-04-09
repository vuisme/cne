<div class="btn-group float-right" role="toolbar" aria-label="@lang('labels.general.toolbar_btn_groups')">
  @can('invoice.export')
  <a href="{{ route('admin.export', 'invoices') }}" class="btn btn-warning" data-toggle="tooltip" title="Full Export">
    <i class="fa fa-download"></i> Export
  </a>
  @endcan
  @can('invoice.trashed')
  <a href="{{ route('admin.invoice.trashed') }}" class="btn btn-danger" data-toggle="tooltip" title="Trashed Invoice">
    <i class="fa fa-trash"></i>
  </a>
  @endcan
</div>