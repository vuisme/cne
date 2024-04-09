<?php

namespace App\Traits;

use App\Models\Auth\User;
use App\Models\Content\Cart;
use App\Models\Content\CartItem;
use App\Models\Content\CartItemVariation;
use App\Models\Content\Coupon;
use App\Models\Content\CouponUser;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

trait CartOperation
{

    public function cart_uid()
    {
        $cart_uid = request('token', null);
        return $cart_uid ? $cart_uid : Str::random(60);
    }

    public function get_pure_cart($cart_id)
    {
        return Cart::with(['cartItems' => function ($query) {
            $query->with('variations')->withCount('variations');
        }])
            ->withCount('variations')
            ->whereNull('is_purchase')
            ->where('id', $cart_id)
            ->first();
    }

    public function get_customer_cart($cart_uid = null)
    {
        $cart_uid = $cart_uid ? $cart_uid : $this->cart_uid();
        $auth_check = auth('sanctum')->check();
        $cart = Cart::whereNull('is_purchase')
            ->where('cart_uid', $cart_uid)
            ->orderByDesc('id')
            ->get();
        if ($cart->isEmpty() && $auth_check) {
            $cart = Cart::whereNull('is_purchase')
                ->where('user_id', auth('sanctum')->id())
                ->orderByDesc('id')
                ->get();
        }

        if ($cart->isEmpty()) {
            return [];
        }

        $first = $cart->first();

        if ($cart->count() > 1) {
            foreach ($cart as $item) {
                if ($first->id !== $item->id) {
                    CartItem::where('cart_id', $item->id)
                        ->update([
                            'cart_id' => $first->id,
                        ]);
                    CartItemVariation::where('cart_id', $item->id)
                        ->update([
                            'cart_id' => $first->id,
                        ]);
                    $item->update(['is_purchase' => 1]);
                }
            }
        }

        $cart = $this->get_pure_cart($first->id);

        if ($auth_check) {
            $auth_id = auth('sanctum')->id();
            $shipping = User::with('shipping')->find($auth_id);
            $shipping = $shipping->shipping ? json_encode($shipping->shipping) : null;
            $cart->update([
                'payment_method' => 'bkash',
                'shipping' => $shipping,
                'user_id' => $auth_id
            ]);
        }
        if ($cart) {
            if (!$cart->cart_uid || $cart->cart_uid == 'null') {
                $cart_random_uid = Str::random(60);
                $cart->update([
                    'cart_uid' => $cart_random_uid
                ]);
            }
        }

        return $cart;
    }

    public function get_checkout_cart()
    {
        $cart = $this->get_customer_cart();
        $cart_id = null;
        if ($cart) {
            $cart_id = $cart->id;
            $cartItems = $cart->cartItems;
            foreach ($cartItems as $item) {
                if (!$item->IsCart) {
                    $variations = $item->variations->pluck('id');
                    CartItemVariation::whereIn('id', $variations)->delete();
                    CartItem::where('id', $item->id)->delete();
                } else {
                    $variation_count = $item->variations->count();
                    if (!$variation_count) {
                        CartItem::where('id', $item->id)->delete();
                    }
                }
            }
        }
        return $this->get_pure_cart($cart_id);
    }

