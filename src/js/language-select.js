(function () {
	const form = document.querySelector(".js-lang-select");
	const legend = form.querySelector(".js-lang-legend");
	const dropdown = form.querySelector(".js-lang-options");

	window.updateSelect = function (lang) {
		dropdown.querySelector("[value=" + lang + "]").checked = true; // IE support
		// form.language.value = lang;
		const selectedLabel = dropdown.querySelector("input:checked + label");
		legend.innerHTML = selectedLabel.innerText;
	};

	// Handle option selection
	form.addEventListener("input", function (e) {
		const lang = e.target.value;
		window.localStorage.setItem("language", lang);
		window.setLanguage(lang); // set-language.js
	});

	// Handle option selection (IE)
	if (
		window.navigator.userAgent.indexOf("MSIE ") > 0 ||
		!!navigator.userAgent.match(/Trident.*rv\:11\./)
	) {
		form.addEventListener("click", function (e) {
			if (e.target.tagName !== "INPUT") return;
			const lang = e.target.value;
			window.localStorage.setItem("language", lang);
			window.setLanguage(lang); // set-language.js
		});
	}

	// Toggle dropdown
	document.addEventListener("click", function (e) {
		if (e.target === legend) dropdown.classList.toggle("open");
		else dropdown.classList.remove("open");
	});
})();
