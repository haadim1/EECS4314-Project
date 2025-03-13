package models

type Message struct {
	BarberID string `json:"barber_id"`
	Time     string `json:"time"`
	Message  string `json:"message"`
}
