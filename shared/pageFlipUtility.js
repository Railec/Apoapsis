function appendPages(bookId, pages) {
    if(!Array.isArray(pages)) {
        console.error("appendPages: Passed argument isn't an array.");
    }
    
	console.log('appendPages: Adding pages to book element with ID: ' + bookId);
	var book = document.getElementById(bookId);
	if(book == null) {
		console.error("appendPages: No element with specified ID (" + bookId + ") found.");
		return;
	}

    //Make sure we have an even amount of pages, just for convenience.
    if((pages.length % 2) > 0) {
        pages.push("");
    }

    //Look for the first inside-cover.
    //Todo: Forego this and just add it after the cover instead, have the pageFlipInit deal with adding the inside covers.
    var inside = document.querySelector('.page-container.page-cover-inside');
    if(inside != null) {
        for(var i = pages.length-1; i >= 0; i--) {
            var container = document.createElement("div");
            container.classList.add("page-container");
            container.classList.add("page-content");
            container.innerHTML+='<div class="decorative-corner top"></div>';
            container.innerHTML+=pages[i];
            container.innerHTML+='<div class="decorative-corner bottom"></div>';

            inside.after(container);
        }
    } else {
        console.error("appendPages: Can't find an element with the classes .page-container.page-cover-inside to append pages after.");
    }
}

//Expects a pageData JSON object with the following structure:
//{
//  pageAlign: 'left' | 'right'
//  pageHeader: string,
//  imageSrc: string,
//  sections: [
//      {
//          header: string | null | undefined,
//          content: string | null | undefined,
//          extraClass: string | null | undefined
//      },
//  ]
//}
function constructPageWithSmallImage(pageData) {
    //Validate pageData JSON structure.
    var error = false;
    var align = 'left';
    if(!pageData.hasOwnProperty('pageAlign')) {
        console.warn("constructPageWithSmallImage: JSON Error: No 'pageAlign' property found. Assuming 'left' alignment.")
    } else if(pageData.pageAlign != 'left' && pageData.pageAlign != 'right') {
        console.warn("constructPageWithSmallImage: JSON Error: 'pageAlign' isn't 'left' or 'right'. Assuming 'left' alignment.")
    } else {
        align = pageData.pageAlign;
    }
    if(!pageData.hasOwnProperty('pageHeader')) {
        console.error("constructPageWithSmallImage: JSON Error: No 'pageHeader' property found.");
        error = true;
    }
    if(!pageData.hasOwnProperty('imageSrc')) {
        console.error("constructPageWithSmallImage: JSON Error: No 'imageSrc' property found.");
        error = true;
    }
    if(!pageData.hasOwnProperty('sections')) {
        console.error("constructPageWithSmallImage: JSON Error: No 'sections' property found.");
        error = true;
    } else if(!Array.isArray(pageData.sections)) {
        console.error("constructPageWithSmallImage: JSON Error: 'sections' property isn't an Array");
        error = true;
    }
    
    if(error) return "";

    var html = "<div class='page-align-"+align+"'>";
    html+="<div class='page-image-small'>";
    if(pageData.imageSrc != "") {
            html+="<img src='"+pageData.imageSrc+"'/>";
    }
    html+="</div>";
    html+="<div class='page-header'>";
    html+=pageData.pageHeader;
    html+="<div class='separator-line'></div>";
    html+="</div>";
    if(pageData.sections.length > 0) {
        for(var id in pageData.sections) {
            var extraClass = "";
            if(pageData.sections[id].hasOwnProperty('extraClass')
            && pageData.sections[id].extraClass != null) {
                extraClass = " "+pageData.sections[id].extraClass;
            }
            html+= "<div class='page-section"+extraClass+"'>";
            if(pageData.sections[id].hasOwnProperty('header')
            && pageData.sections[id].header != null
            && pageData.sections[id].header != "") {
                html+="<div class='page-section-header'>";
                html+=pageData.sections[id].header;
                html+="<div class='separator-line'></div>"
                html+="</div>";
            }
            if(pageData.sections[id].hasOwnProperty('content')
            && pageData.sections[id].content != null
            && pageData.sections[id].content != "") {
                html+="<div class='page-section-content'>"+pageData.sections[id].content+"</div>";
            }
            html+="</div>"
        }
    }
    html+="</div>";

    return html;
}

