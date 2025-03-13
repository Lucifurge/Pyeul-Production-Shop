document.addEventListener("DOMContentLoaded", async () => {
    // Inject Bootstrap 5 and FontAwesome for styling
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);
  
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontAwesome);
  
    // Inject Custom Pinkish Theme
    const customCSS = document.createElement("style");
    customCSS.innerHTML = `
      body { background-color: #fce4ec; color: #333; }
      .navbar { background-color: #ff80ab !important; }
      .navbar-brand, .nav-link { color: white !important; }
      .sidebar { background-color: #ffb3c1; min-width: 250px; height: 100vh; }
      .sidebar .nav-link { color: white; transition: 0.3s; }
      .sidebar .nav-link:hover { background-color: #ff80ab; }
      .card { background: white; border: none; }
      .btn-primary { background-color: #ff4081; border: none; }
      .btn-danger { background-color: #ff1744; border: none; }
    `;
    document.head.appendChild(customCSS);
  
    // Inject Supabase CDN
    const supabaseScript = document.createElement("script");
    supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
    document.head.appendChild(supabaseScript);
  
    supabaseScript.onload = () => {
      const supabaseUrl = 'https://ehrwsusgkzerozjnddib.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocndzdXNna3plcm96am5kZGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0Nzk4OTgsImV4cCI6MjA1MjA1NTg5OH0.2gC_pxtLhwrAGA2wR6jvXKuIhNMe_L_IsMWgSa3KKds';
      const supabase = supabase.createClient(supabaseUrl, supabaseKey);
  
      // Inject Admin Panel HTML
      document.body.innerHTML = `
        <nav class="navbar navbar-dark px-3">
          <a class="navbar-brand" href="#">Admin Panel</a>
          <button class="btn btn-outline-light" id="toggleDarkMode"><i class="fas fa-moon"></i></button>
        </nav>
  
        <div class="d-flex">
          <div class="sidebar p-3" id="sidebar">
            <h4 class="mb-3 text-white">Dashboard</h4>
            <ul class="nav flex-column">
              <li class="nav-item"><a href="#" class="nav-link" id="navHome"><i class="fas fa-home"></i> Home</a></li>
              <li class="nav-item"><a href="#" class="nav-link" id="navAddProduct"><i class="fas fa-plus"></i> Add Product</a></li>
              <li class="nav-item"><a href="#" class="nav-link" id="navProducts"><i class="fas fa-box"></i> Products</a></li>
            </ul>
          </div>
  
          <div class="container-fluid p-4" id="mainContent">
          </div>
        </div>
      `;
  
      const mainContent = document.getElementById("mainContent");
  
      // Load Home with Statistics from Supabase
      async function loadHome() {
        const { data: products, error } = await supabase.from("products").select("*");
        if (error) {
          console.error("Error fetching products:", error);
          return;
        }
        let totalProducts = products.length;
        let totalSales = totalProducts * 15; // Mock sales value
        let totalUsers = 25; // Mock users value
  
        mainContent.innerHTML = `
          <div class="row">
            <div class="col-md-4">
              <div class="card p-4 shadow">
                <h4>Total Products</h4>
                <p class="fs-3">${totalProducts}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 shadow">
                <h4>Total Sales</h4>
                <p class="fs-3">$${totalSales}</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 shadow">
                <h4>Total Users</h4>
                <p class="fs-3">${totalUsers}</p>
              </div>
            </div>
          </div>
        `;
      }
  
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
  
      // Load Products from Supabase
      async function loadProducts() {
        const { data: products, error } = await supabase.from("products").select("*");
        if (error) {
          console.error("Error fetching products:", error);
          return;
        }
  
        let productsContent = products.length === 0 ? "<p>No products available.</p>" : "";
  
        products.forEach((product) => {
          productsContent += `
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="Product">
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <a href="${product.link}" target="_blank" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Buy</a>
                  <button class="btn btn-danger mt-2 w-100 delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
              </div>
            </div>
          `;
        });
  
        mainContent.innerHTML = `<div class="row">${productsContent}</div>`;
  
        document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", async function () {
            let productId = this.getAttribute("data-id");
            await supabase.from("products").delete().eq("id", productId);
            loadProducts();
            loadHome(); // Refresh stats
          });
        });
      }
  
      // Handle Form Submission
      function attachFormListener() {
        document.getElementById("productForm").addEventListener("submit", async function (e) {
          e.preventDefault();
          let title = document.getElementById("productTitle").value.trim();
          let description = document.getElementById("productDescription").value.trim();
          let link = document.getElementById("productLink").value.trim();
          let file = document.getElementById("productImage").files[0];
  
          let reader = new FileReader();
          reader.onload = async function (event) {
            await supabase.from("products").insert([{ title, description, image: event.target.result, link }]);
            loadProducts();
            loadHome();
          };
          reader.readAsDataURL(file);
        });
      }
  
      // Sidebar Navigation
      document.getElementById("navHome").addEventListener("click", () => loadHome());
      document.getElementById("navAddProduct").addEventListener("click", () => {
        mainContent.innerHTML = addProductSection;
        attachFormListener();
      });
      document.getElementById("navProducts").addEventListener("click",
