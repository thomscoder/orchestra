# Orchestra

I'm building this app as a project during my learning of Typescript, PWAs, Networking and CyberSec.
The goal of this app is to simplify the sharing of small live sessions across devices.

Built with React and Nodejs

# How it works

This app is currently a small remote Desktop application in which users can either share their screens or get the screen of other users and control the other end's device.

# How to run it?

The app works over a small local sever written in Go.
The client is hosted on Vercel while the peer server is hosted on Heroku (simply add your own server via either heroku buttons, peerjs docs or leaving it blank for peerjs to use its own default servers -> One of peerjs default servers is already set up in the .env-sample file).

<h1>How to share your screen</h1>

- Start the local server
- Paste the given wss URL from the server in the respective field on the client.

Once "Server" is clicked the client will establish a web socket to your local server
(you can check in the console if there's no error)

- Now click share screen and share the generated ID.

<h1>To watch the screen</h1>

- Paste the ID
- Click
- Done!

# Requirements to run the local server

Requirements to run the local server

- Mkcert

```bash
# On MacOS
$ brew install mkcert
$ mkcert -install

# On Windows
$ choco install mkcert
$ mkcert -install
```

- Go

- Windows -> Microsoft Visual C++ Redistributable
- MacOS -> Xcode command line tools
- Linux -> libXtst

# How to contribute

Open a new branch describing the feature, styling or the bug fix (e.g. feature/audio-sharing) and have fun!

# Current features

- Installable
- Room based sreen sharing
- Remote control
