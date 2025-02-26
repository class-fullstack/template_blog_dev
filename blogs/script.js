let cardData = [];

async function fetchData() {
  try {
    // Hiển thị skeleton khi bắt đầu tải
    document.querySelector(".card__container").innerHTML = `
      <div class="card-skeleton">
        <div class="skeleton-cover"></div>
        <div class="skeleton-body">
          <div class="skeleton-tag"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-desc"></div>
        </div>
      </div>
    `.repeat(6); // Hiển thị 6 skeletons

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxtUVsCEU4lhztURkD6dz_1ZKo7WErhgUTYgHiAFFn5zDOkJkSsytDKpKHFCVo4BLGkNg/exec"
    );

    if (!response.ok) throw new Error("Lỗi khi gọi API!");

    cardData = await response.json();

    if (cardData.error || !Array.isArray(cardData)) {
      throw new Error(cardData.error || "Dữ liệu không hợp lệ!");
    }

    console.log("Dữ liệu nhận được:", cardData);

    // Sau khi tải xong, cập nhật giao diện
    renderCards();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    document.querySelector(".card__container").innerHTML =
      "<p style='color: red;'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>";
  }
}

// Hàm render card sau khi tải xong
function renderCards() {
  const container = document.querySelector(".card__container");

  // Nếu không có dữ liệu thì báo lỗi
  if (cardData.length === 0) {
    container.innerHTML = "<p>Không có dữ liệu để hiển thị.</p>";
    return;
  }

  // Xóa skeleton và hiển thị nội dung thực
  container.innerHTML = cardData.map(createCard).join("");

  // Gán sự kiện click cho từng thẻ
  document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {
      localStorage.setItem("cardData", JSON.stringify(cardData));
      window.location.href = `../detail/index.html?id=${index}`;
    });
  });
}

// Hàm tạo card HTML
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

// Gọi API khi trang load
fetchData();
