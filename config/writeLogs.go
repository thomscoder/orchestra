package config

import (
	"log"
)

func WriteLogs(content ...interface{}) {
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%v\n", content)
}
