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

document.addEventListener("DOMContentLoaded", () => {

  /* ================= CART ================= */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");

  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = total;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartCount();

  /* ================= MODAL ================= */
  const modal = document.getElementById("consultModal");
  const modalClose = document.querySelector(".modal-close");

  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalDuration = document.getElementById("modalDuration");
  const modalDelivery = document.getElementById("modalDelivery");
  const modalPrice = document.getElementById("modalPrice");
  const modalAddBtn = document.getElementById("modalAddBtn");

  let selectedConsultation = null;

  /* ===== DETAILS BUTTON ===== */
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".consult-card");

      selectedConsultation = {
        name: card.querySelector("h2").innerText,
        price: parseFloat(
          card.querySelector(".price").innerText.replace(/[$,]/g, "")
        ),
        quantity: 1
      };

      modalTitle.innerText = selectedConsultation.name;
      modalDescription.innerText = card.querySelector(".description").innerText;
      modalDuration.innerText =
        card.querySelector(".info-box div:nth-child(1)").innerText;
      modalDelivery.innerText =
        card.querySelector(".info-box div:nth-child(2)").innerText;
      modalPrice.innerText = "Price: $" + selectedConsultation.price;

      modal.style.display = "flex";
    });
  });

  /* ===== CLOSE MODAL ===== */
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* ===== ADD TO CART FROM MODAL ===== */
  modalAddBtn.addEventListener("click", () => {
    addToCart(selectedConsultation);
    modal.style.display = "none";
  });

  /* ===== ADD TO CART FROM CARD ===== */
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".consult-card");

      addToCart({
        name: card.querySelector("h2").innerText,
        price: parseFloat(
          card.querySelector(".price").innerText.replace(/[$,]/g, "")
        ),
        quantity: 1
      });
    });
  });

  function addToCart(item) {
    const existing = cart.find(c => c.name === item.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(item);
    }

    updateCartCount();
  }

  /* ===== FLOATER CLICK ===== */
  document.getElementById("cartFloater")
    .addEventListener("click", () => {
      window.location.href = "checkout.html";
    });

});

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

