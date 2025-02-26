let cardData = [];

async function fetchData() {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxtUVsCEU4lhztURkD6dz_1ZKo7WErhgUTYgHiAFFn5zDOkJkSsytDKpKHFCVo4BLGkNg/exec"
    );
    cardData = await response.json();

    if (cardData.error) {
      console.error("Lỗi:", cardData.error);
      document.querySelector(".card__container").innerHTML =
        "<p>Không có dữ liệu để hiển thị.</p>";
      return;
    }

    console.log("Dữ liệu:", cardData);

    // Hiển thị dữ liệu
    document.querySelector(".card__container").innerHTML = cardData
      .map(createCard)
      .join("");

    // Gán sự kiện click cho từng thẻ
    document.querySelectorAll(".card").forEach((card, index) => {
      card.addEventListener("click", () => {
        localStorage.setItem("cardData", JSON.stringify(cardData));
        window.location.href = `../detail/index.html?id=${index}`;
      });
    });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    document.querySelector(".card__container").innerHTML =
      "<p>Lỗi khi tải dữ liệu.</p>";
  }
}

// Gọi API khi trang load
fetchData();

function createCard(card) {
  return `
      <div class="card">
        <div class="card__cover" style="background-image: url('${card.image}')">
          <div class="card__tag">${card.tag}</div>
        </div>
        <div class="card__body">
          <div class="card__title">${card.title}</div>
          <div class="card__desc">${card.desc}</div>
        </div>
      </div>
    `;
}

document.querySelector(".card__container").innerHTML = cardData
  .map(createCard)
  .join("");

// Modify card click handler
document.querySelectorAll(".card").forEach((card, index) => {
  card.addEventListener("click", () => {
    // Save data to localStorage
    localStorage.setItem("cardData", JSON.stringify(cardData));
    window.location.href = `../detail/index.html?id=${index}`;
  });
});
