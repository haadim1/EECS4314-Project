package handlers

import (
	"context"
	"log"
	"time"

	"notificationservice/pkg/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// UpdateBarberNotification updates the barber's notification field in MongoDB
func UpdateBarberNotification(client *mongo.Client, ctx context.Context, messageData models.Message) {
	collection := client.Database("SalonAI").Collection("barbers")

	// Convert BarberID to ObjectID
	barberObjectID, err := primitive.ObjectIDFromHex(messageData.BarberID)
	if err != nil {
		log.Printf("Invalid Barber ID format: %v", err)
		return
	}

	// Set a longer timeout for MongoDB update
	updateCtx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	filter := bson.M{"_id": barberObjectID}
	update := bson.M{
		"$push": bson.M{
			"notifications": bson.M{
				"message":   "Booking confirmed for time: " + messageData.Time,
				"timestamp": time.Now(),
			},
		},
	}

	_, err = collection.UpdateOne(updateCtx, filter, update, options.Update().SetUpsert(true))
	if err != nil {
		log.Printf("MongoDB Update Error (Barber Notifications): %v", err)
		return
	}

	log.Println("Notification added successfully for barber:", messageData.BarberID)
}
