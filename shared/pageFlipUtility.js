//This object contains a number of convencience features for working with the book contents.
var PageFlipUtility = {
    //This method constructs a simple header div with separator line included.
    constructHeader: function (content, divClass = 'page-header') {
        return "<div class='" + divClass + "'>" + content + "<div class='separator-line'></div></div>";
    },

    //This method constructs a simple content div, concaternating the content if it is an array.
    constructContent: function (content, divider = ' ', divClass = 'page-section-content') {
        var inner = "";
        if (!Array.isArray(content)) {
            inner = content;
        } else {
            for (var line in content) {
                inner += content[line] + divider;
            }
        }
        return "<div class='" + divClass + "'>" + inner + "</div>";
    },

    //This method constructs multiple section divs, with header and content.
    //Expects the sections argument to be an array containing the following structures:
    //{
    //  header: string | null | undefined,
    //  content: string | null | undefined,
    //  extraClass: string | [string,] | null | undefined
    //},
    constructSections: function (sections) {
        var html = "";
        for (var id in sections) {
            var extraClass = "";
            if (sections[id].hasOwnProperty('extraClass')
                && sections[id].extraClass != null) {
                extraClass = " " + sections[id].extraClass;
            }
            html += "<div class='page-section" + extraClass + "'>";
            if (sections[id].hasOwnProperty('header')
                && sections[id].header != null
                && sections[id].header != "") {
                html += PageFlipUtility.constructHeader(sections[id].header, "page-section-header");
            }
            if (sections[id].hasOwnProperty('content')
                && sections[id].content != null
                && sections[id].content != "") {
                html += PageFlipUtility.constructContent(sections[id].content);
            }
            html += "</div>"
        }
        return html;
    },

    //This method requests a JSON file from the path and then parses it and returns a Promise for a valid JSON object.
    //This method is async, take heed.
    loadJSONFromFile: async function (path) {
        return await fetch(path)
            .then((response) => response.json())
            .then((responseJson) => { return responseJson })
            .catch((error) => {
                console.error("loadJSONFromFile: " + error);
            });
    }
}

