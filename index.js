// Load navbar
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

  // Load footer
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

const productData = {
    ivermectin: {
        title: "Ivermectin Support (3mg & 12mg)",
        description: "Supports wellness with carefully measured doses of Ivermectin. Researched for its potential supportive properties, ideal for those looking to maintain balance and vitality during health challenges.",
        price: "$250.00",
        image: "f13.jpg",
        rating: "⭐⭐⭐⭐⭐ (89)"
    },
    artemisinin: {
        title: "Artemisinin Extract",
        description: "Premium sweet wormwood extract formulated to support overall wellness. Contains active compounds under research for their potential benefits, making it a natural choice for daily health support.",
        price: "$260.00",
        image: "f14.jpg",
        rating: "⭐⭐⭐⭐⭐ (156)"
    },
    "methylene-blue": {
        title: "Methylene Blue",
        description: "Advanced support for cellular and mitochondrial health. Methylene Blue is studied for its potential to promote energy, focus, and overall cellular wellness.",
        price: "$250.00",
        image: "f15.jpg",
        rating: "⭐⭐⭐⭐⭐ (73)"
    },
    "cbd-oil": {
        title: "CBD Oil",
        description: "High-quality cannabidiol oil designed for wellness and relaxation. Supports balance, calm, and general well-being with every drop, made from premium hemp sources.",
        price: "$175.00",
        image: "f10.jpg",
        rating: "⭐⭐⭐⭐⭐ (203)"
    }
};

function openProductModal(productKey) {
    const product = productData[productKey];
    if (!product) return;

    document.getElementById("modalTitle").innerText = product.title;
    document.getElementById("modalDescription").innerText = product.description;
    document.getElementById("modalPrice").innerText = product.price;
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalRating").innerText = product.rating;

    document.getElementById("productModal").style.display = "flex";
}

function closeProductModal() {
    document.getElementById("productModal").style.display = "none";
}

const protocolData = {
    hydroxychloroquine: {
        title: "Hydroxychloroquine Protocol",
        description: "A structured 3-month wellness plan using Hydroxychloroquine (200–400mg daily) to support immune function and overall vitality. Designed for individuals seeking a research-backed approach to health optimization.",
        duration: "⏱ 3 Months",
        level: "📊 Advanced",
        price: "$2,900.00",
        image: "protocol1.jpg"
    },
    joTippens: {
        title: "Jo Tippens Cancer Protocol",
        description: "A carefully designed 3-month regimen combining Fenbendazole, Ivermectin, Albendazole, and supportive vitamins. Focused on maximizing wellness and providing a structured approach to supportive care.",
        duration: "⏱ 3 Months",
        level: "📊 Advanced",
        price: "$2,700.00",
        image: "protocol2.jpg"
    },
    completeCancer: {
        title: "Complete Cancer Protocol",
        description: "A high-intensity multi-agent 3-month program integrating antiparasitics (Fenbendazole, Ivermectin, Albendazole) with essential nutrients. Developed to support comprehensive wellness and cellular health.",
        duration: "⏱ 3 Months",
        level: "📊 Advanced",
        price: "$2,700.00",
        image: "protocol3.jpg"
    }
};

function openProtocolModal(protocolKey) {
    const protocol = protocolData[protocolKey];
    if (!protocol) return;

    document.getElementById("protocolTitle").innerText = protocol.title;
    document.getElementById("protocolDescription").innerText = protocol.description;
    document.getElementById("protocolPrice").innerText = protocol.price;
    document.getElementById("protocolDuration").innerText = protocol.duration;
    document.getElementById("protocolLevel").innerText = protocol.level;

    document.getElementById("protocolModal").style.display = "flex";
}

function closeProtocolModal() {
    document.getElementById("protocolModal").style.display = "none";
}

const consultationData = {
  protocolReview: {
    title: "Protocol Review Consultation",
    description:
      "A comprehensive expert review of your existing wellness or treatment protocol. You’ll receive professional insights, optimization suggestions, and a written summary to help improve outcomes and ensure proper alignment with your health goals.",
    duration: "⏱ 45 Minutes",
    format: "📹 Video Call + Written Report",
    price: "$500.00"
  },

  followUp: {
    title: "Follow-Up Consultation",
    description:
      "Designed for returning clients, this session reviews your progress, addresses concerns, and fine-tunes your current protocol. Ideal for maintaining momentum and ensuring continued wellness support.",
    duration: "⏱ 30 Minutes",
    format: "📹 Video Call",
    price: "$460.00"
  },

  supplementSelection: {
    title: "Supplement Selection Consultation",
    description:
      "Personalized guidance to help you choose the most appropriate supplements for your needs. An expert will assess your goals and recommend suitable options to support your wellness journey.",
    duration: "⏱ 45 Minutes",
    format: "📹 Video Call",
    price: "$590.00"
  }
};

window.openConsultationModal = function (key) {
  const data = consultationData[key];
  if (!data) return;

  document.getElementById("consultationModalTitle").innerText = data.title;
  document.getElementById("consultationModalDescription").innerText = data.description;
  document.getElementById("consultationModalPrice").innerText = data.price;
  document.getElementById("consultationDuration").innerText = data.duration;
  document.getElementById("consultationFormat").innerText = data.format;

  document.getElementById("consultationModal").style.display = "flex";
};

window.closeConsultationModal = function () {
  const modal = document.getElementById("consultationModal");
  if (!modal) return;
  modal.style.display = "none";
};

// ================= CART LOGIC =================

// Add item to cart (supports multiple items + quantity)
window.addToCart = function(item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(i => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  alert(`${item.name} added to cart`);
};

// Update floating cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Floating cart click
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  const floatingCart = document.getElementById("floatingCart");
  if (!floatingCart) return;

  floatingCart.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    window.location.href = "checkout.html";
  });
});





