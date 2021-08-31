$(function () {
   payment_form = $('form').attr('id');
   setDefaultsForAll();
});


function setDefaultsForAll() {
   if (payment_form === "payment_confirmation") {
      //setDefaultsForUnsignedDetailsSection();
      getSecretKey();
   }
   else {
      setDefaultsForPaymentDetailsSection();
   }
}

var secretStr;

function setDefaultsForUnsignedDetailsSection() {
   //alert(window.location.search);
   var URLparams = window.location.search;
   var paramsPair = URLparams.split('&');
   var appendHTML = "";
   var inputFields = "";
   //alert(params.length);
   for (let i = 0; i < paramsPair.length; i++) {
      var params = paramsPair[i].split('=');
      var keyID = params[0].replace("?", "");
      var keyValue = decodeURIComponent(params[1]);
      keyValue = keyValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      //appendHTML = appendHTML + '<span class="fieldName">' + keyID + '</span><span class="fieldValue">' + keyValue + '</span>' + '<br>';
      appendHTML = appendHTML + '<span class="fieldName">' + keyID + '</span><span class="fieldValue">' + keyValue + '</span>' + '<br>';
      inputFields = inputFields + '<input type="hidden" id="' + keyID + '" name="' + keyID + '" value="' + keyValue + '" />';
   }
   //alert(appendHTML);
   $("#reviewParams").html(appendHTML);
   //alert(inputFields);
   $("#signature").before(inputFields);

   var signedFlds = $("#signed_field_names").val().split(',');
   var messageStr = "";

   for (let i = 0; i < signedFlds.length; i++) {
      if (i == 0)
         messageStr = signedFlds[i] + '=' + $("#" + signedFlds[i]).val();
      else
         messageStr = messageStr + ',' + signedFlds[i] + '=' + $("#" + signedFlds[i]).val();
   }
   //alert(messageStr);

   //let secretStr = "9d06fcb631e74ad2a45ebd88fa53c0563f06015a246849429c777b0027e16998ebaf5e40d9d64379a4ea1b901845653c2e2b05fea9ff4af58a0ce43526609c8a4bed30bbd90a48a4b90883f3431c41d3036a7848a4ce4aa2b153a9c9fd539ae2e52700a9c6594afb9d25814b2d7f09974ddd7429bdbb48a981ccc35540cd92b4";
   //alert(secretStr);

   var hash = CryptoJS.HmacSHA256(messageStr, secretStr);
   var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
   //document.write(hashInBase64);

   $("#signature").val(hashInBase64);
}

function getSecretKey() {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
         secretStr = xhttp.responseText;
         //alert(secretStr);
         setDefaultsForUnsignedDetailsSection();
      }
   };
   xhttp.open("GET", "https://k7atwork.github.io/payment_cybersource/keyStore.txt", true);
   xhttp.send();
}
