'use strict';
const appUrl = window.location.origin;
const ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, callback) {
      const xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = () => {
         if (xmlhttp.readyState === 4) {
            callback(xmlhttp.response, xmlhttp.status, xmlhttp.statusText, xmlhttp.getResponseHeader("userId"));
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
};