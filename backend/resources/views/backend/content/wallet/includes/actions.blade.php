<div class="btn-group">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <i class="fa fa-cog"></i>
  </button>
  <div class="dropdown-menu">
    @can('wallet.view.details')
      <a href="{{ $wallet->id }}" class="dropdown-item walletDetails" data-toggle="tooltip" data-placement="top" title="wallet details">
        View
      </a>
    @endcan
    @can('wallet.change.status')
      <a href="{{ $wallet->id }}" class="dropdown-item changeWalletStatus" data-toggle="tooltip" data-placement="top" title="Change Status">
        Change Status
      </a>
    @endcan
    @can('wallet.tracking.update')
      <a href="{{ route('admin.order.tracking.show', $wallet) }}" class="dropdown-item showTrackingUpdate">
        Show Tracking
      </a>
    @endcan
    @can('wallet.comment.one')
      <a href="{{ route('admin.order.wallet.comments', $wallet) }}" class="dropdown-item walletCommentButton" data-comment="one">
        Add Comments One
      </a>
    @endcan
    @can('wallet.comment.two')
      <a href="{{ route('admin.order.wallet.comments', $wallet) }}" class="dropdown-item walletCommentButton" data-comment="two">
        Add Comments Two
      </a>
    @endcan
    @can('wallet.master.edit')
      <a href="{{ $wallet->id }}" class="dropdown-item walletMasterEdit" data-toggle="tooltip" data-placement="top" title="Edit wallet">
        Master Edit
      </a>
    @endcan
    @can('recent.order.delete')
      <a href="{{ route('admin.order.wallet.destroy', $wallet) }}" data-method="delete" data-trans-button-cancel="@lang('buttons.general.cancel')"
        data-trans-button-confirm="@lang('buttons.general.crud.delete')" data-trans-title="Are You Sure ?" class="dropdown-item" data-toggle="tooltip" data-placement="top"
        title="@lang('buttons.general.crud.delete')">
        <span class="text-danger">Delete Item</span>
      </a>
    @endcan
  </div>
</div>
