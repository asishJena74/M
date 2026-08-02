const surpriseBtn = document.getElementById("surpriseBtn");
const confettiBtn = document.getElementById("confettiBtn");
const finalSurprise = document.getElementById("finalSurprise");
const wishText = document.getElementById("wishText");
const wishButtons = document.querySelectorAll(".wish");
const messageDialog = document.getElementById("messageDialog");
const dialogText = document.getElementById("dialogText");
const dialogClose = document.querySelector(".dialog-close");
const photoDialog = document.getElementById("photoDialog");
const photoDialogImage = document.getElementById("photoDialogImage");
const photoDialogCaption = document.getElementById("photoDialogCaption");
const photoClose = document.querySelector(".photo-close");
const canvas = document.getElementById("confettiCanvas");
const context = canvas.getContext("2d");

let confetti = [];
let confettiFrame;

const colors = ["#c65d49", "#bd8c43", "#687c62", "#f2b39e", "#fff4e8"];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createConfettiPiece() {
  return {
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.35,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    drift: -1.2 + Math.random() * 2.4,
    rotation: Math.random() * Math.PI,
    rotationSpeed: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function drawConfetti() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((piece) => {
    piece.x += piece.drift;
    piece.y += piece.speed;
    piece.rotation += piece.rotationSpeed;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    context.restore();
  });

  confetti = confetti.filter((piece) => piece.y < canvas.height + 30);

  if (confetti.length) {
    confettiFrame = requestAnimationFrame(drawConfetti);
  } else {
    cancelAnimationFrame(confettiFrame);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti() {
  resizeCanvas();
  confetti = Array.from({ length: 150 }, createConfettiPiece);
  cancelAnimationFrame(confettiFrame);
  drawConfetti();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

surpriseBtn.addEventListener("click", () => {
  finalSurprise.scrollIntoView({ behavior: "smooth", block: "center" });
  launchConfetti();
});

confettiBtn.addEventListener("click", launchConfetti);

wishButtons.forEach((button) => {
  button.addEventListener("click", () => {
    wishButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    wishText.textContent = button.dataset.wish;
  });
});

document.querySelectorAll(".message-card").forEach((card) => {
  card.addEventListener("click", () => {
    dialogText.textContent = card.dataset.message;

    if (typeof messageDialog.showModal === "function") {
      messageDialog.showModal();
    } else {
      alert(card.dataset.message);
    }
  });
});

dialogClose.addEventListener("click", () => {
  messageDialog.close();
});

messageDialog.addEventListener("click", (event) => {
  if (event.target === messageDialog) {
    messageDialog.close();
  }
});

document.querySelectorAll(".photo-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const image = tile.querySelector("img");
    photoDialogImage.src = tile.dataset.full;
    photoDialogImage.alt = image.alt;
    photoDialogCaption.textContent = tile.dataset.caption;

    if (typeof photoDialog.showModal === "function") {
      photoDialog.showModal();
    } else {
      window.open(tile.dataset.full, "_blank", "noopener");
    }
  });
});

photoClose.addEventListener("click", () => {
  photoDialog.close();
});

photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
