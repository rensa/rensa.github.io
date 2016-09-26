---
title: Checking your data
layout: regpage
category: writing
date: 2016-02-25
img: <!>
thumbnail: <!>
alt: <!>
project-date: Feb 2016
description: <!>
tags:
- technical
- observations
- 
---
My research involves human heat stress, so I spend a lot of time thinking about much heat we can handle and how long we can handle it. Because of this, I mostly work with subdaily data: weather observations taken several times each day, rather than daily data.

My choice of dataset in my honours and PhD projects has been (HadISD)[http://www.metoffice.gov.uk/hadobs/hadisd/], a quality-controlled subdaily station dataset. HadISD runs automatic quality control testing that weeds out things like duplicate stations, unusual observations (a 5 °C day in summer, huh?), self-coherency (is the max lower than the min?) and (some other stuff)[http://www.clim-past.net/8/1649/2012/].

Unfortunately, I took 'quality-controlled' to mean 'fit for my purposes off the shelf'. That was probably a mistake. I combine variables like temperature and humidity into heat stress indices, and then I aggregate those indices to see what the highest, lowest and average heat stress was on a given day. So it's really important that my data quality is symmetrical over the course of the day.

It didn't occur to me that this might not be the case until I decided to see how temperature and humidity change over the course of a day:

