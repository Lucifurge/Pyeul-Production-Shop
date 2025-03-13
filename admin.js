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

  // Inject Custom Modern Dark Theme with Blue Accents
  const customCSS = document.createElement("style");
  customCSS.innerHTML = `
    body { background-color: #121212; color: #E0E0E0; font-family: 'Poppins', sans-serif; }
    .navbar { background-color: #1F1F1F !important; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); }
    .navbar-brand, .nav-link { color: #00AEEF !important; }
    .sidebar { background-color: #1C1C1C; min-width: 260px; height: 100vh; padding: 1rem; box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3); }
    .sidebar .nav-link { color: #E0E0E0; transition: 0.3s; padding: 10px; border-radius: 8px; }
    .sidebar .nav-link:hover { background-color: #00AEEF; color: #121212; }
    .card { background: #1E1E1E; border: none; color: #E0E0E0; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); }
    .btn-primary { background-color: #00AEEF; border: none; transition: 0.3s; }
    .btn-primary:hover { background-color: #0086C9; }
    .btn-danger { background-color: #D32F2F; border: none; transition: 0.3s; }
    .btn-danger:hover { background-color: #B71C1C; }
  `;
  document.head.appendChild(customCSS);

  // Inject Admin Panel HTML
  document.body.innerHTML = `
    <nav class="navbar navbar-dark px-3">
      <a class="navbar-brand fw-bold" href="#">Admin Panel</a>
      <button class="btn btn-outline-light" id="toggleDarkMode"><i class="fas fa-moon"></i></button>
    </nav>

    <div class="d-flex">
      <div class="sidebar" id="sidebar">
        <h4 class="mb-3 text-white fw-bold">Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item"><a href="#" class="nav-link" id="navHome"><i class="fas fa-home me-2"></i> Home</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navAddProduct"><i class="fas fa-plus me-2"></i> Add Product</a></li>
          <li class="nav-item"><a href="#" class="nav-link" id="navProducts"><i class="fas fa-box me-2"></i> Products</a></li>
        </ul>
      </div>

      <div class="container-fluid p-4" id="mainContent">
      </div>
    </div>
  `;

  const mainContent = document.getElementById("mainContent");

  // Home Section with Statistics
  function loadHome() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let totalProducts = products.length;
    let totalSales = totalProducts * 15; // Mock sales value
    let totalUsers = 25; // Mock users value

    mainContent.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h4>Total Products</h4>
            <p class="fs-3 fw-bold text-info">${totalProducts}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h4>Total Sales</h4>
            <p class="fs-3 fw-bold text-success">$${totalSales}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h4>Total Users</h4>
            <p class="fs-3 fw-bold text-warning">${totalUsers}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Add Product Section
  const addProductSection = `
    <div class="card p-4">
      <h2 class="fw-bold">Add Product</h2>
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
  function loadProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productsContent = products.length === 0 ? "<p>No products available.</p>" : "";

    products.forEach((product, index) => {
      productsContent += `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="Product">
            <div class="card-body">
              <h5 class="card-title fw-bold">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <a href="${product.link}" target="_blank" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Buy</a>
              <button class="btn btn-danger mt-2 w-100 delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      `;
    });

    mainContent.innerHTML = `<div class="row">${productsContent}</div>`;

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
        loadHome();
      });
    });
  }

  // Sidebar Navigation
  document.getElementById("navHome").addEventListener("click", () => loadHome());
  document.getElementById("navAddProduct").addEventListener("click", () => {
    mainContent.innerHTML = addProductSection;
    attachFormListener();
  });
  document.getElementById("navProducts").addEventListener("click", () => loadProducts());

  // Dark Mode Toggle
  document.getElementById("toggleDarkMode").addEventListener("click", () => {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
    document.getElementById("sidebar").classList.toggle("bg-secondary");
  });

  // Handle Form Submission
  function attachFormListener() {
    document.getElementById("productForm").addEventListener("submit", function (e) {
      e.preventDefault();
      let products = JSON.parse(localStorage.getItem("products")) || [];
      let title = document.getElementById("productTitle").value.trim();
      let description = document.getElementById("productDescription").value.trim();
      let link = document.getElementById("productLink").value.trim();
      let file = document.getElementById("productImage").files[0];

      let reader = new FileReader();
      reader.onload = function (event) {
        products.push({ title, description, image: event.target.result, link });
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
        loadHome();
      };
      reader.readAsDataURL(file);
    });
  }

  loadHome();
});
