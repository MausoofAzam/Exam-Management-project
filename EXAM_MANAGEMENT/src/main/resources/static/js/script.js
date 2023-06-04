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






// set the exam duration in minutes
const examDuration = 60;

// calculate the end time
const endTime = new Date().getTime() + examDuration * 60000;

// update the timer every second
const timer = setInterval(function() {
    // calculate the time left
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    // calculate the minutes and seconds left
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // update the timer display
    document.getElementById('time').innerHTML = minutes + "m " + seconds + "s ";

    // stop the timer when the time is up
    if (timeLeft < 0) {
        clearInterval(timer);
        document.getElementById('time').innerHTML = "Time's up!";
        // submit the exam form here
    }
}, 1000);

// get the question elements
const questions = document.querySelectorAll('.question');

// hide all questions except the first one
for (let i = 1; i < questions.length; i++) {
    questions[i].style.display = 'none';
}

// add event listeners to the previous and next buttons
document.getElementById('previous-button').addEventListener('click', showPreviousQuestion);
document.getElementById('next-button').addEventListener('click', showNextQuestion);

// keep track of the current question index
let currentQuestionIndex = 0;

function showPreviousQuestion() {
    // hide the current question
    questions[currentQuestionIndex].style.display = 'none';

    // decrement the current question index
    currentQuestionIndex--;

    // show the previous question
    questions[currentQuestionIndex].style.display = 'block';
}

function showNextQuestion() {
    // hide the current question
    questions[currentQuestionIndex].style.display = 'none';

    // increment the current question index
    currentQuestionIndex++;

    // show the next question
    questions[currentQuestionIndex].style.display = 'block';
}





