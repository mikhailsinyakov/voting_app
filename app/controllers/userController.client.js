'use strict';

(function () {

   const profileId = document.querySelector('#profile-id') || null;
   const profileUsername = document.querySelector('#profile-username') || null;
   const profileRepos = document.querySelector('#profile-repos') || null;
   const displayName = document.querySelector('#display-name');
   const addPollForm = document.querySelector("#addPollForm");
   const apiUrl = appUrl + '/api/user';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, data => {
      data = JSON.parse(data);
      const userObject = data.github || {};

      if (userObject.displayName) updateHtmlElement(userObject, displayName, 'displayName');
      else if (userObject.username) updateHtmlElement(userObject, displayName, 'username');
      
      if (userObject.id) {
         const log = document.querySelector("#log");
         if (log) {
            log.innerHTML = "Logout";
            log.href =  "/logout";
         }
         
      }
      
      if (addPollForm) {
         const input = document.querySelector("#userId");
         input.value = data._id;
      }
      if (profileId !== null) updateHtmlElement(userObject, profileId, 'id'); 
      if (profileUsername !== null) updateHtmlElement(userObject, profileUsername, 'username');
      if (profileRepos !== null) updateHtmlElement(userObject, profileRepos, 'publicRepos');
      
      if (typeof pollsController != "undefined") pollsController();
      else showContentForAuth();
      
   }));
    
})();
