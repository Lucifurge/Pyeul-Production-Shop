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

  // Inject Chart.js for statistics
  const chartScript = document.createElement("script");
  chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
  document.head.appendChild(chartScript);

  // Custom AQW-like Dark Theme with Gold Accents
  const customCSS = document.createElement("style");
  customCSS.innerHTML = `
    body { background-color: #0d1117; color: #c9d1d9; font-family: 'Arial', sans-serif; }
    .navbar { background-color: #161b22 !important; }
    .navbar-brand, .nav-link { color: white !important; }
    .sidebar { background-color: #161b22; min-width: 250px; height: 100vh; padding-top: 20px; }
    .sidebar .nav-link { color: #c9d1d9; transition: 0.3s; }
    .sidebar .nav-link:hover { background-color: #21262d; color: gold; }
    .card { background: #161b22; border: 1px solid #30363d; color: #c9d1d9; }
    .btn-primary { background-color: gold; border: none; color: black; }
    .btn-danger { background-color: #ff1744; border: none; }
    .gold-text { color: gold; }
    canvas { background: #161b22; border-radius: 10px; padding: 10px; }
  `;
  document.head.appendChild(customCSS);

  // Inject Admin Panel HTML
  document.body.innerHTML = `
    <nav class="navbar navbar-dark px-3">
      <a class="navbar-brand" href="#"><i class="fas fa-cog gold-text"></i> Admin Panel</a>
    </nav>

    <div class="d-flex">
      <div class="sidebar p-3" id="sidebar">
        <h4 class="mb-3 gold-text">Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#" class="nav-link" id="navHome"><i class="fas fa-home"></i> Home</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navAddProduct"><i class="fas fa-plus"></i> Add Product</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navProducts"><i class="fas fa-box"></i> Products</a></li>
        </ul>
      </div>

      <div class="container-fluid p-4" id="mainContent"></div>
    </div>
  `;

  const mainContent = document.getElementById("mainContent");

  // Home Section with Statistics and Chart
  function loadHome() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let totalProducts = products.length;
    let totalSales = totalProducts * 15;
    let totalUsers = 25;

    mainContent.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <div class="card p-4 shadow">
            <h4 class="gold-text">Total Products</h4>
            <p class="fs-3">${totalProducts}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 shadow">
            <h4 class="gold-text">Total Sales</h4>
            <p class="fs-3">$${totalSales}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 shadow">
            <h4 class="gold-text">Total Users</h4>
            <p class="fs-3">${totalUsers}</p>
          </div>
        </div>
      </div>
      <canvas id="dashboardChart" class="mt-4"></canvas>
    `;

    setTimeout(() => {
      const ctx = document.getElementById("dashboardChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Products", "Sales", "Users"],
          datasets: [{
            label: "Statistics",
            data: [totalProducts, totalSales, totalUsers],
            backgroundColor: ["gold", "#ff1744", "lightblue"],
          }],
        },
      });
    }, 500);
  }

  // Add Product Section
  function loadAddProduct() {
    mainContent.innerHTML = `
      <div class="card shadow p-4">
        <h2 class="gold-text">Add Product</h2>
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

    document.getElementById("productForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("productTitle").value;
      const description = document.getElementById("productDescription").value;
      const imageFile = document.getElementById("productImage").files[0];
      const link = document.getElementById("productLink").value;

      if (!imageFile) return;

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = function () {
        const newProduct = { title, description, image: reader.result, link };

        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        loadProducts();
        loadHome();
      };
    });
  }

  // Products Section
  function loadProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productsContent = products.length === 0 ? "<p>No products available.</p>" : "";

    products.forEach((product, index) => {
      productsContent += `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="Product">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <a href="${product.link}" class="btn btn-primary w-100" target="_blank">View on Facebook</a>
              <button class="btn btn-danger mt-2 w-100 delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      `;
    });

    mainContent.innerHTML = `<div class="row">${productsContent}</div>`;
  }

  document.getElementById("navHome").addEventListener("click", loadHome);
  document.getElementById("navAddProduct").addEventListener("click", loadAddProduct);
  document.getElementById("navProducts").addEventListener("click", loadProducts);

  loadHome();
});
