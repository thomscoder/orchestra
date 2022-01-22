package actions

import (
	"log"

	"github.com/go-vgo/robotgo"
)

func MouseMove(x float64, y float64) {
	robotgo.Move(int(x), int(y))
}

func MouseClick() {
	robotgo.Click("left", true)
	log.Println("mouse-click")
}

func KeyType(key string) {
	robotgo.KeyTap(key)
	log.Println("key-type")
}
