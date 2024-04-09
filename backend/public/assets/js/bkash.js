function redirectWithErrors(url, tran_id, data) {
  let errorMessage = data?.errorMessage || null;
  let paymentID = data?.paymentID || null;
  let trxID = data?.trxID || null;
  let endpoint = `${url}&tran_id=${tran_id}`;
  endpoint += paymentID ? `&paymentID=${data?.paymentID}` : '';
  endpoint += trxID ? `&trxID=${trxID}` : '';
  endpoint += errorMessage ? `&n_msg=${errorMessage}` : '';
  return endpoint;
}

function callReconfigure(val) {
  bKash.reconfigure(val);
}

(function ($) {
  let paymentInfo = $(document).find("#paymentInfo").text();
  paymentInfo = paymentInfo ? JSON.parse(paymentInfo) : {};
  let tran_id = paymentInfo?.ref_no;
  let amount = paymentInfo?.amount;
  const token_url = paymentInfo?.token_url;
  const checkout_url = paymentInfo?.checkout_url;
  const execute_url = paymentInfo?.execute_url;
  const success_url = paymentInfo?.success_url;
  const failed_url = paymentInfo?.failed_url;
  const cancel_url = paymentInfo?.cancel_url;

  const csrfToken = $('meta[name="csrf-token"]').attr("content");

  function clickPayButton() {
    $("#bKash_button").trigger("click");
  }

  $.ajax({
    url: token_url,
    type: "POST",
    headers: { "X-CSRF-TOKEN": csrfToken },
    contentType: "application/json",
    success: function (data) {
      $("#bKash_button").trigger("click");
    },
    error: function () {
      console.log("error");
    },
  });

  var paymentRequest = {
    amount: amount,
    intent: "sale",
    ref_no: tran_id,
  };

  bKash.init({
    paymentMode: "checkout",
    paymentRequest: paymentRequest,
    createRequest: function (request) {
      $.ajax({
        url: checkout_url,
        type: "POST",
        headers: { "X-CSRF-TOKEN": csrfToken },
        contentType: "application/json",
        success: function (data) {
          if (data.paymentID != null) {
            paymentID = data.paymentID;
            bKash.create().onSuccess(data);
          } else {
            bKash.execute().onError();
            window.location.href = redirectWithErrors(failed_url, tran_id, data);
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          data = xhr.responseJSON;
          bKash.execute().onError();
          window.location.href = redirectWithErrors(failed_url, tran_id, data);
        },
      });
    },
    executeRequestOnAuthorization: function () {
      $.ajax({
        url: `${execute_url + paymentID}`,
        type: "POST",
        headers: { "X-CSRF-TOKEN": csrfToken },
        contentType: "application/json",
        success: function (data) {
          if (data.paymentID) {
            window.location.href = redirectWithErrors(success_url, tran_id, data);
          } else {
            bKash.execute().onError();
            window.location.href = redirectWithErrors(failed_url, tran_id, data);
          }
        },
        error: function (xhr) {
          data = xhr.responseJSON;
          bKash.execute().onError();
          window.location.href = redirectWithErrors(failed_url, tran_id, data);
        },
      });
    },
    onClose: function () {
      var data = {};
      data.errorMessage = 'Payment canceled';
      window.location.href = redirectWithErrors(cancel_url, tran_id, data);
    },
  });
})(jQuery);
