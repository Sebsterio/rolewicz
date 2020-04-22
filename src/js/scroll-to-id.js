(function () {
	const header = document.querySelector("#header");
	if (!header) return;

	header.addEventListener("click", function (e) {
		const target = document.querySelector(e.target.dataset.target);
		if (!target) return;

		e.preventDefault(); // don't prevent if clicked on other elements
		const targetTop = target.getBoundingClientRect().top + window.scrollY;
		window.scroll({
			behavior: "smooth",
			left: 0,
			top: targetTop,
		});
	});
})();
