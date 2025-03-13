document.addEventListener("DOMContentLoaded", () => {
  // Inject Bootstrap 5 CSS
  const bootstrapCSS = document.createElement("link");
  bootstrapCSS.rel = "stylesheet";
  bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  document.head.appendChild(bootstrapCSS);

  // Inject Font Awesome for icons
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(fontAwesome);

  // Inject Chart.js
  const chartJS = document.createElement("script");
  chartJS.src = "https://cdn.jsdelivr.net/npm/chart.js";
  document.head.appendChild(chartJS);

  // Inject Admin Panel HTML
  document.body.innerHTML = `
    <nav class="navbar navbar-dark bg-dark px-3">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="btn btn-outline-light" id="toggleDarkMode"><i class="fas fa-moon"></i></button>
    </nav>

    <div class="d-flex">
      <div class="bg-dark text-white p-3 vh-100" id="sidebar">
        <h4 class="mb-3">Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#" class="nav-link text-white" id="navHome"><i class="fas fa-home"></i> Home</a></li>
          <li class="nav-item"><a href="#" class="nav-link text-white" id="navAddProduct"><i class="fas fa-plus"></i> Add Product</a></li>
          <li class="nav-item"><a href="#" class="nav-link text-white" id="navProducts"><i class="fas fa-box"></i> Products</a></li>
        </ul>
      </div>

      <div class="container-fluid p-4" id="mainContent">
        <h2>Welcome to the Admin Panel</h2>
        <p>Use the sidebar to navigate.</p>
      </div>
    </div>
  `;

  const mainContent = document.getElementById("mainContent");

  // Home Section (Dashboard with Chart)
  const homeSection = `
    <div class="card shadow p-4">
      <h2>Dashboard</h2>
      <p>Welcome, Admin!</p>
      <canvas id="productChart" width="400" height="200"></canvas>
    </div>
  `;

  // Add Product Section
  const addProductSection = `
    <div class="card shadow p-4">
      <h2>Add Product</h2>
      <form id="productForm">
        <div class="mb-3">
          <label class="form-label">Product Title</label>
          <input type="text" id="productTitle" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Product Description</label>
          <textarea id="productDescription" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Product Image</label>
          <input type="file" id="productImage" class="form-control" accept="image/*" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Facebook Link</label>
          <input type="text" id="productLink" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Add Product</button>
      </form>
    </div>
  `;

  // Products Section
  const productsSection = `
    <div class="card shadow p-4">
      <h2>Products</h2>
      <div id="productsContainer" class="row"></div>
    </div>
  `;

  // Load Home Page Initially
  mainContent.innerHTML = homeSection;
  setTimeout(updateChart, 500); // Wait for Chart.js to load before initializing the chart

  // Sidebar Navigation
  document.getElementById("navHome").addEventListener("click", () => {
    mainContent.innerHTML = homeSection;
    setTimeout(updateChart, 500);
  });
  document.getElementById("navAddProduct").addEventListener("click", () => {
    mainContent.innerHTML = addProductSection;
    attachFormListener();
  });
  document.getElementById("navProducts").addEventListener("click", () => {
    mainContent.innerHTML = productsSection;
    displayProducts();
  });

  // Dark Mode Toggle
  document.getElementById("toggleDarkMode").addEventListener("click", () => {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
    document.getElementById("sidebar").classList.toggle("bg-secondary");
  });

  // Product Storage
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Display Products
  function displayProducts() {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = products.length === 0 ? "<p>No products available.</p>" : "";

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "col-md-4 mb-4";
      div.innerHTML = `
        <div class="card shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="Product">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <a href="${product.link}" target="_blank" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Buy</a>
            <button class="btn btn-warning mt-2 w-100 edit-btn" data-index="${index}"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger mt-2 w-100 delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(div);
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        updateChart();
      });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        editProduct(index);
      });
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
        updateChart();
        productForm.reset();
      };
      reader.readAsDataURL(file);
    });
  }

  // Edit Product
  function editProduct(index) {
    const product = products[index];
    document.getElementById("productTitle").value = product.title;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productLink").value = product.link;
  }

  // Update Chart
  function updateChart() {
    const ctx = document.getElementById("productChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Total Products"],
        datasets: [{ label: "Products", data: [products.length], backgroundColor: "blue" }]
      }
    });
  }

  displayProducts();
});
