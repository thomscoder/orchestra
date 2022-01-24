package main

import (
	"testing"
)

func TestEnvVariables(t *testing.T) {
	if s1, s2 := getEnvVariables(); s1 == "" || s2 == "" {
		t.Errorf("Env variables cannot be empty")
	}
}
