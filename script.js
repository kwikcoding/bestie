const labels = [
  "Our happiest chaos",
  "That unstoppable laugh",
  "A day worth keeping",
  "Main-character energy",
  "Just us being us",
];

// const memories = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, src: `https://picsum.photos/seed/bestie-memory-${i + 1}/900/1100`, label: labels[i % labels.length] }));

const memories = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  src: `assets/photos/${String(i + 1).padStart(2, "0")}.jpeg`,
  label: labels[i % labels.length],
}));

const reasons = [
  ["01", "You make ordinary days feel like stories worth remembering."],
  ["02", "You listen to every tiny detail—and somehow remember them all."],
  ["03", "Your laugh is my favourite kind of background music."],
  ["04", "Life is softer, louder and infinitely better with you in it."],
];
const milestones = [
  [
    "The beginning",
    "Two strangers, one hello—and the start of something rare.",
  ],
  [
    "The chaos era",
    "Bad photos, endless calls, inside jokes and zero regrets.",
  ],
  [
    "The forever part",
    "No matter where life takes us, you will always have me.",
  ],
];

const giftScreen = document.querySelector("#gift-screen");
const siteShell = document.querySelector("#site-shell");
const counter = document.querySelector("#memory-counter");
const reel = document.querySelector("#memory-reel");
const progress = document.querySelector(".memory-progress-fill");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
let initialized = false,
  musicOn = false,
  audioContext = null,
  musicTimer = null;

document.querySelector("#hero-photo").src = memories[0].src;
reel.innerHTML = memories
  .map(
    (memory, index) =>
      `<figure class="memory-frame invisible absolute inset-0"><button class="memory-photo-button group relative block h-full w-full overflow-hidden rounded-[1.8rem] bg-[#261934] text-left shadow-[0_35px_100px_rgba(0,0,0,.5)] sm:rounded-[2.5rem]" data-memory="${index}" aria-label="Open memory ${memory.id}"><img src="${memory.src}" alt="" ${index > 1 ? 'loading="lazy"' : ""} class="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl" aria-hidden="true"><img src="${memory.src}" alt="${memory.label}, photo ${memory.id}" ${index > 1 ? 'loading="lazy"' : ""} class="relative z-10 h-full w-full object-contain transition duration-700 group-hover:scale-[1.025]"><span class="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent px-6 pb-6 pt-24 sm:px-9 sm:pb-8"><small class="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/55">Memory ${String(memory.id).padStart(2, "0")}</small><strong class="mt-2 block font-serif text-2xl font-normal sm:text-4xl">${memory.label}</strong><span class="mt-3 block text-xs text-white/45">Tap to view full screen ↗</span></span></button></figure>`,
  )
  .join("");
document.querySelector("#reasons").innerHTML = reasons
  .map(
    ([number, reason]) =>
      `<article class="reveal-up rounded-[2rem] border border-[#eadde3] bg-white p-7 shadow-[0_14px_45px_rgba(74,39,58,0.06)] sm:p-10"><span class="text-xs font-bold tracking-[0.3em] text-[#e94981]">${number}</span><p class="mt-8 font-serif text-2xl leading-snug sm:text-3xl">${reason}</p></article>`,
  )
  .join("");
document.querySelector("#milestones").innerHTML = milestones
  .map(
    ([title, copy], i) =>
      `<article class="reveal-up rounded-[2rem] bg-white/75 p-8 backdrop-blur"><span class="font-serif text-5xl italic text-[#53a896]">0${i + 1}</span><h3 class="mt-8 font-serif text-2xl">${title}</h3><p class="mt-4 text-sm leading-7 text-[#507069]">${copy}</p></article>`,
  )
  .join("");

