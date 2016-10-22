---
title: Global Game Jam 2016 (Raceline)
layout: post
category: projects
date: 2016-02-02
image-sm: thumb-2016-02-02-global-game-jam-2016.png
image: thumb-2016-02-02-global-game-jam-2016.png
alt: Raceline
project-date: Jan 2016
description: We made a dumb little JavaScript game. Which is more of a game than I've made before!
---
We made a game! And you can [go play it](http://flairgenes.github.io/raceline) on your computer or phone right now! It's small and dumb, but it works, and I love it.

I was pretty determined to try [Global Game Jam](http://globalgamejam.org) this year. Game development is something I put aside as a career choice at the end of high school; I wanted to continue do it as an amateur (although the indie scene hadn't exploded back then), but I was falling out of love with code back then, so it never really stuck.

But since I started research, I've started to really enjoy coding again. At uni, it's all data analysis with R, which is interesting in its own right but probably one of the worst possible choices for game development (unless the game is to learn statistics). But I've also found that my interest has spread to web development as I've tinkered with this Jekyll-powered site, and I've _really_ become interested in JavaScript, even though I think it's a horrid language.

I've tinkered with Unity a bit, and I'd love to use it more, but that's not something to learn over a weekend. I had a few friends who were in a similar position to me—coders who had some familiarity with JS but who weren't doing game dev professionally even though it interested them—so we decided to find a [lightweight JS game dev library](http://www.html5quintus.com) and have a go, even if it meant we came up with a pile of crap after 48 hours.

{% include figure.html url='/img/portfolio/raceline.png' %}

As it happens, we [cobbled something together!](http://flairgenes.github.io/raceline) We spent most of the first half grappling with the engine, but we all came out of it understanding how the library makes the magic happen with sprites and tilesets, and we were able to get a working demo functioning. It's a little race car game (think Micro-Machines) where the idea was to stick to the line on subsequent laps. We had some ideas about how to riff on that as the game progressed, but it took most of two days just to get the initial idea happening.

The really rewarding thing is that the engine is complex enough and performance-focussed enough (with its JS base) to get interesting ideas working but simple enough that I'm not using a complete black box. Plus, with HTML5/CSS/JS you can see and publish the results immediately: you can leave a simple web server like Python or Node running in the background for testing or publish to Github Pages to show everyone else (though we also learned that this stack does _not_ mean completely trivial cross-browser compatibility). It works using keyboard controls or touchscreen buttons that were a cinch to set up (and it supports more complex touchscreen controls if you desire them). So even as we were finishing the jam up, I could ask my friends interstate and my partner overseas to test on their phones.

Finally, the other jammers and organisers at AIE Canberra were super supportive. Most of the other teams were professionals or AIE students, and virtually everyone else used Unity, so we were a little apprehensive about getting up to show our dumb game off (we decided to reach for the diversifier that demanded all the game's sounds come from someone's mouth, so I spent 45 minutes in a corridor creating those). But the audience and organisers asked interesting questions about our idea and laughed at the right times, which made us feel really welcome.

So as a first-time game dev experience, [#ggj16](https://twitter.com/search?q=%23ggj16) was really amazing. I'll be tinkering with Unity and JavaScript (both for game dev and web dev) more often in he future :D  