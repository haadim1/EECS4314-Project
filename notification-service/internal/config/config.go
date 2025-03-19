package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var MongoURI string
var RabbitMQURL string
var DatabaseName string
var BarberCollection string

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	MongoURI = os.Getenv("MONGO_URI")
	RabbitMQURL = os.Getenv("RABBITMQ_URL")
	DatabaseName = "SalonAI"
	BarberCollection = "barbers"
}
