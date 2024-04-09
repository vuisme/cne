<?php

namespace App\Http\Controllers\Backend;

use App\Exports\InvoicesExport;
use App\Exports\OrdersExport;
use App\Exports\WalletsExport;
use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Models\Content\CartItem;
use App\Models\Content\CartItemVariation;
use App\Models\Content\Invoice;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use App\Notifications\PushNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Class DashboardController.
 */
class DashboardController extends Controller
{

  public function customerCartReset()
  {
    DB::beginTransaction();
    try {
      CartItem::where('created_at', '<', now()->subHours(48))->delete();
      CartItemVariation::where('created_at', '<', now()->subHours(48))->delete();
      DB::commit(); // all good
    } catch (\Exception $e) {
      DB::rollback(); // something went wrong
    }
  }


  /**
   * @return \Illuminate\View\View
   */
  public function index()
  {
    $this->customerCartReset();
    return view('backend.dashboard');
  }



  public function export($table)
  {
    $export = null;
    if ($table == 'orders') {
      return Excel::download(new OrdersExport(), 'order-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    } elseif ($table == 'order_item') {
      return Excel::download(new WalletsExport(), 'wallet-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    } elseif ($table == 'invoices') {
      return Excel::download(new InvoicesExport(), 'invoices-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    }
    return redirect()->back()->withFlashDanger('File export fail');
  }


  public function quickReportData()
  {
    $startDate = request('startDate');
    $startDate = $startDate ? Carbon::parse($startDate)->startOfDay()->toDateTimeString() : null;
    $endDate = request('endDate');
    $endDate = $endDate ? Carbon::parse($endDate)->endOfDay()->toDateTimeString() : null;

    if (!$startDate && !$endDate) {
      return [];
    }

    $orders = OrderItem::whereNotIn('status', ['waiting-for-payment'])->whereBetween('created_at', [$startDate, $endDate]);

    $product_value = $orders->sum('product_value');
    $DeliveryCost = $orders->sum('DeliveryCost');
    $product_value = ($product_value + $DeliveryCost);

    $first_payment = $orders->sum('first_payment');
    $customer_due = $orders->sum('due_payment');
    $refunded = $orders->sum('refunded');
    $stock_value = OrderItem::where('status', 'received-in-BD-warehouse')->whereBetween('created_at', [$startDate, $endDate])->sum('product_value');

    $express = OrderItem::whereNotIn('shipping_type', ['regular'])->whereBetween('created_at', [$startDate, $endDate]);
    $shipping_rate = $express->sum('shipping_rate');
    $weight = $express->sum('weight');
    $express_count = $express->count();
    $shipping_rate = ($shipping_rate / ($express_count ? $express_count : 1));

    $invoice = Invoice::whereBetween('created_at', [$startDate, $endDate]);
    $invoice_count = $invoice->count();
    $courier_charge = $invoice->sum('total_courier');

    return response([
      'product_value' => $product_value,
      'first_payment' => $first_payment,
      'customer_due' => $customer_due,
      'weight' => floating($weight, 3),
      'refunded' => $refunded,
      'stock_value' => $stock_value,
      'shipping_rate' => round($shipping_rate),
      'invoice_count' => $invoice_count,
      'courier_charge' => $courier_charge,
    ]);
  }
}
