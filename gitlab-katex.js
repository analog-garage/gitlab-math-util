// This script assumes that katex and katex/contrib/auto-render have already been included,
// specifically that the 'katex.render()' and 'renderMathInElement()' functions are in scope.

// This function grovels 'elem' looking for 
// <pre class="language-math"><code class="language-math"> ... </></>
// which results from conversion of GitLab markup fenced math block, and replaces
// it with result of katex.render() call. 
const renderFencedMathBlock = function(elem) 
{
	const children = elem.childNodes;
	const nchildren = children.length;
    for (let i = 0; i < nchildren; ++i)
    {
        const child = elem.childNodes[i];

        if (child.nodeType != 1) 
        	continue;

        switch (child.nodeName.toLowerCase())
        {
        	case "script":
        	case "noscript":
        	case "style":
        	case "textarea":
        	case "code":
        		// Skip
        		continue;

        	case "pre":
        		break;

        	default:
        		// recurse into
        		renderFencedMathBlock(child);
        		continue;
        }

        if (child.getAttribute("class").trim() == "language-math" &&
        	child.childNodes.length == 1)
        {
            const grandchild = child.childNodes[0];
            if (grandchild.nodeName.toLowerCase() == "code" &&
            	grandchild.getAttribute("class").trim() == "language-math" &&
            	grandchild.childNodes.length == 1 &&
            	grandchild.childNodes[0].nodeType == 3)
            {
            	// Replace text content with KaTeX render result.
            	const fragment = document.createDocumentFragment();
            	const math = grandchild.childNodes[0].textContent;

	            try
	            {
	            	const span = document.createElement("span");
	                katex.render(math, span, {displayMode: true});
	                fragment.appendChild(span);
	            	elem.replaceChild(fragment, child)
	            }
	            catch (e) 
	            {
	                if (!(e instanceof katex.ParseError)) {
	                    throw e;
	                }
	                console.error("GitLab KaTeX: Failed to parse `" + math + "`:", e);
	                fragment.appendChild(document.createTextNode(math));
	            }

            }
        }
    }
};


const renderGitlabKatex = function() {
	options = {
		delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\[", right: "\\]", display: true},
        {left: "$`", right: "$`", display: false},
		{left: "\\(`", right: "`\\)", display: false},
        {left: "\\(", right: "\\)", display: false},
        // LaTeX uses this, but it ruins the display of normal `$` in text:
        // {left: "$", right: "$", display: false},
        ],

        ignoredTags: [
        "script", "noscript", "style", "textarea", "pre", "code",
    	],

	};
	renderMathInElement(document.body, options);

	renderFencedMathBlock(document.body, options);
}

