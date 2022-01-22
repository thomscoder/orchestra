package main

import (
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"

	"log"
	"net/http"
	"os"
)

//Build the websocket
var upgrader = websocket.Upgrader{}

func main() {
	// Get env variables
	host, port := getEnvVariables()

	http.HandleFunc("/", webSocketHandler)
	log.Println("Serving at https://" + host + port + "/")
	log.Fatal(http.ListenAndServeTLS(port, "./certificates/localhost+1.pem", "./certificates/localhost+1-key.pem", nil))

}

func webSocketHandler(response http.ResponseWriter, request *http.Request) {
	// Handle cors error
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	// Upgrade all the connections to websocket connections
	ws, err := upgrader.Upgrade(response, request, nil)
	if err != nil {
		log.Println("An error occurred:", err)
	}

	log.Println("Successfully connected!")
	connectionsReader(ws)
}

func connectionsReader(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println("An error occurred:", err)
			return
		}

		log.Println(string(p))

		msg := []byte("Message from the server")
		if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Println("An error occurred:", err)
			return
		}
	}
}

func getEnvVariables() (string, string) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("An error occurred loading the environment variables")
	}
	host := os.Getenv("HOST")
	port := ":" + os.Getenv("PORT")
	return host, port
}
