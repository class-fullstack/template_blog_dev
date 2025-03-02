function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

  // Tách biệt phần xử lý metadata
  const processMetadata = (markdown) => {
    const lines = markdown.split("\n");
    let content = [];
    let postTime = "";

    console.log(postTime);

    lines.forEach((line) => {
      if (line.startsWith("**Time:**")) {
        postTime = line.replace("**Time:**", "").trim();
      } else if (
        !line.startsWith("**Content:**") &&
        !line.startsWith("**Image:**")
      ) {
        content.push(line);
      }
    });

    return { content: content.join("\n"), time: postTime };
  };

  // Main execution flow
  const cardData = JSON.parse(localStorage.getItem("cardData")) || [];
  const selectedCard = cardData[cardId];

  if (selectedCard) {
    document.title = `Blog | ${selectedCard.title}`;

    // Xử lý metadata
    const { content, time } = processMetadata(selectedCard.markdown);

    // Hiển thị thời gian riêng biệt
    const timeContainer = document.createElement("div");
    timeContainer.className = "post-time";
    timeContainer.innerHTML = `🕒 ${time}`;

    const detailHeader = document.querySelector(".detail-header");
    if (detailHeader) {
      detailHeader.appendChild(timeContainer);
    } else {
      console.error("Element with class 'detail-header' not found.");
    }

    const markdownContent = document.querySelector(".markdown-content");
    if (markdownContent) {
      markdownContent.innerHTML = marked.parse(content);
    } else {
      console.error("Element with class 'markdown-content' not found.");
    }

    const detailCover = document.querySelector(".detail-cover");
    if (detailCover) {
      detailCover.style.backgroundImage = `url('${
        selectedCard.image || "default-image.jpg"
      }')`;
    } else {
      console.error("Element with class 'detail-cover' not found.");
    }
  } else {
    // Error handling được cải tiến
    const errorHTML = `
      <div class="error-state">
        <div class="error-animation"></div>
        <h2>404 - Bài viết không tồn tại</h2>
        <p>Bài viết bạn tìm kiếm có thể đã bị xóa hoặc di chuyển</p>
        <a href="../blogs/index.html" class="cta-button">
          <span class="button-icon">←</span>
          Quay lại trang chủ
        </a>
      </div>
    `;
    const detailCard = document.querySelector(".detail-card");
    if (detailCard) {
      detailCard.innerHTML = errorHTML;
    } else {
      console.error("Element with class 'detail-card' not found.");
    }
  }
});
