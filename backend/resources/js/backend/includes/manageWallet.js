function remove_space(stringData) {
    return (
        stringData
            .trim() // remove white spaces at the start and end of string
            // .toLowerCase() // string will be lowercase
            .replace(/^-+/g, "") // remove one or more dash at the start of the string
            .replace(/[^\w-]+/g, "-") // convert any on-alphanumeric character to a dash
            .replace(/-+/g, "-") // convert consecutive dashes to singular one
            .replace(/-+$/g, "")
    );
}

(function ($) {
    function make_full_url(url) {
        var base_url = $("#app_base_url").val();
        return base_url + "/" + url;
    }

    let body = $("body");

    function updateColumnValue(itemData) {
        var itemRow = $(document).find("#" + itemData.id);
        if (itemData.order_number) {
            itemRow.find(".order_number").text(itemData.order_number);
        }
        if (itemData.tracking_number) {
            itemRow.find(".tracking_number").text(itemData.tracking_number);
        }
        if (itemData.actual_weight) {
            itemRow.find(".actual_weight").text(itemData.actual_weight);
        }
        if (itemData.quantity) {
            itemRow.find(".quantity").text(itemData.quantity);
        }
        if (itemData.product_value) {
            itemRow.find(".product_value").text(itemData.product_value);
        }
        if (itemData.first_payment) {
            itemRow.find(".first_payment").text(itemData.first_payment);
        }
        if (itemData.shipping_charge) {
            itemRow.find(".shipping_charge").text(itemData.shipping_charge);
        }
        if (itemData.courier_bill) {
            itemRow.find(".courier_bill").text(itemData.courier_bill);
        }
        if (itemData.out_of_stock) {
            itemRow.find(".out_of_stock").text(itemData.out_of_stock);
        }
        if (itemData.missing) {
            itemRow.find(".missing").text(itemData.missing);
        }
        if (itemData.adjustment) {
            itemRow.find(".adjustment").text(itemData.adjustment);
        }
        if (itemData.refunded) {
            itemRow.find(".refunded").text(itemData.refunded);
        }
        if (itemData.last_payment) {
            itemRow.find(".last_payment").text(itemData.last_payment);
        }
        if (itemData.due_payment) {
            itemRow.find(".due_payment").text(itemData.due_payment);
        }
        if (itemData.status) {
            itemRow.find(".status").text(itemData.status);
            itemRow.find(".checkboxItem").attr("data-status", itemData.status);
        }
    }

    function enable_proceed_button() {
        $("#generateInvoiceButton").removeAttr("disabled");
    }

    function disabled_proceed_button() {
        $("#generateInvoiceButton").attr("disabled", "disabled");
    }

    function generate_process_related_data() {
        var invoiceFooter = $("#invoiceFooter");
        var courier_bill = invoiceFooter.find(".courier_bill").text();
        var payment_method = invoiceFooter.find("#payment_method").val();
        var delivery_method = invoiceFooter.find("#delivery_method").val();
        var total_payable = invoiceFooter.find(".total_payable").text();
        var total_due = invoiceFooter.find(".total_due").text();
        var customer_id = invoiceFooter
            .find(".total_payable")
            .attr("data-user");
        var isNotify = $("#notifyUser").is(":checked") ? 1 : 0;
        var related_data = {};
        related_data.courier_bill = courier_bill;
        related_data.payment_method = payment_method;
        related_data.delivery_method = delivery_method;
        related_data.total_due = total_due;
        related_data.total_payable = total_payable;
        related_data.user_id = customer_id;
        related_data.isNotify = isNotify;
        return related_data;
    }

    body.on("change", 'select[name="out_of_stock_type"]', function (event) {
        var item_id = body.find("#item_id").val();
        var value = $(this).val();
        var itemRow = body.find("#" + item_id);
        var out_of_stock = body.find('input[name="out_of_stock"]');
        if (value === "full") {
            var dueValue = 2 * Number(itemRow.find(".first_payment").text());
            out_of_stock.val(dueValue);
        } else {
            out_of_stock.val("");
        }
    })
        .on("submit", "#statusChargeForm", function (event) {
            event.preventDefault();
            var csrf = $('meta[name="csrf-token"]');
            $.ajax({
                type: "POST",
                url: $(this).attr("action"),
                data: $(this).serialize(),
                headers: {
                    "X-CSRF-TOKEN": csrf.attr("content"),
                },
                beforeSend: function () {
                    // before loading...
                },
                success: function (response) {
                    if (response.status) {
                        var orderItem = response.orderItem;
                        if (response.is_array) {
                            orderItem.map((item, key) => {
                                updateColumnValue(item);
                            });
                        } else {
                            updateColumnValue(orderItem);
                        }
                    }
                    csrf.attr("content", response.csrf);
                },
                error: function (xhr) {
                    // if error occured
                    // console.log('error', xhr);
                },
                complete: function () {
                    $("#changeStatusButton").modal("hide");
                    body.find("#statusSubmitBtn").removeAttr("disabled");
                },
            });
        })
        .on("change", "#allSelectCheckbox", function () {
            var tbodyCheckbox = $("tbody").find("input.checkboxItem");
            if ($(this).is(":checked")) {
                tbodyCheckbox.prop("checked", true);
                enable_proceed_button();
            } else {
                tbodyCheckbox.prop("checked", false);
                disabled_proceed_button();
            }
        })
        .on("change", "input.checkboxItem", function () {
            var checked_item = $("input.checkboxItem:checked").length;
            var uncheck_item = $('input.checkboxItem:not(":checked")').length;

            if (uncheck_item == 0) {
                $("#allSelectCheckbox").prop("checked", true);
            } else {
                $("#allSelectCheckbox").prop("checked", false);
            }
            if (checked_item > 0) {
                enable_proceed_button();
            } else {
                disabled_proceed_button();
            }
        })
        .on("click", "#generateInvoiceButton", function () {
            var generateInvoiceModal = $("#generateInvoiceModal");
            var hiddenInput = "";
            var is_generate = true;
            var duePayment = "";
            var serial = 1;
            var userTrack = 0;
            var total_due = 0;
            var total_weight = 0;
            var invoices = [];

            $("input.checkboxItem:checked").each(function (index) {
                var item_id = $(this).val();
                var status = $(this).attr("data-status");
                var user_id = $(this).attr("data-user");
                var invoice_item = {};
                if (userTrack === 0) {
                    userTrack = user_id;
                }
                if (userTrack !== 0 && userTrack !== user_id) {
                    is_generate = false;
                }
                var status_allow = [
                    "received-in-BD-warehouse",
                    "out-of-stock",
                    "adjustment",
                    "refunded",
                ];
                if (!status_allow.includes(status)) {
                    is_generate = false;
                }
                if (is_generate) {
                    var itemRow = $(document).find("#" + item_id);
                    var product_name = itemRow.find(".product_name").text();
                    var product_id = itemRow
                        .find(".product_name")
                        .attr("data-product-id");
                    var order_item_number = itemRow
                        .find(".order_item_number")
                        .text();
                    var actual_weight = itemRow.find(".actual_weight").text();
                    var due_payment = itemRow.find(".due_payment").text();

                    total_due += Number(due_payment);
                    total_weight += Number(actual_weight);
                    duePayment += `<tr>
                                <td class=" align-middle">${serial}</td>
                                <td class=" align-middle">${order_item_number}</td>
                                <td class="text-left align-middle">${product_name}</td>
                                <td class=" align-middle">${status}</td>
                                <td class="text-right align-middle">${Number(
                                    actual_weight
                                ).toFixed(3)}</td>
                                <td class="text-right align-middle">${Number(
                                    due_payment
                                ).toFixed(2)}</td>
                              </tr>`;
                    invoice_item.id = item_id;
                    invoice_item.order_item_number = order_item_number;
                    invoice_item.product_id = product_id;
                    invoice_item.product_name = product_name;
                    invoice_item.actual_weight = actual_weight;
                    invoice_item.due_payment = due_payment;
                    invoice_item.status = status;
                }
                serial += 1;
                invoices.push(invoice_item);
            });

            if (is_generate) {
                var invoiceFooter = $("#invoiceFooter");
                invoiceFooter
                    .find(".total_weight")
                    .text(Number(total_weight).toFixed(3));
                invoiceFooter
                    .find(".total_due")
                    .text(Number(total_due).toFixed(2));
                // invoiceFooter.find('.courier_bill').text(Number(0.00).toFixed(2));
                invoiceFooter
                    .find(".total_payable")
                    .text(Number(total_due).toFixed(2));
                invoiceFooter
                    .find(".total_payable")
                    .attr("data-user", userTrack);
                invoiceFooter
                    .find(".total_payable")
                    .attr(
                        "data-invoices",
                        encodeURIComponent(JSON.stringify(invoices))
                    );
                $("#invoiceItem").html(duePayment);
                generateInvoiceModal.modal("show");
            } else {
                Swal.fire({
                    icon: "warning",
                    text: "Selected Item Not Ready or Not Same User for Generate Invoice",
                });
            }
            //console.log('invoices', invoices);
            // hiddenField.html(hiddenInput);
            // changeStatusModal.modal('show');
        })
        .on("click", ".applyCourierBtn", function () {
            var courier_bill = $(this)
                .closest(".input-group")
                .find(".form-control")
                .val();
            var total_due = $("#invoiceFooter").find(".total_due").text();
            var total_payable = Number(courier_bill) + Number(total_due);
            $("#invoiceFooter")
                .find(".courier_bill")
                .text(Number(courier_bill).toFixed(2));
            $("#invoiceFooter")
                .find(".total_payable")
                .text(Number(total_payable).toFixed(2));

            $(".courier_bill_text").show();
            $(".courierSubmitForm").hide();
        })
        .on("click", ".removeCourierBtn", function () {
            $(this).closest("div").find(".form-control").val("");
            var total_due = $("#invoiceFooter").find(".total_due").text();
            $("#invoiceFooter").find(".courier_bill").text(0.0);
            $("#invoiceFooter")
                .find(".total_payable")
                .text(Number(total_due).toFixed(2));
            $(".courier_bill_text").hide();
            $(".courierSubmitForm").show();
        })
        .on("click", "#generateSubmitBtn", function () {
            var invoices = $("#invoiceFooter")
                .find(".total_payable")
                .attr("data-invoices");
            if (invoices) {
                invoices = decodeURIComponent(invoices);
            }
            var related = generate_process_related_data();
            var csrf = $('meta[name="csrf-token"]');
            $.ajax({
                type: "POST",
                url: $(this).attr("data-action"),
                data: {
                    invoices: invoices,
                    related: JSON.stringify(related),
                },
                headers: {
                    "X-CSRF-TOKEN": csrf.attr("content"),
                },
                beforeSend: function () {
                    // before loading...
                },
                success: function (response) {
                    if (response.status) {
                        window.location.href = "/admin/invoice";
                    } else {
                        Swal.fire({
                            icon: "warning",
                            text: "Invoice Generate Fail",
                        });
                    }
                },
                error: function (xhr) {
                    // if error occurred
                    Swal.fire({
                        icon: "warning",
                        text: "Invoice Generate Error",
                    });
                },
                complete: function () {
                    $("#generateInvoiceModal").modal("hide");
                },
            });
        });

    //  wallet item updates
    function walletItemParametersUpdates(item_id) {
        var updateWalletStatus = make_full_url(
            `/admin/order/wallet/updated-parameters/${item_id}`
        );
        axios
            .get(updateWalletStatus)
            .then((res) => {
                const wallet = res.data.wallet;
                if (wallet?.id > 0) {
                    for (let item in wallet) {
                        $("#" + wallet?.id)
                            .find("." + item)
                            .text(wallet[item]);
                    }
                    $("#" + wallet?.id)
                        .find(".checkboxItem ")
                        .attr("data-status", wallet.status);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //  wallet search helper js
    function checkUncheckSearchOption() {
        var all_select = $("#all_select");
        var checked = all_select
            .closest(".form-group")
            .find(".status_checkbox:checked");
        var allCheckBox = all_select
            .closest(".form-group")
            .find(".status_checkbox");
        all_select.prop("checked", allCheckBox.length === checked.length);
    }
    $(document).on("click", "#all_select", function () {
        $("#all_select")
            .closest(".form-group")
            .find("input[type=checkbox]")
            .prop("checked", $(this).is(":checked"));
    });

    $(document).on("show.bs.modal", "#searchModal", function (event) {
        checkUncheckSearchOption();
    });
    $(document).on("change", ".status_checkbox", function (event) {
        checkUncheckSearchOption();
    });

    //  wallet customizing develop

    function modalLoader() {
        return `<div style="display:grid;min-height:200px" class="align-items-center justify-content-center"><div class="spinner-border text-secondary" role="status">
    <span class="sr-only">Loading...</span>
  </div></div>`;
    }

    function walletShippingInfo(wallet) {
        var shipping = wallet?.order?.shipping
            ? JSON.parse(wallet?.order?.shipping)
            : {};
        return `<tr><td colspan="6" class="text-center"><h5 class="m-0">Shipping Info</h5></td></tr>
            <tr>
              <td colspan="6" class="text-center align-middle">
                <p class="m-0">
                  Name: <b>${shipping?.name}</b> <br>
                  Phone: <b>${shipping?.phone}</b> <br>
                  Location: <b>${shipping?.city}</b> <br>
                  Address: <b>${shipping?.address}</b>
                </p>
              </td>
            </tr>`;
    }

    function walletCustomerInfo(wallet) {
        var customer = wallet?.user || {};
        var name =
            customer?.name ||
            `${customer?.first_name} ${customer?.last_name}` ||
            "Unknown";
        return `<tr><td colspan="6" class="text-center"><h5 class="m-0">Customer Info</h5></td></tr>
            <tr>
              <td colspan="6" class="text-center align-middle">
                <p class="m-0">
                  Name: <b>${name}</b> <br>
                  Phone: <b>${customer?.phone}</b> <br>
                  Email: <b>${customer?.email}</b>
                </p>
              </td>
            </tr>`;
    }

    function walletOtherInfo(wallet) {
        return `
    <tr>
      <td colspan="5" class="text-center">
        <h5 class="m-0">Other Information</h5>
      </td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Transaction ID</td>
      <td class="text-right">${wallet.order.transaction_id}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Payment Method</td>
      <td class="text-right">${wallet.order.payment_method}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Order Number</td>
      <td class="text-right">${wallet.order.order_number}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Wallet Number</td>
      <td class="text-right">${wallet.item_number}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Product ID</td>
      <td class="text-right">${wallet.ItemId}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Source Site</td>
      <td class="text-right">${wallet.ProviderType}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Shipping Method</td>
      <td class="text-right">${
          wallet.shipping_type ? wallet.shipping_type : "express"
      }</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Shipping Rate</td>
      <td class="text-right">${wallet.shipping_rate || "not set"}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Source Order Number</td>
      <td class="text-right">${wallet.source_order_number || "not set"}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">TrackingNo</td>
      <td class="text-right">${wallet.tracking_number || "not set"}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Ref.Invoice</td>
      <td class="text-right">${wallet.invoice_no || "not set"}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Status</td>
      <td class="text-right">${wallet.status}</td>
    </tr>
    <tr>
      <td colspan="5" class="text-right">Day Count</td>
      <td class="text-right">${12}</td>
    </tr>
    <tr>
      <td colspan="6" class="text-center align-middle">
        <p class="m-0">Comments-1: ${wallet.comment1 || "not set"}</p>
      </td>
    </tr>
    <tr>
      <td colspan="6" class="text-center align-middle">
        <p class="m-0">Comments-2: ${wallet.comment2 || "not set"}</p>
      </td>
    </tr>`;
    }

    function walletSummaryInfo(wallet) {
        var product_value = wallet.product_value || 0;
        var DeliveryCost = wallet.DeliveryCost || 0;
        var coupon_contribution = wallet.coupon_contribution || 0;
        var netValue =
            Number(product_value) +
            Number(DeliveryCost) -
            Number(coupon_contribution);

        var $shipping_rate = wallet.shipping_rate
            ? Number(wallet.shipping_rate)
            : 0;
        var $weight = wallet.weight ? Number(wallet.weight) : 0;
        var $Quantity = wallet.Quantity ? Number(wallet.Quantity) : 0;
        var $totalWeight = Number($weight * $Quantity);
        var $weightCharges = Math.round($shipping_rate * $totalWeight);

        return `
      <tr>
        <td colspan="5" class="text-right">Products Value</td>
        <td class="text-right">${product_value}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">China Local Shipping</td>
        <td class="text-right">${DeliveryCost || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">(-) Coupon Value</td>
        <td class="text-right">${coupon_contribution || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Net Product Value</td>
        <td class="text-right">${netValue || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">1st Payment</td>
        <td class="text-right">${wallet.first_payment || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Out of Stock</td>
        <td class="text-right">${wallet.out_of_stock || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Missing/Shortage</td>
        <td class="text-right">${wallet.missing || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Lost in Transit</td>
        <td class="text-right">${wallet.lost_in_transit || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Refunded</td>
        <td class="text-right">${wallet.refunded || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Adjustment</td>
        <td class="text-right">${wallet.adjustment || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">AliExpress Tax</td>
        <td class="text-right">${wallet.customer_tax || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Weight Charges</td>
        <td class="text-right">${$weightCharges || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Courier Bill</td>
        <td class="text-right">${wallet.courier_bill || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Last Payment</td>
        <td class="text-right">${wallet.last_payment || 0}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">Closing Balance</td>
        <td class="text-right">${wallet.due_payment || 0}</td>
      </tr>`;
    }

    function attributesInfo(attributes) {
        var html = '<p class="m-0">';
        attributes?.map((attribute, key) => {
            html += `${attribute?.PropertyName} : ${
                attribute?.ValueAlias || attribute?.Value
            }  <br>`;
        });
        return html + "</p>";
    }

    function variationImage(attributes, wallet) {
        var imgItem =
            attributes?.find((attr) => attr?.ImageUrl !== undefined) || {};
        return imgItem?.ImageUrl ? imgItem?.ImageUrl : wallet?.MainPictureUrl;
    }

    function walletVariationsInfo(wallet) {
        var html = `<tr>
              <th class="text-center">SL</th>
              <th class="text-center">Picture</th>
              <th>Variations</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Price</th>
              <th class="text-right">Total</th>
            </tr>`;
        if (wallet?.item_variations?.length > 0) {
            wallet?.item_variations?.map((variation, key) => {
                var attributes = variation?.attributes
                    ? JSON.parse(variation.attributes)
                    : [];
                var attrData = attributesInfo(attributes);
                var variationImg = variationImage(attributes, wallet);
                html += `<tr>
              <td class="text-center text-nowrap align-middle">${key + 1}</td>
              <td class="text-nowrap align-middle">
                <img src="${variationImg}" style="width:90px" class="img-fluid mx-auto" alt="variation"/>
              </td>
              <td class="text-nowrap align-middle">${attrData}</td>
              <td class="text-center text-nowrap align-middle">${
                  variation?.qty
              }</td>
              <td class="text-center text-nowrap align-middle">${
                  variation?.price
              }</td>
              <td class="text-right text-nowrap align-middle">${
                  variation?.subTotal
              }</td>
              </tr>`;
            });
        }

        return html;
    }

    function walletInfoDetails(resData) {
        var wallet = resData.data;
        var source_link =
            wallet.ProviderType == "aliexpress"
                ? `https://www.aliexpress.com/item/${wallet.ItemId}.html`
                : `https://item.taobao.com/item.htm?id=${wallet.ItemId}`;

        var html = `<div class="card"><div class="card-body">`;
        html += `<h5>${wallet.Title}</h5>`;
        html += `<p class="m-0"><b>ChinaExpress Link:</b> <a href="${
            wallet.ProviderType == "Taobao"
                ? `/product/${wallet.ItemId}`
                : `/aliexpress/product/${wallet.ItemId}`
        }" target="_blank">Click here</a></p>`;
        html += `<p class="m-0 text-capitalize"><b>Provider:</b> ${wallet.ProviderType}</p>`;
        html += `<p><b>Source Link:</b> <a href="${source_link}" target="_blank">Click here</a></p>`;
        html += `<table class="table table-bordered">`;
        html += walletVariationsInfo(wallet);
        html += walletSummaryInfo(wallet);
        html += walletOtherInfo(wallet);
        html += walletCustomerInfo(wallet);
        html += walletShippingInfo(wallet);
        html += `</table></div></div>`;
        return html;
    }

    function generateWalletDetails(wallet_id) {
        var loader = modalLoader();
        var detailsModal = $("#detailsModal");
        detailsModal.modal("show");
        detailsModal.find(".modal-body").html(loader);
        var updateWalletStatus = make_full_url(
            `/admin/order/wallet/${wallet_id}`
        );
        axios
            .get(updateWalletStatus)
            .then((res) => {
                const resData = res.data;
                var htmlData = walletInfoDetails(resData);
                detailsModal.find(".modal-title").text(resData?.title);
                detailsModal.find(".modal-body").html(htmlData);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    $(document).on("click", ".walletDetails", function (event) {
        event.preventDefault();
        var wallet_id = $(this).attr("href");
        generateWalletDetails(wallet_id);
    });

    $(document).on("click", ".main-wallet-table tbody>tr", function (event) {
        let doubleClick = 2;
        let trippleClick = 3;
        if (event.detail === doubleClick) {
            event.preventDefault();
            var wallet_id = $(this).attr("id");
            generateWalletDetails(wallet_id);
        }
    });

    function formDataObject(formData) {
        var config = {};
        formData.map(function (item) {
            if (config[item.name]) {
                if (typeof config[item.name] === "string") {
                    config[item.name] = [config[item.name]];
                }
                config[item.name].push(item.value);
            } else {
                config[item.name] = item.value;
            }
        });
        return config;
    }

    $(document).on("submit", ".masterEditForm", function (event) {
        event.preventDefault();
        var action = $(this).attr("action");
        var formData = $(this).serializeArray();
        formData = formDataObject(formData);
        axios
            .post(action, { ...formData, _method: "PUT" })
            .then((res) => {
                const resData = res.data;
                if (resData.data?.id > 0) {
                    walletItemParametersUpdates(resData.data?.id);
                }
            })
            .catch((error) => {
                console.log("error", error);
            })
            .then(() => {
                $("#detailsModal").modal("hide");
            });
    });

    function walletMasterEditForm(resData) {
        var wallet = resData.data;
        var update_url = make_full_url(`admin/order/wallet/${wallet.id}`);
        var htmlForm = `<form action="${update_url}" method="post" class="masterEditForm"><input type="hidden" name="_method" value="put"/><table class="table"><tr><th>Parameter</th><th>CurrentData</th><th style="width:200px">UpdateInfo<th/></tr>`;
        const editable = [
            "regular_price",
            "weight",
            "DeliveryCost",
            "Quantity",
            "shipping_type",
            "shipping_rate",
            "tracking_number",
            "product_value",
            "first_payment",
            "coupon_contribution",
            "bd_shipping_charge",
            "courier_bill",
            "out_of_stock",
            "lost_in_transit",
            "customer_tax",
            "missing",
            "adjustment",
            "refunded",
            "last_payment",
            "due_payment",
            "invoice_no",
            "comment1",
            "comment2",
        ];
        for (const item in wallet) {
            if (editable.includes(item)) {
                var itemValue = wallet[item] || "";
                htmlForm += `<tr>
                      <td>${item}</td>
                      <td>${itemValue}</td>
                      <td><input type="text" name="${item}" placeholder="${item}" class="form-control text-right" value="${itemValue}" /></td>
                    </tr>`;
            }
        }
        return (
            htmlForm +
            `<tr><td colspan="3"><button type="submit" class="btn btn-block btn-primary">Update</button></td></tr></form>`
        );
    }

    function generateWalletMasterEdit(wallet_id) {
        var loader = modalLoader();
        var detailsModal = $("#detailsModal");
        detailsModal.modal("show");
        detailsModal.find(".modal-body").html(loader);
        axios
            .get(make_full_url(`/admin/order/wallet/${wallet_id}`))
            .then((res) => {
                const resData = res.data;
                var htmlData = walletMasterEditForm(resData);
                detailsModal
                    .find(".modal-title")
                    .text("Wallet Master Edit Form");
                detailsModal.find(".modal-body").html(htmlData);
                if (resData.data?.id > 0) {
                    walletItemParametersUpdates(resData.data?.id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    $(document).on("click", ".walletMasterEdit", function (event) {
        event.preventDefault();
        var wallet_id = $(this).attr("href");
        generateWalletMasterEdit(wallet_id);
    });

    //  section for change wallet status

    function show_enable_field(show_array) {
        var statusBlock = $("#additionInputStatusForm");
        statusBlock.find(".form-group").addClass("d-none");
        for (var i = 0; show_array.length > i; i++) {
            var item = show_array[i];
            statusBlock
                .find("#" + item)
                .closest(".form-group")
                .removeClass("d-none");
        }
    }

    $(document).on("submit", "#updateWalletStatus", function (event) {
        event.preventDefault();
        var action = make_full_url(`admin/order/wallet/status/change`);
        var loader = modalLoader();
        var formData = $(this).serialize();
        var detailsModal = $("#changeStatusModal");
        detailsModal.find("#additionInputStatusForm").html(loader);
        axios
            .post(action, formData)
            .then((res) => {
                const resData = res.data.data;
                if (resData?.id > 0) {
                    walletItemParametersUpdates(resData?.id);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                detailsModal.modal("hide");
            });
    });

    $(document).on("change", "#status", function (event) {
        event.preventDefault();
        var status = $(this).val();
        if (status == "purchased") {
            show_enable_field(["source_order_number"]);
        } else if (status == "shipped-from-suppliers") {
            show_enable_field(["tracking_number"]);
        } else if (status == "received-in-BD-warehouse") {
            show_enable_field(["actual_weight"]);
        } else if (status == "out-of-stock") {
            show_enable_field(["out_of_stock"]);
        } else if (status == "adjustment") {
            show_enable_field(["adjustment"]);
        } else if (status == "customer_tax") {
            show_enable_field(["customer_tax"]);
        } else if (status == "lost_in_transit") {
            show_enable_field(["lost_in_transit"]);
        } else if (status == "refunded") {
            show_enable_field(["refunded", "refunded_method"]);
        } else {
            show_enable_field([]);
        }
    });

    function wallet_status_change_form(wallet) {
        return `<input type="hidden" name="item_id" value="${wallet.id}">
  <div class="form-group d-none">
    <label for="source_order_number">Source Order Number</label>
    <input type="text" name="source_order_number" class="form-control" value="${
        wallet.source_order_number || ""
    }" id="source_order_number"
      placeholder="Source Order Number">
  </div>
  <div class="form-group d-none">
    <label for="tracking_number">Tracking Number</label>
    <input type="text" name="tracking_number" class="form-control" value="${
        wallet.tracking_number || ""
    }" id="tracking_number"
      placeholder="Tracking Number">
  </div>
  <div class="form-group d-none">
    <label for="out_of_stock">Out of Stock</label>
    <input type="text" name="out_of_stock" class="form-control" value="${
        wallet.out_of_stock || ""
    }" id="out_of_stock" placeholder="Out of Stock">
  </div>
  <div class="form-group d-none">
    <label for="weight">Actual Weight</label>
    <input type="text" name="actual_weight" class="form-control" value="${
        wallet.actual_weight || ""
    }" id="actual_weight"
      placeholder="Actual Weight">
  </div>
  <div class="form-group d-none">
    <label for="missing">Missing</label>
    <input type="text" name="missing" class="form-control" value="${
        wallet.missing || ""
    }" id="missing" placeholder="Missing">
  </div>
  <div class="form-group d-none">
    <label for="adjustment">Adjustment</label>
    <input type="text" name="adjustment" class="form-control" value="${
        wallet.adjustment || ""
    }" id="adjustment" placeholder="Adjustment">
  </div>
  <div class="form-group d-none">
    <label for="customer_tax">Customer Tax</label>
    <input type="text" name="customer_tax" class="form-control" value="${
        wallet.customer_tax || ""
    }" id="customer_tax" placeholder="Customer Tax">
  </div>
  <div class="form-group d-none">
    <label for="lost_in_transit">Lost in Transit</label>
    <input type="text" name="lost_in_transit" class="form-control" value="${
        wallet.lost_in_transit || ""
    }" id="lost_in_transit" placeholder="Lost in Transit">
  </div>
  <div class="form-group d-none">
    <label for="refunded">Refunded Amount</label>
    <input type="text" name="refunded" class="form-control" value="${
        wallet.refunded || ""
    }" id="refunded" placeholder="Refunded">
  </div>
  <div class="form-group d-none">
    <label for="refunded_method">Refunded Method</label>
    <input type="text" name="refunded_method" class="form-control" value="${
        wallet.refunded_method || ""
    }" id="refunded_method" placeholder="Refunded Method">
  </div>
  <div class="form-group d-none">
    <label for="last_payment">Last Payment</label>
    <input type="text" name="last_payment" class="form-control" value="${
        wallet.last_payment || ""
    }" id="last_payment" placeholder="Last Payment">
  </div>`;
    }

    function processToChangeStatus(wallet_id) {
        var loader = modalLoader();
        var detailsModal = $("#changeStatusModal");
        detailsModal.modal("show");
        detailsModal.find("#additionInputStatusForm").html(loader);
        axios
            .get(make_full_url(`/admin/order/wallet/${wallet_id}`))
            .then((res) => {
                const resData = res.data;
                var htmlData = wallet_status_change_form(resData.data);
                detailsModal
                    .find(".modal-title")
                    .text(`Change wallet status of #${wallet_id}`);
                detailsModal.find("#additionInputStatusForm").html(htmlData);
                detailsModal
                    .find("#status")
                    .find(`option[value=${resData.data.status}]`)
                    .attr("selected", "selected");
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                $("#status").trigger("change");
            });
    }

    $(document).on("click", ".changeWalletStatus", function (event) {
        event.preventDefault();
        var wallet_id = $(this).attr("href");
        processToChangeStatus(wallet_id);
    });

    // wallet comments option integration
    $(document).on("click", ".walletCommentButton", function (event) {
        event.preventDefault();
        var action = $(this).attr("href");
        var option = $(this).attr("data-comment");
        var comments1 = $(this).closest("tr").find(".comments1").text();
        var comments2 = $(this).closest("tr").find(".comments2").text();
        var comment = option == "one" ? comments1 : comments2;

        var submitCommentsForm = $("#submitCommentsForm");

        $("#commentsModal").modal("show");

        submitCommentsForm.attr("action", action);
        submitCommentsForm.find("[name=type]").val(option);
        submitCommentsForm.find("[name=comments]").val(comment);
    });

    $(document).on("submit", "#submitCommentsForm", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        var action = $(this).attr("action");
        axios
            .post(action, formData)
            .then((res) => {
                const resData = res.data.data;
                if (resData?.id > 0) {
                    walletItemParametersUpdates(resData?.id);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                $("#commentsModal").modal("hide");
            });
    });

    function trackingInfoBlock(track) {
        return `
        <div>
          ${
              track.updated_time
                  ? '<i class="fa fa-check-circle bg-blue"></i>'
                  : '<i class="fa fa-check-circle bg-gray"></i>'
          }
          <div class="timeline-item">
            <div class="timeline-body">
              <h6>${track.tracking_status}</h6>
              ${track.updated_time ? `<span>${track.updated_time}</span>` : ""}
              ${track.comment ? `<p class="m-0">${track.comment}</p>` : ""}
            </div>
          </div>
        </div>`;
    }

    function trackingInfoModal(tracking) {
        var trackingInfo = $("#trackingInfoModal");
        var htmlBlock = "";
        var hasException = tracking.find((find) => find.exceptions?.length > 0);
        if (hasException) {
            for (var i = 0; i < hasException.exceptions.length; i++) {
                var track = hasException.exceptions[i];
                htmlBlock += trackingInfoBlock(track);
            }
            for (var i = 0; i < tracking.length; i++) {
                var track = tracking[i];
                if (track.id <= hasException.id) {
                    htmlBlock += trackingInfoBlock(track);
                }
            }
        } else {
            for (var i = 0; i < tracking.length; i++) {
                var track = tracking[i];
                htmlBlock += trackingInfoBlock(track);
            }
        }

        trackingInfo.find(".timeline").html(htmlBlock);
        trackingInfo.modal("show");
    }

    // .reverse();

    $(document).on("click", ".showTrackingUpdate", function (event) {
        event.preventDefault();
        var action = $(this).attr("href");
        axios
            .get(action)
            .then(({ data }) => {
                const tracking = data.tracking;
                trackingInfoModal(tracking);
            })
            .catch((error) => {
                console.log(error);
            });
    });
})(jQuery);
