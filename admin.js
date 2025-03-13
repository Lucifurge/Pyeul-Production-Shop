<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { background-color: #ffe6f2; }
    .navbar { background-color: #ff66b2 !important; }
    .sidebar { background-color: #ff99cc; width: 250px; min-height: 100vh; }
    .sidebar a { color: white; font-weight: bold; }
    .sidebar a:hover { background-color: #ff4d94; border-radius: 5px; }
    .content { flex: 1; padding: 20px; }
    .card { border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2); }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar navbar-dark px-3">
    <a class="navbar-brand" href="#"><i class="fas fa-cogs"></i> Admin Panel</a>
    <button class="btn btn-outline-light" id="toggleDarkMode"><i class="fas fa-moon"></i></button>
  </nav>

  <div class="d-flex">
    <!-- Sidebar -->
    <div class="sidebar text-white p-3">
      <h4 class="mb-3"><i class="fas fa-chart-bar"></i> Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item"><a href="#" class="nav-link text-white" id="navHome"><i class="fas fa-home"></i> Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white" id="navStats"><i class="fas fa-chart-line"></i> Stats</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white" id="navAddProduct"><i class="fas fa-plus"></i> Add Product</a></li>
        <li class="nav-item"><a href="#" class="nav-link text-white" id="navProducts"><i class="fas fa-box"></i> Products</a></li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content" id="mainContent">
      <h2>Welcome to the Admin Panel</h2>
      <p>Use the sidebar to navigate.</p>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const mainContent = document.getElementById("mainContent");

      // Sections
      const homeSection = `<div class="alert alert-primary"><h2>Dashboard</h2><p>Welcome, Admin!</p></div>`;
      
      const statsSection = `
        <div class="card p-4">
          <h2>Website Statistics</h2>
          <canvas id="statsChart"></canvas>
        </div>
      `;

      const addProductSection = `
        <div class="card p-4">
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

      const productsSection = `
        <div class="card p-4">
          <h2>Products</h2>
          <div id="productsContainer" class="row"></div>
        </div>
      `;

      // Load Home Page Initially
      mainContent.innerHTML = homeSection;

      // Sidebar Navigation
      document.getElementById("navHome").addEventListener("click", () => mainContent.innerHTML = homeSection);
      document.getElementById("navStats").addEventListener("click", () => {
        mainContent.innerHTML = statsSection;
        loadChart();
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
        document.querySelector(".sidebar").classList.toggle("bg-dark");
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
            productForm.reset();
          };
          reader.readAsDataURL(file);
        });
      }

      function loadChart() {
        new Chart(document.getElementById("statsChart"), {
          type: "bar",
          data: { labels: ["Views", "Users", "Sales"], datasets: [{ data: [200, 100, 50], backgroundColor: ["#ff66b2", "#ff99cc", "#ff4d94"] }] }
        });
      }
      
      displayProducts();
    });
  </script>

</body>
</html>
