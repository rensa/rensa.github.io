---
published: false
title: Kitchen speaker, charger and voice assistant
layout: post
category: projects
tags: [diy, bluetooth, raspberry pi, voice assistants]
date: 2017-06-05
alt: Please Hold
image: TK
image-sm: TK
description: A combination Bluetooth speaker, wireless charger and Google Assistant based on Raspberry Pi.
---

[Introduction]

[Table of contents]

There were three main parts to this project: the amp chip, running on 12 V power, the Raspberry Pi, running on 5 VDC USB power, and the wireless charger, also running on 5 VDC power.

### 1. Test the wireless charger
This was pretty easy: the [Adafruit Qi Transmitter](https://www.adafruit.com/product/2162) I bought runs off microUSB power and even has a full size USB-A for charging a second device. Plug it into a powered USB hub, a wall outlet or any other 2 amp USB source, then place your phone over it. Easy!

I found that it, in additional to my phone's thick case, I could place up to about 60--80 mm of heavy notebook paper between the coil and my phone before it failed to charge. At more than about 30--40 mm, the charging speed halved (taking my 25% charged Galaxy S7's projected charge time from 2.25 hours to 4.5)

![Adafruit Qi transmitter test]({{ site.url }}/assets/kitchen-speaker/qi-coil.jpg)

### 2. Assemble the amplifier

TKTKTK

### 3. Buy or build an audio filter

TKTKTK

### 4. Solder headers onto the Pi and amp

TKTKTK

### 5. Test the amp and speakers

TKTKTK

### 6. Set the Raspberry Pi up
First things first: [download](https://www.raspberrypi.org/downloads/raspbian/) a copy of Raspbian (I used Jessie Lite, which boots into the terminal by default), unzip it and [flash the image to an SD card](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md). You'll need a USB keyboard and HDMI monitor to do the initial setup:

![Raspberry Pi Zero W with (left to right) power, keyboard and montor plugged in](TKTKTK)

Before we start playing with other hardware, we want to:
- change the default password;
- (optionally) change the hostname;
- set the Pi to boot to the terminal and automatically login;
- force audio through HDMI (just while we test);
- turn the SSH server on;
- set the Wi-fi region; and
- connect to our home Wi-fi network.

All but the last of these can be done with the `raspi-config` utility, which we'll run from the terminal (so if you're running full-fat Raspbian, you'll need to open one from the desktop GUI). The default login for Raspbian is user `pi`, password `raspberry`.
 
In the terminal, run `sudo raspi-config` and use the menus to change the default password, hostname, boot settings and Wi-fi region.

Let's get the Wi-fi connected. Once you've closed the utility, append the following to `/etc/wpa_supplicant/wpa_supplicant.conf`:
 
{% highlight shell linenos=table %}
network={
    ssid="Your WiFi name"
    psk="Your WiFi password"
}
{% endhighlight %}

Note that the Pi Zero W doesn't have a 5GHz antenna. You might need to `sudo reboot`, but you should be good to go! (`ping google.com` or something to verify the connection.

From hereon out, we can either access the Pi over SSH (`ssh pi@hostname.local` on a Mac or Linux terminal) or continue working directly on the Pi. Either's fine—but if we go headless, we need to leave the monitor plugged in for the HDMI audio (we'll set the analogue audio up later!). Also, we might need to microUSB port for a microphone or a wireless dongle if we decide to add a voice assistant, so unless you have a hub on hand, you'll probaby want to unplug the keyboard and switch to SSH.

### 7. Basic audio test