    public function add_to_cart($product)
    {
        $cart_uid = $this->cart_uid();
        $user = auth()->user();
        $user_id = $user->id ?? null;
        $shipping = $user->shipping ?? [];
        $cart = $this->get_customer_cart();
        if (!$cart) {
            $cart = new Cart();
            $cart->cart_uid = $cart_uid;
            $cart->user_id = $user_id;
            $cart->shipping = json_encode($shipping);
            $cart->status = 'new';
            $cart->save();
        }
        if (!$cart) {
            return [];
        }
        $cart_id = $cart->id;
        $ItemId = $product['Id'] ?? null;
        $ProviderType = $product['ProviderType'] ?? null;
        $CartItem = null;
        if ($cart_id) {
            $CartItem = CartItem::where('cart_id', $cart_id)->where('ItemId', $ItemId)->first();
            if (!$CartItem) {
                $CartItem = new CartItem();
                $CartItem->cart_id = $cart_id;
                $CartItem->ItemId = $ItemId;
            }
            $CartItem->Title = $product['Title'] ?? null;
            $CartItem->ProviderType = $ProviderType;
            $CartItem->ItemMainUrl = $product['TaobaoItemUrl'] ?? null;
            $CartItem->MainPictureUrl = $product['MainPictureUrl'] ?? null;
            $CartItem->MasterQuantity = $product['MasterQuantity'] ?? null;
            $CartItem->FirstLotQuantity = $product['FirstLotQuantity'] ?? null;
            $CartItem->NextLotQuantity = $product['NextLotQuantity'] ?? null;
            $CartItem->ProductPrice = $product['Price'] ?? null;
            $CartItem->weight = $product['weight'] ?? null;
            $CartItem->shipping_type = $product['shipping_type'] ?? null;
            $CartItem->DeliveryCost = $product['DeliveryCost'] ?? null;
            $CartItem->Quantity = $product['Quantity'] ?? null;
            $CartItem->hasConfigurators = $product['hasConfigurators'] ?? null;
            $CartItem->is_checked = $product['IsCart'] ?? null;
            $CartItem->save();
        }

        $ConfiguredItem = $product['ConfiguredItems'] ?? [];
        if (is_array($ConfiguredItem) && !empty($ConfiguredItem) && $CartItem) {
            $cart_item_id = $CartItem->id;
            $configId = $ConfiguredItem['Id'] ?? null;
            $variation = CartItemVariation::where('cart_item_id', $cart_item_id)
                ->where('cart_id', $cart_id)
                ->where('configId', $configId)
                ->first();
            if (!$variation) {
                $variation = new CartItemVariation();
                $variation->cart_item_id = $cart_item_id;
                $variation->cart_id = $cart_id;
                $variation->configId = $configId;
            }
            $variation->attributes = json_encode($ConfiguredItem['Attributes'] ?? []);
            $variation->maxQuantity = $ConfiguredItem['maxQuantity'] ?? null;
            $variation->price = $ConfiguredItem['price'] ?? null;
            $variation->qty = $ConfiguredItem['qty'] ?? null;
            $variation->save();
        }
        if ($CartItem) {
            $this->shippingCalculate($CartItem);
        }

        return $this->get_pure_cart($cart->id);
    }


    private function shippingCalculate($item, $process = [])
    {
        $variations = $item->variations ?? [];
        $totalQty = 0;
        $totalPrice = 0;
        foreach ($variations as $variation) {
            $totalQty += $variation->qty;
            $totalPrice += $variation->qty * $variation->price;
        }
        $ship_type = $item ? $item->shipping_type : null;
        $ProviderType = $item ? $item->ProviderType : null;
        $shipping_type = getArrayKeyData($process, 'shipping_type', $ship_type);

        if ($ProviderType == 'aliexpress') {
            if ($shipping_type == 'express') {
                $totalQty = $variations->sum('qty');
                $weight = $totalQty * $item->weight;
                $aliTotal = get_setting('express_shipping_min_value');
                $process['DeliveryCost'] = get_aliExpress_shipping($weight);
                if ($totalPrice < $aliTotal) {
                    // $process['shipping_type'] = null;
                    $process['DeliveryCost'] = 0;
                }
                $process['shipping_rate'] = get_aliExpress_air_shipping_rate($variations);
            } elseif ($shipping_type == 'regular') {
                $prevDelCost = $item ? $item->DeliveryCost : 0;
                $delCost = request('shipping_cost', $prevDelCost);
                $process['DeliveryCost'] = $delCost;
            }
        } else {
            $process['shipping_rate'] = get_aliExpress_air_shipping_rate($variations, 'taobao');
        }
        if (!empty($process) && $item) {
            $item->update($process);
        }
        return $process;
    }

