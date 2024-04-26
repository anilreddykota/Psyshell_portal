document.addEventListener('DOMContentLoaded', function () {
    const booksContainer = document.getElementById('books');

    // Fetch books data from Express route
    fetch('https://atman.onrender.com/library/books')
        .then(response => response.json())
        .then(books => {
            // Generate HTML for each book
            console.log(books);
            let booksHTML = '';

            books.forEach((book, index) => {
                if (index % 3 === 0) {
                    // Start a new row for every third book
                    booksHTML += '<div class="row">';
                }

                booksHTML += `
                    <div class="col-md-4">
                        <div class="book">
                            <iframe src="${book.imageUrl}" style="border: none; width: 300px; height: 350px; color:red"></iframe>
                            <div class="book-details">
                                <h3 class="book-title">${book.title|| "title"}</h3>
                                <p class="book-author">Author: ${book.author||"author"}</p>
                                <p class="book-date">Date Created: ${book.dateCreated}</p>
                            </div>
                        </div>
                    </div>
                `;

                if ((index + 1) % 3 === 0 || index === books.length - 1) {
                    // End the row after every third book or if it's the last book
                    booksHTML += '</div>';
                }
            });

            // Set the generated HTML inside the books container
            booksContainer.innerHTML = booksHTML;
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
});
