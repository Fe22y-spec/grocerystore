// Simple product management functionality
    // create an array to hold products and a variable to track editing state
    let products = []; 
    let editingId = 0;

    // Load/get products from localStorage
    function loadProducts() {
        const stored = localStorage.getItem('products'); // Retrieve products from localStorage
        if (stored) {
            products = JSON.parse(stored);// Parse the JSON string back into an JS array
        }
        renderProducts();//display them on the screen,it takes that products array and builds the table rows dynamically.
    }

    // Save products to localStorage
    function saveProductsToStorage() {
        localStorage.setItem('products', JSON.stringify(products));//covert array into text that can be stored in localStorage
    }

    // Render products table
    function renderProducts() {
        const tbody = document.getElementById('productList');
        if (!tbody) return;// if the tbody element is not found, it exits the function to prevent errors. This is a safety check to ensure that the code only tries to manipulate the DOM if the expected element exists.
        
        tbody.innerHTML = '';//clear any exisiting rowsbto prevent duplication.
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No products found. Click "Add New Product" to add.</td></tr>';
            return;
        }//Display the message that no products exist.
        
        products.forEach(product => {
            const row = tbody.insertRow();//create new row for each product
            row.insertCell(0).textContent = product.name;//Name column
            row.insertCell(1).textContent = product.unit;//Unit column
            row.insertCell(2).textContent = '$' + parseFloat(product.price).toFixed(2);// adding new cell to a row and setting its text content to the product's price formatted as currency
             // Column 4: Stock (THIS COMES BEFORE ACTION)
            row.insertCell(3).textContent = product.stock || 0;
            
            const actionCell = row.insertCell(4);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-warning';// bootstrap class for yellow button
            editBtn.style.marginRight = '5px';
            editBtn.onclick = () => editProduct(product.id);
            //This code adds an Edit button into the “Actions” column of a product row in your table. Clicking the button triggers the product editing logic for that specific item. The button is styled with Bootstrap's warning class to make it visually distinct.
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-danger'; //bootsrap class for red button
            deleteBtn.onclick = () => deleteProduct(product.id);// calls the deleteProduct function with the delete button is clicked.
            
            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
        });// loop esnures that all the code is implimeneted for every product
    }

    // Open modal for adding new product
    function openModal() {
        editingId = 0;
        document.getElementById('id').value = 0;
        document.getElementById('name').value = '';
        document.getElementById('uoms').value = '';
        document.getElementById('price').value = '';
        document.getElementById('stock').value = '';  // ← MUST HAVE THIS LINE
        document.getElementById('productModal').style.display = 'block';
    }//This function is designed to open a product form modal and reset it to a clean state, ready for adding a new product.

    // Close modal
    function closeModal() {
        document.getElementById('productModal').style.display = 'none';
    } //it hides the product form modal when you’re done with it.

    // Edit product
    function editProduct(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            editingId = id;
            document.getElementById('id').value = id;
            document.getElementById('name').value = product.name;
            document.getElementById('uoms').value = product.unit;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock || 0;  // ← MUST HAVE THIS LINE
            document.getElementById('productModal').style.display = 'block';
        }
    }//This function loads an existing product into the modal form for editing. It finds the product by its ID, populates the form fields with the product's current data, and then displays the modal for the user to make changes.

    // Delete product
    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            saveProductsToStorage();
            renderProducts();
        }
    }//This function asks the user for confirmation, deletes the chosen product if confirmed, saves the updated list, and re‑renders the table so the change is visible right away.

    // Save product
    function saveProduct() {
        const name = document.getElementById('name').value.trim();
        const unit = document.getElementById('uoms').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;  // ← MUST HAVE THIS LINE

        //This function is collecting the user’s input from the modal form so you can decide what to do next 
        
        if (!name || !unit || !price) {
            alert('Please fill in all fields');
            return;
        }//This ensures the user cannot save a product with missing information. It forces them to fill in the name, unit of measure, and price before proceeding
        
        const id = parseInt(document.getElementById('id').value);//reads the hidden id feild.
        
        if (id === 0) {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            // This line generates a new unique ID for the product. It checks if there are existing products and assigns an ID that is one greater than the current maximum ID. If there are no products, it starts with an ID of 1.
            products.push({//adds new product to the product ID array with the name, unit, and price collected from the form.
                id: newId,
                name: name,
                unit: unit,
                price: parseFloat(price),
                stock: parseInt(stock)  // ← MUST HAVE THIS LINE
            });
        } else {
            // Edit existing product
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name: name,
                    unit: unit,
                    price: parseFloat(price),
                    stock: parseInt(stock)  // ← MUST HAVE THIS LINE
                };
            }
        }
        
        saveProductsToStorage();
        renderProducts();
        closeModal();
    }// if the product already exists (editing), it updates the existing product in the array. If it's a new product, it adds it to the array. After saving, it updates localStorage, re-renders the product list, and closes the modal.

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeModal();
        }
    }//hides the modal if the user clicks outside the form area.

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadProducts();
    });//The second part ensures the product list is automatically loaded and displayed when the page finishes loading.