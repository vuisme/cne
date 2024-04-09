<div class="btn-group" role="group" aria-label="@lang('labels.backend.access.users.user_actions')">
  <div class="btn-group btn-group-sm" role="group">
    <button id="userActions" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      <i class="fa fa-cog"></i>
    </button>
    <div class="dropdown-menu" aria-labelledby="userActions">
      @can('invoice.confirm.receive')
      @if($invoice->status != 'confirm_received')
      <a href="{{ route('admin.invoice.confirm.received', $invoice) }}"
        class="dropdown-item confirm_received">@lang('Confirm Received')</a>
      @endif
      @endcan
      @can('invoice.view.details')
      <a href="{{ route('admin.invoice.details', $invoice) }}" class="dropdown-item show_details">@lang('Details')</a>
      @endcan
      @can('invoice.print')
      <a href="{{ route('admin.invoice.show', $invoice) }}" class="dropdown-item printOrder">@lang('Print Invoice')</a>
      @endcan
      @can('invoice.delete')
      <a href="{{ route('admin.invoice.destroy', $invoice) }}" data-method="delete" class="dropdown-item text-danger"
        data-trans-title="@lang('Do you want to delete?')" data-trans-button-confirm="@lang('Delete')"
        data-trans-button-cancel="@lang('Cancel')">
        @lang('Delete')
      </a>
      @endcan

    </div>
  </div>
</div>