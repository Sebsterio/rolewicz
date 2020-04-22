// Uncomment this block to pull data from spreadhsheet
// Also uncomment Tabletop CDN link in index.html
// (prepend dash in the line below)
//*
Tabletop.init({
	key:
		"https://docs.google.com/spreadsheets/d/1uixytIJj9I2PgDNAqhLyIbt3k4WlHM9QOymvCWJ5p4c/edit?usp=sharing",
	simpleSheet: true,
	order: "id",
	callback: function (data) {
		dataText = JSON.stringify(data).replace(/\\n/gm, "<br>");
		setLanguage();
	},
	error: function (err) {
		console.log("Tabletop fetch error: " + err);
	},
});
//*/

(function () {
	"use strict";

	// Determine browser language
	const userLanguage = (function () {
		const languageString = navigator.language || navigator.userLanguage || "";
		return languageString.split(/[_-]/)[0].toLowerCase();
	})();

	function buildLangSelect(container, languages) {
		console.log("building form");
		const langCodes = Object.keys(languages).filter(function (code) {
			return ["section", "element", "ok"].indexOf(code) < 0;
		});
		container.innerHTML = langCodes
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

	function insertHtml(el, val) {
		if (el.nodeName === "INPUT" || el.nodeName == "TEXTAREA") {
			el.placeholder = val;
		} else {
			el.innerHTML = val;
		}
	}

	window.setLanguage = function (lang) {
		const data = JSON.parse(dataText); // data-text.js
		if (!lang) lang = userLanguage;

		// Handle unsupported languages
		const supportedLanguages = Object.keys(data[0]);
		if (supportedLanguages.indexOf(lang) < 0) lang = "en";

		// update langage select element (language-select.js)
		document.documentElement.dataset.language = lang;

		// Insert text from JSON into HTML elements
		data.forEach(function (row) {
			// build language select element if empty
			if (row.element === "lang-select") {
				const options = document.querySelector(".js-lang-options");
				if (!options.childNodes.length) buildLangSelect(options, row);
			}
			// insert HTML
			else {
				const prefix = row.section === "component" ? "." : "#";
				const selector = prefix + row.section + "--" + row.element;
				const els = document.querySelectorAll(selector);
				const val = row[lang];
				if (els.length > 0)
					els.forEach(function (el) {
						insertHtml(el, val);
					});
				else
					console.log("InsertHtml Error. Element not found. Id: " + selector);
			}
		});
	};

	setLanguage();
})();
