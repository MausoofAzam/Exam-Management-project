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



   // Function to start the timer
          function startTimer(duration, display) {
              var timer = duration, minutes, seconds;
              setInterval(function () {
                  minutes = parseInt(timer / 60, 10);
                  seconds = parseInt(timer % 60, 10);

                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;

                  display.textContent = minutes + ":" + seconds;

                  if (--timer < 0) {
                      timer = 0;
                      // Perform actions when the time expires
                      // For example, submit the form or display a message
                      alert("Time has expired!");
                      document.getElementById("question-form").submit();
                  }
              }, 1000);
          }

          // Function to initialize the timer
          function initializeTimer(duration) {
              var display = document.querySelector('#timer');
              startTimer(duration, display);
          }

          // Call the initializeTimer function with the desired duration in seconds (10 minutes = 600 seconds)
          initializeTimer(60);


// Get the number of questions from your data
const numQuestions = 10/* insert the number of questions here */;

// Get the table row element
const tr = document.querySelector('#question-table tr');

// Add a table cell for each question
for (let i = 1; i <= numQuestions; i++) {
  const td = document.createElement('td');
  td.textContent = `${i}`;
  tr.appendChild(td);
}

// Add an event listener to the form to detect when a user attempts a question
document.getElementById('question-form').addEventListener('change', (event) => {
  // Get the index of the attempted question
  const index = [...event.target.form.elements].indexOf(event.target) / 5;

  // Update the corresponding table cell
  tr.children[index].classList.add('attempted');
});

