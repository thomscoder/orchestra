package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("An error occurred loading the environment variables")
		return
	}
	host := os.Getenv("HOST")
	port := ":" + os.Getenv("PORT")

	server := socketio.NewServer(nil)
	server.OnConnect("connection", func(socket socketio.Conn) error {
		socket.SetContext("")
		fmt.Println("User connected:", socket.ID())
		return nil
	})
	server.OnDisconnect("", func(socket socketio.Conn, reason string) {
		fmt.Println("User disconnected:", reason)
	})
	go server.Serve()
	defer server.Close()
	http.Handle("/", server)
	fmt.Println("Serving at https://localhost" + port)
	fmt.Println("Serving at https://" + host + port)
	log.Println(http.ListenAndServeTLS(port, "./certificates/localhost+1.pem", "./certificates/localhost+1-key.pem", nil))

}
