<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\InvoiceItem;
use App\Models\Content\OrderItem;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InvoiceController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return Factory|View
   */
  public function index()
  {
    return view('backend.content.invoice.index');
  }


  /**
   * Store a newly created resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function store(Request $request)
  {
    $invoices = json_decode(request('invoices'), true);
    $related = json_decode(request('related'), true);
    $status = false;
    if (!empty($related)) {
      $user_id = $related['user_id'];
      $isNotify = $related['isNotify'];
      $courier_bill = $related['courier_bill'];
      $payment_method = $related['payment_method'];
      $delivery_method = $related['delivery_method'];
      $user = User::with('shipping')->find($user_id);
      $invoice = Invoice::create([
        // 'transaction_id' => uniqid('SSL'),
        'customer_name' => $user->full_name,
        'customer_phone' => $user->phone,
        'customer_address' => json_encode($user->shipping),
        'total_payable' => $related['total_payable'],
        'total_courier' => $courier_bill,
        'payment_method' => $payment_method,
        'delivery_method' => $delivery_method,
        'total_due' => $related['total_due'],
        'status' => 'Pending',
        'user_id' => $user_id,
      ]);

      $invoice->update([
        'invoice_no' => generate_order_number($invoice->id, 4),
      ]);

      $item_ids = [];

      if (!empty($invoices)) {
        foreach ($invoices as $item) {
          array_push($item_ids, $item['id']);

          if ($item['status'] == 'received-in-BD-warehouse') {
            $invoice_status = 'on-transit-to-customer';
          } else {
            $invoice_status = $item['status'];
          }
          InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'order_item_id' => $item['id'],
            'order_item_number' => $item['order_item_number'],
            'product_id' => $item['product_id'],
            'product_name' => $item['product_name'],
            'weight' => $item['actual_weight'],
            'total_due' => $item['due_payment'],
            'user_id' => $user_id,
          ]);
          if ($isNotify) {
            generate_customer_notifications('on-transit-to-customer', $user, $item['order_item_number'], $item['due_payment'], "");
          }
        }
      }
      $total_invoices = is_array($invoices) ? count($invoices) : 0;
      $courier_bill = $courier_bill > 0 & $total_invoices > 0 ? $courier_bill / $total_invoices : 0;
      $orderItem = null;
      foreach ($item_ids as $item_id) {
        $orderItem = OrderItem::find($item_id);
        if ($orderItem) {
          if ($orderItem->status == 'received-in-BD-warehouse') {
            $order_item_status = 'on-transit-to-customer';
            (new TrackingService())->updateTracking($item_id, $order_item_status);
          } else {
            $order_item_status = $orderItem->status;
          }
          $orderItem->update([
            'courier_bill' => floating($courier_bill, 2),
            'status' => $order_item_status
          ]);
        }
      }

      $status = $orderItem ? true : false;
    }

    return response()->json(['status' => $status]);
  }

  /**
   * Display the specified resource.
   *
   * @param Invoice $invoice
   * @return Factory|View
   */
  public function show(Invoice $invoice)
  {
    return view('backend.content.invoice.show', compact('invoice'));
  }

  /**
   * Display the specified resource.
   *
   * @param Invoice $invoice
   * @return Factory|View
   */
  public function details(Invoice $invoice)
  {
    return view('backend.content.invoice.details', compact('invoice'));
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function edit(Invoice $invoice)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param \Illuminate\Http\Request $request
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Invoice $invoice)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param Invoice $invoice
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    $invoice = Invoice::withTrashed()->findOrFail($id);
    if ($invoice->trashed()) {
      $invoice->forceDelete();
      return redirect()->route('admin.invoice.index')->withFlashSuccess('Permanent Deleted Successfully');
    } else if ($invoice->delete()) {
      return redirect()->route('admin.invoice.index')->withFlashSuccess('Trashed Successfully');
    }
    return redirect()->route('admin.invoice.index')->withFlashSuccess('Delete failed');
  }

  public function trashed()
  {
    $invoices = Invoice::onlyTrashed()->orderByDesc('created_at')->paginate(10);
    return view('backend.content.invoice.trash', compact('invoices'));
  }

  public function restore($id)
  {
    Invoice::onlyTrashed()->findOrFail($id)->restore();
    return redirect()->route('admin.invoice.index')->withFlashSuccess('Invoice Recovered Successfully');
  }


  public function confirm_received($id)
  {
    $invoice = Invoice::with('invoiceItems')->find($id);
    if (!$invoice) {
      return redirect()->back()->withFlashError('Invoice status not changed');
    }
    $wallet_items = OrderItem::whereIn('id', $invoice->invoiceItems->pluck('order_item_id')->toArray())
      ->get();
    foreach ($wallet_items as $OrderItem) {
      (new TrackingService())->updateTracking($OrderItem->id, 'delivered');
    }
    $invoice->status = 'confirm_received';
    $invoice->save();

    return redirect()->back()->withFlashSuccess('Invoice Confirm Received Successfully');
  }
}
