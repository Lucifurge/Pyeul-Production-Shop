document.addEventListener("DOMContentLoaded", () => {
  // Inject CSS for the admin panel
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    h1 {
      text-align: center;
      color: #333;
    }
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
    .product-list {
      margin-top: 20px;
    }
    .product-list h2 {
      margin-bottom: 10px;
      color: #555;
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
    .product-info {
      flex-grow: 1;
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

  // Create main container for the admin panel
  const container = document.createElement("div");
  container.className = "container";
  container.innerHTML = `
    <h1>Admin Panel</h1>
    <form id="productForm">
      <input type="text" id="productTitle" placeholder="Product Title" required>
      <textarea id="productDescription" placeholder="Product Description" required></textarea>
      <input type="file" id="productImage" accept="image/*" required>
      <button type="submit">Add Product</button>
    </form>
    <div class="product-list" id="productList">
      <h2>Products</h2>
      <div id="productsContainer"></div>
    </div>
  `;
  document.body.appendChild(container);

  // Retrieve stored products from localStorage (if any)
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Function to display products in the admin panel
  const displayProducts = () => {
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

  displayProducts();

  // Handle product form submission
  document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("productTitle").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const imageInput = document.getElementById("productImage");
    const file = imageInput.files[0];

    if (!file) return alert("Please select an image!");

    // Use FileReader to convert the image file to a Base64 string
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageData = event.target.result;
      const newProduct = { title, description, image: imageData };
      products.push(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
      // Reset the form after submission
      document.getElementById("productForm").reset();
    };
    reader.readAsDataURL(file);
  });

  // Delegate event for deleting a product
  document.getElementById("productsContainer").addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
    }
  });
});
