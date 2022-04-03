import searchEvents from './index';

const searchForm = document.querySelector(".form__input");
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");
const info = document.querySelector(".info");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if(SpeechRecognition) {
  // console.log("Your Browser supports speech Recognition");
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";

  searchForm.insertAdjacentHTML("beforeend", '<button class="form-input-btn" type="button"><i class="fas fa-microphone-slash"></i></button>');
  searchFormInput.style.paddingRight = "50px";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if(micIcon.classList.contains("fa-microphone-slash")) { // Start Voice Recognition
      recognition.start(); // First time you have to allow access to mic!
    }
    else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Voice activated, SPEAK");
  }

  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }
  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    // console.log(event.results[current][0]);
    // console.log(searchEvents);
    // searchEvents(event);


    if (transcript.toLowerCase().trim() === "stop recording") {
      console.log('stop recording');
      recognition.stop();
    }
    else if (!searchFormInput.value) {
      console.log('пустое');
      searchFormInput.value = transcript;
    }
    else {
      if (transcript.toLowerCase().trim() === "go") {
        console.log('go');
        // searchForm.submit();
        searchEvents(event)
      }
      else if (transcript.toLowerCase().trim() === "reset input") {
        console.log('reset input');
        searchFormInput.value = "";
      }
      else {
        console.log('не пустое и при этом не  go/reset');
        searchFormInput.value = transcript;
      }
    }
    // searchFormInput.value = transcript;
    // searchFormInput.focus();
    // setTimeout(() => {
    //   searchForm.submit();
    // }, 500);
  }
//   info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
  
}
else {
  console.log("Your Browser does not support speech Recognition");
//   info.textContent = "Your Browser does not support Speech Recognition";
}