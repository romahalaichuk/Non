document.addEventListener("DOMContentLoaded", function () {
	const chatHistory = document.getElementById("chat-history");
	const userInput = document.getElementById("user-input");
	const sendButton = document.getElementById("send-button");

	const riddles = [
		{
			question: "Kiedy ona miała najbardziej fantastyczne spotkania? (data)",
			answer: "19",
			hints: [
				"Wtedy on też ma urodziny",
				"W porę, kiedy wampiry czują się wolno",
				"Tylko dwie cyfry",
			],
			// audio: "Audio/feel-the-sunshine-138635.mp3",
		},
		{
			question:
				"Lubię się bawić i zgadnij w jaki sposób, napewno ty to robiłeś?",
			answer: "Pokój zagadek",
			hints: [
				"Tam trzeba być skupionym i dużo myśleć",
				"Razem z tobą tylko w Warszawie",
				"Nie tylko jeden pokój może być",
			],
		},
		{
			question: "Kogo ona kocha?(Imię)",
			answer: "Kamil",
			hints: [
				"Jest przystojny.",
				"Ma ładny uśmiech.",
				"Czuje się z nim super.",
			],
		},
		{
			question: "Gdzie ona mieszka (dzielnica)?",
			answer: "Żoliborz",
			hints: [
				"Blisko Arkadii.",
				"Też jest artystyczny.",
				"Zaczyna się na literę 'Ż'.",
			],
		},
		{
			question:
				"Czy już wiesz o kim mowa? i kim ona jest? Napewno chcesz napisać go imię?",
			answer: "Marta",
			hints: [
				"Zaczyna się na 'M' a kończy się na 'a' ",
				"Taka jest gatunek kotów",
				"Rzadko używane imię",
			],
		},
	];

	let currentRiddleIndex = 0;
	let currentRiddle = riddles[currentRiddleIndex];
	let hintCount = 0;
	let audioPlaying = false;
	let audioElement;
	let audioInterval;

	function initializeChatbot() {
		setTimeout(function () {
			typeMessage("Hejka Kamilek, widzę że jesteś", "bot", 20);
		}, 1000);

		// Wiadomość audio
		setTimeout(function () {
			typeMessage(
				"Mam nadzieję że jesteś w drodzę, bo ja wszysko o tobie wiem",
				"bot",
				20
			);
		}, 5000);

		setTimeout(function () {
			typeMessage(
				"A ty o dużo wiesz? Jeżeli będziesz potrzebować pomocy to napisz 'podpowiedź'",
				"bot",
				20
			);
			appendRiddleQuestion();
		}, 8000);
	}
	sendButton.addEventListener("click", function () {
		sendUserMessage();
	});

	userInput.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			sendUserMessage();
		}
	});

	function sendUserMessage() {
		let userMessage = userInput.value.trim();
		if (userMessage) {
			userMessage = capitalizeFirstLetter(userMessage);
			appendMessage(userMessage, "user");
			if (userMessage === "Podpowiedź") {
				giveHint();
			} else {
				checkAnswer(userMessage);
			}
		}
		userInput.value = "";
	}

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function appendMessage(message, sender) {
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("message", sender);

		const textDiv = document.createElement("div");
		messageDiv.appendChild(textDiv);

		chatHistory.appendChild(messageDiv);

		const text = message;
		let index = 0;

		function type() {
			if (index < text.length) {
				textDiv.innerHTML += text.charAt(index);
				index++;
				setTimeout(type, 50); // Efekt pisania: opóźnienie między znakami
			}
		}

		type();
		chatHistory.scrollTop = chatHistory.scrollHeight;
	}

	function appendAudioMessage(audioSrc) {
		const audioMessageDiv = document.createElement("div");
		audioMessageDiv.classList.add("message", "bot");

		const audio = new Audio(audioSrc);
		audioElement = audio;

		const audioButton = document.createElement("button");
		audioButton.classList.add("audio-button");
		audioButton.innerHTML = "&#9654;";
		audioButton.addEventListener("click", () => {
			if (!audioPlaying) {
				playAudio(audio);
			} else {
				pauseAudio();
			}
		});

		audioMessageDiv.appendChild(audioButton);

		chatHistory.appendChild(audioMessageDiv);
		chatHistory.scrollTop = chatHistory.scrollHeight;
	}

	function appendRiddleQuestion() {
		const botMessageDiv = document.createElement("div");
		botMessageDiv.classList.add("message", "bot");

		const questionDiv = document.createElement("div");
		botMessageDiv.appendChild(questionDiv);
		chatHistory.appendChild(botMessageDiv);

		const text = currentRiddle.question;
		let index = 0;

		function type() {
			if (index < text.length) {
				questionDiv.innerHTML += text.charAt(index);
				index++;
				setTimeout(type, 8); // Efekt pisania: opóźnienie między znakami
			}
		}

		type();
		chatHistory.scrollTop = chatHistory.scrollHeight;

		if (currentRiddle.audio) {
			const audio = new Audio(currentRiddle.audio);
			audioElement = audio;

			const audioButton = document.createElement("button");
			audioButton.classList.add("audio-button");
			audioButton.innerHTML = "&#9654;";
			audioButton.addEventListener("click", () => {
				if (!audioPlaying) {
					playAudio(audio);
				} else {
					pauseAudio();
				}
			});

			botMessageDiv.appendChild(audioButton);
		}
	}

	function playAudio(audio) {
		audio.play();
		audioPlaying = true;
		audioInterval = setInterval(() => {
			const remainingTime = audio.duration - audio.currentTime;
			const minutes = Math.floor(remainingTime / 60);
			const seconds = Math.floor(remainingTime % 60);
			const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
			updateAudioButton("&#10073;&#10073; " + timeString);
		}, 1000);
	}

	function pauseAudio() {
		audioElement.pause();
		clearInterval(audioInterval);
		updateAudioButton("&#9654;");
		audioPlaying = false;
	}

	function updateAudioButton(html) {
		const audioButton = document.querySelector(".audio-button");
		audioButton.innerHTML = html;
	}

	function checkAnswer(userAnswer) {
		const correctAnswer = currentRiddle.answer;
		if (userAnswer === correctAnswer) {
			appendMessage("Super lecimy dalej", "bot");
			moveToNextRiddle();
		} else {
			appendMessage("Zastanów się jeszcze raz", "bot");
		}
	}

	function giveHint() {
		if (hintCount < currentRiddle.hints.length) {
			const hint = currentRiddle.hints[hintCount];
			hintCount++;
			appendMessage("Okej, masz podpowiedź" + hint, "bot");
		} else {
			appendMessage(
				"Niestery ale, prawidlowo będzie '" + currentRiddle.answer + "'.",
				"bot"
			);
			moveToNextRiddle();
		}
	}

	function moveToNextRiddle() {
		hintCount = 0;
		currentRiddleIndex++;
		if (currentRiddleIndex < riddles.length) {
			currentRiddle = riddles[currentRiddleIndex];
			setTimeout(appendRiddleQuestion, 1000); // Opóźnienie 1 sekundy przed następną zagadką
		} else {
			appendMessage(
				"Nie wierżę, zgadnełeś napewno hehhe. Ale i tak czekam na ciebię :) ",
				"bot"
			);
		}
	}
	function typeMessage(message, sender, typingSpeed) {
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("message", sender);

		const textDiv = document.createElement("div");
		messageDiv.appendChild(textDiv);

		chatHistory.appendChild(messageDiv);

		const text = message;
		let index = 0;

		function type() {
			if (index < text.length) {
				textDiv.innerHTML += text.charAt(index);
				index++;
				setTimeout(type, typingSpeed); // Zmieniona wartość dla szybkości pisania
			}
		}

		type();
		chatHistory.scrollTop = chatHistory.scrollHeight;
	}

	initializeChatbot();
});
