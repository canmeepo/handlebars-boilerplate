$.ajaxSetup({ cache: false });
var errorResponse;



function GetCityState(sender)
{
    var $form = $(sender).closest("form");
    resetServerSideError($form, "FormData.Zip");

    var zip = $(sender).val();
    console.log(zip);

    $.get("../ask-wells/CityStateByZip/", {zip : zip}, function (data) {
        $("#CityState").val(data);
        //var cityState = $("#CityState").val();
        if (data == "") {
            $("#zipValidatorMessage").show();
            return false;
        }
        else {
            $("#zipValidatorMessage").hide();
            return true;
        }
    })
    return false;
}

function resetServerSideError($form, targetName) {
    $form.find(".input-validation-error[name='" + targetName + "']").removeClass("input-validation-error");
    $form.find(".field-validation-error[data-valmsg-for='" + targetName + "']").removeClass("field-validation-error").addClass("field-validation-valid")
}

$("#Contact_FirstName").bind('keydown', function (event) {
    if (event.which === 18 && errorResponse != null) {
        var w = window.open();
        //var html = $("#ErrorResponse").html();
        //var html = $("#ErrorResponse").html(errorResponse);
        $(w.document.body).html(errorResponse).find(".errorResponse").show();
    }
})

$("#DonationForm").attr("novalidate", "true");

function doSubmitting(form) {
    $form = $(form);
    if ($form.hasClass("submitting")) {
        return false;
    }
    $form.validate();
    if ($form.valid()) {
        $form.addClass("submitting");
    }
    return true;
}

function doDonationSubmitting(form) {
    $form = $(form);
    $("#DonationSubmitProgress").show();
    if ($form.hasClass("submitting")) {
        return false;
    }

    $form.validate({
      highlight: function (element, errorClass, validClass) {
        $(element).parents(".freeform-column").addClass("invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).parents(".freeform-column").removeClass("invalid");
      },
      errorElement: 'em',
      errorPlacement: function (error, element) {
        if (element.parent().is('.custom-select')) {
          error.insertAfter($(element).parent());
        } else if (element.closest('.freeform-field-type--checkbox_group').length > 0) {
          error.appendTo($(element).closest('.freeform-field-type--checkbox_group'));
        } else if (element.closest('.freeform-field-type--radio_group').length > 0) {
          error.appendTo($(element).closest('.freeform-field-type--radio_group'));
        } else if (element.attr("type") == "checkbox") {
          error.insertAfter($(element).parents('.freeform-column').find('.freeform-required'));
        } else {
          error.insertAfter($(element));
        }
      },
      validClass: 'success',
      rules: {
        email: {
            email: true
        }
      }
      //submitHandler: function(){
      //  form.submit();
      //}
    });
    if ($form.valid()) {
        $form.addClass("submitting");
    }
    return true;
}

function scrollToElement($element) {
    window.scroll(0, $element.offset().top);
}

function contactUsSuccess() {
    var $errorField = $(".input-validation-error");
    if ($errorField.length > 0)
        scrollToElement($errorField.first());
    else
        scrollToElement($('#AskWellsFormArea'));
    $.validator.unobtrusive.parse('#AskWellsFormArea form');
}

function donationSuccess() {

    var $errorField = $(".input-validation-error");
    if ($errorField.length > 0)
    {
        //scrollToElement($errorField.first());
        $errorField.first().focus();
    }
    else
        scrollToElement($('#DonationFormArea'));
    $.validator.unobtrusive.parse('#DonationFormArea form');
}

function handleDonationError(form) {
    var $form = $(form);

    $form.removeClass("submitting");
    $("#DonationSubmitProgress").hide();

    alert("Oops, something when wrong with your submission!  Please double check the information you are trying to post and try again later.");
}

function handleContactError(form) {

    var $form = $(form);
    $form.removeClass("submitting");
    alert("Oops, something went wrong with your submission!  Please double check the information your are trying to post and try again later.");
}

function handleError(form) {
    var $form = $(form);

    $form.removeClass("submitting");
    alert("Oops, something went wrong with your submission!  Please double check the information you are trying to post and try again later.");
}

$('.contact-us__intro button').on('click', function () {
    //var selectedValue = $('#SubjectTypeId').val();
    var selectedValue = $('input[name=contactType]:checked').val();
    //console.log(selectedValue);
    //console.log($('input[name=contactType]'));
    $('#SubjectTypeId').val(selectedValue);
    //console.log($('#FormData_SubjectTypeId').val());
    if (!selectedValue) {
        alert('Please make a selection!');
        return;
    }

    if (isNaN(parseInt(selectedValue))) {
        var baseUrl = window.location.protocol + "//" + window.location.host;
        window.location = new URL(selectedValue, baseUrl);
        return;
    }

    var $form = $(this).closest("form");
    var $option = $(".contact-us__intro-select input[value=" + selectedValue + "]");
    var conditionalTarget = $option.attr("data-conditional-target");
    if (conditionalTarget) {
        var targets = conditionalTarget.split(',');
        for (var i = 0; i < targets.length; i++) {
            $form.addClass("conditional-" + targets[i]);
        }
    }

    $form.addClass("contact-page-answering");

    var $main = $('.contact-us__main'),
        $conditionals = $main.find('[data-conditional-field]');

    if (selectedValue == "1224") {
        $(".field-work-phone").show();
        $(".field-home-phone").hide();
    }

    //$('.contact-us__intro').hide();
    //$main.show();
    //$conditionals.hide().each(function () {
    //    if ($.trim($(this).data('conditional-field')).split('|').indexOf(selectedValue) != -1) {
    //        $(this).show();

    //    }
    //});
});

$("#DonationType").change(function () {
    if ($("#DonationType").val() == "1") {
        $(".donation-form-event-type").show();
    }
    else {
        $(".donation-form-event-type").hide();
    }
});

$(document).ready(function () {
    $("#EventDate").val("");
});