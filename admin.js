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

  // Inject Chart.js for product statistics
  const chartJS = document.createElement("script");
  chartJS.src = "https://cdn.jsdelivr.net/npm/chart.js";
  document.head.appendChild(chartJS);

  // Inject Custom CSS
  const customCSS = document.createElement("style");
  customCSS.innerHTML = `
    body { background-color: #faf3f3; color: #4a4a4a; }
    .navbar { background: linear-gradient(45deg, #ff6b81, #d63384); color: white; }
    .navbar a { color: white !important; }
    #sidebar { background: #fff5f7; color: #6d214f; box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); }
    .nav-link { color: #4a4a4a !important; }
    .nav-link:hover { background-color: #ffccd5; color: white !important; }
    .btn-primary { background: linear-gradient(45deg, #ff6b81, #d63384); border: none; color: white; }
    .btn-danger { background: linear-gradient(45deg, #ff4d6d, #ff6b81); border: none; color: white; }
    .card { background: white; border: 1px solid #f8a5c2; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); }
    .alert-primary { background-color: #ffdde1; color: #d63384; border-color: #f8a5c2; }
    .history-item { background-color: #fff0f6; border-left: 5px solid #d63384; padding: 10px; margin-bottom: 8px; 
                    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); }
  `;
  document.head.appendChild(customCSS);

  // Admin Panel UI
  document.body.innerHTML = `
    <nav class="navbar navbar-dark px-3">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="btn btn-outline-light" id="toggleDarkMode"><i class="fas fa-moon"></i></button>
    </nav>

    <div class="d-flex">
      <div class="p-3 vh-100" id="sidebar">
        <h4 class="mb-3">Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#" class="nav-link" id="navHome"><i class="fas fa-home"></i> Home</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navAddProduct"><i class="fas fa-plus"></i> Add Product</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navProducts"><i class="fas fa-box"></i> Products</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navHistory"><i class="fas fa-history"></i> History</a></li>
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
    <div class="alert alert-primary">
      <h2>Dashboard</h2>
      <p>Welcome, Admin!</p>
    </div>

    <div class="card shadow p-4">
      <h3>Product Statistics</h3>
      <canvas id="productChart"></canvas>
    </div>
  `;

  // Add Product Section
  const addProductSection = `
    <div class="card shadow p-4">
      <h2>Add Product</h2>
      <form id="productForm">
        <div class="mb-3"><label class="form-label">Title</label><input type="text" id="productTitle" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Description</label><textarea id="productDescription" class="form-control" required></textarea></div>
        <div class="mb-3"><label class="form-label">Facebook Link</label><input type="text" id="productLink" class="form-control" required></div>
        <button type="submit" class="btn btn-primary w-100">Add Product</button>
      </form>
    </div>
  `;

  // Products Section
  const productsSection = `<div class="card shadow p-4"><h2>Products</h2><div id="productsContainer" class="row"></div></div>`;

  // History Section
  const historySection = `<div class="card shadow p-4"><h2>History</h2><div id="historyContainer"></div></div>`;

  mainContent.innerHTML = homeSection;
  displayProductChart();

  document.getElementById("navHome").addEventListener("click", () => {
    mainContent.innerHTML = homeSection;
    displayProductChart();
  });

  document.getElementById("navAddProduct").addEventListener("click", () => {
    mainContent.innerHTML = addProductSection;
    attachFormListener();
  });

  document.getElementById("navProducts").addEventListener("click", () => {
    mainContent.innerHTML = productsSection;
    displayProducts();
  });

  document.getElementById("navHistory").addEventListener("click", () => {
    mainContent.innerHTML = historySection;
    displayHistory();
  });

  function displayProductChart() {
    if (typeof Chart === "undefined") {
      setTimeout(displayProductChart, 500);
      return;
    }

    const ctx = document.getElementById("productChart").getContext("2d");
    const productCounts = products.length;
    const deletedCounts = history.filter(h => h.includes("Deleted")).length;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Total Products", "Deleted Products"],
        datasets: [{
          label: "Product Statistics",
          data: [productCounts, deletedCounts],
          backgroundColor: ["#4caf50", "#ff4d4d"]
        }]
      }
    });
  }

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let history = JSON.parse(localStorage.getItem("history")) || [];

  function displayProducts() {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = products.length === 0 ? "<p>No products available.</p>" : "";

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "col-md-4 mb-4";
      div.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <a href="${product.link}" target="_blank" class="btn btn-primary">View</a>
            <button class="btn btn-danger mt-2 w-100 delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(div);
    });
  }
});
