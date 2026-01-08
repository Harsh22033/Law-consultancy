document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default page reload

    // Get the selected category
    const selectedCategory = document.getElementById('categorySelect').value;

    if (selectedCategory) {
        // Redirect to lawyers.html with the category as a URL parameter
        window.location.href = `lawyers.html?category=${encodeURIComponent(selectedCategory)}`;
    } else {
        alert("Please select a category first.");
    }
});