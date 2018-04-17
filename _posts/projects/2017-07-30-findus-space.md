---
title: Findus.space
layout: post
category: projects
work-type: App
tags: [js, web app, govhack, hackathon]
date: 2017-07-30
alt: Findus.space
image-sm: thumb-2017-07-30-findus-space.png
description: To where should you relocate your (totally hypothetical) government agency?
---

{% include figure.html url='/assets/post-img/thumb-2017-07-30-findus-space.png' %}

I built Findus.space with four others as part of a team of four for GovHack 2017. The idea was to help a fictional government agency relocate to regional Australia, using a range of evidence-based (and not-so-evidence-based) predictors.

We no longer host Findus.space, but you can now find it on [GitHub](https://github.com/teamsuperduper/findus_space). If you have R, you can also run it locally! You'll need the [`tidyverse`](https://cran.r-project.org/package=tidyverse), [`shiny`](https://cran.r-project.org/package=shiny) and [`leaflet`](https://cran.r-project.org/package=leaflet) packages (heads up: `tidyverse` takes a while to install!). Then:

{% highlight r linenos=table %}
    shiny::runGitHub('findus_space', 'teamsuperduper')
{% endhighlight %}