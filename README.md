## Background

GitLab now supports support for [math in markdown][gitlab-math] files both in wikis using the syntax:

     $`E = mc^2`$
     
for inline math, and fenced code blocks with the language name `math` for block math:

     ~~~math
     E = mc^2
     ~~~

Unfortunately, this is an idiosyncratic syntax that is not yet supported by any existing Markdown editor that I am aware of. Most Markdown editors do not support math at all, but those that do usually just support standard LaTeX embedded math syntaxes (e.g. `$...$`, `\(...\)`, `\[...\]`).

However, editing tools that are based all or in part on JavaScript may
be able to handle math rendering the same way that GitLab does by
using the [KaTeX](https://github.com/Khan/KaTeX) JavaScript math rendering library, which supports
both server-side and in-browser rendering of math. There is an associated
auto-rendering extension script that can search for unrendered math markup
in a DOM and replace it with rendered versions. With a little extra bit of
JavaScript provided in this project it is possible to support GitLab syntax.

## LightPaper support

[LightPaper](http://lightpaper.42squares.in/) is an inexpensive (but not free) Markdown editor
for Mac OS X 10.10 or higher. While it does not natively support GitLab 
syntax, it allows you to specify CSS files and JavaScript scripts to be automatically be loaded for all documents, and this can be used to install
code to render GitLab math in place.

Here is what you need to do:

1. Download KaTeX from [here](https://github.com/khan/katex/releases) and install it somewhere on your machine. (Choose tar.gz or zip file)
2. Download [gitlab-katex.js](./gitlab-katex.js) from this project and install somewhere. Or you could simply just clone this repository.
3. In Preview tab of LightPaper preferences make sure that `Enable Math Rendering (powered by MathJax)` is turned off. We will be using KaTeX instead.
4. In Script Assets tab of LightPaper preferences, add the following entries:
    * katex library, which is `katex.min.js` in the KaTeX download
    * katex auto-rendering script, which is `contrib/auto-render.min.js` in the
      KaTeX download.
    * `gitlab-katex.js]` script downloaded from this project
    * katex CSS file, which is `katex.css` in the KaTeX download (this is NOT optional)
5. In Script Assets tab of LightPaper preferences, select `On Update Callback Script` at bottom of dialog and add `renderGitlabKatex();` to body of update function.
6. Restart LightPaper

KaTeX is not a complete implementation of LaTeX math, so you may want to occasionally update KaTeX to get the latest updates.

