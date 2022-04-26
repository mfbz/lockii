<p align="center">
  <img width="200" src="./lockii-icon.png">
</p>

<h1 align="center">Lockii</h1>

## 💡 What is

Lockii is a smart lock device managed by NFTs on the Neo blockchain.

## Raspberry installation

#### Step 1 - Install the pigpio C library

The [pigpio C library](https://github.com/joan2937/pigpio) is a prerequisite
for the pigpio Node.js module.

Run the following command to determine which version of the pigpio C library
is installed:

```
pigpiod -v
```

For the Raspberry Pi Zero, 1, 2 and 3 V41 or higher of the pigpio C library is
required. For the Raspberry Pi 4 V69 or higher is required.

If the pigpio C library is not installed or if the installed version is too
old, the latest version can be installed with the following commands:

```
sudo apt-get update
sudo apt-get install pigpio
```

Alternative installation instructions for the pigpio C library can be found
[here](http://abyz.me.uk/rpi/pigpio/download.html).

**Warning:** The pigpio C library contains a number of utilities. One of these
utilities is pigpiod which launches the pigpio C library as a daemon. This
utility should not be used as the pigpio Node.js package uses the C library
directly.

#### Step 2 - Install the pigpio Node.js package

```
npm install pigpio
```