//This object contains methods for constructing various types of pages.
var PageFlipPages = {
    //Expects a pageData JSON object with the following structure:
    //{
    //  pageHeader: string | null | undefined,
    //  sections: [
    //      {
    //          header: string | null | undefined,
    //          content: string | null | undefined,
    //          extraClass: string | [string,] | null | undefined
    //      },
    //  ]
    //}
    constructPage: function (pageData) {
        //Validate pageData JSON structure.
        var error = false;
        if (!pageData.hasOwnProperty('sections')) {
            console.error("constructPage: JSON Error: No 'sections' property found.");
            error = true;
        } else if (!Array.isArray(pageData.sections)) {
            console.error("constructPage: JSON Error: 'sections' property isn't an Array");
            error = true;
        }

        if (error) return "";

        var html = "";
        if (pageData.hasOwnProperty('pageHeader')
            && pageData.pageHeader != null
            && pageData.pageHeader != "") {
            html += PageFlipUtility.constructHeader(pageData.pageHeader);
        }
        if (pageData.sections.length > 0) {
            html += PageFlipUtility.constructSections(pageData.sections);
        }
        html += "</div>";

        return html;
    },

    //Expects a pageData JSON object with the following structure:
    //{
    //  pageAlign: 'left' | 'right'
    //  pageHeader: string,
    //  imageSrc: string,
    //  sections: [
    //      {
    //          header: string | null | undefined,
    //          content: string | null | undefined,
    //          extraClass: string | [string,] | null | undefined
    //      },
    //  ]
    //}
    constructPageWithSmallImage: function (pageData) {
        //Validate pageData JSON structure.
        var error = false;
        var align = 'left';
        if (!pageData.hasOwnProperty('pageAlign')) {
            console.warn("constructPageWithSmallImage: JSON Error: No 'pageAlign' property found. Assuming 'left' alignment.")
        } else if (pageData.pageAlign != 'left' && pageData.pageAlign != 'right') {
            console.warn("constructPageWithSmallImage: JSON Error: 'pageAlign' isn't 'left' or 'right'. Assuming 'left' alignment.")
        } else {
            align = pageData.pageAlign;
        }
        if (!pageData.hasOwnProperty('pageHeader')) {
            console.error("constructPageWithSmallImage: JSON Error: No 'pageHeader' property found.");
            error = true;
        }
        if (!pageData.hasOwnProperty('imageSrc')) {
            console.error("constructPageWithSmallImage: JSON Error: No 'imageSrc' property found.");
            error = true;
        }
        if (!pageData.hasOwnProperty('sections')) {
            console.error("constructPageWithSmallImage: JSON Error: No 'sections' property found.");
            error = true;
        } else if (!Array.isArray(pageData.sections)) {
            console.error("constructPageWithSmallImage: JSON Error: 'sections' property isn't an Array");
            error = true;
        }

        if (error) return "";

        var html = "<div class='page-align-" + align + "'>";
        html += "<div class='page-image-small'>";
        if (pageData.imageSrc != "") {
            html += "<img src='" + pageData.imageSrc + "'/>";
        }
        html += "</div>";
        html += PageFlipUtility.constructHeader(pageData.pageHeader);

        if (pageData.sections.length > 0) {
            html += PageFlipUtility.constructSections(pageData.sections);
        }
        html += "</div>";

        return html;
    },

    //Expects a pageData JSON object with the following structure:
    //{
    //  pageHeader: string,
    //  imageSrc: string,
    //  sections: [
    //      {
    //          header: string | null | undefined,
    //          content: string | null | undefined,
    //          extraClass: string | [string,] | null | undefined
    //      },
    //  ]
    //}
    constructPageWithLargeImage: function (pageData) {
        //Validate pageData JSON structure.
        var error = false;
        if (!pageData.hasOwnProperty('pageHeader')) {
            console.error("constructPageWithLargeImage: JSON Error: No 'pageHeader' property found.");
            error = true;
        }
        if (!pageData.hasOwnProperty('imageSrc')) {
            console.error("constructPageWithLargeImage: JSON Error: No 'imageSrc' property found.");
            error = true;
        }
        if (!pageData.hasOwnProperty('sections')) {
            console.error("constructPageWithLargeImage: JSON Error: No 'sections' property found.");
            error = true;
        } else if (!Array.isArray(pageData.sections)) {
            console.error("constructPageWithLargeImage: JSON Error: 'sections' property isn't an Array");
            error = true;
        }

        if (error) return "";

        var html = "<div class='page-image-large'>";
        if (pageData.imageSrc != "") {
            html += "<img src='" + pageData.imageSrc + "'/>";
        }
        html += "</div>";
        html += PageFlipUtility.constructHeader(pageData.pageHeader);

        if (pageData.sections.length > 0) {
            html += PageFlipUtility.constructSections(pageData.sections);
        }
        html += "</div>";

        return html;
    }
}

function appendPages(bookId, pages) {
    if (!Array.isArray(pages)) {
        console.error("appendPages: Passed argument isn't an array.");
    }

    console.log('appendPages: Adding pages to book element with ID: ' + bookId);
    var book = document.getElementById(bookId);
    if (book == null) {
        console.error("appendPages: No element with specified ID (" + bookId + ") found.");
        return;
    }

    //Make sure we have an even amount of pages, just for convenience.
    if ((pages.length % 2) > 0) {
        pages.push("");
    }

    //Look for the first inside-cover.
    //Todo: Forego this and just add it after the cover instead, have the pageFlipInit deal with adding the inside covers.
    var inside = document.querySelector('.page-container.page-cover-inside');
    if (inside != null) {
        for (var i = pages.length - 1; i >= 0; i--) {
            var container = document.createElement("div");
            container.classList.add("page-container");
            container.classList.add("page-content");
            container.innerHTML += '<div class="decorative-corner top"></div>';
            container.innerHTML += pages[i];
            container.innerHTML += '<div class="decorative-corner bottom"></div>';

            inside.after(container);
        }
    } else {
        console.error("appendPages: Can't find an element with the classes .page-container.page-cover-inside to append pages after.");
    }
}