'use strict';

function pollsController () {

   const path = window.location.pathname;
   const pollName = document.querySelector("#pollName");
   const isShowPollPage = !!pollName;
   const isPollsPage = path == "/polls";
   const isMyPollsPage = path == "/my_polls";
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + "/api/polls", (polls, status, statusText, userId) => {
      
      if (status !== 200) {
         const h2 = document.querySelector("h2");
         h2.innerHTML = `Error: ${status} ${statusText}`;
         h2.style.textAlign = "left";
         return;
      }
      
      polls = JSON.parse(polls);
      
      if (isPollsPage || isMyPollsPage) updatePolls(polls, userId);
      if (isMyPollsPage) {
         document.querySelector("#home").classList.remove("active");
         document.querySelector("#my_polls").classList.add("active");
      }
      
      if (isShowPollPage) {
         const pollsId = window.location.pathname.split("/")[2];
         const poll = polls.filter(val => val._id == pollsId)[0];
         showPoll(poll, pollsId);
         if (userId) addOnclickToAddOptionBtn(pollsId);
         if (userId && poll.user_id == userId) createRemoveBtn();
         drawChart(poll.options);
      }
      
      showContentForAuth();
      
   }));
   
   function updatePolls (polls, userId) {
      const container = document.querySelector(".container");
      
      // Create description
      const h2 = container.querySelector("h2");
      const par = document.createElement("p"); 
      h2.innerHTML = "Voting app";
      par.innerHTML = "Select a poll to see the results and vote, or log-in to make a new poll.";
      container.appendChild(par);
      
      // Create add-new-poll button
      const anchor = document.createElement("a");
      anchor.classList.add("isAuth");
      anchor.classList.add("false");
      anchor.classList.add("btn");
      anchor.classList.add("btn-primary");
      anchor.id = "addNewPoll";
      anchor.href = "/addPoll";
      anchor.innerHTML = "Make a new poll";
      container.appendChild(anchor);
      
      // Create poll's list
      const list = document.createElement("div");
      list.classList.add("list-group");
      list.id = "pollsList";
      container.appendChild(list);
      
      if (isMyPollsPage) polls = polls.filter(val => val.user_id == userId);
      
      if (!polls.length) {
         const p = document.createElement("p");
         p.innerHTML = "No polls created yet.";
         list.appendChild(p);
      }
      
      polls.forEach(val => createPollItem(list, val._id, val.name, isMyPollsPage));
   }
   
   function showPoll (poll, id) {
      if (!poll) return pollName.innerHTML = "Not found";
      const parent = document.querySelector(".left-side");
      const addOptionBtn = document.querySelector("#addOption-js");
      pollName.innerHTML = poll.name;
      poll.options.forEach(val => {
         const btn = document.createElement("button");
         btn.classList.add("btn");
         btn.classList.add("btn-secondary");
         btn.classList.add("btn-sm");
         btn.type = "button";
         btn.style.marginTop = "10px";
         btn.innerHTML = val.name;
         btn.onclick = () => {
            if (confirm(`Do you want to vote for '${val.name}'?`)) {
               ajaxFunctions.ready(ajaxFunctions.ajaxRequest('PUT', 
                                                             `${appUrl}/api/${id}/voteFor/${val.name}`, 
                                                             (data, status) => {
                                                                  if (status == 403) {
                                                                     alert("You have already voted");
                                                                  }
                                                                  window.location.reload();
                                                               }));
            }
         };
         parent.insertBefore(btn, addOptionBtn);
         const br = document.createElement("br");
         parent.insertBefore(br, addOptionBtn);
      });
   }
   
   
   function createRemoveBtn () {
      const pollsId = window.location.pathname.split("/")[2];
      const btn = document.createElement("button");
      btn.type = "submit";
      btn.classList.add("btn");
      btn.classList.add("btn-primary");
      btn.innerHTML = "Delete poll";
      btn.onclick = () => {
         if (confirm("Do you want to delete this poll?")) {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', 
                                                         `${appUrl}/api/${pollsId}/deletePoll`, 
                                                         () => window.location.href = window.location.origin));
         }
      };
   
      const div = document.querySelector(".left-side");
      div.appendChild(btn);
   }
   
   function createPollItem(parent, id, name, addBtn) {
      const anchor = document.createElement("a");
      anchor.href = "/polls/" + id;
      anchor.classList.add("list-group-item");
      anchor.innerHTML = name;
      parent.appendChild(anchor);
      if (addBtn) {
         const i = document.createElement("i"); 
         i.onclick = e => {
            e.preventDefault();
            if (confirm("Do you want to delete this poll?")) {
               ajaxFunctions.ajaxRequest('DELETE', 
                                          `${appUrl}/api/${id}/deletePoll`, 
                                          () => window.location.reload());
            }
         };
         i.classList.add("fa");
         i.classList.add("fa-remove");
         i.style.marginLeft = "10px";
         anchor.appendChild(i);
      }
   }
   
   function addOnclickToAddOptionBtn(id) {
      const addOption = document.querySelector("#addOption-js");
      addOption.onclick = () => {
         const input = document.createElement("input");
         input.type = "text";
         input.name = "newOption";
         input.classList.add("form-control");
         input.classList.add("col-sm-4");
         input.setAttribute("placeholder", "Enter an option");
         input.style.marginTop = "15px";
         addOption.parentNode.insertBefore(input, addOption);
         addOption.parentNode.removeChild(addOption);
         input.onblur = () => {
            if (input.value != "") {
               ajaxFunctions.ajaxRequest('PUT', 
                                         `${appUrl}/api/${id}/addOption/${input.value}`, 
                                         (data, status) => {
                                             if (status == 403) alert("You have already added option to this poll!");
                                                 window.location.reload();
                                             });
            }
         };
      };
   }
  
}
