const settings = {
	startPage: 0,

	width: 600,
	height: 800,

	drawShadow: true,
	maxShadowOpacity: 0.2,

	autoSize: true,
	showCover: true
};
var pageFlip = null;

function onFlip(e) {
	var fakeCoverInside = document.getElementById('fake-cover-inside');
	//1 is the index of the inside of the front cover.
	//pageTotal - 3 is the index of the page before the inside of the back cover.
	if (e.data == 1) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 600px; right: 0px;');
		fakeCoverInside.classList.add('--right');
	} else if (e.data > 1 && e.data < (pageFlip.getPageCount() - 3)) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 0px; right: 0px;');
		fakeCoverInside.classList.remove('--left');
		fakeCoverInside.classList.remove('--right');
	} else if (e.data == (pageFlip.getPageCount() - 3)) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 0px; right: 600px;');
		fakeCoverInside.classList.add('--left');
	}
}

function initPageFlip(bookId) {
	//Get pages and possibly add another empty page to make sure the book is balanced.
	//Simply here to make my life easier.
	var pages = document.querySelectorAll('.page-container');
	if (pages.length % 2) {	//If pages odd, add another at the end, inside the cover, to balance the pages.
		var emptyPage = document.createElement('div');
		emptyPage.classList.add('page-container');
		emptyPage.classList.add('page-content');

		coverInsides = document.querySelectorAll('.page-cover-inside');
		if (coverInsides.length > 1) {
			coverInsides[coverInsides.length - 1].before(emptyPage);
		} else {
			console.error("Last inside of Cover is missing. Consider adding a div with classes .page-cover-inside before the end cover.");
		}

		pages = document.querySelectorAll('.page-container');
	}

	console.log('Initializing pageFlip on element with ID: ' + bookId);
	var book = document.getElementById(bookId);
	if (book != null) {
		pageFlip = new St.PageFlip(book, settings);
		pageFlip.loadFromHTML(pages);

		pageFlip.on('flip', onFlip);

		var fakeCoverInside = document.createElement('div');
		fakeCoverInside.classList.add('page-cover-inside');
		fakeCoverInside.classList.add('--right');
		fakeCoverInside.setAttribute('id', 'fake-cover-inside');
		fakeCoverInside.setAttribute('style', 'display: block; left: 600px; right: 0px;');
		book.append(fakeCoverInside);
	} else {
		console.error("No element with specified ID (" + bookId + ") found.")
	}
}