    public function update_cart()
    {
        $item_id = request('item_id');
        $variation_id = request('variation_id');
        $qty = request('qty');

        $cart = $this->get_customer_cart();
        if (!$cart) {
            return [];
        }

        if ($variation_id) {
            if ($qty > 0) {
                CartItemVariation::where('id', $variation_id)->update(['qty' => $qty]);
            } else {
                CartItemVariation::where('id', $variation_id)->delete();
            }
        }
        $item = CartItem::with('variations')->where('id', $item_id)->first();
        if ($item) {
            $variationQty = CartItemVariation::where('cart_item_id', $item_id)->sum('qty');
            if ($variationQty > 0) {
                $item->update(['Quantity' => $variationQty]);
            } else {
                $item->delete();
            }
            $this->shippingCalculate($item);
        }

        return $this->get_pure_cart($cart->id);
    }


    public function update_checkout_cart()
    {
        $item_id = request('item_id');
        $variation_id = request('variation_id');
        $qty = request('qty');
        $cart = $this->get_customer_cart();
        if (!$cart) {
            return [];
        }
        if ($variation_id) {
            if ($qty > 0) {
                CartItemVariation::where('id', $variation_id)->update(['qty' => $qty]);
            } else {
                CartItemVariation::where('id', $variation_id)->delete();
            }
        }
        $item = CartItem::with('variations')->where('id', $item_id)->first();
        if ($item) {
            $variations = CartItemVariation::where('cart_item_id', $item_id)->get();
            if ($variations->isEmpty()) {
                $process['DeliveryCost'] = null;
                $process['shipping_rate'] = null;
                $item->delete();
            } else {
                $this->shippingCalculate($item);
            }
        }

        return $this->get_pure_cart($cart->id);
    }


    public function product_mark_as_cart()
    {
        $item_id = request('item_id');
        $shipping_type = request('shipping_type');
        $cart = $this->get_customer_cart();
        if (!$cart) {
            return [];
        }
        if ($item_id) {
            $data['IsCart'] = 1;
            if ($shipping_type) {
                $data['shipping_type'] = $shipping_type;
            }
            CartItem::where('cart_id', $cart->id)
                ->where('ItemId', $item_id)
                ->update($data);
        }
        return $this->get_pure_cart($cart->id);
    }

    public function ali_product_choose_shipping()
    {
        $item_id = request('item_id');
        $shipping = request('shipping_type', null);
        $DeliveryCost = request('shipping_cost', null);
        $cart = $this->get_customer_cart();
        if (!$cart) {
            return [];
        }
        if ($item_id) {
            $data = [
                'is_express_popup_shown' => null,
                'is_popup_shown' => null,
                'IsCart' => null,
                'shipping_type' => $shipping,
                'DeliveryCost' => $DeliveryCost,
            ];
            $item = CartItem::where('cart_id', $cart->id)
                ->where('ItemId', $item_id)->first();
            $this->shippingCalculate($item, $data);
        }
        return $this->get_pure_cart($cart->id);
    }

    public function read_popup_message()
    {
        $item_id = request('item_id');
        $is_express_popup_shown = request('is_express_popup_shown');
        $cart = $this->get_customer_cart();
        if (!$cart) {
            return [];
        }
        if ($item_id) {
            CartItem::where('cart_id', $cart->id)
                ->where('ItemId', $item_id)
                ->update(['is_popup_shown' => 1, 'is_express_popup_shown' => $is_express_popup_shown]);
        }
        return $this->get_pure_cart($cart->id);
    }


    public function toggle_cart_checkbox()
    {
        $cart = $this->get_customer_cart();
        $variation_id = request('variation_id', null);
        $is_checked = request('checked', null);
        if ($cart) {
            // $is_checked = $is_checked ? 1 : null;
            if (!$variation_id) {
                CartItemVariation::where('cart_id', $cart->id)
                    ->update(['is_checked' => (int)$is_checked]);
            } else if ($variation_id) {
                CartItemVariation::where('id', $variation_id)
                    ->where('cart_id', $cart->id)
                    ->update(['is_checked' => (int)$is_checked]);
            }
        }

        if (!$cart) {
            return [];
        }

        return $this->get_pure_cart($cart->id);
    }


