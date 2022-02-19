package config

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
)

var (
	file *os.File
	err  error
)

func DefaultTexts(COLOR1 string, COLOR2 string, RESET string) {
	fmt.Printf("\x1b[2J")
	fmt.Printf("\x1b[H")
	fmt.Printf("%vORCHESTRA %vmade by @thomscoder\n%v", COLOR1, COLOR2, RESET)
}

// Create the certificates
func createCA(firstPart string, secondPart string, thirdPart string) error {
	cmd := exec.Command(firstPart, secondPart, thirdPart)
	if _, err := cmd.Output(); err != nil {
		return err
	}
	return nil
}

// Get the port number
func getPortNumber() string {
	var port string
	fmt.Print("Port number: ")
	fmt.Scanf("%v", &port)
	return port
}

// Write the server .env
func CreateServerEnvFile() {
	go createCA("sh", "-c", "cd certificates && mkcert localhost")
	pNumber := getPortNumber()
	file, err = os.Create(".env")
	defer file.Close()
	if err != nil {
		panic(err)
	}
	file.WriteString("HOST=localhost\n")
	file.WriteString("PORT=" + pNumber + "\n")
}

// Read the generated env file
func GetEnvVariables() (string, string) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("An error occurred loading the environment variables")
	}
	host := os.Getenv("HOST")
	port := ":" + os.Getenv("PORT")
	return host, port
}
