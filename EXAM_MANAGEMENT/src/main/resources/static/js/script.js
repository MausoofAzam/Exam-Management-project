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

/* function to store the options in storage session*/
function setSelectedOptions() {
    let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};
    for (let questionId in selectedOptions) {
        let selectedOption = selectedOptions[questionId];
        let optionElement = document.querySelector("input[name='question-" + questionId + "'][value='" + selectedOption + "']");
        if (optionElement) {
            optionElement.checked = true;
        }
    }
}

setSelectedOptions();




 // Set the duration of the exam in minutes
 const examDuration = 10;

 // Calculate the end time of the exam
 const endTime = new Date(Date.now() + examDuration * 60000);

 // Update the timer every second
 const timer = setInterval(() => {
 // Calculate the remaining time
 const now = new Date();
 const remainingTime = endTime - now;

 // Check if the time is up
 if (remainingTime <= 0) {
 clearInterval(timer);
 document.getElementById("timer").textContent = "Time's up!";
 // Automatically submit the exam
 document.getElementById("exam-form").submit();
 } else {
 // Update the timer display
 const minutes = Math.floor(remainingTime / 60000);
 const seconds = Math.floor((remainingTime % 60000) / 1000);
 document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
 }
 }, 1000);






// get the total number of questions
const totalQuestions = document.querySelectorAll('.question').length;

// get the question list element
const questionList = document.getElementById('question-list');

// add a list item for each question
for (let i = 1; i <= 12; i++) {
    const li = document.createElement('li');
    li.textContent = 'Q. ' + i;
    questionList.appendChild(li);
}


// add the 'selected' class to the list item when a question is selected
li.classList.add('selected');

// add the 'skipped' class to the list item when a question is skipped
li.classList.add('skipped');





