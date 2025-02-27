let cardData = [];
let start = 0;
let limit = 6;
let loadMore = 3;
let isLoading = false;
let hasMore = true;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Load Data for API
async function fetchData(isFirstLoad = false) {
  if (isLoading || !hasMore) return;

  try {
    isLoading = true;

    // If not first load, show 3 skeletons
    if (!isFirstLoad) {
      document
        .querySelector(".card__container")
        .insertAdjacentHTML("beforeend", generateSkeletons(loadMore));
    } else {
      // Lần đầu vào trang hiển thị 6 skeletons
      document.querySelector(".card__container").innerHTML =
        generateSkeletons(limit);
    }

    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbyOZfpG4Hh4MPMJxlj5g8W1TigiSe0wxnyhQOO6VB-vxKLFYzV3BRLSJeCAz8reREbS_w/exec?start=${start}&limit=${limit}`
    );

    if (!response.ok) throw new Error("Lỗi khi gọi API!");

    let responseData = await response.json();

    // Xóa skeleton sau khi dữ liệu tải xong
    document
      .querySelectorAll(".skeleton-card")
      .forEach((skeleton) => skeleton.remove());

    if (!responseData || !Array.isArray(responseData.data)) {
      throw new Error("Dữ liệu không hợp lệ!");
    }

    // Cập nhật dữ liệu
    cardData = [...cardData, ...responseData.data];
    renderCards();

    start += limit;

    if (!responseData.nextStart) {
      hasMore = false;
      document
        .querySelector(".card__container")
        .insertAdjacentHTML(
          "beforeend",
          `<p class="end-message">Hết dữ liệu!</p>`
        );
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    document.querySelector(".card__container").innerHTML =
      "<p style='color: red;'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>";
  } finally {
    isLoading = false;
  }
}

// Tạo skeleton loading
function generateSkeletons(count) {
  return Array(count)
    .fill("")
    .map(
      () => `
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
    `
    )
    .join("");
}

// Render card
function renderCards() {
  const container = document.querySelector(".card__container");

  if (cardData.length === 0) {
    container.innerHTML = "<p>Không có dữ liệu để hiển thị.</p>";
    return;
  }

  container.innerHTML = cardData.map(createCard).join("");

  // Gán sự kiện click cho từng card
  document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {
      localStorage.setItem("cardData", JSON.stringify(cardData));
      window.location.href = `../detail/index.html?id=${index}`;
    });
  });
}

// Tạo card HTML
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

// Lắng nghe sự kiện cuộn trang
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    fetchData(false);
  }
});

// Gọi API lần đầu
fetchData(true);
