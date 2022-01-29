package main

// Websockets are handled in the Handlers folder "./handlers/"
// Env file writing and reading is handled in the Config folder "./config/"

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

	go http.HandleFunc("/", handlers.WebSocketHandler)
	log.Println("Paste -> wss://localhost" + port + "/ <- in the respective field")
	log.Fatal(http.ListenAndServeTLS(port, "./certificates/localhost.pem", "./certificates/localhost-key.pem", nil))
}