function burstConfetti() {
  const holder = document.querySelector("#confetti");
  holder.innerHTML = "";
  const colors = ["#ff4f87", "#ffd166", "#77e6d5", "#b99cff", "#fff"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${(i * 19) % 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${(i % 12) * 0.06}s`;
    piece.style.animationDuration = `${2.3 + (i % 6) * 0.25}s`;
    holder.appendChild(piece);
  }
  setTimeout(() => (holder.innerHTML = ""), 4200);
}

function initAnimations() {
  if (initialized) return;
  initialized = true;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-word", {
    y: 110,
    opacity: 0,
    rotate: 4,
    duration: 1.1,
    stagger: 0.12,
    ease: "power4.out",
  });
  gsap.from(".hero-note", { opacity: 0, y: 20, delay: 0.8, duration: 0.8 });
  gsap.utils.toArray(".reveal-up").forEach((el) =>
    gsap.from(el, {
      opacity: 0,
      y: 70,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 84%" },
    }),
  );
  const frames = gsap.utils.toArray(".memory-frame");
  gsap.set(frames, { autoAlpha: 0, yPercent: 45, scale: 1.1, rotate: 0 });
  gsap.set(frames[0], { autoAlpha: 1, yPercent: 0, scale: 1 });
  gsap.set(progress, {
    scaleX: 1 / memories.length,
    transformOrigin: "left center",
  });
  const timeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    scrollTrigger: {
      trigger: ".memory-stage",
      start: "top top",
      end: () => `+=${innerHeight * memories.length * 0.72}`,
      pin: true,
      scrub: 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const current = Math.min(
          memories.length,
          Math.floor(self.progress * memories.length) + 1,
        );
        counter.textContent = String(current).padStart(2, "0");
      },
    },
  });
  frames.slice(1).forEach((frame, index) => {
    const previous = frames[index],
      position = index;
    timeline
      .to(
        previous,
        {
          autoAlpha: 0,
          yPercent: -28,
          scale: 0.9,
          rotate: index % 2 ? -2 : 2,
          duration: 0.42,
        },
        position,
      )
      .fromTo(
        frame,
        { autoAlpha: 0, yPercent: 48, scale: 1.12, rotate: index % 2 ? 3 : -3 },
        { autoAlpha: 1, yPercent: 0, scale: 1, rotate: 0, duration: 0.58 },
        position + 0.22,
      )
      .to(
        progress,
        { scaleX: (index + 2) / memories.length, duration: 0.58, ease: "none" },
        position + 0.22,
      );
  });
  gsap.to(".orb-one", {
    x: 70,
    y: -80,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".orb-two", {
    x: -90,
    y: 60,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function openSurprise() {
  giftScreen.classList.add("hidden");
  siteShell.classList.remove("hidden");
  burstConfetti();
  requestAnimationFrame(() => {
    initAnimations();
    ScrollTrigger.refresh();
  });
}
document
  .querySelectorAll("[data-open-surprise]")
  .forEach((button) => button.addEventListener("click", openSurprise));

reel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-memory]");
  if (!button) return;
  const memory = memories[Number(button.dataset.memory)];
  lightboxImage.src = memory.src;
  lightboxImage.alt = memory.label;
  lightboxCaption.textContent = `${memory.label} ♡`;
  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});
function closeLightbox() {
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document
  .querySelector("#lightbox-close")
  .addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const envelope = document.querySelector("#envelope");
envelope.addEventListener("click", () => {
  const open = envelope.classList.toggle("is-open");
  envelope.setAttribute("aria-expanded", String(open));
  document.querySelector("#letter-action").textContent = open
    ? "close"
    : "open";
});
document.querySelector("#wish-button").addEventListener("click", burstConfetti);

function playNote(frequency, when) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator(),
    gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.055, when + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 1.1);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(when);
  oscillator.stop(when + 1.15);
}
function melody() {
  const start = audioContext.currentTime;
  [523.25, 659.25, 783.99, 659.25, 587.33, 523.25].forEach((note, index) =>
    playNote(note, start + index * 0.42),
  );
}
const birthdayMusic = new Audio("assets/music/birthday-song.mp3");
birthdayMusic.loop = true;
birthdayMusic.volume = 0.6;

document.querySelector("#music-toggle").addEventListener("click", async () => {
  const bars = document.querySelector(".music-bars");
  const label = document.querySelector(".music-label");
  const button = document.querySelector("#music-toggle");

  if (musicOn) {
    birthdayMusic.pause();
    musicOn = false;

    bars.classList.remove("playing");
    label.textContent = "Play music";
    button.setAttribute("aria-label", "Play music");
  } else {
    await birthdayMusic.play();
    musicOn = true;

    bars.classList.add("playing");
    label.textContent = "Music on";
    button.setAttribute("aria-label", "Pause music");
  }
});
