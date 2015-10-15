---
title: CCRC Weather Station
layout: regpage
category: projects
date: 2015-09-21
thumbnail: weather-station-thumb.jpg
alt: image-alt
project-date: 2014&mdash;2015
description: Raspberry Pi + camera + enthusiast weather station + really tall building = epic weather data
---
<!-- Youtube embed -->
<div markdown="0" style="text-align:center; position: relative; height: 0; padding-bottom: 56.25%; margin-top: 25px; margin-bottom: 25px;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/_4XGPOtL_NU?list=PLPA1_XSKQBZaasniybfRbSRYUNF91_y5U" frameborder="0" allowfullscreen></iframe>
</div>

Sometime last year, the idea of collecting weather observations at UNSW popped up. This sort of data is useful to people for many reasons beyond curiosity: UNSW staff can use it to predict power loads, lecturers can use it to give climatology students practice data sets for eductional purposes, and of course anyone can use it to plan their day.

This project is actually fairly simple to put together; most of the tricky stuff comes from trying to make it reliably work 16 stories up, in a place beyond the reach of UNSW's Wi-Fi. The station itself—an [Oregon WMR200](http://shop.australiangeographic.com.au/oregon-weather-station-wmr200.html)—wirelessly transmits to a data logger, which in turns sends the data over USB to a [Raspberry Pi](http://www.raspberrypi.org/). The PI runs the free [weewx](http://www.weewx.com) software to collect observations and send them over a wired connection to the CCRC's network storage and to public weather sites like [Weather Underground](http://www.wunderground.com/personal-weather-station/dashboard?ID=INEWSOUT602) and the Met Office's [Weather Observations Website](http://bom-wow.metoffice.gov.uk/graphdata?requestedAction=REQUEST&siteID=919586001) (where you can view or download the data right now!).

![CCRC weather station](/img/portfolio/weather-station.jpg){: .center-image }

Since we were going to the effort of installing a computer up there, we decided to give it some eyes. We plugged a [camera](http://www.raspberrypi.org/camera) into the Pi and wrote a script that take a picture every few seconds during the day (and less often at night, since it needs a bit of time to expose properly).

<!-- Flickr embed -->
<div markdown="0" style='position: relative; padding-bottom: 76%; height: 0; overflow: hidden; margin-top: 25px; margin-bottom: 25px;'><iframe id='iframe' src='//flickrit.com/slideshowholder.php?height=75&size=big&speed=3&count=10&userId=132153736@N04&caption=on&credit=1&trans=1&theme=1&thumbnails=1&transition=0&layoutType=responsive&sort=0' scrolling='no' frameborder='0'style='width:100%; height:100%; position: absolute; top:0; left:0;' ></iframe></div>

The Pi isn't really powerful to do anything too magical with those images itself, but since we have more powerful servers at the CCRC, they do the legwork of deleting those images (we keep a rolling record so that we don't end up with terabytes of old images), uploading them to [Flickr](http://www.flickr.com/photos/ccrc_weather/) and rendering timelapse videos to send to [YouTube](https://www.youtube.com/channel/UCeiNSkPn47gxultHDuJZEYw) each day. We can also render videos on demand, which is great for studying storms!

This project has been a long time coming, and it wouldn't have happened without the hard work of CCRC stduent Ryan Batehup, who built the excellent box that houses the station and went up on the roof week after week with the long-suffering and incredibly helpful Ben Crankshaw from UNSW's Facilities Management, who advised us on the roof installation and facilitated the whole process.

There are still lots of things we want to do with this station, and we're making tweaks as we think of them. If you have any ideas for it or there's any recent weather that you'd like to see on camera, [tweet at me](https://twitter.com/intent/tweet?text=@rensa_co&related=rensa_co) or [drop me an email](mailto:j.goldie@unsw.edu.au)! We're pretty open to ideas :)