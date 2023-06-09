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






const examDuration = 5; // duration of the exam in minutes
// Check if the end time is stored in session storage
let endTime = sessionStorage.getItem('endTime');

if (endTime) {
  // Parse the end time from session storage
  endTime = new Date(endTime);
} else {
  // Calculate the end time of the exam
  const now = new Date();
  endTime = new Date(now.getTime() + examDuration * 60000);

  // Store the end time in session storage
  sessionStorage.setItem('endTime', endTime);
}


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
   document.getElementById("question-form").submit();

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
for (let i = 1; i <= 10; i++) {
    const li = document.createElement('li');
    li.textContent = 'Q. ' + i;
    questionList.appendChild(li);
}


// get the selected options from session storage
let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};

// get the list items in the question list
let listItems = document.querySelectorAll('#question-list li');

// iterate through the list items
for (let i = 0; i <= listItems.length; i++) {
  let li = listItems[i];
  let questionNumber = i + 1;

  // check if the question has been answered
  if (selectedOptions.hasOwnProperty(questionNumber)) {
    // add a green tick mark to indicate that the question has been answered
    li.innerHTML += '  .✅';
  } else {
    // add a red cross mark to indicate that the question has been skipped
    li.innerHTML += '  .⬜';
  }
}


/*
function updateTickMarks(selectedOptions) {
const totalQuestions = Object.keys(selectedOptions).length;

const questionList = document.getElementById('question-list');

questionList.innerHTML = '';

// Add a list item for each question
for (let i = 1; i <= totalQuestions; i++) {
const li = document.createElement('li');
li.textContent = 'Q. ' + i;

// Check if the question has been answered
if (selectedOptions.hasOwnProperty(i)) {
// Add a green tick mark to indicate that the question has been answered
li.innerHTML += ' <span class="tick-mark">✅</span>';
} else {
// Add a blank square for unanswered questions
li.innerHTML += ' <span class="blank-square">⬜</span>';
}

questionList.appendChild(li);
}
}

// AJAX request in the exam page retrieves session storage data
// Pass the session storage data to the updateTickMarks function
$(document).ready(function() {
$.ajax({
url: '/retrieve-session-data',
method: 'GET',
success: function(response) {
updateTickMarks(response.selectedOptions);
},
error: function(error) {
console.error('Failed to retrieve session data:', error);
}
});
});*/
