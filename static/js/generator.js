(($) => {
  var currentCode = 0;

  function zeroPad(number, targetLength = 5) {
    return parseInt(number).toString().padStart(targetLength, '0');
  }

  function addCheckDigit(couponCode) {
    var checkDigit = 0;

    for (var i in couponCode) {
      checkDigit += parseInt(couponCode[i]) * (9 - (i % 2) * 2);
    }

    return couponCode + checkDigit.toString().slice(-1);
  }

  function openBarcode(master, title, subtitle, expiry, uniq, prefix = 47000) {
    currentCode = master;

    if (typeof uniq === 'undefined') {
      uniq = Math.floor(Math.random() * 100000);
    }

    var couponCode = addCheckDigit(zeroPad(prefix) + zeroPad(uniq) + zeroPad(master, 4));

    if (typeof title !== 'undefined') {
      var couponLimits = "";

      if (title.includes('%')) {
        couponLimits = 'Coupon is valid for ' + title + ' a single receipt ' +
                       'purchase of any in-stock or Special Order merchandise ' +
                       'only ' + subtitle.replace('purchases ', '') + '.';
      } else if (title.includes('$')) {
        minPurchase = subtitle.replace(/^.*(\$[0-9,\.]+).*$/, '$1');
        couponLimits = 'Coupon is valid for ' + title + ' any in-stock or ' +
                       'special order merchandise single receipt purchase of ' +
                       minPurchase + ' or more (calculated before taxes &amp; ' +
                       'after applicable discounts).';
      }

      $('.promo-title').html(title);
      $('.promo-subtitle').html(subtitle);
      $('.promo-expiry').html(expiry);
      $('.coupon-limits').html(couponLimits);
    }

    $('.barcode-image').attr('src', 'https://api-bwipjs.metafloor.com/?bcid=code128&text=' + couponCode);
    $('.coupon-code').val(couponCode);
    $('#coupon-modal').modal({ show: true });
  }

  function copyCoupon() {
    $('.coupon-code').select();
    document.execCommand('copy');
  }

  function printCoupon() {
    window.print();
  }

  function buildCoupons() {
    var template = $('#coupon-template').html();

    for (var coupon of couponData) {
      var $coupon = $(template);

      $coupon.find('.coupon-name').html(coupon.name);

      for (var tag in coupon.data) {
        $coupon.find('.get-coupon').data(tag, coupon.data[tag]);

        if (tag === 'mastercode') {
          $coupon.find('.master-code').text(coupon.data[tag]);
        }
      }

      $coupon.appendTo($('.coupons-list'));
    }
  }

  function getExpiryDate(month) {
    var monthInt = new Date(Date.parse(month + ' 1')).getMonth();
    var expiryDate = new Date((new Date()).getFullYear(), monthInt + 1, 0);

    return expiryDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  $(document).ready(() => {
    buildCoupons();

    $('.get-coupon').click(function() {
      var master = $(this).data('mastercode');
      var title = $(this).data('title');
      var subtitle = $(this).data('subtitle');
      var expiry = $(this).data('expiry');

      expiry = getExpiryDate(expiry);

      openBarcode(master, title, subtitle, expiry);
    });

    $('.copy-coupon').click(copyCoupon);
    $('.print-coupon').click(printCoupon);
    $('.new-coupon').click(() => openBarcode(currentCode));
  });
})(jQuery);
