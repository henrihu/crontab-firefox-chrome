function fillInputsUW(task) {
  elem = document.querySelector(task.hourlyRateSelector);
  elem.value = task.hourlyRate;

  elem = document.querySelector(task.coverLetterSelector);
  elem.value = task.coverLetter;

  elemSubmit = document.querySelector(task.submitButtonSelector);
  elemSubmit.click();
}

function submitBidUW(connectionCount) {

}