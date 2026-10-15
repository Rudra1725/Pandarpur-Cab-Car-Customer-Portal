

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('is-open');
    });

    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
   * 2. Travel Date Restriction (Minimum = Today)
   * ------------------------------------------------------------------------ */
  var pickupDateInput = document.getElementById('pickupDate');
  if (pickupDateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    pickupDateInput.min = yyyy + '-' + mm + '-' + dd;
  }

  /* ------------------------------------------------------------------------
   * 3. Fare Estimator
   * ------------------------------------------------------------------------ */
  var serviceTypeSelect = document.getElementById('serviceType');
  var vehicleTypeSelect = document.getElementById('vehicleType');
  var estimatedFareText = document.getElementById('estimatedFareText');

  function calculateFare() {
    if (!estimatedFareText) return;

    var s = serviceTypeSelect ? serviceTypeSelect.value : '';
    var v = vehicleTypeSelect ? vehicleTypeSelect.value : '';

    if (!s || !v) {
      estimatedFareText.textContent = 'Select vehicle & service';
      return;
    }

    var tariffBook = {
      compact: {
        darshan: '₹1,400 (4 hrs / 40 km)',
        'pickup-drop': '₹600 - ₹900 (Station / Local)',
        'outstation-oneway': '₹11 / km (Min 250 km)',
        'outstation-round': '₹11 / km + ₹300 driver/day'
      },
      sedan: {
        darshan: '₹1,800 (4 hrs / 40 km)',
        'pickup-drop': '₹800 - ₹1,200 (Station / Local)',
        'outstation-oneway': '₹13 / km (Min 250 km)',
        'outstation-round': '₹13 / km + ₹300 driver/day'
      },
      suv: {
        darshan: '₹2,500 (4 hrs / 40 km)',
        'pickup-drop': '₹1,200 - ₹1,600 (Station / Local)',
        'outstation-oneway': '₹16 / km (Min 250 km)',
        'outstation-round': '₹16 / km + ₹400 driver/day'
      },
      luxury: {
        darshan: '₹3,500 (4 hrs / 40 km)',
        'pickup-drop': '₹1,800 - ₹2,400 (Station / Local)',
        'outstation-oneway': '₹20 / km (Min 250 km)',
        'outstation-round': '₹20 / km + ₹500 driver/day'
      }
    };

    if (tariffBook[v] && tariffBook[v][s]) {
      estimatedFareText.textContent = tariffBook[v][s];
    } else {
      estimatedFareText.textContent = 'Standard RTO meter rates apply';
    }
  }

  if (serviceTypeSelect && vehicleTypeSelect) {
    serviceTypeSelect.addEventListener('change', calculateFare);
    vehicleTypeSelect.addEventListener('change', calculateFare);
  }

  /* ------------------------------------------------------------------------
   * 4. Validation Helpers
   * ------------------------------------------------------------------------ */
  function isValidIndianPhone(phone) {
    if (!phone) return false;
    var clean = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  }

  function isValidFutureDate(dateStr) {
    if (!dateStr) return false;
    var d = new Date(dateStr + 'T00:00:00');
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    return !isNaN(d.getTime()) && d >= now;
  }

  function setFieldError(field, errorEl, msg) {
    if (!field || !errorEl) return;
    if (msg) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = msg;
    } else {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
  }

  function clearFormErrors(form) {
    if (!form) return;
    var invalidInputs = form.querySelectorAll('.is-invalid');
    for (var i = 0; i < invalidInputs.length; i++) {
      invalidInputs[i].classList.remove('is-invalid');
      invalidInputs[i].removeAttribute('aria-invalid');
    }
    var errors = form.querySelectorAll('.field-error');
    for (var j = 0; j < errors.length; j++) {
      errors[j].textContent = '';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ------------------------------------------------------------------------
   * 5. Booking Local Persistence
   * ------------------------------------------------------------------------ */
  var STORAGE_KEY = 'pandharpur_cab_reservations';

  function getBookings() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBooking(item) {
    try {
      var list = getBookings();
      list.unshift(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------------
   * 6. Booking Form Submission
   * ------------------------------------------------------------------------ */
  var bookingForm = document.getElementById('bookingForm');
  var bookingNotify = document.getElementById('bookingResultNotification');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors(bookingForm);
      var valid = true;

      var service = document.getElementById('serviceType');
      var serviceErr = document.getElementById('serviceTypeError');
      if (!service.value) {
        setFieldError(service, serviceErr, 'Please select a service category.');
        valid = false;
      }

      var vehicle = document.getElementById('vehicleType');
      var vehicleErr = document.getElementById('vehicleTypeError');
      if (!vehicle.value) {
        setFieldError(vehicle, vehicleErr, 'Please select a vehicle class.');
        valid = false;
      }

      var passengers = document.getElementById('passengerCount');
      var passErr = document.getElementById('passengerCountError');
      var count = parseInt(passengers.value, 10);
      if (isNaN(count) || count < 1 || count > 7) {
        setFieldError(passengers, passErr, 'Capacity is between 1 and 7 persons.');
        valid = false;
      }

      var pickup = document.getElementById('pickupLocation');
      var pickupErr = document.getElementById('pickupLocationError');
      if (!pickup.value.trim() || pickup.value.trim().length < 3) {
        setFieldError(pickup, pickupErr, 'Please state pickup point or hotel name.');
        valid = false;
      }

      var drop = document.getElementById('dropLocation');
      var dropErr = document.getElementById('dropLocationError');
      if (!drop.value.trim() || drop.value.trim().length < 3) {
        setFieldError(drop, dropErr, 'Please state drop destination or local route.');
        valid = false;
      }

      var pDate = document.getElementById('pickupDate');
      var pDateErr = document.getElementById('pickupDateError');
      if (!isValidFutureDate(pDate.value)) {
        setFieldError(pDate, pDateErr, 'Choose today or an upcoming travel date.');
        valid = false;
      }

      var pTime = document.getElementById('pickupTime');
      var pTimeErr = document.getElementById('pickupTimeError');
      if (!pTime.value) {
        setFieldError(pTime, pTimeErr, 'Please specify pickup time.');
        valid = false;
      }

      var name = document.getElementById('customerName');
      var nameErr = document.getElementById('customerNameError');
      if (!name.value.trim() || name.value.trim().length < 2) {
        setFieldError(name, nameErr, 'Please enter your full name.');
        valid = false;
      }

      var phone = document.getElementById('customerPhone');
      var phoneErr = document.getElementById('customerPhoneError');
      if (!isValidIndianPhone(phone.value)) {
        setFieldError(phone, phoneErr, 'Enter a valid 10-digit mobile number.');
        valid = false;
      }

      if (!valid) {
        var firstInvalid = bookingForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var refId = 'PCC-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);
      var record = {
        refId: refId,
        customerName: name.value.trim(),
        customerPhone: phone.value.trim().replace(/\D/g, ''),
        serviceType: service.options[service.selectedIndex].text,
        vehicleClass: vehicle.options[vehicle.selectedIndex].text,
        passengers: count,
        pickupLocation: pickup.value.trim(),
        dropLocation: drop.value.trim(),
        travelDate: pDate.value,
        travelTime: pTime.value,
        status: 'Confirmed - Driver Allocation in Progress'
      };

      saveBooking(record);

      if (bookingNotify) {
        bookingNotify.style.display = 'block';
        bookingNotify.innerHTML =
          '<div class="notification-box notification-success">' +
            '<strong>Booking Confirmed! Reference ID: ' + refId + '</strong><br>' +
            'Namaste ' + escapeHtml(record.customerName) + '. Your ' + escapeHtml(record.vehicleClass) +
            ' is reserved for ' + escapeHtml(record.travelDate) + ' at ' + escapeHtml(record.travelTime) + '. ' +
            'Chauffeur contact will be sent to +91 ' + escapeHtml(record.customerPhone) + ' before pickup.' +
          '</div>';
        bookingNotify.focus();
      }

      bookingForm.reset();
      calculateFare();
    });
  }

  /* ------------------------------------------------------------------------
   * 7. Customer Portal Lookup
   * ------------------------------------------------------------------------ */
  var lookupForm = document.getElementById('portalLookupForm');
  var displayArea = document.getElementById('portalDisplayArea');

  if (lookupForm && displayArea) {
    lookupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('lookupRef');
      var errorSpan = document.getElementById('lookupRefError');
      var q = input.value.trim();

      if (!q) {
        setFieldError(input, errorSpan, 'Enter your mobile number or Reference ID.');
        input.focus();
        return;
      }

      setFieldError(input, errorSpan, '');
      var cleanQuery = q.toLowerCase().replace(/\s+/g, '');
      var records = getBookings();

      var match = records.find(function (b) {
        return (b.refId && b.refId.toLowerCase() === cleanQuery) ||
               (b.customerPhone && b.customerPhone === q.replace(/\D/g, ''));
      });

      if (match) {
        displayArea.innerHTML =
          '<div class="status-card">' +
            '<div class="status-card-header">' +
              '<strong>Reference: ' + escapeHtml(match.refId) + '</strong>' +
              '<span class="status-tag">' + escapeHtml(match.status) + '</span>' +
            '</div>' +
            '<div class="status-grid">' +
              '<div><strong>Passenger:</strong> ' + escapeHtml(match.customerName) + '</div>' +
              '<div><strong>Phone:</strong> +91 ' + escapeHtml(match.customerPhone) + '</div>' +
              '<div><strong>Vehicle:</strong> ' + escapeHtml(match.vehicleClass) + '</div>' +
              '<div><strong>Date & Time:</strong> ' + escapeHtml(match.travelDate) + ' at ' + escapeHtml(match.travelTime) + '</div>' +
              '<div><strong>Pick-up:</strong> ' + escapeHtml(match.pickupLocation) + '</div>' +
              '<div><strong>Destination:</strong> ' + escapeHtml(match.dropLocation) + '</div>' +
            '</div>' +
            '<p style="margin-top: 10px; margin-bottom: 0; font-size: 0.825rem; color: #4a5568;">' +
              'Need to modify or cancel? Call dispatch at +91 98000 00000.' +
            '</p>' +
          '</div>';
      } else {
        displayArea.innerHTML =
          '<div class="notification-box notification-error">' +
            'No booking found matching "' + escapeHtml(q) + '". Double check your 10-digit number or call dispatch at +91 98000 00000.' +
          '</div>';
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 8. Contact & Inquiry Form
   * ------------------------------------------------------------------------ */
  var inquiryForm = document.getElementById('inquiryForm');
  var inquiryNotify = document.getElementById('inquiryStatusNotification');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors(inquiryForm);

      var name = document.getElementById('inqName');
      var nameErr = document.getElementById('inqNameError');
      var phone = document.getElementById('inqPhone');
      var phoneErr = document.getElementById('inqPhoneError');
      var msg = document.getElementById('inqMessage');
      var msgErr = document.getElementById('inqMessageError');

      var valid = true;
      if (!name.value.trim() || name.value.trim().length < 2) {
        setFieldError(name, nameErr, 'Please state your name.');
        valid = false;
      }
      if (!isValidIndianPhone(phone.value)) {
        setFieldError(phone, phoneErr, 'Enter a valid 10-digit phone number.');
        valid = false;
      }
      if (!msg.value.trim() || msg.value.trim().length < 5) {
        setFieldError(msg, msgErr, 'Please enter your message or query details.');
        valid = false;
      }

      if (!valid) return;

      if (inquiryNotify) {
        inquiryNotify.style.display = 'block';
        inquiryNotify.innerHTML =
          '<div class="notification-box notification-success">' +
            'Thank you, ' + escapeHtml(name.value.trim()) + '. Your inquiry has been forwarded to our desk at S20 Bhakti Nivas. A coordinator will call you shortly.' +
          '</div>';
      }
      inquiryForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
   * 9. Legal Modals Handler (Privacy & Terms)
   * ------------------------------------------------------------------------ */
  var openModalButtons = document.querySelectorAll('[data-open-modal]');
  var closeModalButtons = document.querySelectorAll('[data-close-modal]');

  openModalButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modalId = btn.getAttribute('data-open-modal');
      var modal = document.getElementById(modalId);
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      }
    });
  });

  closeModalButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modalId = btn.getAttribute('data-close-modal');
      var modal = document.getElementById(modalId);
      if (modal && typeof modal.close === 'function') {
        modal.close();
      }
    });
  });

  var dialogs = document.querySelectorAll('dialog');
  dialogs.forEach(function (dialog) {
    dialog.addEventListener('click', function (e) {
      var rect = dialog.getBoundingClientRect();
      var isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        dialog.close();
      }
    });
  });
});