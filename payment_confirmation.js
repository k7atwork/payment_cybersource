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
   
   //----------------------------------------------
   // Prepare Parameter Values & hidden Fields
   //----------------------------------------------
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
   
   //----------------------------------------------
   // Show Parameter Values
   //----------------------------------------------
   //alert(appendHTML);
   $("#reviewParams").html(appendHTML);
   
   //----------------------------------------------
   // Inject hidden Fields
   //----------------------------------------------
   //alert(inputFields);
   $("#signature").before(inputFields);

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
   // ign parameters
   //----------------------------------------------
   //alert(messageStr);
   //alert(secretStr);

   var hash = CryptoJS.HmacSHA256(messageStr, secretStr);
   var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
   //document.write(hashInBase64);

   $("#signature").val(hashInBase64);
}


//----------------------------------------------
// Fetch Secret Key
//----------------------------------------------
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
