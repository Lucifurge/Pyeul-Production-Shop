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

  // Apply pink theme styles
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background-color: #ffe4e6;
      color: #880e4f;
    }
    .navbar {
      background-color: #d63384 !important;
    }
    .navbar a {
      color: white !important;
    }
    #sidebar {
      background-color: #ffccd5;
      color: #6d214f;
    }
    .nav-link {
      color: #880e4f !important;
    }
    .nav-link:hover {
      background-color: #f8a5c2;
      color: white !important;
    }
    .btn-primary {
      background: linear-gradient(45deg, #d63384, #ff69b4);
      border: none;
    }
    .btn-danger {
      background: linear-gradient(45deg, #ff4d6d, #ff6b81);
      border: none;
    }
    .btn-outline-light {
      color: white;
      border-color: white;
    }
    .btn-outline-light:hover {
      background-color: white;
      color: #d63384;
    }
    .card {
      background: white;
      border: 1px solid #f8a5c2;
    }
    .alert-primary {
      background-color: #ffdde1;
      color: #d63384;
      border-color: #f8a5c2;
    }
    .history-item {
      background-color: #fff0f6;
      border-left: 5px solid #d63384;
      padding: 10px;
      margin-bottom: 8px;
    }
  `;
  document.head.appendChild(style);

  // Inject Admin Panel HTML
  document.body.innerHTML = `
    <nav class="navbar px-3">
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

  // Sections
  const homeSection = `<div class="alert alert-primary"><h2>Dashboard</h2><p>Welcome, Admin!</p></div>`;

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

  const productsSection = `
    <div class="card shadow p-4">
      <h2>Products</h2>
      <div id="productsContainer" class="row"></div>
    </div>
  `;

  const historySection = `
    <div class="card shadow p-4">
      <h2>History</h2>
      <div id="historyContainer"></div>
    </div>
  `;

  mainContent.innerHTML = homeSection;

  document.getElementById("navHome").addEventListener("click", () => mainContent.innerHTML = homeSection);
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
        history.push(`❌ Deleted: ${products[index].title}`);
        localStorage.setItem("history", JSON.stringify(history));
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
      });
    });
  }

  function attachFormListener() {
    document.getElementById("productForm").addEventListener("submit", function (e) {
      e.preventDefault();
      history.push(`✅ Added: ${document.getElementById("productTitle").value}`);
      localStorage.setItem("history", JSON.stringify(history));
    });
  }

  function displayHistory() {
    document.getElementById("historyContainer").innerHTML = history.map(item => `<div class="history-item">${item}</div>`).join("");
  }

  displayProducts();
});
