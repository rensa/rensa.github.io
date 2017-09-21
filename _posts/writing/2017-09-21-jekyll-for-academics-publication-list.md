---
title: "Jekyll for academics: add a publication list"
layout: post
category: writing
tags: [technical, webdev, jekyll]
date: 2017-08-22
mast: false
image: thumb-2017-09-21-jekyll-for-academics-publication-list.png
image-sm: thumb-2017-09-21-jekyll-for-academics-publication-list.png
alt: "Jekyll for academics: add a publication list"
project-date: Sep 2017
description: Making a personal website for a researcher? They'll probably want their publications on it.
---
Publication lists are a big part of your academic CV, and if you’re a researcher who has a personal website, you’ll probably want one somewhere prominent. Extensions like [`jekyll-scholar`](https://github.com/inukshuk/jekyll-scholar) make adding publications incredibly easy: bibtex files from your reference manager go in; an HTML list comes out.

But if you’re looking for something a little more configurable and almost as easy, you can set one up yourself! Once it’s set up, you can add entries to it by adding blog posts (which can have content of their own or be empty). My version looks like this:

{% include figure.html url='/assets/post-img/thumb-2017-09-21-jekyll-for-academics-publication-list.png' %}

The key is custom front matter. Jekyll posts (and other pages) have a block at the start specifying metadata like title and date:

{% highlight yaml linenos=table %}
---
title: And that's how I saved Hogwarts from the Decepticons
date: 2017-08-19
category: fanfics
---
{% endhighlight %}

Some of the elements in this block, like `title`, are baked into Jekyll. But you can make up whatever metadata you like. For example, the blog posts I make for publications look like a bit more like this:

{% highlight yaml linenos=table %}
---
title: A novel method of fortifying mineral-based...
layout: post
category: science
date: 2015-08-21

# tags i made up to format this as a paper
work-type: Paper
ref-authors: Goldie J
ref-year: 2015
ref-title: A novel method of fortifying mineral-based structures against attack by artificial intelligences
ref-journal: Journal of Machine-Arcana Interactions
ref-vol: 47(8):1289–1304
ref-doi: 10.1017/j.mai.2015.08.009
---
{% endhighlight %}

The second set of tags are all made up. They don't _do_ anything on their own, but Jekyll will recognise them when it builds the site. That makes them available if I reference posts elsewhere—like on a post archive page.

So, for example, my [science page](/science) contains a section for my publications. It looks like this:

{% highlight html linenos=table %}
{% raw %}
<div class="publist">
  <ul>
    {% for post in site.categories.science %}
      {% if post.work-type == 'Paper' %}
        <li>
          <a href="{% if post.ref-doi %}http://dx.doi.org/{{ post.ref-doi }}
            {% else %}{{ post.url | prepend: site.baseurl }}{% endif %}">
            <h2>{{ post.ref-authors }} ({{ post.ref-year }}).</h2></a>
          <p>
            {{ post.ref-title }}. 
            <em>{{ post.ref-journal}}</em>
            {% if post.ref-vol %}, {{ post.ref-vol }}{% endif %}. 
            {% if post.ref-doi %}
              <a href="http://dx.doi.org/{{ post.ref-doi }}">
                doi: {{ post.ref-doi }}
              </a>
            {% endif %}
          </p>
        </li>
      {% endif %}
    {% endfor %}
  <ul>
</div>
{% endraw %}
{% endhighlight %}

When I build the site, this iterates through each post in the `science` category (line 3—you can use `site.posts` if you don't care about categories). If the post has the custom `work-type` tag and it's `"Paper"` (line 4), it creates a list item (line 5). Lines 6–16 format this item as an author-date style reference, using the other custom metadata tags (with some flexibility added for papers that are still in press). You can then style these items however you like with CSS (for example, ditching the bullets with `list-style-type: none`).

The nice thing about this approach is the flexibility. Right now the links lead straight to the paper's page on the journal if a `ref-doi` is present or to a blog post otherwise. If you wanted to maintain an actual blog post with stuff like a plain-language summary or related resources (like conference talks), you could strip this out and just link to the blog post. You could add a link to the paper's PDF on the end using an extra custom tag (remember, they're made up).

The downside is that you need to format the reference yourself—if this style doesn't work for you, you'll need to modify it. But you're not likely to do that often, as you do with a manuscript, so I figure it's an easy trade-off: you just need to have the HTML skills to put the tags where they need to go.

Plus, this publication list can be copy-and-pasted straight into a CV—which is nice for you and nice for a potential employer 😉