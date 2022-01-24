package config

import (
	"os"
	"testing"
)

// Tests the creation of local certificates
func TestCreateCA(t *testing.T) {
	err := createCA()
	if err != nil {
		t.Errorf("Error in generating local CA")
		return
	}
}

func TestCreateEnv(t *testing.T) {
	if file, err := os.Create(".env"); err != nil {
		t.Errorf("Error creating .env file")
	} else {
		file.Close()
	}
}
