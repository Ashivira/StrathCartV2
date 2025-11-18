/*--Project Name : StrathCart
  Team Members:
  - Sean Jalemba - 218821
  - Samuel Kimani - 220237 -->

  <!--initial start 24/10/2025*/
let orders = [
  {
    id: "ORD-001",
    items: [
      { name: "Grilled Chicken", quantity: 1, price: 350 },
      { name: "Caesar Salad", quantity: 1, price: 250 },
    ],
    total: 600,
    status: "in-process",
    date: "2025-11-06",
  },
  {
    id: "ORD-002",
    items: [{ name: "Pasta Alfredo", quantity: 2, price: 420 }],
    total: 840,
    status: "ready",
    date: "2025-11-05",
  },
  {
    id: "ORD-003",
    items: [{ name: "Beef Burger & Fries", quantity: 1, price: 450 }],
    total: 450,
    status: "completed",
    date: "2025-11-02",
  },
];

function renderOrders(filter = "all") {
  const container = document.getElementById("orders-list");
  container.innerHTML = "";

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (filteredOrders.length === 0) {
    container.innerHTML = `<div class="empty-state">No orders found.</div>`;
    return;
  }

  filteredOrders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-card");

    orderDiv.innerHTML = `
      <div class="order-header">
        <span class="order-id">#${order.id}</span>
        <span class="order-status status-${order.status}">
          ${order.status.replace("-", " ")}
        </span>
      </div>
      <small>${order.date}</small>
      <div class="order-items">
        ${order.items
          .map(
            (item) => `
            <div class="order-item">
              <span>${item.name} (x${item.quantity})</span>
              <span>KES ${(item.price * item.quantity).toFixed(2)}</span>
            </div>`
          )
          .join("")}
      </div>
      <div class="order-total">Total: KES ${order.total.toFixed(2)}</div>
    `;

    container.appendChild(orderDiv);
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    renderOrders(filter);
  });
});


window.onload = () => {
  renderOrders();
};
