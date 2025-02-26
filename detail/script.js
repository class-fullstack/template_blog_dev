document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

  // Get data from localStorage
  const cardData = JSON.parse(localStorage.getItem("cardData")) || [];
  const selectedCard = cardData[cardId];

  if (selectedCard) {
    // Update page title
    document.title = ` Blog | ${selectedCard.title} |`;

    console.log(selectedCard);

    // Set content
    document.querySelector(
      ".detail-cover"
    ).style.backgroundImage = `url('${selectedCard.image}')`;
    document.querySelector(".detail-title").textContent = selectedCard.title;
    document.querySelector(".markdown-content").innerHTML = marked.parse(
      selectedCard.markdown
    );
  } else {
    document.querySelector(".detail-card").innerHTML = `
        <div class="error-message">
          <h2>Article not found</h2>
          <a href="../blogs/index.html" class="back-button">← Back to News</a>
        </div>
      `;
  }
});
