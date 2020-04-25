// Parse translation data (from data-text.js)
dataText = JSON.parse(dataText);

(function () {
	"use strict";

	const dropdown = document.querySelector(".js-lang-options");
	const langForm = document.querySelector(".js-lang-select");

	// Add options to select-language form from languages available in database
	function buildLangSelect(row) {
		const languages = Object.assign({}, row);
		delete languages.section;
		delete languages.element;

		if (dropdown.childNodes.length === languages.length) return;

		const langCodes = Object.keys(languages);
		dropdown.innerHTML = langCodes
			.map(function (code) {
				const label = languages[code];
				return (
					'<input type="radio" name="language" value="' +
					code +
					'" id="language-' +
					code +
					'">' +
					'<label for="language-' +
					code +
					'">' +
					label +
					"</label>"
				);
			})
			.join("");
	}

	// Update element with translated content
	function insertHtml(row, lang) {
		const prefix = row.section === "component" ? "." : "#";
		const selector = prefix + row.section + "--" + row.element;
		const els = document.querySelectorAll(selector);
		const val = row[lang].replace(/\\n/gm, "<br>");
		if (els.length > 0)
			els.forEach(function (el) {
				if (el.nodeName === "INPUT" || el.nodeName == "TEXTAREA") {
					el.placeholder = val;
				} else {
					el.innerHTML = val;
				}
			});
		else console.log("InsertHtml Error. Element not found. Id: " + selector);
	}

	// Insert translated text into HTML elements
	function translateSite(lang, data) {
		data.forEach(function (row) {
			if (row.element === "lang-select") buildLangSelect(row);
			else insertHtml(row, lang);
		});
	}

	// Determine browser language
	const browserLanguage = (function () {
		const languageString = navigator.language || navigator.userLanguage || "";
		return languageString.split(/[_-]/)[0].toLowerCase();
	})();

	function getClientLanguage(data) {
		// Check preference in localStorage when initializing app
		var lang = window.localStorage.getItem("language");

		// Get preference from user browser & handle unsupported languages
		if (!lang) {
			lang = browserLanguage;
			const supportedLanguages = Object.keys(data[0]);
			if (supportedLanguages.indexOf(lang) < 0) lang = "en";
		}

		return lang;
	}

	// Set correct site language with up-to-date translation data
	window.setLanguage = function (lang) {
		const data = window.dataText; // data-text.js

		// Automatically set language on site load
		if (!lang) lang = getClientLanguage(data);

		// Update view
		translateSite(lang, data);
		window.updateSelect(lang); // layout-select.js
	};

	// Update site content preserving currently selected language
	function updateTranslation(data) {
		const currentLang = langForm.language.value;
		setLanguage(currentLang);
	}

	function fetchTranslation(callback) {
		Tabletop.init({
			key:
				"https://docs.google.com/spreadsheets/d/1uixytIJj9I2PgDNAqhLyIbt3k4WlHM9QOymvCWJ5p4c/edit?usp=sharing",
			simpleSheet: true,
			order: "id",
			// update translation with remote data when available
			callback: callback,
			error: function (err) {
				console.log("Tabletop fetch error: " + err);
			},
		});
	}

	// --------------------------------- Init ------------------------------------------

	// Translate site with local data on doc load
	setLanguage(null);

	// Translate site with remote data when available
	fetchTranslation(updateTranslation);
})();
