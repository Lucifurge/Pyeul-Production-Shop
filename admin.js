document.addEventListener("DOMContentLoaded", () => {
  // Retrieve stored products from localStorage (if any)
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Function to display products
  window.displayProducts = function() {
    const productsContainer = document.getElementById("productsContainer");
    if (!productsContainer) return; // Prevent errors if container doesn't exist
    productsContainer.innerHTML = "";

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <img src="${product.image}" alt="Product Image">
        <div class="product-info">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <button class="buy-btn" onclick="window.open('${product.fbLink}', '_blank')">Buy</button>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      productsContainer.appendChild(div);
    });
  };

  // Ensure products are loaded when the page refreshes
  displayProducts();

  // Attach form submission listener
  window.attachFormListener = function() {
    const productForm = document.getElementById("productForm");
    productForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("productTitle").value.trim();
      const description = document.getElementById("productDescription").value.trim();
      const imageInput = document.getElementById("productImage");
      const fbLink = prompt("Enter Facebook link for this product:");
      const file = imageInput.files[0];

      if (!file) return alert("Please select an image!");

      const reader = new FileReader();
      reader.onload = function(event) {
        const imageData = event.target.result;
        const newProduct = { title, description, image: imageData, fbLink };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        productForm.reset();
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete product event
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
    }
  });
});
