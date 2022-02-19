package actions

import (
	"orchestra/config"

	"github.com/go-vgo/robotgo"
)

func MouseMove(x float64, y float64) {
	robotgo.Move(int(x), int(y))
	mouseCoordinates := make(map[string]int)
	mouseCoordinates["x"] = int(x)
	mouseCoordinates["y"] = int(y)
	config.WriteLogs("Moving mouse ->", mouseCoordinates)
}

func MouseClick() {
	robotgo.Click("left", true)
	config.WriteLogs("Mouse Click ->", "left")
}

func KeyType(key string) {
	switch key {
	case "Enter":
		robotgo.KeyTap("enter")
		break
	case "Backspace":
		robotgo.KeyTap("backspace")
	default:
		robotgo.KeyTap(key)
		break
	}
	config.WriteLogs("Pressed key ->", key)
}

func Scroll(x float64, y float64) {
	robotgo.Scroll(int(x), int(y))
	scrollCoordinates := make(map[float64]int)
	config.WriteLogs("Scroll ->", scrollCoordinates)
}
