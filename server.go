package main

import (
	"fmt"
	"orchestra/actions"

	"github.com/go-vgo/robotgo"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"

	"encoding/json"
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

func mouseMove(x float64, y float64) {
	robotgo.Move(int(x), int(y))
}

func connectionsReader(conn *websocket.Conn) error {
	type Message struct {
		Event string
		PosX  float64
		PosY  float64
		Key   string
	}
	var (
		receivedMessage string
		message         Message
	)
	// Send a message to client
	msg := []byte("Message from the server")
	if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
		log.Fatal("An error occurred:", err)
		return err
	}
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Fatal("An error occurred ->", err)
			return err
		}

		// Get message text
		receivedMessage = string(p)
		json.Unmarshal([]byte(receivedMessage), &message)
		fmt.Println("coordinates", message.PosX, message.PosY)
		switch message.Event {
		case "mousemove":
			actions.MouseMove(message.PosX, message.PosY)
			break
		case "mouse-click":
			actions.MouseClick()
			break
		case "type":
			actions.KeyType(message.Key)
			break
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
