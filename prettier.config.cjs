const defaultConfig = {
	trailingComma: "es5",
	tabWidth: 2,
	semi: true,
	printWidth: 80,
	useTabs: false,
	singleQuote: false,
	quoteProps: "consistent",
	// htmlWhitespaceSensitivity: "ignore",
};

const svelte = {
	files: ["*.svelte", "*.set"],
	options: {
		printWidth: 80,
	},
};


// ---------------------------------------------- exports -- ;

module.exports = {
	...defaultConfig,
	overrides: [svelte],
};

/* References
 + https://github.com/prettier/plugin-pug
 + https://github.com/sveltejs/prettier-plugin-svelte#options
 + https://prettier.io/docs/en/options.html#parser */
