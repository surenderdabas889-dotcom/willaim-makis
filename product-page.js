document.addEventListener("DOMContentLoaded", () => {

// Load navbar
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    navbar.innerHTML = data;
    initNavbar(); // 👈 IMPORTANT
  });

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    const footer = document.getElementById("footer");
    if (!footer) return;
    footer.innerHTML = data;
  });


  // =======================
  // 1. Product Data
  // =======================
  const products = [
    {id:"fenbendazole", title:"Fenbendazole", price:250, desc:"Complementary support being researched worldwide...", img:"f12.jpg"},
    {id:"ivermectin", title:"Ivermectin Support (3mg & 12mg)", price:250, desc:"Off-label use under investigation...", img:"f13.jpg"},
    {id:"artemisinin", title:"Artemisinin Extract", price:260, desc:"Sweet wormwood extract with active research compounds...", img:"f14.jpg"},
    {id:"zeolite", title:"Zeolite Binder", price:60, desc:"Natural mineral binder for detox protocols...", img:"f16.jpg"},
    {id:"ivermectin3", title:"Ivermectin 3mg", price:60, desc:"3mg dose under investigation for supportive properties", img:"f17.jpeg"},
    {id:"ivermectin6", title:"Ivermectin 6mg", price:260, desc:"6mg option for antiparasitic and supportive uses...", img:"f18.jpeg"},
    {id:"vitamine", title:"Vitamin E 600-800mg", price:260, desc:"High-dose Vitamin E for oxidative balance...", img:"f19.webp"},
    {id:"methylene", title:"Methylene Blue", price:260, desc:"Investigated for cellular and mitochondrial function support...", img:"f15.jpg"},
    {id:"mebendazole", title:"Mebendazole", price:260, desc:"Broad-spectrum antiparasitic under investigation...", img:"f20.jpeg"},
    {id:"hydroxy400", title:"Hydroxychloroquine 400mg", price:250, desc:"400mg option investigated for immune-related pathways...", img:"f21.jpg"},
    {id:"hydroxy200", title:"Hydroxychloroquine 200mg", price:250, desc:"200mg option for research and clinical settings...", img:"f22.jpg"},
    {id:"fenbendazole222", title:"Fenbendazole 222mg", price:260, desc:"222mg formulation used in research protocols...", img:"f25.jpg"},
    {id:"cbd", title:"CBD Oil", price:60, desc:"Cannabidiol oil for wellness support...", img:"f27.jpg"},
    {id:"nicotine7", title:"Nicotine Patches 7mg", price:60, desc:"7mg transdermal nicotine patches...", img:"f23.jpg"},
    {id:"nicotine21", title:"Nicotine Patches 21mg", price:260, desc:"21mg transdermal nicotine patches...", img:"f24.jpg"},
    {id:"soolantra", title:"Soolantra (Ivermectin Cream)", price:260, desc:"Ivermectin topical cream for dermatological support...", img:"f26.jpg"},
    {id:"curcumin", title:"Curcumin 600-1500mg", price:260, desc:"Curcumin high-dose supplement for inflammation balance...", img:"f11.jpg"},
    {id:"soursop", title:"Soursop (Graviola)", price:260, desc:"Soursop fruit extract for natural wellness...", img:"f10.jpg"},
    {id:"soursopTea", title:"Soursop Tea", price:250, desc:"Tea made from soursop leaves...", img:"f28.jpg"},
    {id:"ivermectinHorse", title:"Ivermectin Horse Paste and Strip", price:250, desc:"Ivermectin horse paste with dosing strip...", img:"f29.jpg"},
    {id:"methylene12", title:"Methylene Blue 12mg Pills", price:260, desc:"Methylene Blue supplement for cellular support...", img:"f9.jpg"}
  ];

  // =======================
  // 2. Pagination Setup
  // =======================
  const productsPerPage = 9;
  const totalPages = Math.ceil(products.length / productsPerPage);
  let currentPage = Number(new URLSearchParams(window.location.search).get("page")) || 1;

  const productGrid = document.querySelector(".product-grid");
  const pageNumbersDiv = document.getElementById("pageNumbers");
  const pageInfo = document.getElementById("pageInfo");
  const productCountSpan = document.getElementById("productCount");

  function displayProducts() {
    productGrid.innerHTML = "";
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = products.slice(start, end);

    productCountSpan.textContent = pageProducts.length;

    pageProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="card-image">
          <img src="${product.img}" alt="${product.title}">
        </div>

        <div class="card-body">
          <h4 class="product-title">${product.title}</h4>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>

        <div class="card-actions">
          <button class="icon-btn view" onclick="openProductModal('${product.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="icon-btn cart" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      `;

      productGrid.appendChild(card);
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    renderPagination();
  }

  function renderPagination() {
    pageNumbersDiv.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "page-number" + (i === currentPage ? " active" : "");
      btn.textContent = i;
      btn.addEventListener("click", () => {
        currentPage = i;
        displayProducts();
      });
      pageNumbersDiv.appendChild(btn);
    }
  }

  // =======================
  // 3. Product Modal
  // =======================
  let currentModalItem = null;

  window.openProductModal = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentModalItem = product;

    document.getElementById("modalTitle").innerText = product.title;
    document.getElementById("modalPrice").innerText = "$" + product.price.toFixed(2);
    document.getElementById("modalDescription").innerText = product.desc;
    document.getElementById("modalImage").src = product.img;
    document.getElementById("productModal").style.display = "flex";
  }

  window.closeProductModal = () => {
    document.getElementById("productModal").style.display = "none";
    currentModalItem = null;
  }

  // =======================
  // 4. Cart Logic
  // =======================
  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("cartCount").textContent = cart.length;
  }

  window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const cart = getCart();

    // If product already in cart, increment qty
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        qty: 1
      });
    }

    saveCart(cart);
    alert(`${product.title} added to cart!`);
  }

  // Initialize cart count
  document.getElementById("cartCount").textContent = getCart().length;

  // =======================
  // 5. Prev / Next Buttons
  // =======================
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; displayProducts(); }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < totalPages) { currentPage++; displayProducts(); }
  });

  // Initial display
  displayProducts();

});

// =======================
// 6. Go to Checkout
// =======================
function goToCheckout() {
  window.location.href = "checkout.html"; // Your checkout page
}

function addModalItemToCart() {
    if (!currentModalItem) return; // safety check

    // Get existing cart or start empty
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Add the product object from the modal
    cart.push(currentModalItem);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update floating cart number
    document.getElementById("cartCount").textContent = cart.length;

    // Quick confirmation
    alert(`${currentModalItem.title} has been added to your cart!`);
}

function initNavbar() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (!menuToggle || !navLinks) return;

  // Hamburger toggle
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });

  // Mobile dropdown toggle
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.stopPropagation();
        dropdown.classList.toggle("open");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });

  navLinks.addEventListener("click", e => e.stopPropagation());
}

