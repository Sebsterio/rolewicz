(function () {
	const toggle = document.querySelector(".navbar-toggle");
	const nav = document.querySelector(".nav-collapse");
	if (!toggle || !nav) return;
	toggle.addEventListener("click", function () {
		nav.classList.toggle("in");
	});
})();
