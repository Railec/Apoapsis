const settings = {
	startPage: 0,

	width: 600,
	height: 800,

	drawShadow: true,
	maxShadowOpacity: 0.2,

	autoSize: true,
	usePortrait: false,
	showCover: true
};
var pageFlip = null;

function onFlip(e) {
	var book = e.object.getUI().getWrapper();
	if (book == null) {
		console.error("PageFlip.onFlip: No book wrapper element found. Something went wrong with the script.");
		return;
	}

	var fakeCoverInside = document.getElementById('fake-cover-inside');
	var fakePageStack = document.getElementById('fake-page-stack');
	var lastPage = e.object.getPageCount() - 1;

	//1 is the index of the inside of the front cover.
	//pageTotal - 3 is the index of the page before the inside of the back cover.
	if (e.data == 1) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 600px; right: 0px;');
		fakeCoverInside.classList.remove('--left');
		fakeCoverInside.classList.add('--right');
	} else if (e.data > 1 && e.data < (lastPage - 2)) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 0px; right: 0px;');
		fakeCoverInside.classList.remove('--left');
		fakeCoverInside.classList.remove('--right');
	} else if (e.data == (lastPage - 2)) {
		fakeCoverInside.setAttribute('style', 'display: block; left: 0px; right: 600px;');
		fakeCoverInside.classList.add('--left');
		fakeCoverInside.classList.remove('--right');
	}

	//console.log("1: " + (e.data < 3));
	//console.log("2: " + (e.data == 3));
	//console.log("3: " + (e.data > 3 && e.data < (lastPage - 4)));
	//console.log("4: " + (e.data == (lastPage - 4)));
	//console.log("5: " + (e.data > (lastPage - 4)));

	//specific one for the page stack, it requires a little bit more effort
	//0 is the front cover, 1 is the inside of the front cover and 2 is the first actual page.
	//n = getPageCount-1;
	//n is the back cover, n-1 is the inside of the back cover and n-2 is the last page.
	if (e.data < 3) {
		fakePageStack.setAttribute('style', 'display: block; left: 0px;');
		fakePageStack.classList.remove('--left');
		fakePageStack.classList.add('--right');
	} else if (e.data == 3) {
		fakePageStack.setAttribute('style', 'display: block;');
		fakePageStack.classList.remove('--left');
		fakePageStack.classList.add('--right');
	} else if (e.data > 3 && e.data < (lastPage - 4)) {
		fakePageStack.setAttribute('style', 'display: block;');
		fakePageStack.classList.remove('--left');
		fakePageStack.classList.remove('--right');
	} else if (e.data == (lastPage - 4)) {
		fakePageStack.setAttribute('style', 'display: block;');
		fakePageStack.classList.add('--left');
		fakePageStack.classList.remove('--right');
	} else if (e.data > (lastPage - 4)) {
		fakePageStack.setAttribute('style', 'display: block; right: 0px;');
		fakePageStack.classList.add('--left');
		fakePageStack.classList.remove('--right');
	}
}

function pageFlipInit(bookId) {
	console.log('pageFlipInit: Initializing pageFlip on element with ID: ' + bookId);
	var book = document.getElementById(bookId);
	if (book == null) {
		console.error("pageFlipInit: No element with specified ID (" + bookId + ") found.");
		return;
	}

	//Get pages and possibly add another empty page to make sure the book is balanced.
	//Simply here to make my life easier.
	//TODO: Simply add a bunch of inner content.
	var pages = book.querySelectorAll('.page-container');
	if (pages.length % 2) {	//If pages odd, add another at the end, inside the cover, to balance the pages.
		var emptyPage = document.createElement('div');
		emptyPage.classList.add('page-container');
		emptyPage.classList.add('page-content');

		coverInsides = book.querySelectorAll('.page-cover-inside');
		if (coverInsides.length > 1) {
			coverInsides[coverInsides.length - 1].before(emptyPage);
		} else {
			console.error("pageFlipInit: Last inside of Cover is missing. Consider adding a div with classes .page-cover-inside before the end cover.");
			return;
		}

		pages = book.querySelectorAll('.page-container');
	}

	pageFlip = new St.PageFlip(book, settings);
	pageFlip.loadFromHTML(pages);

	pageFlip.on('flip', onFlip);

	var fakeCoverInside = document.createElement('div');
	fakeCoverInside.classList.add('page-cover-inside');
	fakeCoverInside.classList.add('--right');
	fakeCoverInside.setAttribute('id', 'fake-cover-inside');
	fakeCoverInside.setAttribute('style', 'display: block; left: ' + settings.width + 'px; right: 0px;');

	var fakePageStack = document.createElement('div');
	fakePageStack.classList.add("--right");
	fakePageStack.setAttribute('id', 'fake-page-stack');
	fakePageStack.setAttribute('style', 'display: block;');
	fakeCoverInside.append(fakePageStack);

	var fakeCoverSpine = document.createElement('div');
	fakeCoverSpine.classList.add('page-cover');
	fakeCoverSpine.setAttribute('id', 'fake-cover-spine');

	book.append(fakeCoverInside);
	book.append(fakeCoverSpine);
}