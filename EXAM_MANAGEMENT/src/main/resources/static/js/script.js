

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


// Retrieve the user ID from the HTML page
const userIdElement = document.querySelector('.selected-info h5 span');
const userId = userIdElement.textContent;

// Make the AJAX call to the server to retrieve the question IDs
fetch(`/user/get-question-ids?userId=${userId}`)
  .then(response => response.json())
  .then(data => {
    const idlist = data;
    const questionList = document.getElementById('question-list');
    for (let i = 0; i < idlist.length; i++) {
      const li = document.createElement('li');
      li.setAttribute('data-question-id', idlist[i]);
      li.textContent = 'Q. ' + (i + 1);
      questionList.appendChild(li);
    }

    // get the selected options from session storage
    let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};

    // get the list items in the question list
    let listItems = document.querySelectorAll('#question-list li');

    // iterate through the list items
    for (let i = 0; i < listItems.length; i++) {
      let li = listItems[i];

      // retrieve the question ID from the data-question-id attribute
      let questionId = li.getAttribute('data-question-id');

      // check if the question has been answered
      if (selectedOptions.hasOwnProperty(questionId)) {
        // add a green tick mark to indicate that the question has been answered
        li.innerHTML += '  .✅';
      } else {
        // add a red cross mark to indicate that the question has been skipped
        li.innerHTML += '  .⬜';
      }
    }
  });
 /* // Define a function that resets all of the user's selected options
  function resetSelectedOptions() {
    // clear the selected options in session storage
    sessionStorage.setItem("selectedOptions", JSON.stringify({}));

    // update the display of all tick marks
    let listItems = document.querySelectorAll('#question-list li');
    for (let i = 0; i < listItems.length; i++) {
      let li = listItems[i];
      li.innerHTML = li.innerHTML.replace('✅', '⬜');
    }
  }*/


/*// Define a function that unselects the answer to the current question
function unselectAnswer() {
  // get the current question ID from the data-question-id attribute of the active list item
  let activeListItem = document.querySelector('#question-list li.active');
  let questionId = activeListItem.getAttribute('data-question-id');

  // get the selected options from session storage
  let selectedOptions = JSON.parse(sessionStorage.getItem("selectedOptions")) || {};

  // remove the selected option for the current question
  delete selectedOptions[questionId];
console.log("questionId",questionId);
  // update session storage
  sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
console.log("selectedOptions" ,selectedOptions);
  // update the display of the tick mark for the current question
  activeListItem.innerHTML = activeListItem.innerHTML.replace('✅', '⬜');
}*/

   /*<div th:if="${pageNumber > 1}">
            <a th:href="@{/user/assigned-question(pageNumber=${pageNumber - 1})}" class="btn btn-info btn-sm" id="previous-button" onclick="unselectAnswer()">Previous</a>
          </div>
*/