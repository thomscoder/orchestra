package config

import (
	"os"
	"testing"
)

// Tests the creation of local certificates
func TestCreateCA(t *testing.T) {
	err := createCA("sh", "-c", "mkcert localhost")
	if err != nil {
		t.Errorf("Error in generating local CA")
		return
	}
}

func TestCreateEnv(t *testing.T) {
	pNumber := "0000"
	file, err = os.Create(".env")
	defer file.Close()
	if err != nil {
		t.Errorf("Error creating .env file")
	}
	file.WriteString("HOST=localhost\n")
	file.WriteString("PORT=" + pNumber + "\n")
}

func TestEnvVariables(t *testing.T) {
	if s1, s2 := GetEnvVariables(); s1 == "" || s2 == "" {
		t.Errorf("Env variables cannot be empty")
	} else {
		keyErr := os.Remove("localhost-key.pem")
		pemErr := os.Remove("localhost.pem")
		envErr := os.Remove(".env")
		if keyErr != nil || pemErr != nil || envErr != nil {
			t.Errorf("File does not exist or it wasn't created correctly")
		}
	}
}
