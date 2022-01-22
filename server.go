package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
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
	fmt.Println("Serving at http://localhost:5003")
	log.Println(http.ListenAndServeTLS(":5003", "./certificates/localhost+1.pem", "./certificates/localhost+1-key.pem", nil))

}
