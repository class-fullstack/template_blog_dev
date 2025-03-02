let cardData = [];

async function fetchData() {
  try {
    // Show skeleton when start fetching
    document.querySelector(".card__container").innerHTML = `
          <div class="card-skeleton">
            <div class="skeleton-cover">
              <div class="skeleton-tag"></div>
              <div class="skeleton-time"></div>
            </div>
            <div class="skeleton-body">
              <div class="skeleton-title"></div>
              <div class="skeleton-desc"></div>
            </div>
          </div>
    `.repeat(6); // Show 6 skeleton cards

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzIRUAyiqr7OUIke0coIx7GOIduUMGQynU31HR-JJjIBDQzAg6jq_h3zgBncrvlpr_vaA/exec"
    );

    if (!response.ok) throw new Error("Lỗi khi gọi API!");

    cardData = await response.json();

    if (cardData.error || !Array.isArray(cardData)) {
      throw new Error(cardData.error || "Dữ liệu không hợp lệ!");
    }

    console.log("Dữ liệu nhận được:", cardData);

    // After fetching data, render cards
    renderCards();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    document.querySelector(".card__container").innerHTML =
      "<p style='color: red;'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>";
  }
}

// Func called after fetching data
function renderCards() {
  const container = document.querySelector(".card__container");

  // If not data, show error
  if (cardData.length === 0) {
    container.innerHTML = "<p>Không có dữ liệu để hiển thị.</p>";
    return;
  }

  // Delete skeleton and show real content
  container.innerHTML = cardData.map(createCard).join("");

  // Assign click event for each card
  document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {
      localStorage.setItem("cardData", JSON.stringify(cardData));
      window.location.href = `../detail/index.html?id=${index}`;
    });
  });
}

// Func create card HTML
function createCard(card) {
  return `
    <div class="card">
      <div class="card__cover" style="background-image: url('${card.image}')">
        <div class="card__tag">${card.tag}</div>
        ${card.time ? `<div class="card__time">${card.time}</div>` : ""}
      </div>
      <div class="card__body">
        <div class="card__title">${card.title}</div>
        <div class="card__desc">${card.desc}</div>
      </div>
    </div>
  `;
}

// Call API when page loaded
fetchData();
