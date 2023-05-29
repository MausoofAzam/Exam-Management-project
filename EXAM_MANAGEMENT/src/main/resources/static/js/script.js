console.log("This is Script File")


const toggleSidebar = () => {
	if ($(".sidebar").is(":visible")) {

		$(".sidebar").css("display", "none")
		$(".content").css("margin-left", "0%")
	} else {
		$(".sidebar").css("display", "block")
		$(".content").css("margin-left", "20%")
	}
};

        function storeSelectedOptions() {
          let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};
          let questionIds = document.querySelectorAll("input[name='questionIds[]']");
          for (let i = 0; i < questionIds.length; i++) {
            let questionId = questionIds[i].value;
            let selectedOption = document.querySelector("input[name='question-" + questionId + "']:checked");
            if (selectedOption) {
              selectedOptions[questionId] = selectedOption.value;
            }
          }
          sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
        }

        // Store the selected options when the next button is clicked
        if(document.getElementById("next-button")){
        document.getElementById("next-button").addEventListener("click", function(event) {
          event.preventDefault();
          storeSelectedOptions();
          window.location.href = this.href;
        });}

        // Submit the form with the stored selected options when the last page is reached
        if (document.querySelector(".submit")) {
          storeSelectedOptions();
          let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};
          for (let questionId in selectedOptions) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "question-" + questionId;
            input.value = selectedOptions[questionId];
            document.getElementById("question-form").appendChild(input);
          }
          for (let questionId in selectedOptions) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "questionIds[]";
            input.value = questionId;
            document.getElementById("question-form").appendChild(input);
          }
        }
