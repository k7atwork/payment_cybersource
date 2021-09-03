$(function () {
   var payment_form = $('#payment_confirmation_iframe').attr('id');
   if (payment_form === "payment_confirmation_iframe") {
      initValues();
      getSecretKey();
   }
});

function initValues() {
    $("input[name='transaction_type']").val("authorization");
    $("input[name='reference_number']").val(new Date().getTime());
    $("input[name='amount']").val("100.00");
    $("input[name='currency']").val("AUD");

    //$("input[name='transaction_uuid']").val(UUIDGen());
    //$("input[name='signed_date_time']").val(new Date().toISOString().replace(/\:/g,''));
    $("input[name='signed_date_time']").val(new Date().toISOString().substring(0,19) + 'Z');
}

var secretStr;

//----------------------------------------------
// Fetch Secret Key
//----------------------------------------------
function getSecretKey() {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
         // Action to be performed when the document is ready:
         secretStr = xhttp.responseText;
         //alert(secretStr);
         signParameters();
      }
   };
   xhttp.open("GET", "https://k7atwork.github.io/payment_cybersource/keyStore.txt", true);
   xhttp.send();
}


function signParameters() {

   //----------------------------------------------
   // Prepare to Sign parameters
   //----------------------------------------------
   var signedFlds = $("#signed_field_names").val().split(',');
   var messageStr = "";

   for (let i = 0; i < signedFlds.length; i++) {
      if (i == 0)
         messageStr = signedFlds[i] + '=' + $("#" + signedFlds[i]).val();
      else
         messageStr = messageStr + ',' + signedFlds[i] + '=' + $("#" + signedFlds[i]).val();
   }


   //----------------------------------------------
   // Sign parameters
   //----------------------------------------------
   //alert(messageStr);
   //alert(secretStr);

   var hash = CryptoJS.HmacSHA256(messageStr, secretStr);
   var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

   $("#signature").val(hashInBase64);

   //----------------------------------------------
   // Trigger Redirect
   //----------------------------------------------
   //$("#payment_confirmation").submit();

   //if ( window.location !== window.parent.location )
      //document.forms['payment_confirmation'].submit();
   //else {
   // alert ('window.location == window.parent.location');
      //document.forms['payment_confirmation'].target = "myActionWin";
      //window.open("","myActionWin","width=500,height=300,toolbar=0");
      //document.forms['payment_confirmation'].submit();
   //}
}


//function target_popup(form) {
//alert('hi')
//   window.open('',//URL should be blank so that it will take form attributes.
//                    'UniqueWindowName', //window name
//                    'width=400,height=400,resizeable,scrollbars');
//   form.target = 'UniqueWindowName';
//}