    public function add_shipping_address($type, $shipping)
    {
        $user = User::find(auth()->id());
        $cart = $this->get_customer_cart();
        if ($cart) {
            $shipping_id = $shipping['id'] ?? null;
            if ($type == 'shipping') {
                $cart->update(['shipping' => is_array($shipping) ? json_encode($shipping) : []]);
                if ($user) {
                    $user->update(['shipping_id' => $shipping_id]);
                }
            }
            if ($type == 'billing') {
                $cart->update(['billing' => json_encode($shipping)]);
                if ($user) {
                    $user->update(['shipping_id' => $shipping_id]);
                }
            }
        }
        if ($user) {
            if (!$user->name) {
                $name = $shipping['name'] ?? null;
                $user->update(['name' => $name]);
            }
        }

        return $this->get_pure_cart($cart->id);
    }

    public function remove_from_cart()
    {
        $cart = $this->get_customer_cart();
        if ($cart) {
            $items = CartItemVariation::where('is_checked', 1)->where('cart_id', $cart->id);
            $itemsArray = $items->pluck('cart_item_id')->toArray() ?? [];
            $items->delete();
            $items = CartItem::withCount('variations')->whereIn('id', $itemsArray)->get();
            foreach ($items as $item) {
                if (!$item->variations_count) {
                    $item->delete();
                }
            }
        }
        return $this->get_pure_cart($cart->id);
    }

    public function add_payment_information($pmt)
    {
        $cart = $this->get_customer_cart();
        if ($cart) {
            $cart->update([
                'payment_method' => $pmt
            ]);
        }
        return $this->get_pure_cart($cart->id);
    }


