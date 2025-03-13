package main

import (
	"notificationservice/internal/config"
	"notificationservice/internal/database"
	"notificationservice/internal/messaging"
)

func main() {
	config.LoadEnv()

	// Connect to MongoDB
	client, ctx, cancel := database.ConnectMongoDB()
	defer cancel()
	defer client.Disconnect(ctx)

	// Start RabbitMQ message processing
	messaging.ConsumeMessages(client, ctx) // ✅ Removed incorrect value assignment
}
