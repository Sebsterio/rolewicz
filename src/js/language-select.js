(function () {
	const form = document.querySelector(".js-lang-select");
	const legend = form.querySelector(".js-lang-legend");
	const dropdown = form.querySelector(".js-lang-options");

	function updateSelect() {
		const language = window.localStorage.getItem("language");
		if (form.language.value !== language) {
			form.language.value = language;
		}
		const selectedLabel = form.querySelector("input:checked + label");
		legend.innerHTML = selectedLabel.innerText;
	}

	// Handle option selection
	form.addEventListener("input", function (e) {
		const lang = e.target.value;
		setLanguage(lang); // set-language.js
		updateSelect();
	});

	// Toggle dropdown
	document.addEventListener("click", function (e) {
		if (e.target === legend) dropdown.classList.toggle("open");
		else dropdown.classList.remove("open");
	});

	updateSelect();
})();