    public function placedCustomerOrder($tran_id)
    {
        $cart = $this->get_customer_cart();
        if ($cart) {
            $user = User::find(auth()->id());
            $status = 'waiting-for-payment';
            $order = Order::create([
                'order_number' => null,
                'name' => $user->name,
                'phone' => $user->phone,
                'user_id' => $user->id,
                'shipping' => $cart->shipping ?? '',
                'billing' => $user->billing ?? '',
                'coupon_code' => $cart->coupon_code,
                'coupon_discount' => $cart->coupon_discount,
                'status' => $status,
                'transaction_id' => $tran_id,
                'payment_method' => $cart->payment_method,
                'bkash_payment_id' => null,
                'order_from' => 'web',
            ]);

            $order->update([
                'order_number' => generate_order_number($order->id)
            ]);

            $order_id = $order->id;
            $cartItems = CartItem::where('cart_id', $cart->id)
                ->with('variations')
                ->whereHas('variations', function ($variation) {
                    $variation->where('is_checked', 1);
                })
                ->withCount('variations')
                ->where('IsCart', 1)
                ->get();
            $current_rate = get_setting('payment_advanched_rate', 60);
            $rates = get_setting('advanced_rates');
            foreach ($cartItems as $product) {
                $ProviderType = $product->ProviderType;
                $ship_method = $product->shipping_type;
                $DeliveryCost = $product->DeliveryCost;
                $variations = $product->variations->where('is_checked', 1);
                if (($ship_method == 'regular' && $ProviderType == 'aliexpress')) {
                    $shipping_rate = 0;
                } else {
                    $type = ($ProviderType == 'aliexpress') ? 'express' : 'taobao';
                    $shipping_rate = get_aliExpress_air_shipping_rate($variations, $type);
                }

                $orderItem = OrderItem::create([
                    'order_id' => $order_id,
                    'user_id' => $user->id,
                    'ItemId' => $product->ItemId,
                    'Title' => $product->Title,
                    'ProviderType' => $ProviderType,
                    'ItemMainUrl' => $product->ItemMainUrl,
                    'MainPictureUrl' => $product->MainPictureUrl,
                    'regular_price' => $product->ProductPrice,
                    'weight' => $product->weight,
                    'Quantity' => $product->Quantity,
                    'hasConfigurators' => $product->hasConfigurators,
                    'shipped_by' => $product->shipped_by,
                    'DeliveryCost' => $DeliveryCost,
                    'shipping_rate' => $shipping_rate,
                    'shipping_from' => $product->shipping_from,
                    'status' => $status,
                    'tracking_number' => null,
                    'shipping_type' => $ship_method,
                    'shipped_by' => 'Air',
                ]);

                if ($orderItem) {
                    $item_id = $orderItem->id;
                    $DeliveryCost = $orderItem->DeliveryCost;
                    $variations_count = $orderItem->variations_count;
                    $product_value = 0;
                    $count = 0;
                    foreach ($variations as $variation) {
                        $price = $variation->price;
                        $qty = $variation->qty;
                        $subTotal = round($price * $qty);
                        $product_value += $subTotal;
                        OrderItemVariation::create([
                            'order_id' => $order_id,
                            'item_id' => $item_id,
                            'user_id' => $user->id,
                            'configId' => $variation->configId,
                            'price' => $price,
                            'qty' => $qty,
                            'attributes' => $variation->attributes,
                            'subTotal' => $subTotal,
                        ]);
                        $count += 1;
                        $variation->delete();
                    }
                    $product_value_sum = $product_value;
                    $product_value = $product_value + $DeliveryCost;

                    $advanced_rate = calculate_advanced_rate($product_value, $rates, $current_rate);

                    $first_payment = ($product_value * $advanced_rate) / 100;
                    $due_payment = $product_value - $first_payment;
                    $orderItem->update([
                        'item_number' => generate_order_number($orderItem->id),
                        'product_value' => $product_value_sum,
                        'first_payment' => round($first_payment),
                        'due_payment' => round($due_payment),
                    ]);
                    if ($count == $variations_count) {
                        $product->delete();
                    }
                }
            }

            $coupon_code = $order->coupon_code;
            $coupon_discount = $order->coupon_discount;

            if ($coupon_code) {
                $findCoupon = Coupon::where('coupon_code', $coupon_code)->first();
                CouponUser::create([
                    'coupon_id' => $findCoupon->id,
                    'coupon_code' => $coupon_code,
                    'coupon_details' => '',
                    'win_amount' => $coupon_discount,
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                ]);
            }
            // $cart->update(['is_purchase' => 1]);
            return $order;
        }


        return null;
    }


    public function coupon_code_submit($coupon_code)
    {
        $cart = $this->getCart();
        $cartTotal = $this->cartTotal($cart);
        $discount = $this->validateAppCoupon($coupon_code, $cartTotal);
        if (is_array($discount)) {
            $status = $discount['status'] ?? false;
            if (!$status) {
                $cart->update([
                    'coupon_code' => null,
                    'coupon_discount' => null,
                ]);
                $cart = $this->getCart();
                return ['cart' => $cart, 'msg' => 'Coupon is not valid'];
            }
            $amount = $discount['amount'] ?? 0;
            if ($amount == 'free_shipping') {
                $delivery_charge = $cart['delivery_charge'] ?? 0;
                $discount['amount'] = (int)$delivery_charge;
            }
        }
        $cart->update([
            'coupon_code' => $coupon_code,
            'coupon_discount' => $discount,
        ]);
        $cart = $this->getCart();
        return ['cart' => $cart, 'msg' => 'Coupon added successfully'];
    }

    public function coupon_reset()
    {
        $cart = $this->getCart();
        $msg = 'Coupon reset failed';
        if ($cart) {
            $this->resetCoupon($cart);
            $cart = $this->getCart();
            $msg = 'Coupon reset successfully';
        }
        return ['cart' => $cart, 'msg' => $msg];
    }
}
