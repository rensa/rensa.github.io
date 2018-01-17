---
title: "Drilling into non-rectangular data with purrr"
layout: post
category: writing
tags: [technical, rstats]
date: 2018-01-17
mast: true
image: 2018-01-17-drilling-into-non-rectangular-data-with-purrr.jpg
image-sm: thumb-2018-01-17-drilling-into-non-rectangular-data-with-purrr.jpg
alt: "Drilling into non-rectangular data with purrr"
project-date: Jan 2018
description: Purrr and pipes go a long way.
---
My PhD is in climate science, and climate data is usually rectangular—or some higher-dimensional analogue of rectangular, anyway. (Blocky?) And since rectangular data is R's bread and butter, I've had a pretty good time of things up until now.

But for the last few months I've been working on [Is It Hot Right Now](https://isithotrightnow.com) with my colleagues, Mat and Stefan, and that's forced me to get to know data formats that are a bit less familiar to R but ubiquitous on the web: namely, XML and JSON.

Luckily, the [xml2](https://cran.r-project.org/web/packages/xml2/index.html) and [RJSONIO](https://cran.r-project.org/web/packages/RJSONIO/index.html) packages make accessing XML and JSON data really easy, and with [purrrr](http://purrr.tidyverse.org/) (part of the [tidyverse](https://www.tidyverse.org/), we can reduce them down to something useful really quickly. Like  a yummy, rich... bolognese of data, I guess?

Let's look at some basic examples and then ramp it up.

## JSON: it's lists all the way down

JSON is a data format that's designed to mimic the way JavaScript stores objects. [Here's an example](https://raw.githubusercontent.com/isithot/isithotrightnow/master/www/locations.json) we're using on Is It Hot Right Now:

{% highlight json linenos=table %}
[
  {
    "id": "066062",
    "name": "Observatory Hill",
    "label": "Sydney City",
    "tz": "Australia/Sydney",
    "record_start": "1910",
    "record_end": "2017"
  },
  {
    "id": "067105",
    "name": "Richmond RAAF",
    "label": "Sydney West",
    "tz": "Australia/Sydney",
    "record_start": "1939",
    "record_end": "2017"
  }
]
{% endhighlight %}

JSON can store data in Arrays (denoted by [square brackets]) or Objects (denoted by {curly brackets}). This example doesn't illustrate it, but you can also nest Arrays and Objects as deeply as you want.

Arrays and Objects both map naturally to R's lists, since you can access list elements by a numeric position or a name. So when you load JSON data in R using RJSONIO, you just get a hierarchy of lists:

{% highlight r linenos=table %}
library(tidyverse)     # purrr is in here!
library(RJSONIO)

stations = fromJSON("https://goo.gl/U7C3MP")
str(stations)
# List of 10
#  $ : Named chr [1:3] "066062" "Observatory Hill" "Sydney"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "067105" "Richmond RAAF" "Western Sydney"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "087031" "Laverton RAAF" "Melbourne"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "070351" "Canberra Airport" "Canberra"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "094029" "Hobart (Ellerslie Rd)" "Hobart"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "040842" "Brisbane Aero" "Brisbane"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "023090" "Kent Town" "Adelaide"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "015590" "Alice Springs Airport" "Alice Springs"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "014015" "Darwin Airport" "Darwin"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
#  $ : Named chr [1:3] "009021" "Perth Airport" "Perth"
#   ..- attr(*, "names")= chr [1:3] "id" "name" "label"
{% endhighlight %}

So this is a list of lists. We can look at one of the outer list elements (a single station) and see that it's a list with a bunch of named elements inside. We can get an element out:

{% highlight r linenos=table %}
stations[[3]]
#              id            name           label
#        "087031" "Laverton RAAF"     "Melbourne"
stations[[3]][["name"]]
# [1] "Laverton RAAF"
{% endhighlight %}

We can also use purrr's amazing `pluck` function to dig as far as we need into lists of lists in a more readable way. For example, to get the name from the third station in the list:

{% highlight r linenos=table %}
stations %>% pluck(3, "name")
# [1] "Laverton RAAF"

# we can also use pluck(stations, 3, "name") if we're not piping!
{% endhighlight %}

(If you haven't used the pipe operator `%>%` from [magrittr](http://magrittr.tidyverse.org/) before, it takes the thing on the left and squeezes it into the function on the right before that function's other arguments. If you want the thing on the left somewhere else, you can use `.` to put it wherever you'd like.)

But pulling things out one at a time gets old real quick; we want to _automate_ this. In cases where we trust the input data to be structured in a predictable way (like this example, where we expect that each station in the Array will have the same data in it), we can use `map` in combination with `pluck` to get _every_ station's `name`:

{% highlight r linenos=table %}
stations %>% map(~ pluck(., "name"))
# 
# [[1]]
# [1] "Observatory Hill"
# 
# [[2]]
# [1] "Richmond RAAF"
# 
# [[3]]
# [1] "Laverton RAAF"
# 
# [[4]]
# [1] "Canberra Airport"
# 
# [[5]]
# [1] "Hobart (Ellerslie Rd)"
# 
# [[6]]
# [1] "Brisbane Aero"
# 
# [[7]]
# [1] "Kent Town"
# 
# [[8]]
# [1] "Alice Springs Airport"
# 
# [[9]]
# [1] "Darwin Airport"
# 
# [[10]]
# [1] "Perth Airport"
{% endhighlight %}

The `map_*` functions take lists (or vectors) in, run the supplied function on each element of the input, then return the results of the function in a data structure of your choice. Here, pluck gives us a character vector of length 1 (because, on its own, it deals with one thing at a time). Vanilla `map` `pluck`s from each object in turn and gives us a list with each character vector back. Since the list we get back just as character vectors in it, we could reduce it all the way down to one vector with `unlist()`:

{% highlight r linenos=table %}
stations %>%
map(pluck, "name") %>%
unlist()

#  [1] "Observatory Hill"      "Richmond RAAF"         "Laverton RAAF"
#  [4] "Canberra Airport"      "Hobart (Ellerslie Rd)" "Brisbane Aero"
#  [7] "Kent Town"             "Alice Springs Airport" "Darwin Airport"
# [10] "Perth Airport"
{% endhighlight %}

Usually we pluck something `like("this")`, but `map` can pass arguments along to the function you want to run. So in this case, `map` passes `name` onto `pluck`.

A different way to do this is using what's called an _anonymous function_: instead of a calling a here's-one-I-prepared-earlier function, we define one on the spot. `map` gives a shortcut to do this using the tilde (`~`):

{% highlight r linenos=table %}
stations %>%
map(~ pluck(., "name")) %>%
unlist()

#  [1] "Observatory Hill"      "Richmond RAAF"         "Laverton RAAF"
#  [4] "Canberra Airport"      "Hobart (Ellerslie Rd)" "Brisbane Aero"
#  [7] "Kent Town"             "Alice Springs Airport" "Darwin Airport"
# [10] "Perth Airport"
{% endhighlight %}

That looks a bit more complicated. In the first version, `map` passed each element of the list onto `pluck` automatically (just like the pipe operator, `%>%`, does); in the second, we have to do it ourselves using the `.` pronoun.

But the second version is also more powerful—nor just because we can use functions that don't expect the data from `map` to go first, but because now we can pipe functions together _inside `map`_. For example:

{% highlight r linenos=table %}
stations %>%
map(
  ~ pluck(., "name") %>%
  paste("has a weather station")) %>%
unlist() %>%
head(3)
#  [1] "Observatory Hill has a weather station"
#  [2] "Richmond RAAF has a weather station"
#  [3] "Laverton RAAF has a weather station"
{% endhighlight %}

Here, one pipe is `stations %>% map() %>% unlist() %>% head()`; the other is `pluck() %>% paste()`. The data pronoun `.` is passed into `map` from the outer pipe.

## XML unplucked
To show you some of the more complex things we can do with `map` and nested pipes, let's look at a more interesting dataset:

{% highlight r linenos=table %}
library(xml2)    # rvest is the html version of this!

obs = read_xml("ftp://ftp.bom.gov.au/anon/gen/fwo/IDN60920.xml")
obs
# {xml_document}
# <product version="v1.7.1" noNamespaceSchemaLocation="http://www.bom.gov.au/schema/v1.7/product.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
# [1] <amoc>\n  <source>\n    <sender>Australian Government Bureau of Meteorolo ...
# [2] <observations>\n  <station wmo-id="94768" bom-id="066062" tz="Australia/S ...
{% endhighlight %}

Like JSON, XML can store hierarchies of objects. However, in XML, the objects (or _nodes_, as XML calls them) are stored like `<my_thing some_attribute="some_value">Some contents</my_thing>`. So nodes have a name (`my_thing`), some optional attributes with values, and they have contents (which, like JSON, can be straight-up data or more objects).

Unlike JSON, XML doesn't map neatly to R's data structures. So we can't `pluck` into XML files, or even use R's `builtin[["accessor"]][["syntax"]]`. Instead, we use accessor functions that help us isolate parts of the file:

{% highlight r linenos=table %}
obs %>% xml_find_all("//station")
# {xml_nodeset (185)}
#  [1] <station wmo-id="94768" bom-id="066062" tz="Australia/Sydney" stn-name=" ...
#  [2] <station wmo-id="94926" bom-id="070351" tz="Australia/Sydney" stn-name=" ...
#  [3] <station wmo-id="94934" bom-id="069137" tz="Australia/Sydney" stn-name=" ...
#  [4] <station wmo-id="94938" bom-id="069138" tz="Australia/Sydney" stn-name=" ...
#  [5] <station wmo-id="94937" bom-id="069018" tz="Australia/Sydney" stn-name=" ...

# (there're 185 stations, but 5 is quite enough)
{% endhighlight %}

And then we use functions like `xml_attr` or `xml_text` to get at the good bits as pluck did. But, unlike, `pluck`, these XML functions can be given a _group_ of nodes from `xml_find_all`, and they'll return the results from _each_ element in the group. No `map` needed!

{% highlight r linenos=table %}
obs %>% xml_find_all("//station") %>% xml_attr("stn-name") %>% head(5)
#  [1] "SYDNEY (OBSERVATORY HILL)"
#  [2] "CANBERRA AIRPORT"
#  [3] "GREEN CAPE AWS"
#  [4] "ULLADULLA AWS"
#  [5] "MORUYA HEADS PILOT STATION"
{% endhighlight %}

(`xml2` uses a syntax called XPath to make all sorts of granular selections of nodes. I'm not going to delve into it too deeply, but if you're interested, [MSDN has a good primer on it](https://msdn.microsoft.com/en-us/library/ms256471%28v=vs.110%29.aspx).)

I guess we don't need `map` after all! Well, not quite...

## Nesting pipes

I mentioned before that using `map` with the tilde syntax allows us to chain functions together and repeat the result across a list of things. But nested pipes can get complicated _real_ fast, as the next example will illustrate.

Let's say I don't just want a bunch of station names from my XML file—I want a bunch of useful information, like its latitude and longitude, its timezone and the air temperature.

I'll probably want to put that into a data frame, and I can! But I only want the stations with codes matching my earlier list:

{% highlight r linenos=table %}
# let's get those station ids back
station_ids =
  stations %>%
  map(~ pluck(., "id")) %>%
  unlist()
station_ids
#  [1] "066062" "067105" "087031" "070351" "094029" "040842" "023090" "015590"
#  [9] "014015" "009021"

# i'm going to mash these into one big string that i'll use as an xpath_filter
xpath_filter =
  paste0("@bom-id = '", station_ids, "'") %>%
  paste(collapse = " or ")
xpath_filter
# [1] "@bom-id = '066062' or @bom-id = '067105' or @bom-id = '087031' or @bom-id = '070351' or @bom-id = '094029' or @bom-id = '040842' or @bom-id = '023090' or @bom-id = '015590' or @bom-id = '014015' or @bom-id = '009021'"

# okay, let's build a data frame!
obs %>%
xml_find_all(paste0("//station[", xpath_filter, "]")) %>%
data_frame(
  station_id = xml_attr(., "bom-id"),
  tz = xml_attr(., "tz"),
  lat = xml_attr(., "lat"),
  lon = xml_attr(., "lon"),
  temp =
    xml_find_first(., "//element[@type='air_temperature']") %>%
    xml_text())
# # A tibble: 3 x 6
#   .                                               stat… tz    lat   lon   temp
#   <S3: xml_nodeset>                               <chr> <chr> <chr> <chr> <chr>
# 1 "<station wmo-id=\"94768\" bom-id=\"066062\" t… 0660… Aust… -33.… 151.… 23.5
# 2 "<station wmo-id=\"94926\" bom-id=\"070351\" t… 0703… Aust… -35.… 149.… 23.5
# 3 "<station wmo-id=\"95753\" bom-id=\"067105\" t… 0671… Aust… -33.… 150.… 23.5
{% endhighlight %}

Now we're cookin' with gas! (These are _current_ observations, so your numbers might look a little different.)

Let's leave the rather convoluted XPath filter aside and focus on the pipes. This code is liberally sprinkled with `%>%` and `.`, but there are actually two different pipes going on. (This is a really good argument for consistent indentation style: it helps keep nested pipes straight!)

In the first two lines (18 and 19), we have the sort of pipe we would usually expect: it passes the data frame `obs` onto the XML selector, `xml_find_all`, and that passes the selection of nodes onto `data_frame`. Once we're inside `data_frame`, we use the data pronoun `.` to refer back to the selection from `xml_find_all`. So the pipe `%>%` stays outside `data_frame`, following the first level of indentation, and `.` stays inside.

But there's also a pipe operator `%>%` _inside_ `data_frame`, on line 26. **That's a _new pipe_**. It's passing a sub-selection on to `xml_text`. If we continue piping on outside `data_frame`, we're back to the outer pipe, passing the whole data frame on.

There's just one problem with all of this: my stations are spread across a bunch of different states, and this XML file is for one state, New South Wales. I want a data frame for all of them!

## Something-something Inception

Luckily, the [Bureau of Meteorology](https://www.bom.gov.au) keeps the other states' observations in the same place, varying only the third letter of the name: `IDN60920.xml` for New South Wales, `IDV60920.xml` for Victoria, and so on.

Now, what can we use to repeat a task across a list?

Yep, it's `map`! But this time, we're returning data frames. I mentioned that there are `map_*` functions for combining the results of our mapping in different ways, and `map_dfr` can bind data frames you return by row. So we're going to take our entire last example, and we're going to jam it into a `map_dfr()` call using that magical tilde `~`:

{% highlight r linenos=table %}
obs_new =
  c("D", "N", "Q", "S", "T", "V", "W") %>%
  map_dfr(
    ~ read_xml(paste0("ftp://ftp.bom.gov.au/anon/gen/fwo/ID", ., "60920.xml")) %>%
    xml_find_all(paste0("//station[", xpath_filter, "]")) %>%
    data_frame(
      station_id = xml_attr(., "bom-id"),
      tz = xml_attr(., "tz"),
      lat = xml_attr(., "lat"),
      lon = xml_attr(., "lon"),
      temp =
        xml_find_first(., "//element[@type='air_temperature']") %>%
        xml_text()))
obs_new
# # A tibble: 10 x 6
#    .              station_id tz                  lat      lon      temp
#    <list>         <chr>      <chr>               <chr>    <chr>    <chr>
#  1 <S3: xml_node> 014015     Australia/Darwin    -12.4239 130.8925 30.3
#  2 <S3: xml_node> 015590     Australia/Darwin    -23.7951 133.8890 30.3
#  3 <S3: xml_node> 066062     Australia/Sydney    -33.8607 151.2050 21.9
#  4 <S3: xml_node> 070351     Australia/Sydney    -35.3088 149.2004 21.9
#  5 <S3: xml_node> 067105     Australia/Sydney    -33.6004 150.7761 21.9
#  6 <S3: xml_node> 040842     Australia/Brisbane  -27.3917 153.1292 25.4
#  7 <S3: xml_node> 023090     Australia/Adelaide  -34.9211 138.6216 37.3
#  8 <S3: xml_node> 094029     Australia/Hobart    -42.8897 147.3278 17.0
#  9 <S3: xml_node> 087031     Australia/Melbourne -37.8565 144.7566 27.4
# 10 <S3: xml_node> 009021     Australia/Perth     -31.9275 115.9764 24.1
{% endhighlight %}

Okay, that got a little wild. By my count, we have **three** pipes going here—and **two** of them have `.` operators referring back:

1. First, we pipe that vector of letter codes into `map_dfr` (on line 2). Once we're inside `map_dfr`, we use `.` on line 4 to refer to the _current_ letter (because the functions we give to `map_*` deal with one list element at a time).
2. But we also start a new pipe on lines 4 and 5, inside `map_dfr`, carrying a node selection into `data_frame` as we did before. And once we're inside `data_frame`, we use `.` to refer back to the second pipe's data (lines 8–11, 13).
3. And, on line 13, we start a _third_ pipe (as we did before) to get the text from each `air_temperature` element.

Each of those data frames we made before gets row bound (glued from top-to-bottom) by `map_dfr`. Ta-da!

The important thing to keep track of all these pipes is that the pipe operator `%>%` and the data pronoun `.` appear on the outside and inside of a piped function respectively. In a couple of places the pronoun from one pipe and the operator from another appear on the same line. But if we're consistent about our indentation, we can always see which pipes they belong to, remembering that the pronoun `.` appears one level further in (because it's inside the piped function).

So now we have a totally automated way to bring together the interesting observations from all stations of interest across a number of files. In fact, we _did_ automate it: for [Is It Hot Right Now](https://isithotrightnow.com), we schedule R to run a script with this pipe in it every half hour.

## Next stop

One of the best things about `map` is its flexibility: you can use this approach to deal with just about any structured data in R, whether it's complex objects like regression models, data structures you've built yourself or files brought in using other packages.

If you're looking for more detail, I—like many others—recommend [Jenny Bryan's incomparable purrr tutorial](https://jennybc.github.io/purrr-tutorial/index.html). It covers a lot of the other sophisticated ways you can use purrr. One particular use case from her tutorial that I didn't cover is roundtripping a data frame list column with `map` inside a `mutate` verb, the way you would other a regular data frame column verbs. That's mostly because I've only done it once and I still only 80% understand it 😅

Think I could've done this better? Got a question? [Let me know](https://twitter.com/rensa_co)!

_Cover image: [Jackhammer](https://www.flickr.com/photos/srudy/4679621144/) by Martinus Scriblerus. Licensed under CC BY-NC 2.0_
