document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('recipeGrid');
    
    let customList = JSON.parse(localStorage.getItem('customRecipeList')) || [];
    customList.forEach(title => {
        const savedData = localStorage.getItem(title);
        const savedImg = localStorage.getItem(title + "_img"); 
        const imgSrc = savedImg ? savedImg : "https://via.placeholder.com/300x200?text=No+Image";
        if (savedData && grid) createCard(title, imgSrc, true);
    });

    const recipeElements = document.querySelectorAll('[data-name]');
    recipeElements.forEach(el => {
        const recipeName = el.getAttribute('data-name');
        const savedData = localStorage.getItem(recipeName);
        if (savedData && savedData.trim() !== "") {
            const btnContainer = el.querySelector('.button-container');
            const mainBtn = btnContainer.querySelector('.check-recipe-btn');
            if (mainBtn) mainBtn.innerText = 'Edit Recipe';
            
            if (!el.querySelector('.view-recipe-btn')) {
                const viewBtn = document.createElement('button');
                viewBtn.className = 'view-recipe-btn';
                viewBtn.innerText = 'View Recipe';
                viewBtn.onclick = () => {
                    window.location.href = `add-recipe.html?name=${encodeURIComponent(recipeName)}`;
                };
                btnContainer.appendChild(viewBtn);
            }
            addDeleteButton(el, recipeName, false);
        }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.recipe-card, .hero');
            cards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                card.style.display = name.includes(term) ? "" : "none";
            });
        });
    }
});

function addDeleteButton(container, title, isCustom) {
    if (container.querySelector('.delete-recipe-btn')) return;
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-recipe-btn';
    delBtn.innerText = 'Delete';
    delBtn.onclick = function() {
        if (confirm(`Delete recipe for "${title}"?`)) {
            localStorage.removeItem(title);
            localStorage.removeItem(title + "_img");
            if (isCustom) {
                let list = JSON.parse(localStorage.getItem('customRecipeList')) || [];
                list = list.filter(item => item !== title);
                localStorage.setItem('customRecipeList', JSON.stringify(list));
                container.remove(); 
            } else { location.reload(); }
        }
    };
    container.querySelector('.button-container').appendChild(delBtn);
}

function createCard(title, imgSrc, isCustom) {
    const grid = document.getElementById('recipeGrid');
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-name', title);
    card.innerHTML = `
        <div class="image-wrapper"><img src="${imgSrc}" alt="${title}"></div>
        <div class="card-content">
            <h3>${title}</h3>
            <div class="button-container">
                <a href="add-recipe.html?name=${encodeURIComponent(title)}" class="check-recipe-btn">Edit Recipe</a>
                <button class="view-recipe-btn" onclick="window.location.href='add-recipe.html?name=${encodeURIComponent(title)}'">View Recipe</button>
            </div>
        </div>
    `;
    grid.appendChild(card);
    addDeleteButton(card, title, isCustom);
}