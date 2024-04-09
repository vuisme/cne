<?php

namespace App\Repositories\Frontend;

use App\Models\Content\Invoice;
use App\Models\Content\InvoiceItem;
use App\Models\Content\Product;
use Illuminate\Http\Request;

/**
 * Class DashboardRepository.
 */
class DashboardRepository
{

  public function getCustomerInvoices(Request $request)
  {
    $user_id = auth()->id();
    if (!$user_id) {
      return [];
    }

    $page = request('page', 1);
    $limit = request('limit', 15);
    $page = $page > 0 ? ($page - 1) : 0;
    $offset = $page * $limit;

    $invoice = Invoice::where('user_id', $user_id);
    $data['totalPage'] = round($invoice->count() / $limit);
    $invoices = $invoice->latest()->offset($offset)->limit($limit)->get();
    $data['invoices'] = json_encode($invoices);
    return $data;
  }

  public function getCustomerInvoiceDetails(Request $request, $invoice_no)
  {
    $user_id = auth()->id();
    if (!$user_id) {
      return ['invoice' => []];
    }
    $invoice = Invoice::with(['invoiceItems' => function ($items) {
      $items->with(['order_item' => function ($variations) {
        $variations->with('itemVariations');
      }]);
    }])
      ->where('user_id', $user_id)
      ->where('invoice_no', $invoice_no)
      ->first();
    $data['invoice'] = $invoice ? json_encode($invoice) : [];
    return $data;
  }
}
