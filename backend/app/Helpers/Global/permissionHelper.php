<?php




if (!function_exists('permissions_data')) {

  function permissions_data()
  {
    return [
      [
        'guard_name' => 'web',
        'name' => 'view backend',
        'description' => 'view backend',
        'sort' => 1,
        'children' => [],
      ],
      [
        'guard_name' => 'web',
        'name' => 'manage.order',
        'description' => 'Manage Orders',
        'sort' => 1,
        'children' => [
          [
            'guard_name' => 'web',
            'name' => 'recent.order.index',
            'description' => 'Show Recent Orders',
            'sort' => 1,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.edit',
            'description' => 'Recent Order Edit',
            'sort' => 2,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.show',
            'description' => 'Recent Order Details',
            'sort' => 3,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.delete',
            'description' => 'Recent Order Delete',
            'sort' => 4,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.trash',
            'description' => 'Recent Order Show Trash',
            'sort' => 5,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.generate.invoice',
            'description' => 'Recent Order Generate Invoice',
            'sort' => 6,
          ],
          [
            'guard_name' => 'web',
            'name' => 'recent.order.change.status',
            'description' => 'Recent Order Change Status',
            'sort' => 6,
          ],
        ],
      ],
      [
        'guard_name' => 'web',
        'name' => 'order.wallet',
        'description' => 'Show Wallet Data',
        'sort' => 1,
        'children' => [
          [
            'guard_name' => 'web',
            'name' => 'wallet.change.status',
            'description' => 'Wallet Change Status',
            'sort' => 1,
          ],
          [
            'guard_name' => 'web',
            'name' => 'wallet.view.details',
            'description' => 'View Wallet Details',
            'sort' => 2,
          ],
          [
            'guard_name' => 'web',
            'name' => 'wallet.generate.invoice',
            'description' => 'Wallet Generate Invoice',
            'sort' => 3,
          ],
          [
            'guard_name' => 'web',
            'name' => 'wallet.download',
            'description' => 'Wallet Download',
            'sort' => 4,
          ],
        ]
      ],
      [
        'guard_name' => 'web',
        'name' => 'invoice.index',
        'description' => 'Show Invoice Data',
        'sort' => 1,
        'children' => [
          [
            'guard_name' => 'web',
            'name' => 'invoice.confirm.receive',
            'description' => 'Invoice Confirm Receive',
            'sort' => 1,
          ],
          [
            'guard_name' => 'web',
            'name' => 'invoice.view.details',
            'description' => 'Invoice View Details',
            'sort' => 2,
          ],
          [
            'guard_name' => 'web',
            'name' => 'invoice.print',
            'description' => 'Can Print Invoice',
            'sort' => 3,
          ],
          [
            'guard_name' => 'web',
            'name' => 'invoice.delete',
            'description' => 'Can Delete Invoice',
            'sort' => 4,
          ],
          [
            'guard_name' => 'web',
            'name' => 'invoice.trashed',
            'description' => 'Show Trashed Invoices',
            'sort' => 5,
          ],
          [
            'guard_name' => 'web',
            'name' => 'invoice.export',
            'description' => 'Invoice Export',
            'sort' => 6,
          ],
        ]
      ],
      [
        'name' => 'product.index',
        'description' => 'Show Product Data',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'product.edit',
            'description' => 'Edit Product',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'product.delete',
            'description' => 'Delete Product',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'product.trashed',
            'description' => 'Show Trashed Product',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'coupon.manage',
        'description' => 'Manage Coupon',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'coupon.create',
            'description' => 'Coupon Create',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'coupon.edit',
            'description' => 'Coupon Edit',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'coupon.delete',
            'description' => 'Coupon Delete',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'coupon.trashed',
            'description' => 'Coupon Trashed',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'coupon.show.log',
            'description' => 'Show Coupon Log',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'customer.index',
        'description' => 'Customer Data Show',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'customer.edit',
            'description' => 'Customer Edit',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'customer.delete',
            'description' => 'Customer Delete',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'customer.view',
            'description' => 'Customer View Details',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'category.index',
        'description' => 'Category Data Show',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'category.create',
            'description' => 'Category Create',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'category.edit',
            'description' => 'Category Edit',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'category.delete',
            'description' => 'Category Delete',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'category.trashed',
            'description' => 'Category Trashed',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'contact.index',
        'description' => 'Contact Data Show',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => []
      ],
      [
        'name' => 'pages.index',
        'description' => 'Page Data Show',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'page.create',
            'description' => 'Page Create',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'page.edit',
            'description' => 'Page Edit',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'page.delete',
            'description' => 'Page Delete',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'page.trashed',
            'description' => 'Page Trashed',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'faq.index',
        'description' => 'FAQ Data Show',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'faq.create',
            'description' => 'FAQ Create',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'faq.edit',
            'description' => 'FAQ Edit',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'faq.delete',
            'description' => 'FAQ Delete',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'faq.trashed',
            'description' => 'FAQ Trashed',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'frontend.settings',
        'description' => 'Frontend Settings',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'frontend.top.notice',
            'description' => 'Frontend Top Notice',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'frontend.announcement',
            'description' => 'Frontend Announcement',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'frontend.banner',
            'description' => 'Frontend Banner',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'frontend.banner.right',
            'description' => 'Frontend Banner Right',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'frontend.manage.section',
            'description' => 'Frontend Manage Section',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'frontend.image.loader',
            'description' => 'Frontend loader Image',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'backend.settings',
        'description' => 'Backend Settings',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => [
          [
            'name' => 'backend.general.setting',
            'description' => 'General Setting',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.price.setting',
            'description' => 'Price Setting',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.order.setting',
            'description' => 'Order Setting',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.popup.message.setup',
            'description' => 'Popup Manage Setup',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.block.words',
            'description' => 'Backend Block Words',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.message.setting',
            'description' => 'Message Setting',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.cache.control',
            'description' => 'Backend Cache Control',
            'guard_name' => 'web',
            'sort' => 1,
          ],
          [
            'name' => 'backend.bkash.response',
            'description' => 'Backend Bkash Response',
            'guard_name' => 'web',
            'sort' => 1,
          ],
        ]
      ],
      [
        'name' => 'access.control',
        'description' => 'Operational Access Control',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => []
      ],
      [
        'name' => 'developer.log.view',
        'description' => 'Developer Log View',
        'guard_name' => 'web',
        'sort' => 1,
        'children' => []
      ]
    ];
  }
}
