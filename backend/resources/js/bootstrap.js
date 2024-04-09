window._ = require('lodash');
window.Swal = require('sweetalert2');


try {
   window.Popper = require('popper.js').default;
   window.$ = window.jQuery = require('jquery');
   require('bootstrap');
} catch (e) {
   console.log(e)
}




window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';