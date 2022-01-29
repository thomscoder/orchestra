package main

import (
	"orchestra/config"
	"testing"
)

func TestEnvVariables(t *testing.T) {
	if s1, s2 := config.GetEnvVariables(); s1 == "" || s2 == "" {
		t.Errorf("Env variables cannot be empty")
	}
}
