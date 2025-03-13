package messaging

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"notificationservice/internal/handlers"
	"notificationservice/pkg/models"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
)

// ConnectRabbitMQ establishes a connection to RabbitMQ
func ConnectRabbitMQ() (*amqp.Connection, *amqp.Channel) {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	rabbitMQURL := os.Getenv("RABBITMQ_URL")
	if rabbitMQURL == "" {
		log.Fatal("RabbitMQ URL is missing in .env file")
	}

	// Connect to RabbitMQ
	conn, err := amqp.Dial(rabbitMQURL)
	if err != nil {
		log.Fatal("RabbitMQ Connection Error:", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("RabbitMQ Channel Error:", err)
	}

	log.Println("Connected to RabbitMQ")
	return conn, ch
}

// ConsumeMessages listens for RabbitMQ messages and processes them
func ConsumeMessages(client *mongo.Client, ctx context.Context) {
	conn, ch := ConnectRabbitMQ()
	defer conn.Close()
	defer ch.Close()

	msgs, err := ch.Consume(
		"metadata_queue",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Failed to register a consumer:", err)
	}

	forever := make(chan bool)
	go func() {
		for d := range msgs {
			log.Printf("Raw message received: %s", string(d.Body))

			var messageData models.Message
			if err := json.Unmarshal(d.Body, &messageData); err != nil {
				log.Printf("Error parsing message JSON: %v", err)
				continue
			}

			handlers.UpdateBarberNotification(client, ctx, messageData)
		}
	}()

	log.Println("Listening for messages...")
	<-forever
}
