---
title: CCRC Weather Station
layout: post
category: projects
work-type: DIY
date: 2015-09-21
tags: [raspberry pi, ffmpeg, shell, diy]
image-sm: thumb-2015-09-21-ccrc-weather-station.jpg
image: thumb-2015-09-21-ccrc-weather-station.jpg
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

Since we were going to the effort of installing a computer up there, we decided to give it some eyes. We plugged a [camera](http://www.raspberrypi.org/camera) into the Pi and wrote a script that take a picture every few seconds during the day (and less often at night, since it needs a bit of time to expose properly).

The Pi isn't really powerful to do anything too magical with those images itself, but since we have more powerful servers at the CCRC, they do the legwork of deleting those images (we keep a rolling record so that we don't end up with terabytes of old images), uploading them to [Flickr](http://www.flickr.com/photos/ccrc_weather/) and rendering timelapse videos to send to [YouTube](https://www.youtube.com/channel/UCeiNSkPn47gxultHDuJZEYw) each day. We can also render videos on demand, which is great for studying storms!

This project has been a long time coming, and it wouldn't have happened without the hard work of CCRC stduent Ryan Batehup, who built the excellent box that houses the station and went up on the roof week after week with the long-suffering and incredibly helpful Ben Crankshaw from UNSW's Facilities Management, who advised us on the roof installation and facilitated the whole process.

There are still lots of things we want to do with this station, and we're making tweaks as we think of them. If you have any ideas for it or there's any recent weather that you'd like to see on camera, [tweet at me](https://twitter.com/intent/tweet?text=@rensa_co&related=rensa_co) or [drop me an email](mailto:j.goldie@unsw.edu.au)! We're pretty open to ideas :)

<hr>

**January 2016 update:** small update to the CCRC weather station! I mean, I'm pretty happy with it, but the end result is physically small: the timelapse videos now have timestamps. The reason is that it's storm season in Sydney at the moment, and the videos coming out of the weather station are getting a lot of attention. A pair of videos of a recent storm picked up about 21 000 views between them:

<!-- Youtube embed -->
<div markdown="0" style="text-align:center; position: relative; height: 0; padding-bottom: 56.25%; margin-top: 25px; margin-bottom: 25px;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/r9QelVBENoo?list=PLPA1_XSKQBZaasniybfRbSRYUNF91_y5U" frameborder="0" allowfullscreen></iframe>
</div>

I'd like a bit more of the benefit of that to go back to the CCRC—but as well as that, it would be useful to see how quickly time is moving during the shot, as the night shots have long exposures and hence run at a different speed to the day ones.

I had a few requirements, though. I wanted to be able to do this:

- using the existing image series, which is stored within a base directory using a `/images/YYYY-MM-DD/HH/YYYY-MM-DD-HHMM-SS.jpg` structure, and
- without preprocessing the images (ie. altering the original images or making copies of them).

Basically, I was being stubborn about this because I thought `ffmpeg` should be able to handle it.

The existing code (which is [now on Github](https://github.com/rensa/ccrc-weather-station-uploads)—I'm working on getting the code that sits on the station itself up at a later date) already uses [ffmpeg](https://ffmpeg.org/) to stitch the image sequence together. Because the images aren't taken at regular intervals (though the station tries very hard), this script uses ffmpeg's concat filter, which accepts a list of image paths, to render the video. Originally, that file list looked like this (but with absolute paths):

{% highlight shell linenos=table %}
file 'images/2016-01-31/06/2016-01-31-0630-37.jpg'
file 'images/2016-01-31/06/2016-01-31-0630-41.jpg'
file 'images/2016-01-31/06/2016-01-31-0630-44.jpg'
{% endhighlight %}

But the concat filter can also be used to pass other custom frame metadata, like:

{% highlight shell linenos=table %}
file 'images/2016-01-31/06/2016-01-31-0630-37.jpg'
file_packet_metadata dt=2016-01-31-0630-37
file 'images/2016-01-31/06/2016-01-31-0630-41.jpg'
file_packet_metadata dt=2016-01-31-0630-41
file 'images/2016-01-31/06/2016-01-31-0630-44.jpg'
file_packet_metadata dt=2016-01-31-0630-44
{% endhighlight %}

And _that_ metadata can be accessed by subsequent filters. For example, in the weather station script, we use the shell's `find` to build up the list of images, then loop through the list to add the metadata (which is essentially just the date-time used in the file name). Finally, `ffmpeg`'s `drawtext` filter access this using `text='%{metadata\\:dt}`, where `dt` is the metadata key we've specified. [This](https://github.com/rensa/ccrc-weather-station-uploads/blob/master/custom-youtube.sh) is how it comes together:

{% highlight shell linenos=table %}
# get the list of files in the matching date-time range
find "$DATA_DIR"/images -type f -mmin -"$VID_START" -mmin +"$VID_END" >custom-list.txt

# transform file list to prep for ffmpeg (including adding metadata)line-by-line
IMG_PATH="$DATA_DIR"/images
EXT=".jpg"
while read FULLNAME; do
    # extract date-time part of filename
    if [[ $FULLNAME =~ [0-9]{4}.[0-9]{2}.[0-9]{2}.[0-9]{4}.[0-9]{2} ]]; then
        DT="${BASH_REMATCH[0]}"
    fi

    printf "file \'$FULLNAME\'\nfile_packet_metadata dt=$DT\n" >>custom-list2.txt
done <custom-list.txt
mv custom-list2.txt custom-list.txt

# render the video
nice -n 20 ffmpeg/ffmpeg -threads 6 -f concat -r "$FRAME_RATE" \
    -i custom-list.txt \
    -i waltz-flowers-tchaikovsky.mp3 \
    -threads 6 \
    -vf "crop=2592:1458:0:450, \
        drawtext=fontfile=RobotoCondensed-Italic.ttf:\
            fontsize=48:\
            fontcolor=0xFFFFFF:\
            shadowcolor=0x00000088:\
            shadowx=5:\
            shadowy=5:\
            text='%{metadata\\:dt}':\
            x=20:\
            y=h-32-106-th, \
        drawtext=fontfile=RobotoCondensed-Regular.ttf:\
            fontsize=48:\
            fontcolor=0xFFFFFF:\
            shadowcolor=0x00000088:\
            shadowx=5:\
            shadowy=5:\
            text='Climate Change Research Centre':\
            x=20:\
            y=h-32-48-th, \
        drawtext=fontfile=RobotoCondensed-Regular.ttf:\
            fontsize=48:\
            fontcolor=0xFFFFFF:\
            shadowcolor=0x00000088:\
            shadowx=5:\
            shadowy=5:\
            text='Sydney, Australia':\
            x=20:\
            y=h-32-th" \
    -shortest "$DATA_DIR"/videos/custom-"$TODAY.mov"
{% endhighlight %}

The result works really well:

<!-- Youtube embed -->
<div markdown="0" style="text-align:center; position: relative; height: 0; padding-bottom: 56.25%; margin-top: 25px; margin-bottom: 25px;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/nq4ZGtLOw6Q?index=5&list=PLPA1_XSKQBZaasniybfRbSRYUNF91_y5U" frameborder="0" allowfullscreen></iframe>
</div>