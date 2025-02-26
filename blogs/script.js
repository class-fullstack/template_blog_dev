const cardData = [
  {
    tag: "Pokemon",
    title: "Pokemon Halloween Event",
    desc: "Mario ipsum RGB mushroom 1-up. Lava NES fireball 1-up piranha plant castle green shell.",
    image:
      "https://cdn.dribbble.com/users/250235/screenshots/7885863/media/b2a6d5fb3c27de51d1c0c424296460ba.png",
  },
  {
    tag: "Animal Crossings",
    title: "Fishing in Animal Crossing",
    desc: "Mario ipsum RGB mushroom 1-up. Lava NES fireball 1-up piranha plant castle green shell.",
    image:
      "https://cdn.dribbble.com/users/769121/screenshots/11112077/media/1445dc22a15c2590ac332fc20abaf2df.jpg",
  },
  {
    tag: "Zelda",
    title: "New Zelda Release",
    desc: "Mario ipsum RGB mushroom 1-up. Lava NES fireball 1-up piranha plant castle green shell.",
    image:
      "https://cdn.dribbble.com/users/772985/screenshots/6034403/link_4x.png?compress=1&resize=1200x900",
  },
  {
    tag: "Mario",
    title: "Mario Kart Tournament",
    desc: "Race through rainbow roads and classic circuits. Collect power-ups and boost your way to victory!",
    image:
      "https://cdn.dribbble.com/users/1998175/screenshots/6476091/mario_kart_4x.png",
  },
  {
    tag: "Splatoon",
    title: "Splatfest 2023",
    desc: "Join the ultimate turf war! Choose your team and cover the map in your color.",
    image:
      "https://cdn.dribbble.com/users/1098270/screenshots/15856060/media/5d60d09d46f6d2a0d3e8e4f7a8e5c4f9.png",
  },
  {
    tag: "Metroid",
    title: "Metroid Dread Update",
    desc: "New difficulty modes and hidden upgrades now available. Explore planet ZDR!",
    image:
      "https://cdn.dribbble.com/users/60166/screenshots/16676763/media/4c3a0fbb8d82f1d7a2f5b8e8e7a8a5d9.png",
  },
  {
    tag: "Pokemon",
    title: "Pokemon Halloween Event",
    desc: `**Special Halloween Event!**\n\nCapture spooky Pokemon variants:\n- [Download Event Guide](#)\n- New costumes available\n\n![Preview](https://example.com/halloween-preview.jpg)\n\n_Event runs from October 25-31_`,
    image: "https://cdn...",
  },
];

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
