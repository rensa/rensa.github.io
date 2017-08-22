---
title: Leave your research question at the door when you first visualise data
layout: post
category: writing
tags: [data analysis]
date: 2017-08-22
image-sm: thumb-2017-08-22-viz-data-without-research-question.jpg
image: 2017-08-22-viz-data-without-research-question.jpg
alt: Leave your research question at the door when you first visualise data
project-date: Aug 2017
description: One tough lesson that I've had to learn over and over (and continue to be reminded of) in my PhD is the importance of a disciplined data science pipeline.
---
The Hadley view of such a pipeline [looks like this](http://r4ds.had.co.nz/introduction.html):

![Hadley data science pipeline: import, tidy, (transform, visualise, model), communicate](http://r4ds.had.co.nz/diagrams/data-science.png)

The approach I took in my honours and for like half of my PhD was more like:

![Hypothesise, import, tidy, ((model, UGH, transform), visualise), communicate](/assets/hadisd/bad-data-analysis.png)

This isn't a post about how you should jump into a data set without a clear research question in mind. Nor is it a post about overfitting your models. This is a post about how it's important to explore your data before you start testing hypotheses.

The problem with my data pipeline is that I would get my hands on some data, code all the way out to the hypothesis I wanted to test or the angle I wanted to visualise (in order to test my hypothesis), start writing up and then later (sometimes _much_ later) realise that there was a big problem with my work.

Here's one example of that. In my PhD I've extensively used [HadISD](http://www.metoffice.gov.uk/hadobs/hadisd/), a set of weather station data. HadISD is useful for me because it's _subdaily_ station data (ie. multiple observations per day), which is important for calculating the heat stress indices I work with. It's also nice to use because it's quality controlled.

That quality control catches out [a number of kinds](https://www.clim-past.net/8/1649/2012/) of bad observations and stations that you often see in raw data sets, like duplicate stations, values that turn up suspiciously often, days where the temperature doesn't fit an expected day/night cycle, that sort of thing.

But 'quality-controlled' doesn't necessarily mean 'entirely free of problems'. After I used HadISD observations for my first analysis and got some odd results, I went back to take a broader look at the data more broadly. Since part of my work involves how stress changes over the day, I decided to look at how how temperature and humidity shift over the day:

![Sydney Airport temperature and humidity, 1973-2014](/assets/hadisd/tq-ani.gif)

You can see a nice diurnal cycle here, but you can also see some weird stripey effects. This looked a bit like an issue with precision to me, so I decided to plot a time series of the decimal remainder of each observation.

When you look at all of the observations together, there doesn't seem to be an issue. There's a nice spread of values between 0 and 1, since the observations go down to a tenth of a degree (apart from a period in 1980 when they're all remainder zero, or integers):

![Sydney Airport temperature precision, 1973-2014](/assets/hadisd/tq-precision-all-hours.png)

But when you take a look at it hour by hour, you see the problem:

![Sydney Airport temperature precision by hour, 1973-2014](/assets/hadisd/tq-precision-ani.gif)

There are several issues here. One is that the the precision changes hour by hour at different parts of the time series. Another looks like a daylight savings issue from the year 2000.

After speaking to [Robert Dunn](https://scholar.google.com/citations?user=toTm8pQAAAAJ&hl=en), who manages HadISD, we concluded that this is probably a result of [ISD](https://www.ncdc.noaa.gov/isd), the parent dataset. It isn't necessarily a problem for most people, but for my purposes—looking at temperature and humidity extremes—it certainly could be. This problem manifested for all of my Australian airport-based stations, though it was slightly different in each case.

But since I only needed data from 2000 onward (though I used 1990 onward here), I found that I could extract a dependable three hourly time series for all of the cities. In Sydney, that meant:

- replacing hours 02, 05, ..., 23 UTC with 01, 04, ..., 23 UTC for summer days from 2000 onward, and
- keeping the 02, 05, ... 23 UTC series.

The result looks much better:

![Refined Sydney Airport temperature precision by hour, 1990-2014](/assets/hadisd/tq-precision-ani-refined.gif)

And the corresponding plot of temperature and humidity also looks clearer:

![Refined Sydney Airport temperature and humidity, 1990-2014](/assets/hadisd/tq-ani-refined.gif)

I wouldn't have caught this if I'd gone straight for the research question goal. In fact, if I'd gone to exploratory data visualisation as soon as my data was tidy, I probably would've saved myself a lot of time.

Now, as I do the last parts of my PhD analysis, I try to make sure that my scripts clearly follow a standard analysis pipeline. That isn't always possible, but thinking about the pipeline when I get started on a research question means that I'm getting a lot more science done in my last year.
