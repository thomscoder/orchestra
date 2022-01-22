package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"

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

	var socketServer *socketio.Server = createSocketServer()
	go socketServer.Serve()
	defer socketServer.Close()

	var handler http.Handler = createServer(socketServer)

	fmt.Println("Serving at https://localhost" + port)
	fmt.Println("Serving at https://" + host + port)
	log.Println(http.ListenAndServeTLS(port, "./certificates/localhost+1.pem", "./certificates/localhost+1-key.pem", handler))

}

func createSocketServer() *socketio.Server {
	server := socketio.NewServer(nil)
	server.OnConnect("/", func(socket socketio.Conn) error {
		socket.SetContext("")
		fmt.Println("User connected:", socket.ID())
		return nil
	})
	server.OnDisconnect("", func(socket socketio.Conn, reason string) {
		fmt.Println("User disconnected:", reason)
	})
	return server
}

func createServer(s *socketio.Server) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", s)
	handler := cors.Default().Handler(mux)
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST"},
	})
	handler = corsOptions.Handler(handler)
	return handler
}
