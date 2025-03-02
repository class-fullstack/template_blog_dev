let cardData = [];
let start = 0;
let limit = 6;
let loadMore = 3;
let isLoading = false;
let hasMore = true;
let currentSearch = "";
let currentTag = "";

// Thêm hàm debounce
const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Xử lý sự kiện search
document.getElementById("searchInput").addEventListener(
  "input",
  debounce((e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    resetAndFetch();
  })
);

// Xử lý thay đổi tag
document.getElementById("tagFilter").addEventListener("change", (e) => {
  currentTag = e.target.value;
  resetAndFetch();
});

function resetData() {
  cardData = [];
  start = 0;
  hasMore = true;
  document.querySelector(".card__container").innerHTML = "";
}

// Hàm fetch mới
async function resetAndFetch() {
  resetData();

  await fetchData(true);
}

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
      // First time, show 6 skeletons
      document.querySelector(".card__container").innerHTML =
        generateSkeletons(limit);
    }

    const apiUrl = new URL(
      "https://script.google.com/macros/s/AKfycbwR5TGFAkRrG2d8g5n0UH93XL-HPZ5YWYxNK4HUdJyyybdMD9lQeRg0Z8Rn6Y9l9eayBg/exec"
    );
    apiUrl.searchParams.set("start", start);
    apiUrl.searchParams.set("limit", limit);
    if (currentSearch) apiUrl.searchParams.set("search", currentSearch);
    if (currentTag) apiUrl.searchParams.set("tag", currentTag);

    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("Lỗi khi gọi API!");

    let responseData = await response.json();

    // Delete skelton after loading
    document
      .querySelectorAll(".skeleton-card")
      .forEach((skeleton) => skeleton.remove());

    if (!responseData || !Array.isArray(responseData.data)) {
      throw new Error("Dữ liệu không hợp lệ!");
    }

    // Update data
    cardData = [...cardData, ...responseData.data];
    renderCards();

    start += limit;

    // Modify your existing code
    if (!responseData.nextStart) {
      hasMore = false;
      const container = document.querySelector(".card__container");
      container.insertAdjacentHTML(
        "beforeend",
        `<img class="end-message" src="https://animal-crossing.com/assets/img/characters/CTRP_EAA_NPC-flg11_1_R_ad.png" alt="End of content">`
      );

      const endMessage = container.lastElementChild;
      endMessage.addEventListener("animationend", () => {
        endMessage.remove();
      });
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    document.querySelector(".card__container").innerHTML = `
    <div class="error-message">
    <p>Không thể tải dữ liệu. Vui lòng thử lại sau!</p>
    <button class="error-retry-btn" onclick="resetAndFetch()">
      Thử lại ngay
    </button>
  </div>`;
  } finally {
    isLoading = false;
  }
}

// Create skeleton loading
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
    container.innerHTML = `<div class="error-message">
    <p>Không thể tải dữ liệu. Vui lòng thử lại sau!</p>
    <button class="error-retry-btn" onclick="resetAndFetch()">
      Thử lại ngay
    </button>
  </div>`;
    return;
  }

  container.innerHTML = cardData.map(createCard).join("");

  // Assign click event for each card
  document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {
      localStorage.setItem("cardData", JSON.stringify(cardData));
      window.location.href = `../detail/index.html?id=${index}`;
    });
  });
}

// Create card HTML
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

// Listen scroll event
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    fetchData(false);
  }
});

// Call API for the first time
fetchData(true);
