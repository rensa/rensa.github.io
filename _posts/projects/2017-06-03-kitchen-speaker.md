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

### 1. Set the Raspberry Pi up
First things first: [download](https://www.raspberrypi.org/downloads/raspbian/) a copy of Raspbian (I used Jessie Lite, which boots into the terminal by default), unzip it and [flash the image to an SD card](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md). You'll need a USB keyboard and HDMI monitor to do the initial setup:

![Raspberry Pi Zero W with (left to right) power, keyboard and montor plugged in](TK)

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

Let's get the Wi-fi connected. Once you've closed the utility, `sudo nano /etc/wpa_supplicant/wpa_supplicant.conf` and append:
 
{% highlight shell linenos=table %}
network={
    ssid="Your WiFi name"
    psk="Your WiFi password"
}
{% endhighlight %}

Note that the Pi Zero W doesn't have a 5GHz antenna. You might need to `sudo reboot`, but you should be good to go! (`ping google.com` or something to verify the connection.

From hereon out, we can either access the Pi over SSH (`ssh pi@hostname.local` on a Mac or Linux terminal) or continue working directly on the Pi. Either's fine—but if we go headless, we need to leave the monitor plugged in for the HDMI audio (we'll set the analogue audio up later!). Also, we're going to need the microUSB port for the microphone, so unless you have a hub on hand, you'll probaby want to unplug the keyboard and switch to SSH.

### 2. Configure the microphone
Do a [quick test](https://www.raspberrypi.org/documentation/usage/audio/) of the HDMI audio. You'll need to [install `omxplayer` first](http://omxplayer.sconde.net/) if you're using Raspbian Lite. If the example MP3 is coming across the HDMI audio well, it's time to set the microphone up.

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

So the Eye mic works—_if_ you disconnect and reconnect it. It seems that [it won't work if it's already plugged in on boot](https://www.raspberrypi.org/forums/viewtopic.php?f=38&t=15851#p180474). To fix this, I'm going to ~~tell the Pi to disconnect and reconnect the camera after booting.~~