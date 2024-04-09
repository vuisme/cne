<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Http\Services\Api\Backend\ApiInvoiceService;
use App\Http\Services\Api\Backend\ApiWalletService;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\InvoiceItem;
use App\Models\Content\OrderItem;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ApiInvoiceController extends Controller
{

    public $invoiceService;

    public function __construct(ApiInvoiceService $apiInvoiceService)
    {
        $this->invoiceService = $apiInvoiceService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Factory|View
     */
    public function index(Request $request)
    {
        $data = $this->invoiceService->list($request);
        return response($data);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $status = $this->invoiceService->store($request);
        return response($status);
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
        foreach ($invoice->invoiceItems as $invoice_item) {
            $order_item_id = $invoice_item->order_item_id;
            $OrderItem = OrderItem::find($order_item_id);

            if ($OrderItem->status == 'on-transit-to-customer') {
                $OrderItem->update([
                    'invoice_no' => $invoice->invoice_no,
                    'last_payment' => $invoice_item->total_due,
                    'due_payment' => 0,
                    'status' => 'delivered',
                ]);
            } else {
                $OrderItem->update([
                    'invoice_no' => $invoice->invoice_no,
                    'last_payment' => $invoice_item->total_due,
                    'due_payment' => 0,
                    'status' => 'adjusted',
                ]);
            }
        }
        $invoice->status = 'confirm_received';
        $invoice->save();

        return redirect()->back()->withFlashSuccess('Invoice Confirm Received Successfully');
    }
}
