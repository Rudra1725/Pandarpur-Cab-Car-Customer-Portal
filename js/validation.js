

(function (window) {
  'use strict';

  var Validator = {
  
    isValidPhone: function (phone) {
      if (!phone) return false;
      var clean = phone.replace(/\D/g, '');
      return /^[6-9]\d{9}$/.test(clean);
    },


    isNotEmpty: function (value, minLength) {
      var min = minLength || 1;
      return typeof value === 'string' && value.trim().length >= min;
    },

   
    isValidFutureDate: function (dateString) {
      if (!dateString) return false;
      var selected = new Date(dateString + 'T00:00:00');
      var now = new Date();
      now.setHours(0, 0, 0, 0);
      return !isNaN(selected.getTime()) && selected >= now;
    },

  
    setFieldError: function (inputElement, errorElement, errorMessage) {
      if (!inputElement || !errorElement) return;
      if (errorMessage) {
        inputElement.classList.add('is-invalid');
        inputElement.setAttribute('aria-invalid', 'true');
        errorElement.textContent = errorMessage;
      } else {
        inputElement.classList.remove('is-invalid');
        inputElement.removeAttribute('aria-invalid');
        errorElement.textContent = '';
      }
    },

  
    clearFormErrors: function (formElement) {
      if (!formElement) return;
      var invalidInputs = formElement.querySelectorAll('.is-invalid');
      for (var i = 0; i < invalidInputs.length; i++) {
        invalidInputs[i].classList.remove('is-invalid');
        invalidInputs[i].removeAttribute('aria-invalid');
      }
      var errorSpans = formElement.querySelectorAll('.field-error');
      for (var j = 0; j < errorSpans.length; j++) {
        errorSpans[j].textContent = '';
      }
    }
  };

  window.AppValidator = Validator;
})(window);