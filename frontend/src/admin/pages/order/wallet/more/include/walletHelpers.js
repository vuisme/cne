

export const cancelMissingAmt = (walletItem) => {
    if (!walletItem?.product_value) {
        return 0;
    }
    let product_value = walletItem?.product_value ? parseInt(walletItem.product_value) : 0;
    let DeliveryCost = walletItem?.DeliveryCost ? parseInt(walletItem.DeliveryCost) : 0;
    let coupon_contribution = walletItem?.coupon_contribution ? parseInt(walletItem.coupon_contribution) : 0;

    return product_value + DeliveryCost - coupon_contribution;
}

export const cancelComment = (walletItem, current_status) => {
    return walletItem?.tracking_exceptional?.find(find => find.status === current_status)?.comment || '';
}