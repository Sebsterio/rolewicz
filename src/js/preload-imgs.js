// Load high quality versions of images in the background
// Replace each compressed original when high-res version loaded
(function () {
	// Download hq image and run callback when done
	function preloadImage(url, imageLoadedCallback, imgErrorCallback) {
		var img = new Image();
		img.src = url;
		img.onload = imageLoadedCallback;
		img.onerror = imgErrorCallback;
	}

	window.preloadImages = function (imgs) {
		imgs.forEach(function (img) {
			const hqUrl = img.src.replace(/.webp/, ".hq.webp");
			preloadImage(hqUrl, function () {
				// Update image quality when hq version has loaded
				img.src = hqUrl;
			});
		});
	};

	window.preloadBackgrounds = function (bgs) {
		bgs.forEach(function (bg) {
			// Use original bg while resizing in order to avoid specificity issues
			// when new image resolutions load on breakpoints
			bg.style.backgroundImage = null;

			// Ignore elements that are disabled
			const style = window.getComputedStyle(bg);
			if (style.display === "none") return;

			// Ignore non-jpg formats
			const url = style.backgroundImage;
			if (!url.includes(".webp")) return;

			const hqUrl = url
				.replace(/url\("?/, "")
				.replace(/"?\)/, "")
				.replace(".webp", ".hq.webp");

			preloadImage(
				hqUrl,
				function () {
					// Update image quality when hq version has preloaded
					bg.style.backgroundImage = 'url("' + hqUrl + '")';
				},
				function (error) {
					console.log(error);
				}
			);
		});
	};

	// Debounce
	const interval = 300;
	var scheduled = false;
	function debouncePreload(bgs) {
		if (!scheduled) {
			scheduled = true;
			// accept input every N milliseconds
			setTimeout(function () {
				scheduled = false;
				// make sure nothings is missed
				setTimeout(function () {
					preloadBackgrounds(bgs);
				}, interval);
			}, interval);
		}
	}

	// -----------------------------------------------------
	const imgs = document.querySelectorAll("img[src$=webp]");
	const bgs = document.querySelectorAll(".preload-bg");

	preloadBackgrounds(bgs);
	preloadImages(imgs);

	// update bg images to hq when new resulutions load on breakpoints
	window.addEventListener("resize", function () {
		debouncePreload(bgs);
	});
})();
