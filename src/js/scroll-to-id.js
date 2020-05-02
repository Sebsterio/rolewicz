(function () {
	const header = document.querySelector("#header");
	if (!header) return;

	header.addEventListener("click", function (e) {
		const target = document.querySelector(e.target.dataset.target);
		if (!target) return;
		e.preventDefault();

		const initialScroll = window.pageYOffset;
		const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
		window.scrollTo({
			behavior: "smooth",
			left: 0,
			top: targetTop,
		});

		// Clunky fix for Edge & IE:
		// Jump to target if scroll didn't work correctly
		setTimeout(function () {
			if (window.pageYOffset === initialScroll || window.pageYOffset === 0)
				window.scrollTo(0, targetTop);
		}, 100);
	});
})();
