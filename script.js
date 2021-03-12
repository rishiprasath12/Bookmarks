const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show model and focus on input
function showModel() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listener 
modalShow.addEventListener('click',showModel);
modalClose.addEventListener('click',() => modal.classList.remove('show-modal'));
window.addEventListener('click',(e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue,urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Plese enter both the fields');
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('Please provide a valid link');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmark Dom
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarkContainer.textContent= '';
    // Build items
    bookmarks.forEach((bookmark) => {
        const { name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        // Favicon / Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        // Append to bookmark container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarkContainer.appendChild(item); 
    })
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        // Create bookmark in local storage
        bookmarks = [
            {
                name: 'Rishi Prasath',
                url: 'https://rishiprasath.com',
            },
    ];
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    buildBookmarks();   
}

// Delet bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark,i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i,1);
        }
    });
    // update bookmark array in local storage and re-populate DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://','https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue,urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks)); 
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}


// Event listener
bookmarkForm.addEventListener('submit',storeBookmark);

// OnLoad
fetchBookmarks();