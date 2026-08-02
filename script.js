const surpriseBtn = document.getElementById("surpriseBtn");
const confettiBtn = document.getElementById("confettiBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const finalSurprise = document.getElementById("finalSurprise");
const wishText = document.getElementById("wishText");
const wishButtons = document.querySelectorAll(".wish");
const messageDialog = document.getElementById("messageDialog");
const dialogText = document.getElementById("dialogText");
const dialogClose = messageDialog.querySelector(".dialog-close");
const photoDialog = document.getElementById("photoDialog");
const photoDialogImage = document.getElementById("photoDialogImage");
const photoDialogCaption = document.getElementById("photoDialogCaption");
const photoClose = photoDialog.querySelector(".photo-close");
const birthdayWishDialog = document.getElementById("birthdayWishDialog");
const birthdayWishClose = birthdayWishDialog.querySelector(".birthday-wish-close");
const birthdayWishResult = document.getElementById("birthdayWishResult");
const sendWishBtn = document.getElementById("sendWishBtn");
const finalAfterWish = document.getElementById("finalAfterWish");
const finalWishOptions = document.querySelectorAll("[data-final-wish]");
const canvas = document.getElementById("confettiCanvas");
const context = canvas.getContext("2d");
const wishCanvas = document.getElementById("wishConfettiCanvas");
const wishContext = wishCanvas.getContext("2d");

let confetti = [];
let confettiFrame;
let wishConfetti = [];
let wishConfettiFrame;
let musicFadeTimer;
let isMusicPlaying = false;
let isMusicMuted = false;
let musicRequestId = 0;
let userMusicChoiceMade = false;

const colors = ["#c65d49", "#bd8c43", "#687c62", "#f2b39e", "#fff4e8"];
const musicMaxVolume = 0.58;

bgMusic.volume = musicMaxVolume;

function fadeMusic(targetVolume, onDone) {
  window.clearInterval(musicFadeTimer);

  musicFadeTimer = window.setInterval(() => {
    const difference = targetVolume - bgMusic.volume;
    const nextVolume = bgMusic.volume + Math.sign(difference) * 0.04;

    if (Math.abs(difference) <= 0.045) {
      bgMusic.volume = targetVolume;
      window.clearInterval(musicFadeTimer);

      if (onDone) {
        onDone();
      }

      return;
    }

    bgMusic.volume = Math.max(0, Math.min(musicMaxVolume, nextVolume));
  }, 80);
}

function syncMusicBubble() {
  const muted = bgMusic.muted || bgMusic.paused || bgMusic.volume === 0;

  musicToggle.classList.toggle("is-muted", muted);
  musicToggle.setAttribute("aria-pressed", String(!muted));
  musicToggle.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
  musicToggle.title = muted ? "Unmute music" : "Mute music";
}

async function startMusic({ fade = true } = {}) {
  const requestId = ++musicRequestId;

  try {
    await bgMusic.play();
  } catch (error) {
    if (requestId !== musicRequestId) {
      return false;
    }

    isMusicPlaying = false;
    isMusicMuted = true;
    syncMusicBubble();
    return false;
  }

  if (requestId !== musicRequestId) {
    return false;
  }

  bgMusic.muted = false;
  isMusicMuted = false;
  isMusicPlaying = true;

  if (fade) {
    bgMusic.volume = Math.min(bgMusic.volume, 0.08);
    fadeMusic(musicMaxVolume, syncMusicBubble);
  } else {
    bgMusic.volume = musicMaxVolume;
  }

  syncMusicBubble();
  return true;
}

function stopMusic() {
  musicRequestId += 1;
  isMusicMuted = true;
  fadeMusic(0, () => {
    bgMusic.muted = true;
    isMusicPlaying = !bgMusic.paused;
    syncMusicBubble();
  });
}

async function attemptAutoplay() {
  if (userMusicChoiceMade) {
    return;
  }

  const requestId = musicRequestId + 1;
  bgMusic.muted = false;
  bgMusic.volume = musicMaxVolume;
  const started = await startMusic({ fade: false });

  if (!started && requestId === musicRequestId) {
    isMusicPlaying = false;
    isMusicMuted = true;
    bgMusic.muted = false;
    bgMusic.volume = musicMaxVolume;
    syncMusicBubble();
  }
}

function startMusicOnFirstInteraction(event) {
  if (userMusicChoiceMade) {
    return;
  }

  if (event.target instanceof Element && event.target.closest("#musicToggle")) {
    return;
  }

  if (!isMusicPlaying || isMusicMuted) {
    startMusic();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  wishCanvas.width = window.innerWidth;
  wishCanvas.height = window.innerHeight;
}

function createConfettiPiece(targetCanvas) {
  return {
    x: Math.random() * targetCanvas.width,
    y: -20 - Math.random() * targetCanvas.height * 0.35,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    drift: -1.2 + Math.random() * 2.4,
    rotation: Math.random() * Math.PI,
    rotationSpeed: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function drawConfettiLayer(targetCanvas, targetContext, pieces, frameSetter) {
  targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  pieces.forEach((piece) => {
    piece.x += piece.drift;
    piece.y += piece.speed;
    piece.rotation += piece.rotationSpeed;

    targetContext.save();
    targetContext.translate(piece.x, piece.y);
    targetContext.rotate(piece.rotation);
    targetContext.fillStyle = piece.color;
    targetContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    targetContext.restore();
  });

  const remainingPieces = pieces.filter((piece) => piece.y < targetCanvas.height + 30);

  if (remainingPieces.length) {
    frameSetter(remainingPieces, requestAnimationFrame(() => {
      drawConfettiLayer(targetCanvas, targetContext, remainingPieces, frameSetter);
    }));
  } else {
    frameSetter([], undefined);
    targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  }
}

function launchConfetti() {
  resizeCanvas();
  confetti = Array.from({ length: 150 }, () => createConfettiPiece(canvas));
  cancelAnimationFrame(confettiFrame);
  drawConfettiLayer(canvas, context, confetti, (nextPieces, nextFrame) => {
    confetti = nextPieces;
    confettiFrame = nextFrame;
  });
}

function launchWishConfetti() {
  resizeCanvas();
  wishConfetti = Array.from({ length: 150 }, () => createConfettiPiece(wishCanvas));
  cancelAnimationFrame(wishConfettiFrame);
  drawConfettiLayer(wishCanvas, wishContext, wishConfetti, (nextPieces, nextFrame) => {
    wishConfetti = nextPieces;
    wishConfettiFrame = nextFrame;
  });
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

surpriseBtn.addEventListener("click", () => {
  finalSurprise.scrollIntoView({ behavior: "smooth", block: "center" });
  launchConfetti();
});

musicToggle.addEventListener("click", () => {
  userMusicChoiceMade = true;

  if (!bgMusic.paused && !bgMusic.muted && bgMusic.volume > 0) {
    stopMusic();
  } else {
    startMusic();
  }
});

attemptAutoplay();
document.addEventListener("DOMContentLoaded", attemptAutoplay, { once: true });
["pointerup", "click", "touchend", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, startMusicOnFirstInteraction, { once: true, passive: true });
});

confettiBtn.addEventListener("click", () => {
  birthdayWishDialog.classList.remove("sent");

  if (typeof birthdayWishDialog.showModal === "function") {
    birthdayWishDialog.showModal();
  } else {
    launchConfetti();
  }
});

finalWishOptions.forEach((button) => {
  button.addEventListener("click", () => {
    finalWishOptions.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    birthdayWishDialog.classList.remove("sent");
    birthdayWishResult.textContent = button.dataset.finalWish;
    sendWishBtn.disabled = false;
  });
});

sendWishBtn.addEventListener("click", () => {
  const activeWish = document.querySelector("[data-final-wish].active");

  if (!activeWish) {
    return;
  }

  birthdayWishDialog.classList.add("sent");
  birthdayWishResult.textContent = "Wish sent. May it find her at exactly the right moment.";
  finalAfterWish.textContent = "A little wish has been sent for Madhushree.";
  confettiBtn.textContent = "Send another birthday wish";
  launchWishConfetti();
});

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

birthdayWishClose.addEventListener("click", () => {
  birthdayWishDialog.close();
});

birthdayWishDialog.addEventListener("click", (event) => {
  if (event.target === birthdayWishDialog) {
    birthdayWishDialog.close();
  }
});

birthdayWishDialog.addEventListener("close", () => {
  cancelAnimationFrame(wishConfettiFrame);
  wishConfetti = [];
  wishContext.clearRect(0, 0, wishCanvas.width, wishCanvas.height);
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