Do a [quick test](https://www.raspberrypi.org/documentation/usage/audio/) of the HDMI audio. You'll need to [install `omxplayer` first](http://omxplayer.sconde.net/) if you're using Raspbian Lite. If the example MP3 is coming across the HDMI audio well, great! (Obviously this won't work if you've disconnected your monitor—but it will if you've left it plugged in after going headless!)

### 8. Test the GPIO pins

We'll need the GPIO pins on the Pi to:

1. send audio to the amp as PWM (via the filter),
2. direct volume signals to the amp using I2C, and
3. detect buttons and direct LEDs.

My solder work on the Pi and the amp was a little sloppy, so I'm keen to test the pins first. I'll be using GPIO Zero, a sweet Python-based library and tool, and Python 3. The latter's already installed (launch it using `python3`), so install GPIO Zero with `sudo apt update` and `sudo apt install python3-gpiozero`. The `pinout` command line tool does a nice little prinout of the pins and their functions, and https://pinout.xyz is a great page that shows more detail on the pins themselves. Also, [the GPIO Zero docs](https://gpiozero.readthedocs.io/en/stable/recipes.html) are a fantastic resource for people like me who're using GPIO for the first time.

I had a couple of basic switches with which to test the pins. Plugging one end into the one of the `GND` pins (I used pin 6), and the other into a BCM.GPIO pin (I used BCM 2, or pin 3, initially), I opened `python3` and ran:

{% highlight python linenos=table %}
from gpiozero import Button
button = Button(2)
{% endhighlight %}

Then `button.is_pressed` returns `True` or `False` depending on the state of the button. For a switch, that's when it's in the active position; for a momentary button, it's when it's held down. (I didn't have one of those to test). Seems to work fine! I also have an illuminated rocker, but I couldn't get figure out how to light it up 😞 I'll get some regular LEDs and resistors to test separately. But anyway, the GPIO pins all work, which is the important thing.

### 9. Hook the amp up to the Pi (via the audio filter)

Next up, we're gonna hook the amp and audio filter up to the Pi. This is, apparently, [an involved process](https://learn.adafruit.com/adding-basic-audio-ouput-to-raspberry-pi-zero/pi-zero-pwm-audio), but I used the first DTO described in Option 1 to make it a lot easier. You just append `dtoverlay=pwm-2chan,pin=18,func=2,pin2=13,func2=4` to `/boot/config.txt`, reboot, then plug GPIO pins 18 and 13 into the right and left channels of the filter, respectively. Then plug the ends of the filter into the amp's input channels, hook the amp up the speakers, plug it into the power, flip the switch, and—

_**BWAAAAAAH.**_

Crap. Okay, I'm gonna hope for the best and take a punt that this is because I didn't wire the I2C pins up to the Pi, rather than because of a bad connection or sth. This requires four additional wires from the Pi's GPIO pins to the amp header, as outlined in [this Python support library's README](https://github.com/adafruit/Adafruit_Python_MAX9744). Let's flick the switch again and hope for the best.

Silence! And, better, when I tested an example sound on the Pi using `omxxplayer example.mp3` (sidenote: omxplayer had to be installed from source, but I'll skip that since I only used it for testing), it came out nice and clear. There was a bit of crackle when I bump the connections, but otherwise it sounded fine. Phew.

### 10. Test the I2C volume control

Next, let's test the volume control. Once everything's going, I'll write code to wire physical buttons to the volume, but for now, I just wanted to test [this Python library](https://github.com/adafruit/Adafruit_Python_MAX9744/blob/master/Adafruit_MAX9744/MAX9744.py) for changing the volume via I2C (note that it's specific to this amp, although if you're familiar with I2C you might be able to adapt it). The instructions are oretty simple: install some packages, clone the git repo, run the setup script and then run a test script (which also nicely illustrates how to integrate volume controls into your own script). Oh, and if you get an error that `/dev/i2c-1` doesn't exist, run `sudo raspi-config` and enable I2C under the interfacing options.

The test ran fine, but I couldn't verify that it worked because it doesn't play any sound 😅

### 10. Turn the Pi into a Bluetooth audio receiver

Okay, time to get to the meat of it. I've forked someone else's instructions and scripts for this part (and they've forked it, and...), so you can follow along [here](https://github.com/rensa/bearspeaker/). The main deviations for me were:

- to skip setting up USB audio (since we're not using it) and to ammend `/etc/bluetooth/main.conf` instead of `/etc/bluetooth/audio.conf`, due to changes in Raspbian over the years (just with the `Name` and `Class` lines, not the `Enable` one);
- to add `connect [mac address]` after `trust [mac address]` when manually connecting, since the connection didn't seem to happen otherwise (or actually, maybe I just forgot to hit Connect on my phone after pairing 😅); and
- rather than `/etc/udev/rules.d/99-input.rules`, I added the a2dp-autoconnect script to `/etc/udev/rules.d/99-com.rules`. Also, because I cloned into home, the line is changed to: `KERNEL=="input[0-9]*", RUN+="/home/pi/bearspeaker/a2dp-autoconnect"`.

But otherwise, it mostly worked! My phone connects and plays stuff, and the phone's volume changes the output volume (though I suspect that it's changing the Pi volume, not the amp volume—I might have to change the change the script for that).

There is one big problem, though: the Raspberry Pis that all have integrated Wi-fi and Bluetooth all have them on the same chip, and using both at the same time (eg. playing Bluetooth audio while SSHing in over Wifi) leads to choppy audio. I could just turn off the Wi-fi interface when everything's setup, since (ideally) I won't need Wifi unless I add a voice assistant in. But I'd like to—and besides, chances are _something_ will go wrong down the road. I don't wanna have to SSH in with a pair of USB Ethernet adapters.

So that means that I need either a USB Wifi dongle or a USB Bluetooth dongle (and if I add a mic, I'll need a hub... I may just have the Pi's USB port run to the outside of the case when I put this in a box) to fix the choppy audio.

So I'll probably stop here until I can buy (a) some momentary push buttons with which to wire up the volume, and (b) a wireless dongle. After that:

- I'll look at what needs to change with the `a2dp-autoconnect` script to have it play nice with the I2C volume controls.
- Then we need to get the Pi and the Qi charger running off the amp's 12V out. I have a cigarette lighter that can do that, but it needs a sockt because I don't fancy trying to stick jumper leads onto its terminals.
- Once I've verified that everything runs off one power source, we can start talking about a box. I basically failed Year 7 woodworking, so that'll be interesting 😂




<!-- ### 8. Configure the microphone

Most of the components I used for this build are hobbyist oriented (read: expensive 😂). The microphone isn't: I bought a used [PS3 Eye camera](https://en.wikipedia.org/wiki/PlayStation_Eye) from my local EB for AU$2. _Two bucks_. It's not the best mic in the world, but the price is right. I'll go through getting rid of the camera and casing later, but for now, we can use it as is.

The downisde of the PS3 Eye is that, with a four mic array, it's a little more complicated to set up than a typical USB mic. Following the [audio setup instructions](https://developers.google.com/assistant/sdk/prototype/getting-started-pi-python/configure-audio) for the Google Assistant SDK, we'll create an `~/.asoundrc` file on the Pi. Mine is a slightly tweaked version of [this one](https://me.m01.eu/blog/2014/07/an-asoundrc-alsa-config-for-the-ps3-eye/) designed for the Eye (it follows the Google instructions for playback and boosts the mic's gain a lot):

{% highlight shell linenos=table %}
# ps3 eye mic
# from https://me.m01.eu/blog/2014/07/an-asoundrc-alsa-config-for-the-ps3-eye/
# modified by james goldie (http://rensa.co)

pcm.array {
  type hw
  card CameraB409241
}

pcm.array_gain {
  type softvol
  slave {
    pcm "array"
  }
  control {
    name "Mic Gain"
    count 2
  }
  min_dB -5.0
  max_dB 30.0
}

pcm.cap {
  type plug
  slave {
    pcm "array_gain"
    channels 4
  }
  route_policy sum
}

pcm.!default {
    type asym
    playback.pcm "speaker"
    capture.pcm {
        type plug
        slave.pcm "cap"
    }
}

pcm.speaker {
  type plug
  slave {
    pcm "hw:0,1"
  }
}
{% endhighlight %}

So the Eye mic works—_if_ you disconnect and reconnect it. It seems that [it won't work if it's already plugged in on boot](https://www.raspberrypi.org/forums/viewtopic.php?f=38&t=15851#p180474). To fix this, I'm going to ~~tell the Pi to disconnect and reconnect the camera after booting.~~ -->