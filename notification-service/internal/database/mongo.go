package database

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// ConnectMongoDB initializes and returns a MongoDB client
func ConnectMongoDB() (*mongo.Client, context.Context, context.CancelFunc) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MongoDB URI is missing in .env file")
	}

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("MongoDB Connection Error:", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal("MongoDB Connect Error:", err)
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal("MongoDB Ping Error:", err)
	}
	log.Println("Connected to MongoDB")

	return client, ctx, cancel
}
