(function () {
	"use strict";

	const IMG_PEEK_THRESHOLD = 70;
	const PARALLAX_PEEK_THRESHOLD = -150;
	const HEADER_OFFSET_THRESHOLD = 70;

	const rellax = new Rellax(".parallax");

	const header = document.querySelector("#header");
	const hero = document.querySelector(".hero");
	const parallax = document.querySelector(".parallax-container");
	const images = document.querySelectorAll(".js-on-scroll");

	var headerHeight = header.offsetHeight;

	// ---------------------------------------------------------------------

	// threshold < 0 --> image near viewports
	function isPeekingIntoViewport(windowY, img, threshold) {
		const windowBottomScrollY = windowY + window.innerHeight;
		const imgIsBelowViewport = img.offsetTop + threshold > windowBottomScrollY;
		const imgOffsetBottom = img.offsetTop + img.offsetHeight;
		const imgIsAboveViewport =
			imgOffsetBottom - threshold < windowY + headerHeight;

		return !imgIsBelowViewport && !imgIsAboveViewport;
	}

	function updateImages(windowY) {
		images.forEach(function (img) {
			// is any part of the img within viewport
			if (isPeekingIntoViewport(windowY, img, IMG_PEEK_THRESHOLD)) {
				img.classList.add("active");
			}
			// entire image is outside viewport
			else if (!isPeekingIntoViewport(windowY, img, 0)) {
				img.classList.remove("active");
			}
		});
	}

	function updateHeader(windowY) {
		if (windowY > HEADER_OFFSET_THRESHOLD)
			document.body.classList.add("page-on-scroll");
		else document.body.classList.remove("page-on-scroll");
	}

	function toggleParallax(windowY) {
		if (isPeekingIntoViewport(windowY, parallax, PARALLAX_PEEK_THRESHOLD)) {
			rellax.refresh();
		} else {
			rellax.destroy();
		}
	}

	function handleScroll() {
		const windowY = window.pageYOffset;
		updateHeader(windowY);
		// if (parallax) toggleParallax(windowY);
		if (images.length) updateImages(windowY);
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
