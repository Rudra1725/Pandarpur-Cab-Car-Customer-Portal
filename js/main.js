
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


  var pickupDateInput = document.getElementById('pickupDate');
  if (pickupDateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    pickupDateInput.min = yyyy + '-' + mm + '-' + dd;
  }

  /* ------------------------------------------------------------------------
   * 3. Dynamic Fare Estimator
   * ------------------------------------------------------------------------ */
  var serviceTypeSelect = document.getElementById('serviceType');
  var vehicleTypeSelect = document.getElementById('vehicleType');
  var estimatedFareText = document.getElementById('estimatedFareText');

  function calculateEstimate() {
    if (!estimatedFareText) return;

    var service = serviceTypeSelect ? serviceTypeSelect.value : '';
    var vehicle = vehicleTypeSelect ? vehicleTypeSelect.value : '';

    if (!service || !vehicle) {
      estimatedFareText.textContent = 'Select vehicle & service';
      return;
    }

    var baseTariffs = {
      compact: { darshan: '₹1,400 (4 hrs package)', 'pickup-drop': '₹600 - ₹900 (local)', 'outstation-oneway': '₹11/km (min 250 km)', 'outstation-round': '₹11/km + ₹300 driver/day' },
      sedan: { darshan: '₹1,800 (4 hrs package)', 'pickup-drop': '₹800 - ₹1,200 (local)', 'outstation-oneway': '₹13/km (min 250 km)', 'outstation-round': '₹13/km + ₹300 driver/day' },
      suv: { darshan: '₹2,500 (4 hrs package)', 'pickup-drop': '₹1,200 - ₹1,600 (local)', 'outstation-oneway': '₹16/km (min 250 km)', 'outstation-round': '₹16/km + ₹400 driver/day' },
      luxury: { darshan: '₹3,500 (4 hrs package)', 'pickup-drop': '₹1,800 - ₹2,400 (local)', 'outstation-oneway': '₹20/km (min 250 km)', 'outstation-round': '₹20/km + ₹500 driver/day' }
    };

    if (baseTariffs[vehicle] && baseTariffs[vehicle][service]) {
      estimatedFareText.textContent = baseTariffs[vehicle][service];
    } else {
      estimatedFareText.textContent = 'Standard RTO meter rates apply';
    }
  }

  if (serviceTypeSelect && vehicleTypeSelect) {
    serviceTypeSelect.addEventListener('change', calculateEstimate);
    vehicleTypeSelect.addEventListener('change', calculateEstimate);
  }

  /* ------------------------------------------------------------------------
   * 4. Booking Storage Helper (Local persistence for demo portal)
   * ------------------------------------------------------------------------ */
  var STORAGE_KEY = 'pandharpur_cab_bookings';

  function getStoredBookings() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBooking(bookingObj) {
    try {
      var bookings = getStoredBookings();
      bookings.unshift(bookingObj); // Prepend new booking
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------------
   * 5. Booking Form Submission & Validation
   * ------------------------------------------------------------------------ */
  var bookingForm = document.getElementById('bookingForm');
  var bookingNotify = document.getElementById('bookingResultNotification');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;
      var V = window.AppValidator;

      V.clearFormErrors(bookingForm);

      // Validate Service
      var service = document.getElementById('serviceType');
      var serviceErr = document.getElementById('serviceTypeError');
      if (!V.isNotEmpty(service.value)) {
        V.setFieldError(service, serviceErr, 'Please select a service type.');
        isValid = false;
      }

      // Validate Vehicle
      var vehicle = document.getElementById('vehicleType');
      var vehicleErr = document.getElementById('vehicleTypeError');
      if (!V.isNotEmpty(vehicle.value)) {
        V.setFieldError(vehicle, vehicleErr, 'Please select a vehicle category.');
        isValid = false;
      }

      // Validate Passengers
      var passengers = document.getElementById('passengerCount');
      var passErr = document.getElementById('passengerCountError');
      var pCount = parseInt(passengers.value, 10);
      if (isNaN(pCount) || pCount < 1 || pCount > 7) {
        V.setFieldError(passengers, passErr, 'Capacity must be between 1 and 7 passengers.');
        isValid = false;
      }

      // Validate Pickup Location
      var pickup = document.getElementById('pickupLocation');
      var pickupErr = document.getElementById('pickupLocationError');
      if (!V.isNotEmpty(pickup.value, 3)) {
        V.setFieldError(pickup, pickupErr, 'Please state your pickup point or landmark.');
        isValid = false;
      }

      // Validate Drop Location
      var drop = document.getElementById('dropLocation');
      var dropErr = document.getElementById('dropLocationError');
      if (!V.isNotEmpty(drop.value, 3)) {
        V.setFieldError(drop, dropErr, 'Please state your destination or local route.');
        isValid = false;
      }

      // Validate Date
      var pDate = document.getElementById('pickupDate');
      var pDateErr = document.getElementById('pickupDateError');
      if (!V.isValidFutureDate(pDate.value)) {
        V.setFieldError(pDate, pDateErr, 'Please choose today or an upcoming date.');
        isValid = false;
      }

      // Validate Time
      var pTime = document.getElementById('pickupTime');
      var pTimeErr = document.getElementById('pickupTimeError');
      if (!V.isNotEmpty(pTime.value)) {
        V.setFieldError(pTime, pTimeErr, 'Please choose your preferred pickup time.');
        isValid = false;
      }

      // Validate Customer Name
      var name = document.getElementById('customerName');
      var nameErr = document.getElementById('customerNameError');
      if (!V.isNotEmpty(name.value, 2)) {
        V.setFieldError(name, nameErr, 'Please enter your full name.');
        isValid = false;
      }

      // Validate Customer Phone
      var phone = document.getElementById('customerPhone');
      var phoneErr = document.getElementById('customerPhoneError');
      if (!V.isValidPhone(phone.value)) {
        V.setFieldError(phone, phoneErr, 'Please enter a valid 10-digit Indian mobile number.');
        isValid = false;
      }

      if (!isValid) {
        // Focus first invalid element
        var firstInvalid = bookingForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Generate Reference Code (e.g. PCC-2026-XXXX)
      var refCode = 'PCC-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);

      var newBooking = {
        refId: refCode,
        customerName: name.value.trim(),
        customerPhone: phone.value.trim().replace(/\D/g, ''),
        serviceType: service.options[service.selectedIndex].text,
        vehicleClass: vehicle.options[vehicle.selectedIndex].text,
        passengers: pCount,
        pickupLocation: pickup.value.trim(),
        dropLocation: drop.value.trim(),
        travelDate: pDate.value,
        travelTime: pTime.value,
        status: 'Confirmed - Driver Allocation in Progress',
        timestamp: new Date().toISOString()
      };

      saveBooking(newBooking);

      // Display Confirmation Notice
      if (bookingNotify) {
        bookingNotify.style.display = 'block';
        bookingNotify.innerHTML =
          '<div class="notification-box notification-success">' +
          '<strong>Booking Confirmed! Reference ID: ' + refCode + '</strong><br>' +
          'Namaste ' + escapeHtml(newBooking.customerName) + '. Your ' + escapeHtml(newBooking.vehicleClass) +
          ' is scheduled for ' + escapeHtml(newBooking.travelDate) + ' at ' + escapeHtml(newBooking.travelTime) + '. ' +
          'Driver details will be dispatched to +91 ' + escapeHtml(newBooking.customerPhone) + ' via SMS before pickup.' +
          '</div>';
        bookingNotify.focus();
      }

      // Reset form fields
      bookingForm.reset();
      calculateEstimate();
    });
  }

  /* ------------------------------------------------------------------------
   * 6. Customer Portal Lookup
   * ------------------------------------------------------------------------ */
  var lookupForm = document.getElementById('portalLookupForm');
  var displayArea = document.getElementById('portalDisplayArea');

  if (lookupForm && displayArea) {
    lookupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = document.getElementById('lookupRef');
      var errorSpan = document.getElementById('lookupRefError');
      var query = input.value.trim();

      if (!query) {
        window.AppValidator.setFieldError(input, errorSpan, 'Please enter your phone number or booking reference ID.');
        input.focus();
        return;
      }

      window.AppValidator.setFieldError(input, errorSpan, '');
      var cleanQuery = query.toLowerCase().replace(/\s+/g, '');
      var bookings = getStoredBookings();

      // Search match by reference ID or phone
      var match = bookings.find(function (b) {
        return (b.refId && b.refId.toLowerCase() === cleanQuery) ||
               (b.customerPhone && b.customerPhone === query.replace(/\D/g, ''));
      });

      if (match) {
        displayArea.innerHTML =
          '<div class="status-card">' +
            '<div class="status-card-header">' +
              '<strong>Ref: ' + escapeHtml(match.refId) + '</strong>' +
              '<span class="status-tag">' + escapeHtml(match.status) + '</span>' +
            '</div>' +
            '<div class="status-grid">' +
              '<div><strong>Passenger:</strong> ' + escapeHtml(match.customerName) + '</div>' +
              '<div><strong>Contact:</strong> +91 ' + escapeHtml(match.customerPhone) + '</div>' +
              '<div><strong>Vehicle:</strong> ' + escapeHtml(match.vehicleClass) + '</div>' +
              '<div><strong>Date & Time:</strong> ' + escapeHtml(match.travelDate) + ' at ' + escapeHtml(match.travelTime) + '</div>' +
              '<div><strong>Pickup:</strong> ' + escapeHtml(match.pickupLocation) + '</div>' +
              '<div><strong>Destination:</strong> ' + escapeHtml(match.dropLocation) + '</div>' +
            '</div>' +
            '<p style="margin-top: 12px; margin-bottom: 0; font-size: 0.825rem; color: #4a5568;">' +
              'Office Dispatch Desk: S20 Bhakti Nivas, Pandharpur. Call +91 98000 00000 for modifications.' +
            '</p>' +
          '</div>';
      } else {
        displayArea.innerHTML =
          '<div class="notification-box notification-error">' +
            'No booking record found for "' + escapeHtml(query) + '". Please double-check your 10-digit number or call dispatch at +91 98000 00000.' +
          '</div>';
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 7. Contact / Inquiry Form
   * ------------------------------------------------------------------------ */
  var inquiryForm = document.getElementById('inquiryForm');
  var inquiryStatus = document.getElementById('inquiryStatusNotification');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var V = window.AppValidator;
      V.clearFormErrors(inquiryForm);

      var name = document.getElementById('inqName');
      var nameErr = document.getElementById('inqNameError');
      var phone = document.getElementById('inqPhone');
      var phoneErr = document.getElementById('inqPhoneError');
      var msg = document.getElementById('inqMessage');
      var msgErr = document.getElementById('inqMessageError');

      var valid = true;
      if (!V.isNotEmpty(name.value, 2)) {
        V.setFieldError(name, nameErr, 'Please enter your name.');
        valid = false;
      }
      if (!V.isValidPhone(phone.value)) {
        V.setFieldError(phone, phoneErr, 'Please enter a valid 10-digit phone number.');
        valid = false;
      }
      if (!V.isNotEmpty(msg.value, 5)) {
        V.setFieldError(msg, msgErr, 'Please provide details of your inquiry (at least 5 characters).');
        valid = false;
      }

      if (!valid) return;

      if (inquiryStatus) {
        inquiryStatus.style.display = 'block';
        inquiryStatus.innerHTML =
          '<div class="notification-box notification-success">' +
            'Thank you, ' + escapeHtml(name.value.trim()) + '. Your inquiry has been received at our S20 Bhakti Nivas office. A dispatch coordinator will contact you shortly.' +
          '</div>';
      }
      inquiryForm.reset();
    });
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
});