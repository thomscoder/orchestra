# Eco

I'm building this app as a project during my learning of Typescript, PWA and CyberSec.
The goal of this app is to simplify the sharing of small live sessions across devices.

# How it works

This app is currently a small remote Desktop application in which users can either share their screens or get the screen of other users and control the other end's device.
It's room based so only those with the access token/key can access the live session.

# Important

- Currently works only with devices in the same network
- <b>Remote control currently works only Macbook Air M1 displays. Devices with different display size might experience way different results. I'll add support to more devices really soon</b>

# How to install and run it

- Requires Python

* Clone the repo
* run <b>yarn install</b> in ./
* running <b>yarn dev</b> in ./ will trigger python script cli that will create .env files with your custom values

I chose to use local ip addresses to make it easy to screen share with devices in the same network:

- Start screen sharing from your pc
- Join the room from another device in the same network
- Enjoy!

# Current features

- Installable
- Room based sreen sharing
- Remote control
