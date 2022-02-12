package main

// Websockets are handled in the Handlers folder "./handlers/"
// Env file writing and reading is handled in the Config folder "./config/"

import (
	"orchestra/config"
	"orchestra/handlers"
	"os"

	"log"
	"net/http"
)

const (
	YELLOW     = "\x1b[0;33m"
	LIGHT_GREY = "\x1b[0;37m"
	CYAN       = "\x1b[1;36m"
	RESET      = "\x1b[0m"
)

func main() {
	config.DefaultTexts(CYAN, LIGHT_GREY, RESET)
	// Create env file
	config.CreateServerEnvFile()
	// Get env variables
	_, port := config.GetEnvVariables()

	go http.HandleFunc("/", handlers.WebSocketHandler)
	log.Printf("%vPaste -> wss://localhost%v/ <- in the respective field\n", YELLOW, port)
	// start writitng logs in the file
	file, _ := os.OpenFile("./logs/orchestra.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	defer file.Close()
	log.SetOutput(file)

	log.Fatal(http.ListenAndServeTLS(port, "./certificates/localhost.pem", "./certificates/localhost-key.pem", nil))
}
