"use strict";

(function() {
    const userIdElem = document.querySelector("#userId");
    const addOptionBtn = document.querySelector("#addOption-js");
    const form = document.querySelector("#addPollForm");
    const pollOptions = document.querySelector("#pollOptions");
    
    addOptionBtn.onclick = () => {
        createNewOption();
        deleteRemoveBtn();
        createRemoveBtn();
    };
    
    function createNewOption() {
        const optionsNum = form.querySelectorAll(".options").length;
        const option = document.createElement("input");
        option.type = "text";
        option.name = "option" + (optionsNum + 1);
        option.classList.add("options");
        option.classList.add("form-control");
        option.required = true;
        option.setAttribute("placeholder", "Enter an option");
        pollOptions.insertBefore(option, userIdElem);
        const br = document.createElement("br");
        pollOptions.insertBefore(br, userIdElem);
    }
    
    function createRemoveBtn() {
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn");
        removeBtn.classList.add("btn-addRemoveElements");
        removeBtn.id = "removeOption-js";
        removeBtn.type = "button";
        removeBtn.innerHTML = "↑";
        form.insertBefore(removeBtn, addOptionBtn);
        removeBtn.onclick = () => {
            const optionsNum = deleteLastOption();
            if (optionsNum == 2) deleteRemoveBtn();
        };
    }
    
    function deleteRemoveBtn() {
        const removeBtn = form.querySelector("#removeOption-js");
        if (removeBtn) form.removeChild(removeBtn);
    }
    
    function deleteLastOption() {
        const options = form.querySelectorAll(".options");
        const lastOption = options[options.length - 1];
        const lastBr = lastOption.nextSibling;
        pollOptions.removeChild(lastOption);
        pollOptions.removeChild(lastBr);
        return form.querySelectorAll(".options").length;
    }
    
    
})();
   