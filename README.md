# Orchestra

I'm building this app as a project during my learning of Typescript, PWAs and CyberSec.
The goal of this app is to simplify the sharing of small live sessions across devices.

# How it works

This app is currently a small remote Desktop application in which users can either share their screens or get the screen of other users and control the other end's device.
It's room based so only those with the access token/key can access the live session.

# Important

- Currently works only with devices in the same network

# How to run it?

The app works over a small Websockets and webRTC implementation.
The client is hosted on Netlify while the peer server is hosted on Heroku.

<h1>How to share your screen</h1>

- Start the local server on a port of your choice
- Paste the given URL from the server in the respective field on the client.
- Click the button "Server"
- Done!

The client will now connect to your local server and establish a ws connection
(you can check in the console if there's no error)

- Click share screen and send the generated Room ID to whoever you want.

<h1>To watch the screen</h1>

- Simply paste or type the ID in the respective field
- Click "Get screen".
- Done

# Requirements to run it locally

Requirements to run the local server and share the screen

- Mkcert
- On Windows requires windows-build-tools and Visual Studio (2013 or higher)

- Python (not necessarily but good to have it)

# Current features

- Installable
- Room based sreen sharing
- Remote control
