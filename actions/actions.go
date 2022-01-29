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
	log.Println("mouse click")
}

func KeyType(key string) {
	robotgo.KeyPress(key)
	log.Println("key tap")
}

func Scroll(x float64, y float64) {
	robotgo.Scroll(int(x), int(y))
	log.Println("scroll")
}
