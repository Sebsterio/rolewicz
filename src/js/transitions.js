(function () {
	"use strict";

	const IMG_PEEK_THRESHOLD = 70;
	const HEADER_OFFSET_THRESHOLD = 70;
	const LAZYLOAD_THRESHOLD = -500;
	const PARALLAX_PEEK_THRESHOLD = -250;
	const PARALLAX_MIN_WIDTH = 768;

	const rellax = new Rellax(".parallax");

	const header = document.querySelector("#header");
	const hero = document.querySelector(".hero");
	const parallax = document.querySelector(".parallax-container");
	const images = document.querySelectorAll(".js-on-scroll");
	const aboutSection = document.querySelector(".js-about");
	var lazy = document.querySelectorAll(".lazy");

	var headerHeight = 0;
	var windowWidth = 0;

	// ---------------------------------------------------------------------

	function updateWindowWidth() {
		windowWidth =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
	}

	function updateHeaderHeight() {
		headerHeight = header.offsetHeight;
	}

	function limitAboutSectionHeight() {
		if (windowWidth > 2100) {
			aboutSection.style.height = "830px";
			aboutSection.style.minHeight = "0";
		} else {
			aboutSection.style.height = null;
			aboutSection.style.minHeight = null;
		}
	}

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

	// disable parallax when not in view or on mobile
	function toggleParallax() {
		if (
			windowWidth < PARALLAX_MIN_WIDTH ||
			!isPeekingIntoViewport(parallax, PARALLAX_PEEK_THRESHOLD)
		) {
			rellax.destroy();
		} else {
			rellax.refresh();
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
					if (el.src.includes(".webp")) preloadImages([el]);
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
	window.addEventListener("resize", function (e) {
		updateHeaderHeight();
		updateWindowWidth();
		toggleParallax();
		limitAboutSectionHeight();
	});

	updateHeaderHeight();
	updateWindowWidth();
	debounceScroll();

	setTimeout(function () {
		hero.classList.add("active");
	}, 500);
})();
