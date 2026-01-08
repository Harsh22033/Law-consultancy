const container = document.getElementById('lawyer-container');

// --- 1. RENDER FUNCTION (Draws the HTML) ---
function renderLawyers(data) {
    container.innerHTML = ""; // Clear existing content
    
    if(data.length === 0) {
        container.innerHTML = "<h3>No lawyers found matching your criteria.</h3>";
        return;
    }

    container.innerHTML += `<p class="result-count">Found ${data.length} lawyers</p>`;

    data.forEach(lawyer => {
        let eduHTML = "";
        lawyer.education.forEach(edu => {
            eduHTML += `<li><strong>${edu.school}</strong><span>${edu.degree} | ${edu.year}</span></li>`;
        });

        let badgeHTML = lawyer.verified 
            ? `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>` 
            : ``;

        const cardHTML = `
        <div class="lawyer-card">
            <div class="card-left">
                <img src="${lawyer.image}" alt="${lawyer.name}">
                <div class="rating"><i class="fas fa-star"></i> ${lawyer.rating} <span>(${lawyer.reviewCount})</span></div>
            </div>
            <div class="card-body">
                <div class="card-header">
                    <h2>${lawyer.name}</h2>
                    ${badgeHTML}
                </div>
                <p class="specialty">${lawyer.specialty}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${lawyer.location} • ${lawyer.experience} Yrs Exp.</p>
                <hr>
                <div class="education-section">
                    <h4><i class="fas fa-graduation-cap"></i> Education</h4>
                    <ul class="education-list">${eduHTML}</ul>
                </div>
            </div>
            <div class="card-actions">
                <span class="price">$${lawyer.price}/hr</span>
                <button class="btn btn-primary">Contact</button>
                <button class="btn btn-outline">Profile</button>
            </div>
        </div>`;

        container.innerHTML += cardHTML;
    });
}

// --- 2. FILTER FUNCTION (Logic) ---
function filterLawyers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const isVerifiedChecked = document.getElementById('verifiedCheck').checked;
    const isExpChecked = document.getElementById('expCheck').checked;

    const checkedBoxes = document.querySelectorAll('.cat-check:checked');
    const selectedCategories = Array.from(checkedBoxes).map(box => box.value);

    const filteredData = lawyersData.filter(lawyer => {
        // A. Search Text
        const matchesText = lawyer.name.toLowerCase().includes(searchInput) || 
                            lawyer.specialty.toLowerCase().includes(searchInput);
        
        // B. Checkboxes
        const matchesVerified = isVerifiedChecked ? lawyer.verified === true : true;
        const matchesExp = isExpChecked ? lawyer.experience >= 10 : true;

        // C. Categories
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(lawyer.specialty);

        return matchesText && matchesVerified && matchesExp && matchesCategory;
    });

    renderLawyers(filteredData);
}

// --- 3. URL PARAMETER HANDLING ---
function applyUrlFilters() {
    // Reads URL like: lawyers.html?category=Family%20Law
    const params = new URLSearchParams(window.location.search);
    const categoryFromHome = params.get('category');

    if (categoryFromHome) {
        const checkboxes = document.querySelectorAll('.cat-check');
        checkboxes.forEach(box => {
            if (box.value === categoryFromHome) {
                box.checked = true;
            }
        });
        filterLawyers(); // Run filter immediately
    } else {
        renderLawyers(lawyersData); // Show all
    }
}

// Run on load
applyUrlFilters();