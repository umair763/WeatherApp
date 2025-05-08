import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

async function startServer() {
	const app = express();
	const server = createServer(app);

	// Set up middleware
	app.use(express.json());

	// Register routes
	await registerRoutes(app);

	// Set up Vite for development
	if (process.env.NODE_ENV === "development") {
		await setupVite(app, server);
	} else {
		serveStatic(app);
	}

	// Error handling middleware
	app.use((err, _req, res, _next) => {
		console.error("Server error:", err);
		res.status(500).json({ error: "Internal Server Error", message: err.message });
	});

	// Start the server
	const port = process.env.PORT || 5000;
	server.listen(port, "0.0.0.0", () => {
		log(`serving on port ${port}`);
	});
}

startServer().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
