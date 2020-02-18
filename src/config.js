const config = {
	EDITOR_API_URL: process.env.EDITOR_API_URL || "http://localhost:4001",
	SERVER_API_URL: process.env.SERVER_API_URL || "http://localhost:3030",
	// DISABLE_BACKEND: true,
	EDITOR_SOCKET_URL: process.env.EDITOR_SOCKET_URL || "ws://localhost:4001",
	HOMEWORK_URI: process.env.HOMEWORK_URI || "/homework",

	breakpoints: {
		tablet: 750,
		desktop: 991,
		desktopLg: 1200,
	},
}
console.log('config', config)
export default config