//Expects a pageData JSON object with the following structure:
//{
//  pageHeader: string,
//  imageSrc: string,
//  sections: [
//      {
//          header: string | null | undefined,
//          content: string | null | undefined,
//          extraClass: string | null | undefined
//      },
//  ]
//}
function constructPageWithLargeImage(pageData) {
    //Validate pageData JSON structure.
    var error = false;
    if(!pageData.hasOwnProperty('pageHeader')) {
        console.error("constructPageWithLargeImage: JSON Error: No 'pageHeader' property found.");
        error = true;
    }
    if(!pageData.hasOwnProperty('imageSrc')) {
        console.error("constructPageWithLargeImage: JSON Error: No 'imageSrc' property found.");
        error = true;
    }
    if(!pageData.hasOwnProperty('sections')) {
        console.error("constructPageWithLargeImage: JSON Error: No 'sections' property found.");
        error = true;
    } else if(!Array.isArray(pageData.sections)) {
        console.error("constructPageWithLargeImage: JSON Error: 'sections' property isn't an Array");
        error = true;
    }
    
    if(error) return "";

    var html = "<div class='page-image-large'>";
    if(pageData.imageSrc != "") {
            html+="<img src='"+pageData.imageSrc+"'/>";
    }
    html+="</div>";
    html+="<div class='page-header'>";
    html+=pageData.pageHeader;
    html+="<div class='separator-line'></div>";
    html+="</div>";
    if(pageData.sections.length > 0) {
        for(var id in pageData.sections) {
            var extraClass = "";
            if(pageData.sections[id].hasOwnProperty('extraClass')
            && pageData.sections[id].extraClass != null) {
                extraClass = " "+pageData.sections[id].extraClass;
            }
            html+= "<div class='page-section"+extraClass+"'>";
            if(pageData.sections[id].hasOwnProperty('header')
            && pageData.sections[id].header != null
            && pageData.sections[id].header != "") {
                html+="<div class='page-section-header'>";
                html+=pageData.sections[id].header;
                html+="<div class='separator-line'></div>"
                html+="</div>";
            }
            if(pageData.sections[id].hasOwnProperty('content')
            && pageData.sections[id].content != null
            && pageData.sections[id].content != "") {
                html+="<div class='page-section-content'>"+pageData.sections[id].content+"</div>";
            }
            html+="</div>"
        }
    }
    html+="</div>";

    return html;
}

//Expects a pageData JSON object with the following structure:
//{
//  pageHeader: string | null | undefined,
//  sections: [
//      {
//          header: string | null | undefined,
//          content: string | null | undefined,
//          extraClass: string | null | undefined
//      },
//  ]
//}
function constructPage(pageData) {
    //Validate pageData JSON structure.
    var error = false;
    if(!pageData.hasOwnProperty('sections')) {
        console.error("constructPage: JSON Error: No 'sections' property found.");
        error = true;
    } else if(!Array.isArray(pageData.sections)) {
        console.error("constructPage: JSON Error: 'sections' property isn't an Array");
        error = true;
    }
    
    if(error) return "";

    var html = "";
    if(pageData.hasOwnProperty('pageHeader')
    && pageData.pageHeader != null
    && pageData.pageHeader != "") {
        html+="<div class='page-header'>";
        html+=pageData.pageHeader;
        html+="<div class='separator-line'></div>";
        html+="</div>";
    }
    if(pageData.sections.length > 0) {
        for(var id in pageData.sections) {
            var extraClass = "";
            if(pageData.sections[id].hasOwnProperty('extraClass')
            && pageData.sections[id].extraClass != null) {
                extraClass = " "+pageData.sections[id].extraClass;
            }
            html+= "<div class='page-section"+extraClass+"'>";
            if(pageData.sections[id].hasOwnProperty('header')
            && pageData.sections[id].header != null
            && pageData.sections[id].header != "") {
                html+="<div class='page-section-header'>";
                html+=pageData.sections[id].header;
                html+="<div class='separator-line'></div>"
                html+="</div>";
            }
            if(pageData.sections[id].hasOwnProperty('content')
            && pageData.sections[id].content != null
            && pageData.sections[id].content != "") {
                html+="<div class='page-section-content'>"+pageData.sections[id].content+"</div>";
            }
            html+="</div>"
        }
    }
    html+="</div>";

    return html;
}