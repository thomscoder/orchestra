# Orchestra

I'm building this app as a project during my learning of Typescript, PWAs, Networking and CyberSec.
The goal of this app is to simplify the sharing of small live sessions across devices.

Built with React and Nodejs

# How it works

This app currently allows users to either share their screens or get the screen of other users and control them.

<img src="https://i.ibb.co/k59nQhZ/Schermata-2022-01-29-alle-17-31-55.png">

# Requirements to run the local server

Requirements to run the local server

- Mkcert

On MacOS

```bash
# Use Hombrew
$ brew install mkcert
$ mkcert -install
```

On Windows

```bash
# Use Chocolatey
$ choco install mkcert
$ mkcert -install
```

- Go

```bash
# Run go server
$ go build server.go
$ ./server
```

- Windows -> Microsoft Visual C++ Redistributable
- MacOS -> Xcode command line tools
- Linux -> libXtst

# How to contribute

Open a new branch describing the feature, styling or the bug fix (e.g. feature/audio-sharing) and have fun!

# Current features

- Installable
- Room based sreen sharing
- Remote control
