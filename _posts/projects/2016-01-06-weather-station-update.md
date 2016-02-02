---
title: Weather station—timelapse update
layout: regpage
category: projects
date: 2016-01-06
thumbnail: weather-station-thumb.jpg
alt: image-alt
project-date: Jan 2016
description: tl;dr ffmpeg is pretty powerful!
---
Small update to the CCRC weather station! I mean, I'm pretty happy with it, but the end result is physically small: the timelapse videos now have timestamps.

<!-- ![Timestamped timelapse video](http://i.imgur.com/9uZ19G5.jpg) -->

The reason is that it's storm season in Sydney at the moment, and the videos coming out of the weather station are getting a lot of attention. A pair of videos of a recent storm picked up about 21 000 views between them:

<!-- Youtube embed -->
<div markdown="0" style="text-align:center; position: relative; height: 0; padding-bottom: 56.25%; margin-top: 25px; margin-bottom: 25px;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/r9QelVBENoo?list=PLPA1_XSKQBZaasniybfRbSRYUNF91_y5U" frameborder="0" allowfullscreen></iframe>
</div>

I'd like a bit more of the benefit of that to go back to the CCRC—but as well as that ,it would be useful to see how quickly time is moving during the shot, as the night shots have long exposures and hence run at a different speed to the day ones.

I had a few requirements, though. I wanted to be able to do this:

- using the existing image series, which is stored within a base directory using a `/images/YYYY-MM-DD/HH/YYYY-MM-DD-HHMM-SS.jpg` structure, and
- without preprocessing the images (ie. altering the original images or making copies of them).

The existing code (which is [now on Github](https://github.com/rensa/ccrc-weather-station-uploads)—I'm working on getting the code that sits on the station itself up at a later date) already uses [ffmpeg](https://ffmpeg.org/) to stitch the image sequence together. Because the images aren't taken at regular intervals (though the station tries very hard), this script uses ffmpeg's concat filter, which accepts a list of image paths, to render the video:

{% highlight shell %}
    # get the list of files in the matching date-time range
    find "$DATA_DIR"/images -type f -mmin -"$VID_START" -mmin +"$VID_END" > custom-list.txt

    # transform file list to prep for ffmpeg (including adding metadata) line-by-line
    IMG_PATH="$DATA_DIR"/images
    EXT=".jpg"
    while read FULLNAME; do
        # extract date-time part of filename
        if [[ $FULLNAME =~ [0-9]{4}.[0-9]{2}.[0-9]{2}.[0-9]{4}.[0-9]{2} ]]; then
            DT="${BASH_REMATCH[0]}"
        fi

        printf "file \'$FULLNAME\'\nfile_packet_metadata dt=$DT\n" >> custom-list2.txt
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