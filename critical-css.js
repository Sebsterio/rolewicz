var critical = require("critical");

critical.generate({
	inline: false,
	base: "dist/",
	src: "index.html",
	dimensions: [
		{
			height: 900,
			width: 300,
		},
		{
			height: 900,
			width: 500,
		},
		{
			height: 900,
			width: 1100,
		},
		{
			height: 900,
			width: 1400,
		},
	],
	dest: "critical.css",
	timeout: 30000,
});
