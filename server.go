package main

import (
	"log"
	"net/http"
	"os"

	socketio "github.com/googollee/go-socket.io"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Get env variables
	host, port := getEnvVariables()

	// Create Socket Server
	var socketServer *socketio.Server = createSocketServer()
	go socketServer.Serve()
	defer socketServer.Close()

	// Create handler
	var handler http.Handler = createServer(socketServer)

	log.Println("Serving at https://" + host + port)
	log.Println(http.ListenAndServeTLS(port, "./certificates/localhost+1.pem", "./certificates/localhost+1-key.pem", handler))

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

func createSocketServer() *socketio.Server {
	server := socketio.NewServer(nil)
	server.OnConnect("/", func(socket socketio.Conn) error {
		socket.SetContext("")
		log.Println("User connected:", socket.ID())
		return nil
	})
	server.OnDisconnect("", func(socket socketio.Conn, reason string) {
		log.Println("User disconnected:", reason)
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
