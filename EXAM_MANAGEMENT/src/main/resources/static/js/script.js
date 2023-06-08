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
        let endTime = sessionStorage.getItem('endTime');


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
        function onQuestionSubmit(){
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
          // Delete the selected options and end time from session storage
          sessionStorage.removeItem('selectedOptions');
          sessionStorage.removeItem('endTime');

          console.log("session removed")
//            sessionStorage.clear();

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






const examDuration = 10;

// Check if the end time is stored in session storage
//let endTime = sessionStorage.getItem('endTime');

if (endTime) {
  // Parse the end time from session storage
  endTime = new Date(endTime);
} else {
  // Calculate the end time of the exam
  endTime = new Date(Date.now() + examDuration * 60000);

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
    document.getElementById("timer").textContent = "Your time is up!.  Submitting Automatically";
    // Automatically submit the exam
    document.getElementById("exam-form").submit();
  } else {
    // Update the timer display
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}, 1000);



// Get the total number of questions from session storage data
const selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};
const totalQuestions = Object.keys(selectedOptions).length;

// Get the question list element
const questionList = document.getElementById('question-list');

// Add a list item for each question
for (let i = 1; i <= totalQuestions; i++) {
  const li = document.createElement('li');
  li.textContent = 'Q. ' + i;
  questionList.appendChild(li);
}

// Get the list items in the question list
const listItems = document.querySelectorAll('#question-list li');

// Update the tick mark for each question
listItems.forEach((li, index) => {
  const questionNumber = index + 1;

  // Check if the question has been answered
  if (selectedOptions.hasOwnProperty(questionNumber)) {
    // Add a green tick mark to indicate that the question has been answered
    li.innerHTML = 'Q. ' + questionNumber + ' <span class="tick-mark">⬜</span>';
  } else {
    // Add a blank square for unanswered questions
    li.innerHTML = 'Q. ' + questionNumber + ' <span class="blank-square">✅</span>';
  }
});




/*
// get the total number of pages (questions) from the HTML
const totalPages = parseInt(document.querySelector('.selected-info span:nth-child(3)').textContent);

// get the question list element
const questionList = document.getElementById('question-list');

// add a list item for each question
for (let i = 1; i <= totalPages; i++) {
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
    li.innerHTML += ' .✅';
  } else {
    // add a red cross mark to indicate that the question has been skipped
    li.innerHTML += ' .⬜';
  }
}





<!-- add the script just before the closing </body> tag -->
 // clear the session storage when the exam is submitted
 document.getElementById('question-form').addEventListener('submit', function() {
   sessionStorage.clear();
 });


  // clear the session storage when a new user starts the exam
  *//*window.addEventListener('load', function() {
    sessionStorage.clear();
  });*/


 /*function storeSelectedOptions() {

          let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};
          let questionIds = document.querySelectorAll("input[name='questionIds[]']");
          console.log('questionIds', questionIds);
          for (let i = 0; i < questionIds.length; i++) {
            let questionId = questionIds[i].value;
            let selectedOption = document.querySelector("input[name='question-" + questionId + "']:checked");
            if (selectedOption) {
            selectedOptions[i+1] = {
                id: questionId,
                value: selectedOption.value
            }
              //selectedOptions[questionId] = selectedOption.value;
            }
          }*/