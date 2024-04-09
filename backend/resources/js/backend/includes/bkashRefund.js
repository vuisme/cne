import Swal from "sweetalert2";

(function ($) {

  const body = $('body');
  const refundModal = $('#refundProcessModal');
  const spinner = `<div class="text-center my-5"><div class="spinner-border text-secondary" role="status"><span class="sr-only">Loading...</span></div></div>`;
  refundModal.on('hidden.bs.modal', function (event) {
    refundModal.find('.modal-body').html(spinner);
  })
  body.on('click', '.payment_status', function (event) {
    event.preventDefault();
    refundModal.modal('show');
    axios.post($(this).attr('href'))
      .then(res => {
        const resData = res.data;
        if (resData.status === true) {
          const htmlData = resData?.html;
          refundModal.find('.modal-body').html(htmlData);
        } else {
          Swal.fire({
            'text': resData.msg,
            'icon': 'error',
          })
        }
      })
  });

  body.on('click', '.refund_order', function (event) {
    event.preventDefault();
    refundModal.modal('show');
    axios.post($(this).attr('href'))
      .then(res => {
        const resData = res.data;
        if (resData.status === true) {
          const htmlData = resData?.html;
          refundModal.find('.modal-body').html(htmlData);
        } else {
          Swal.fire({
            'text': resData.msg,
            'icon': 'error',
          })
        }
      })

  });
  body.on('click', '.refund_status', function (event) {
    event.preventDefault();
    refundModal.modal('show');
    axios.post($(this).attr('href'))
      .then(res => {
        const resData = res.data;
        if (resData.status === true) {
          const htmlData = resData?.html;
          refundModal.find('.modal-body').html(htmlData);
        } else {
          Swal.fire({
            'text': resData.msg,
            'icon': 'error',
          })
        }
      })
  });

  body.on('submit', '.bkash_refund_form', function (event) {
    event.preventDefault();
    Swal.fire({
      icon: "info",
      text: "Are you sure to refund this order ?",
      showCancelButton: true,
      confirmButtonText: "confirm",
      cancelButtonText: "cancel"
    }).then(result => {
      if (result.value) {
        refundModal.find('.modal-body').html(spinner);
        axios
          .post($(this).attr('action'), $(this).serialize())
          .then(response => {
            let resData = response.data;
            if (resData.status) {
              refundModal.find('.modal-body').html(resData.html);
            }
          })
          .catch(error => {
            console.log("error", error);
          });
      }

    });
  });


})(jQuery);