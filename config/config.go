package config

import (
	"fmt"
	"os"
	"os/exec"
)

var (
	file *os.File
	err  error
)

// Create the certificates
func createCA() error {
	cmd := exec.Command("sh", "-c", "cd certificates && mkcert localhost")
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
	go createCA()
	pNumber := getPortNumber()
	file, err = os.Create(".env")
	defer file.Close()
	if err != nil {
		panic(err)
	}
	file.WriteString("HOST=localhost\n")
	file.WriteString("PORT=" + pNumber + "\n")
}
