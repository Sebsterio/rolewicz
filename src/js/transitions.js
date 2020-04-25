(function () {
	"use strict";

	const IMG_PEEK_THRESHOLD = 70;
	const PARALLAX_PEEK_THRESHOLD = -250;
	const HEADER_OFFSET_THRESHOLD = 70;
	const LAZYLOAD_THRESHOLD = -500;

	const rellax = new Rellax(".parallax");

	const header = document.querySelector("#header");
	const hero = document.querySelector(".hero");
	const parallax = document.querySelector(".parallax-container");
	const images = document.querySelectorAll(".js-on-scroll");
	var lazy = document.querySelectorAll(".lazy");

	var headerHeight = header.offsetHeight;

	// ---------------------------------------------------------------------

	// threshold < 0 --> image near viewports
	function isPeekingIntoViewport(img, threshold) {
		const rect = img.getBoundingClientRect();
		const imgIsAboveViewport = rect.bottom - threshold < headerHeight;
		const imgIsBelowViewport = rect.top + threshold > window.innerHeight;
		return !imgIsBelowViewport && !imgIsAboveViewport;
	}

	// toggle header styles
	function updateHeader() {
		if (window.pageYOffset > HEADER_OFFSET_THRESHOLD)
			document.body.classList.add("page-on-scroll");
		else document.body.classList.remove("page-on-scroll");
	}

	// disable parallax when not in view
	function toggleParallax() {
		if (isPeekingIntoViewport(parallax, PARALLAX_PEEK_THRESHOLD)) {
			rellax.refresh();
		} else {
			rellax.destroy();
		}
	}

	// fade in images
	function updateImages() {
		images.forEach(function (img) {
			// is any part of the img within viewport
			if (isPeekingIntoViewport(img, IMG_PEEK_THRESHOLD)) {
				img.classList.add("active");
			}
			// entire image is outside viewport
			else if (!isPeekingIntoViewport(img, 0)) {
				img.classList.remove("active");
			}
		});
	}

	// load image files
	function lazyload() {
		lazy.forEach(function (el) {
			if (isPeekingIntoViewport(el, LAZYLOAD_THRESHOLD)) {
				el.classList.remove("lazy");

				// img
				if (el.tagName === "IMG" && el.dataset.src) {
					el.src = el.dataset.src;
					el.removeAttribute("data-src");
					if (el.matches("img[src$=webp]")) preloadImages([el]);
				}
				// bg
				else if (el.classList.contains("preload-bg")) preloadBackgrounds([el]);

				// remove element from watched list
				lazy = document.querySelectorAll(".lazy");
			}
		});
	}

	function handleScroll() {
		updateHeader();
		if (parallax) toggleParallax();
		if (images.length) updateImages();
		if (lazy.length) lazyload();
	}

	// Debounce
	const interval = 100;
	var scheduled = false;
	function debounceScroll() {
		if (!scheduled) {
			scheduled = true;
			setTimeout(function () {
				scheduled = false;
				/* without timeout, window.offsetY is received when the scrolling starts,
				instead of when it ends */
				setTimeout(handleScroll, 150);
			}, interval);
		}
	}

	// ---------------------------------------------------------------------

	window.addEventListener("scroll", debounceScroll);
	window.addEventListener("resize", function () {
		headerHeight = header.offsetHeight;
	});

	debounceScroll();

	setTimeout(function () {
		hero.classList.add("active");
	}, 500);
})();
