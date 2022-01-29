package main

import (
	"orchestra/config"
	"orchestra/handlers"

	"log"
	"net/http"
)

func main() {
	// Create env file
	config.CreateServerEnvFile()
	// Get env variables
	_, port := config.GetEnvVariables()

	http.HandleFunc("/", handlers.WebSocketHandler)
	log.Println("Paste -> wss://localhost" + port + "/ <- in the respective field")
	log.Fatal(http.ListenAndServeTLS(port, "./certificates/localhost.pem", "./certificates/localhost-key.pem", nil))
}
