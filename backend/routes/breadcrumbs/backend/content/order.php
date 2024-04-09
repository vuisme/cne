<?php

Breadcrumbs::for('admin.order.index', function ($trail) {
  $trail->push('Orders', route('admin.order.index'));
});

Breadcrumbs::for('admin.order.wallet', function ($trail) {
  $trail->push('Customer Wallet', route('admin.order.wallet'));
});
Breadcrumbs::for('admin.order.manage.invoice', function ($trail) {
  $trail->push('Wallet Orders', route('admin.order.manage.invoice'));
});

Breadcrumbs::for('admin.order.trashed', function ($trail) {
  $trail->parent('admin.order.index');
  $trail->push('Trashed', route('admin.order.trashed'));
});

Breadcrumbs::for('admin.order.create', function ($trail) {
  $trail->parent('admin.order.index');
  $trail->push('Create Order', route('admin.order.create'));
});

Breadcrumbs::for('admin.order.edit', function ($trail, $id) {
  $trail->parent('admin.order.index');
  $trail->push('Edit Order', route('admin.order.edit', $id));
});

Breadcrumbs::for('admin.order.show', function ($trail, $id) {
  $trail->parent('admin.order.index');
  $trail->push('Show Order Details', route('admin.order.show', $id));
});


Breadcrumbs::for('admin.order.wallet.index', function ($trail) {
  $trail->push('Wallet', route('admin.order.wallet.index'));
});

Breadcrumbs::for('admin.order.tracking.index', function ($trail) {
  $trail->push('Tracking', route('admin.order.tracking.index'));
});
