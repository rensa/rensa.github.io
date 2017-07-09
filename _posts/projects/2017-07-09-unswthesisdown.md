---
title: unswthesisdown
layout: post
category: projects
date: 2017-07-09
image-sm: thumb-2017-07-09-unswthesisdown.png
image: 2017-07-09-unswthesisdown.png
alt: unswthesisdown
project-date: Jun 2017
description: A package for writing your thesis in RMarkdown according to UNSW guidelines.
---
[Chester Ismay's](http://twitter.com/old_man_chester) lovely [`thesisdown`](https://github.com/ismayc/thesisdown) package allows people to ditch LaTeX and write their thesis in RMarkdown. RMarkdown allows you to insert blocks of R code into your manuscript, but even if you don't want to actually do analysis in your manuscript, you can use RMarkdown to easily insert tables and figures, or you can just write plain Markdown. Frankly, either option beats out ugly LaTeX, and this package pipes your readable RMArkdown through a LaTeX template so that you get that pristine TeX look without actually having to write it. Plus, you can produce a gorgeous [gitbook](https://www.gitbook.com/) version to host on the web!

I forked ismayc/thesisdown because the original is built with Reed College in mind. The [`unswthesisdown` fork](https://github.com/rensa/unswthesisdown) modifies the LaTeX template to be suitable for UNSW students. That mostly means it uses A4 paper with UNSW margins instead of letter size, but it also adds a prettier title page and hyperlinks. Frankly, you could probably use it for any Australian university unless they have different margin sizes (and you can tweak those in the LaTeX template if you need to).

As always, I'm happy to take feedback and changes to improve the template, either via [GitHub](http://github.com/rensa/unswthesisdown) issues and PRs or by [getting in touch](http://twitter.com/rensa_co).