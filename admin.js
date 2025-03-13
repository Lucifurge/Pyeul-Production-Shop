document.addEventListener("DOMContentLoaded", () => {
  // Inject CSS
  const style = document.createElement("style");
  style.innerHTML = `
    .topnav { background-color: #333; color: #fff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
    .toggle-btn { font-size: 20px; cursor: pointer; }
    .sidebar { position: fixed; top: 50px; left: 0; width: 200px; height: 100%; background-color: #222; padding-top: 20px; transition: transform 0.3s ease; transform: translateX(0); }
    .sidebar.hide { transform: translateX(-100%); }
    .sidebar a { padding: 10px 20px; color: #fff; display: block; text-decoration: none; }
    .sidebar a:hover { background-color: #444; }
    .main-content { margin-left: 200px; padding: 20px; transition: margin-left 0.3s ease; }
    .full-width { margin-left: 0; }
    .form-section, .products-section { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
    button { padding: 10px; background-color: #ff69b4; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    .product-item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd; }
    .product-item img { max-width: 100px; margin-right: 20px; border-radius: 4px; object-fit: cover; }
    .delete-btn { background: #d9534f; color: #fff; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
  `;
  document.head.appendChild(style);

  // Create Admin Panel Layout
  document.body.innerHTML = `
    <div class="topnav">
      <span class="toggle-btn" id="toggleSidebar">☰</span>
      <a href="index.html">Visit Website</a>
    </div>
    <div class="sidebar" id="sidebar">
      <a href="#" id="navHome">Home</a>
      <a href="#" id="navAddProduct">Add Product</a>
      <a href="#" id="navProducts">Products</a>
    </div>
    <div class="main-content" id="mainContent"></div>
  `;

  const mainContent = document.getElementById("mainContent");

  // Home Section
  const homeSection = `<div class="home-section"><h2>Welcome to the Admin Panel</h2><p>Use the sidebar to navigate.</p></div>`;

  // Add Product Section
  const addProductSection = `
    <div class="form-section">
      <h2>Add Product</h2>
      <form id="productForm">
        <input type="text" id="productTitle" placeholder="Product Title" required>
        <textarea id="productDescription" placeholder="Product Description" required></textarea>
        <input type="file" id="productImage" accept="image/*" required>
        <input type="text" id="productLink" placeholder="Facebook Link" required>
        <button type="submit">Add Product</button>
      </form>
    </div>
  `;

  // Products Section
  const productsSection = `
    <div class="products-section">
      <h2>Products</h2>
      <div id="productsContainer"></div>
    </div>
  `;

  // Load Home Page Initially
  mainContent.innerHTML = homeSection;

  // Handle Sidebar Navigation
  document.getElementById("navHome").addEventListener("click", () => mainContent.innerHTML = homeSection);
  document.getElementById("navAddProduct").addEventListener("click", () => {
    mainContent.innerHTML = addProductSection;
    attachFormListener();
  });
  document.getElementById("navProducts").addEventListener("click", () => {
    mainContent.innerHTML = productsSection;
    displayProducts();
  });

  // Sidebar Toggle
  document.getElementById("toggleSidebar").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");

    sidebar.classList.toggle("hide");
    mainContent.classList.toggle("full-width");
  });

  // Retrieve Stored Products
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Display Products
  function displayProducts() {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = products.length === 0 ? "<p>No products available.</p>" : "";

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <img src="${product.image}" alt="Product Image">
        <div class="product-info">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <a href="${product.link}" target="_blank"><button>Buy</button></a>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      productsContainer.appendChild(div);
    });
  }

  // Handle Form Submission
  function attachFormListener() {
    const productForm = document.getElementById("productForm");
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("productTitle").value.trim();
      const description = document.getElementById("productDescription").value.trim();
      const link = document.getElementById("productLink").value.trim();
      const file = document.getElementById("productImage").files[0];

      if (!file) return alert("Please select an image!");

      const reader = new FileReader();
      reader.onload = function (event) {
        const newProduct = { title, description, image: event.target.result, link };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        productForm.reset();
      };
      reader.readAsDataURL(file);
    });
  }

  // Delete Product
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
    }
  });

  // Ensure products load if products page is opened first
  displayProducts();
});
