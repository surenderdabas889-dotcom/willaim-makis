// --- Load navbar ---
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

// --- Cart initialization ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

// --- Update floater ---
function updateCartCount() {
    let floater = document.getElementById("floatingCart");
    if (!floater) {
        floater = document.createElement("div");
        floater.id = "floatingCart";
        floater.style = "position:fixed; bottom:20px; right:20px; background:#001b4e; color:white; padding:12px 18px; border-radius:12px; cursor:pointer; z-index:999;";
        floater.onclick = () => window.location.href = "checkout.html";
        document.body.appendChild(floater);
    }
    floater.innerHTML = `🛒 <span id="cartCount">${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>`;
}

// --- Protocol Data ---
const protocols = [
    { id: 1, title: "Vaccine Detoxification Protocol", price: 2500, description: "A comprehensive detox program designed to support elimination of vaccine-related toxins. Includes supplements, guidance, and monitoring." },
    { id: 2, title: "Parasite Detoxification Protocol", price: 1500, description: "Uses antiparasitic compounds such as ivermectin, mebendazole, and natural herbs to help clear parasites." },
    { id: 3, title: "Complete Cancer Protocol", price: 4500, description: "High-intensity multi-agent protocol combining antiparasitics (Fenbendazole, Mebendazole, Ivermectin) and supportive supplements." },
    { id: 4, title: "Ivermectine Protocol", price: 1500, description: "Daily or alternate-day use of ivermectin tablets (3mg or 12mg) under supervision for supportive care." },
    { id: 5, title: "Fenbendazole Protocol", price: 1500, description: "Involves Fenbendazole (commonly 222mg daily, sometimes titrated higher) with supportive nutrition." },
    { id: 6, title: "Mebendazole Protocol", price: 2500, description: "Uses Mebendazole (100mg tablets) as part of a cancer support regimen with nutritional guidance." },
    { id: 7, title: "Hydroxychloroquine Protocol", price: 2500, description: "Hydroxychloroquine (200–400mg daily) for immune modulation and anti-inflammatory support." },
    { id: 8, title: "Jo Tippens Cancer Protocol", price: 4500, description: "Combines Fenbendazole, Ivermectin, Albendazole, Serrapeptase, TUDCA, Curcumin, and other agents." }
];

// --- Create Modal ---
const modal = document.createElement("div");
modal.id = "protocolModal";
modal.style = "display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); justify-content:center; align-items:center; z-index:1000;";
modal.innerHTML = `
<div style="background:white; border-radius:12px; padding:20px; max-width:500px; width:90%; position:relative;">
    <span id="closeModal" style="cursor:pointer; float:right; font-size:24px;">&times;</span>
    <h2 id="modalTitle"></h2>
    <p id="modalDescription"></p>
    <p id="modalPrice" style="font-weight:bold;"></p>
    <button id="addModalBtn" style="background:#001b4e; color:white; padding:10px 15px; border:none; border-radius:8px; cursor:pointer;">Add to Cart</button>
</div>
`;
document.body.appendChild(modal);

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const addModalBtn = document.getElementById("addModalBtn");
const closeModal = document.getElementById("closeModal");
let currentProtocol = null;

// --- Event Listeners for Details Buttons ---
document.querySelectorAll(".details-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        currentProtocol = protocols[index];
        modalTitle.innerText = currentProtocol.title;
        modalDescription.innerText = currentProtocol.description;
        modalPrice.innerText = "$" + currentProtocol.price.toLocaleString();
        modal.style.display = "flex";
    });
});

// --- Close Modal ---
closeModal.onclick = () => {
    modal.style.display = "none";
    currentProtocol = null;
};

// --- Add to Cart Function ---
function addToCart(protocol) {
    // Check if item already exists
    const existing = cart.find(item => item.name === protocol.title);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name: protocol.title, price: protocol.price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// --- Modal Add Button ---
addModalBtn.onclick = () => {
    if (currentProtocol) addToCart(currentProtocol);
};

// --- Card Add Buttons ---
document.querySelectorAll(".add-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        addToCart(protocols[index]);
    });
});
