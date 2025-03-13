document.addEventListener("DOMContentLoaded", () => {
  // Inject CSS for the admin panel layout and styling
  const style = document.createElement("style");
  style.innerHTML = `
    /* Top Navbar */
    .topnav {
      background-color: #333;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topnav a {
      color: #ff69b4;
      text-decoration: none;
      font-size: 18px;
    }
    .toggle-btn {
      background-color: #ff69b4;
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    /* Sidebar */
    .sidebar {
      position: fixed;
      top: 50px;
      left: 0;
      width: 200px;
      height: calc(100% - 50px);
      background-color: #222;
      padding-top: 20px;
      transition: left 0.3s ease;
    }
    .sidebar a {
      padding: 10px 20px;
      text-decoration: none;
      color: #fff;
      display: block;
    }
    .sidebar a:hover {
      background-color: #444;
    }
    /* Main Content Area */
    .main-content {
      margin-left: 200px;
      padding: 20px;
      transition: margin-left 0.3s ease;
    }
    .full-width {
      margin-left: 0;
    }
    /* Sections */
    .form-section, .products-section, .home-section {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .form-section h2, .products-section h2, .home-section h2 {
      color: #333;
    }
    /* Form Styles */
    form {
      display: flex;
      flex-direction: column;
    }
    input, textarea {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    input[type="file"] {
      padding: 3px;
    }
    button {
      padding: 10px;
      background-color: #ff69b4;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      font-size: 16px;
    }
    button:hover {
      background-color: #ff1493;
    }
    /* Product List */
    .product-list {
      margin-top: 20px;
    }
    .product-item {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      display: flex;
      align-items: center;
    }
    .product-item img {
      max-width: 100px;
      max-height: 100px;
      margin-right: 20px;
      border-radius: 4px;
      object-fit: cover;
    }
    .product-info h3 {
      margin: 0;
      color: #333;
    }
    .product-info p {
      margin: 5px 0 0;
      color: #666;
    }
    .delete-btn {
      background: #d9534f;
      border: none;
      color: #fff;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .delete-btn:hover {
      background: #c9302c;
    }
  `;
  document.head.appendChild(style);

  // Create Top Navbar
  const topnav = document.createElement("div");
  topnav.className = "topnav";
  topnav.innerHTML = `
    <button class="toggle-btn" id="toggleSidebar">☰</button>
    <a href="index.html">Visit Website</a>
  `;
  document.body.appendChild(topnav);

  // Create Sidebar
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <a href="#" id="navHome">Home</a>
    <a href="#" id="navAddProduct">Add Product</a>
    <a href="#" id="navProducts">Products</a>
  `;
  document.body.appendChild(sidebar);

  // Create Main Content Area
  const mainContent = document.createElement("div");
  mainContent.className = "main-content";
  document.body.appendChild(mainContent);

  // Define the three sections

  // Home Section
  const homeSection = document.createElement("div");
  homeSection.className = "home-section";
  homeSection.innerHTML = `
    <h2>Welcome to the Admin Panel</h2>
    <p>Use the sidebar to navigate.</p>
  `;

  // Add Product Section (Form)
  const addProductSection = document.createElement("div");
  addProductSection.className = "form-section";
  addProductSection.innerHTML = `
    <h2>Add Product</h2>
    <form id="productForm">
      <input type="text" id="productTitle" placeholder="Product Title" required>
      <textarea id="productDescription" placeholder="Product Description" required></textarea>
      <input type="file" id="productImage" accept="image/*" required>
      <button type="submit">Add Product</button>
    </form>
  `;

  // Products Section (List)
  const productsSection = document.createElement("div");
  productsSection.className = "products-section";
  productsSection.innerHTML = `
    <h2>Products</h2>
    <div class="product-list" id="productsContainer"></div>
  `;

  // Append the Home Section by default
  mainContent.appendChild(homeSection);

  // Navigation: Sidebar Link Clicks
  document.getElementById("navHome").addEventListener("click", (e) => {
    e.preventDefault();
    mainContent.innerHTML = "";
    mainContent.appendChild(homeSection);
  });
  document.getElementById("navAddProduct").addEventListener("click", (e) => {
    e.preventDefault();
    mainContent.innerHTML = "";
    mainContent.appendChild(addProductSection);
    attachFormListener(); // attach listener for the add product form
  });
  document.getElementById("navProducts").addEventListener("click", (e) => {
    e.preventDefault();
    mainContent.innerHTML = "";
    mainContent.appendChild(productsSection);
    displayProducts();
  });

  // Toggle Sidebar
  document.getElementById("toggleSidebar").addEventListener("click", () => {
    if (sidebar.style.left === "0px" || sidebar.style.left === "") {
      sidebar.style.left = "-200px";
      mainContent.classList.add("full-width");
    } else {
      sidebar.style.left = "0px";
      mainContent.classList.remove("full-width");
    }
  });

  // Retrieve stored products from localStorage (if any)
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Function to display products in the "Products" section
  window.displayProducts = function() {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";
    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <img src="${product.image}" alt="Product Image">
        <div class="product-info">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      productsContainer.appendChild(div);
    });
  };

  // Function to attach the form submission listener for adding products
  window.attachFormListener = function() {
    const productForm = document.getElementById("productForm");
    productForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("productTitle").value.trim();
      const description = document.getElementById("productDescription").value.trim();
      const imageInput = document.getElementById("productImage");
      const file = imageInput.files[0];

      if (!file) return alert("Please select an image!");

      const reader = new FileReader();
      reader.onload = function(event) {
        const imageData = event.target.result;
        const newProduct = { title, description, image: imageData };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        // Reset the form after submission
        productForm.reset();
      };
      reader.readAsDataURL(file);
    });
  };

  // Delegate event for deleting a product from the "Products" section
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
    }
  });
});
