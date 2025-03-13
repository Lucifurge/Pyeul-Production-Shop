document.addEventListener("DOMContentLoaded", () => {
  // Inject Enhanced CSS for Modern Design
  const style = document.createElement("style");
  style.innerHTML = `
    /* Dark Mode */
    body.dark-mode { background-color: #121212; color: #fff; }
    .form-section, .products-section, .topnav, .sidebar { background-color: #1e1e1e; }
    .sidebar a { color: #fff; transition: background 0.3s; }
    .sidebar a:hover { background-color: #444; }
    .form-section, .products-section { color: #fff; }

    /* General Styles */
    body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; transition: background 0.3s ease; }
    .topnav { background: linear-gradient(135deg, #333, #444); color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .toggle-btn { font-size: 22px; cursor: pointer; color: #fff; transition: transform 0.2s ease; }
    .toggle-btn:hover { transform: scale(1.1); }
    .sidebar { position: fixed; top: 60px; left: 0; width: 230px; height: 100%; padding-top: 20px; transition: transform 0.3s ease-in-out; transform: translateX(0); box-shadow: 2px 0 12px rgba(0,0,0,0.1); }
    .sidebar.hide { transform: translateX(-100%); }
    .sidebar a { padding: 12px 25px; display: block; text-decoration: none; color: #fff; font-weight: 500; border-radius: 6px; }
    .sidebar a:hover { background-color: rgba(255,255,255,0.1); }
    .main-content { margin-left: 230px; padding: 25px; transition: margin-left 0.3s ease; }
    .full-width { margin-left: 0; }
    .form-section, .products-section { padding: 25px; border-radius: 10px; box-shadow: 0 3px 15px rgba(0,0,0,0.15); margin-bottom: 25px; background: #fff; transition: background 0.3s ease; }
    .form-section.dark-mode, .products-section.dark-mode { background: #1e1e1e; }
    button { padding: 12px 18px; background: linear-gradient(135deg, #ff69b4, #ff85c1); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.3s ease; }
    button:hover { background: linear-gradient(135deg, #ff4791, #ff6aab); transform: scale(1.05); }
    .product-item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(0,0,0,0.1); }
    .product-item img { max-width: 110px; margin-right: 20px; border-radius: 8px; object-fit: cover; transition: transform 0.3s ease; }
    .product-item img:hover { transform: scale(1.05); }
    .delete-btn { background: linear-gradient(135deg, #d9534f, #e74c3c); color: #fff; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .delete-btn:hover { background: linear-gradient(135deg, #c9302c, #d43f3a); transform: scale(1.05); }

    /* Responsive Design */
    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 15px; }
      .sidebar { width: 180px; }
      .topnav { padding: 12px 15px; }
      .product-item img { max-width: 80px; }
    }
  `;
  document.head.appendChild(style);
});
