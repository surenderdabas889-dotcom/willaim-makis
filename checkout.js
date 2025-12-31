document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  const cartSummary = document.getElementById("cartSummary");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !cartSummary) {
    console.error("Checkout form or cart summary not found");
    return;
  }

  // ===============================
  // LOAD CART
  // ===============================
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ===============================
  // GENERATE ORDER ID
  // ===============================
  function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // ===============================
  // RENDER CART
  // ===============================
  function renderCheckoutCart() {
    if (cart.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let subtotal = 0;
    cartSummary.innerHTML = "<h3>Your Cart</h3>";

    cart.forEach((item, index) => {
      const name = item.name || item.title || "Item";
      const price =
        Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      const qty = Number(item.quantity) || 1;
      const lineTotal = price * qty;

      subtotal += lineTotal;

      const row = document.createElement("div");
      row.className = "cart-row";

      row.innerHTML = `
        <div class="cart-left">
          <strong>${name}</strong><br>
          $${price.toFixed(2)}
        </div>

        <div class="cart-right">
          <button type="button" class="qty-btn" data-action="decrease" data-index="${index}">−</button>
          <span class="qty">${qty}</span>
          <button type="button" class="qty-btn" data-action="increase" data-index="${index}">+</button>
          <button type="button" class="remove-btn" data-index="${index}">Remove</button>
        </div>

        <div class="cart-line-total">
          $${lineTotal.toFixed(2)}
        </div>
      `;

      cartSummary.appendChild(row);
    });

    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    const totals = document.createElement("div");
    totals.className = "cart-totals";
    totals.innerHTML = `
      <hr>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Tax (7%): $${tax.toFixed(2)}</p>
      <h3>Total: $${total.toFixed(2)}</h3>
    `;

    cartSummary.appendChild(totals);

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  renderCheckoutCart();

  // ===============================
  // CART BUTTONS
  // ===============================
  cartSummary.addEventListener("click", (e) => {
    const btn = e.target;

    if (btn.classList.contains("qty-btn")) {
      const index = Number(btn.dataset.index);
      const action = btn.dataset.action;

      if (action === "increase") cart[index].quantity += 1;
      if (action === "decrease") {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
      }

      renderCheckoutCart();
    }

    if (btn.classList.contains("remove-btn")) {
      const index = Number(btn.dataset.index);
      cart.splice(index, 1);
      renderCheckoutCart();
    }
  });

  // ===============================
  // FORM SUBMIT (EmailJS)
  // ===============================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // 🔒 Loading state ON
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const orderId = generateOrderId();
    const itemsField = document.getElementById("cartItemsField");
    const totalField = document.getElementById("cartTotalField");

    let total = 0;

    const cartDetails = cart
      .map((item) => {
        const name = item.name || item.title || "Item";
        const price =
          Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
        const qty = Number(item.quantity) || 1;

        total += price * qty;
        return `${name} × ${qty} ($${price})`;
      })
      .join(" | ");

    itemsField.value = cartDetails;
    totalField.value = `$${total.toFixed(2)}`;

    const templateParams = {
      order_id: orderId,
      full_name: form.full_name.value,
      email: form.email.value,
      phone: form.phone.value,
      notes: form.notes.value,
      cart_items: itemsField.value,
      total_price: totalField.value,
    };

    emailjs
      .send("service_k3sjyzk", "template_d6jfav5", templateParams)
      .then(() => {
        localStorage.removeItem("cart");
        localStorage.setItem("lastOrderId", orderId);
        window.location.href = "order-success.html";
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("❌ Failed to submit order. Try again.");

        // 🔓 Restore button on error
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      });
  });
});
