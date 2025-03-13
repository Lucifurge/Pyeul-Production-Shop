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

  // Custom Styles
  const customCSS = document.createElement("style");
  customCSS.innerHTML = `
    body { background-color: #faf3f3; color: #4a4a4a; }
    .navbar { background: linear-gradient(45deg, #ff6b81, #d63384); color: white; }
    .navbar a { color: white !important; }
    #sidebar { background: #fff5f7; color: #6d214f; box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); }
    .nav-link { color: #4a4a4a !important; }
    .nav-link:hover { background-color: #ffccd5; color: white !important; }
    .card { background: white; border: 1px solid #f8a5c2; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); }
    .product-img { width: 100%; height: 150px; object-fit: cover; }
  `;
  document.head.appendChild(customCSS);

  // Admin Panel UI
  document.body.innerHTML = `
    <nav class="navbar navbar-dark px-3">
      <a class="navbar-brand" href="#">Admin Panel</a>
    </nav>

    <div class="d-flex">
      <div class="p-3 vh-100" id="sidebar">
        <h4 class="mb-3">Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#" class="nav-link" id="navHome"><i class="fas fa-home"></i> Home</a></li>
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

  // Home Section
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

  // Products Section with Add Product Form (With Image)
  const productsSection = `
    <div class="card shadow p-4">
      <h2>Products</h2>
      
      <form id="addProductForm" class="mb-4">
        <div class="mb-3">
          <label for="productTitle" class="form-label">Product Title</label>
          <input type="text" class="form-control" id="productTitle" required>
        </div>
        <div class="mb-3">
          <label for="productLink" class="form-label">Product Link</label>
          <input type="url" class="form-control" id="productLink" required>
        </div>
        <div class="mb-3">
          <label for="productImage" class="form-label">Product Image URL</label>
          <input type="url" class="form-control" id="productImage" required>
        </div>
        <button type="submit" class="btn btn-success">Add Product</button>
      </form>

      <div id="productsContainer" class="row"></div>
    </div>
  `;

  // History Section
  const historySection = `<div class="card shadow p-4"><h2>History</h2><div id="historyContainer"></div></div>`;

  mainContent.innerHTML = homeSection;
  displayProductChart();

  document.getElementById("navHome").addEventListener("click", () => {
    mainContent.innerHTML = homeSection;
    displayProductChart();
  });

  document.getElementById("navProducts").addEventListener("click", () => {
    mainContent.innerHTML = productsSection;
    displayProducts();
    document.getElementById("addProductForm").addEventListener("submit", addProduct);
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
          <img src="${product.image}" class="product-img card-img-top" alt="Product Image">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <a href="${product.link}" target="_blank" class="btn btn-primary">View</a>
            <button class="btn btn-danger mt-2 w-100 delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(div);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        const deletedProduct = products.splice(index, 1)[0];
        history.push(`Deleted product: ${deletedProduct.title}`);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("history", JSON.stringify(history));
        displayProducts();
      });
    });
  }

  function addProduct(e) {
    e.preventDefault();
    const title = document.getElementById("productTitle").value;
    const link = document.getElementById("productLink").value;
    const image = document.getElementById("productImage").value;

    products.push({ title, link, image });
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    document.getElementById("addProductForm").reset();
  }

  function displayHistory() {
    document.getElementById("historyContainer").innerHTML = history.map(event => `<p>${event}</p>`).join("");
  }
});
