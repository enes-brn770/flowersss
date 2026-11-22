/**
 * ECRİN'E ÖZEL ÇİÇEK BUKETİ - JAVASCRIPT
 * Sade, Gerçekçi Çiçek Buketi, Ataçlı 3D Not Kartı ve Zarif Parçacıklar (Sessiz)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sayfa yüklendiğinde buketi yumuşak bir yükselmeyle göster
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 250);

  // ================= 1. ATAÇLI 3D KART ÇEVİRME ETKİLEŞİMİ =================
  const noteCard = document.getElementById('noteCard');

  if (noteCard) {
    noteCard.addEventListener('click', (e) => {
      e.stopPropagation();
      const isFlipped = noteCard.classList.toggle('is-flipped');
      if (isFlipped) {
        // Kart çevrildiğinde zarifçe gül yaprakları ve kalpler saçılsın (tamamen sessiz)
        spawnPetalBurst(26);
      }
    });
  }

  // ================= 2. GECE ATEŞ BÖCEKLERİ & IŞILTI KANVASI =================
  const firefliesCanvas = document.getElementById('fireflies-canvas');
  if (firefliesCanvas) {
    const ctx = firefliesCanvas.getContext('2d');
    let width = firefliesCanvas.width = window.innerWidth;
    let height = firefliesCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = firefliesCanvas.width = window.innerWidth;
      height = firefliesCanvas.height = window.innerHeight;
    });

    const fireflies = [];
    const count = Math.min(32, Math.floor((width * height) / 20000));

    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.0 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.15,
        opacity: Math.random() * 0.65 + 0.35,
        glowColor: Math.random() > 0.4 ? 'rgba(254, 240, 138, ' : 'rgba(251, 113, 133, ',
        phase: Math.random() * Math.PI * 2
      });
    }

    function animateFireflies() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];
        f.phase += 0.025;
        f.x += f.speedX + Math.sin(f.phase) * 0.35;
        f.y += f.speedY;

        if (f.y < -10) {
          f.y = height + 10;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        const currentOpacity = (Math.sin(f.phase) * 0.3 + 0.7) * f.opacity;

        // Yumuşak ışık halesi
        ctx.beginPath();
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 3.5);
        grad.addColorStop(0, f.glowColor + currentOpacity + ')');
        grad.addColorStop(1, f.glowColor + '0)');
        ctx.fillStyle = grad;
        ctx.arc(f.x, f.y, f.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Parçacık çekirdeği
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      requestAnimationFrame(animateFireflies);
    }

    animateFireflies();
  }

  // ================= 3. ZARİF DÜŞEN YAPRAKLAR & KALPLER =================
  const petalsCanvas = document.getElementById('petals-canvas');
  let petalsCtx = null;
  const activePetals = [];

  if (petalsCanvas) {
    petalsCtx = petalsCanvas.getContext('2d');
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    });

    function renderPetals() {
      petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

      for (let i = activePetals.length - 1; i >= 0; i--) {
        const p = activePetals[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.y > petalsCanvas.height + 20 || p.opacity <= 0) {
          activePetals.splice(i, 1);
          continue;
        }

        petalsCtx.save();
        petalsCtx.translate(p.x, p.y);
        petalsCtx.rotate(p.rotation);
        petalsCtx.scale(p.scale, p.scale);
        petalsCtx.globalAlpha = Math.max(0, p.opacity);

        if (p.isHeart) {
          // Mini kalp
          petalsCtx.fillStyle = p.color;
          petalsCtx.beginPath();
          const topCurveHeight = p.size * 0.3;
          petalsCtx.moveTo(0, topCurveHeight);
          petalsCtx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
          petalsCtx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, (p.size + topCurveHeight) / 2, 0, p.size);
          petalsCtx.bezierCurveTo(0, (p.size + topCurveHeight) / 2, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
          petalsCtx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
          petalsCtx.closePath();
          petalsCtx.fill();
        } else {
          // Çiçek yaprağı
          petalsCtx.fillStyle = p.color;
          petalsCtx.beginPath();
          petalsCtx.ellipse(0, 0, p.size * 0.45, p.size, Math.PI / 4, 0, 2 * Math.PI);
          petalsCtx.fill();
        }

        petalsCtx.restore();
      }

      requestAnimationFrame(renderPetals);
    }

    renderPetals();
  }

  function spawnPetalBurst(amount = 24) {
    if (!petalsCanvas) return;
    const colors = [
      '#ff4d6d', '#ff758f', '#ffb3c1', '#fce7f3', 
      '#e63946', '#fde047', '#fffbeb', '#ffffff'
    ];

    for (let i = 0; i < amount; i++) {
      activePetals.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 180,
        y: window.innerHeight * 0.48 + (Math.random() - 0.5) * 80,
        size: Math.random() * 10 + 8,
        scale: Math.random() * 0.45 + 0.65,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 3.8,
        speedY: Math.random() * 2.5 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        opacity: 0.95,
        fadeSpeed: Math.random() * 0.005 + 0.0035,
        isHeart: Math.random() > 0.45
      });
    }
  }

  // İlk açılışta hafif bir karşılama yaprak süzülmesi
  setTimeout(() => {
    spawnPetalBurst(12);
  }, 700);
});
