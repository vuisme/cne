<div class="btn-group">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <i class="fa fa-cog"></i>
  </button>
  <div class="dropdown-menu">
    @can('tracking.view')
      <a href="{{ $tracking->id }}" class="dropdown-item walletDetails" data-toggle="tooltip" data-placement="top" title="Show tracking details">
        View
      </a>
    @endcan
    @can('tracking.edit')
      <a href="{{ $tracking->id }}" class="dropdown-item walletMasterEdit" data-toggle="tooltip" data-placement="top" title="Edit Tracking">
        Edit Tracking
      </a>
    @endcan
    @can('tracking.delete')
      <a href="{{ route('admin.order.tracking.destroy', $tracking) }}" data-method="delete" data-trans-button-cancel="@lang('buttons.general.cancel')"
        data-trans-button-confirm="@lang('buttons.general.crud.delete')" data-trans-title="Are You Sure ?" class="dropdown-item" data-toggle="tooltip" data-placement="top"
        title="@lang('buttons.general.crud.delete')">
        <span class="text-danger">Delete Tracking</span>
      </a>
    @endcan
  </div>
</div>
