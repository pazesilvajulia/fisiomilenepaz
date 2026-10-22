/* ===== Contatos: troque aqui pelos dados reais ===== */
const CONTATO = {
  whatsapp: "5547997638337",          // DDI + DDD + número, só dígitos
  whatsappTexto: "(47) 99763-8337",
  mensagem: "Olá, Dra. Milene! Vim pelo site e gostaria de agendar uma avaliação.",
  instagram: "fisiomilenepaz"         // sem o @
};

(function(){
  const wa = "https://wa.me/" + CONTATO.whatsapp + "?text=" + encodeURIComponent(CONTATO.mensagem);
  document.querySelectorAll(".js-wa").forEach(a => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll(".js-ig").forEach(a => { a.href = "https://www.instagram.com/" + CONTATO.instagram + "/"; });
  document.getElementById("waText").textContent = CONTATO.whatsappTexto;
  document.getElementById("igText").textContent = "@" + CONTATO.instagram;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Menu no celular */
  const top = document.getElementById("top"), btn = document.getElementById("menuBtn"), ico = document.getElementById("menuIco");
  const setMenu = open => { top.classList.toggle("open", open); document.body.classList.toggle("menu-open", open); btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu"); ico.setAttribute("d", open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h10"); };
  btn.addEventListener("click", () => setMenu(!top.classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", e => { if (top.classList.contains("open") && !document.getElementById("nav").contains(e.target) && !btn.contains(e.target)) setMenu(false); });
  document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* Cabeçalho e botão flutuante conforme a rolagem */
  const fab = document.getElementById("fab"), contato = document.getElementById("contato");
  const onScroll = () => {
    top.classList.toggle("scrolled", window.scrollY > 8);
    const r = contato.getBoundingClientRect();
    fab.classList.toggle("hide", window.scrollY < 300 || r.top < window.innerHeight * .8);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Primeira tela no celular: ajusta o tamanho dos elementos para que a abertura
     ocupe a tela inteira e termine nos locais de atendimento */
  const heroText = document.querySelector(".hero-text");
  let lastW = 0;
  const fitHero = () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    heroText.style.removeProperty("--k"); heroText.style.minHeight = ""; heroText.querySelector("h1").style.lineHeight = "";
    if (window.innerWidth > 600) return;
    const avail = window.innerHeight - (heroText.getBoundingClientRect().top + window.scrollY) - 16;
    const h1 = heroText.querySelector("h1");
    const fits = () => {
      return heroText.scrollHeight <= avail && h1.scrollWidth <= h1.clientWidth + 1;
    };
    let lo = 0.8, hi = 3;
    for (let n = 0; n < 16; n++) {
      const k = (lo + hi) / 2;
      heroText.style.setProperty("--k", k);
      if (fits()) lo = k; else hi = k;
    }
    let k = lo * 0.995;
    heroText.style.setProperty("--k", k);
    while (!fits() && k > 0.8) { k -= 0.01; heroText.style.setProperty("--k", k); }
    /* o espaço que sobrar vira entrelinha do título, até um limite confortável */
    const fs = parseFloat(getComputedStyle(h1).fontSize);
    const lines = Math.round(h1.offsetHeight / fs);
    const spare = avail - heroText.scrollHeight;
    if (spare > 0 && lines > 0) h1.style.lineHeight = Math.min(1.18, 1 + spare / (lines * fs)).toFixed(3);
    heroText.style.minHeight = Math.max(avail, heroText.scrollHeight) + "px";
  };
  fitHero();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { lastW = 0; fitHero(); });
  window.addEventListener("resize", fitHero);

  /* Pulmões que respiram: inspira 4s, segura 1s, expira 5s */
  const breath = document.getElementById("breath"), cue = document.getElementById("cueText"), bar = document.getElementById("cueBar");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const phases = [["in", "Inspire pelo nariz", 4000], ["hold", "Segure um instante", 1000], ["out", "Expire devagar", 5000]];
    let i = 0;
    const step = () => {
      const [p, label, ms] = phases[i];
      breath.dataset.phase = p; cue.textContent = label;
      bar.style.transitionDuration = "0ms"; bar.style.width = "0";
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transitionDuration = ms + "ms"; bar.style.width = "100%"; }));
      i = (i + 1) % phases.length; setTimeout(step, ms);
    };
    setTimeout(step, 600);
  }

  /* Zonas do Peak Flow (80% e 50% do melhor valor) */
  const best = document.getElementById("pfBest"), today = document.getElementById("pfToday");
  const out = document.getElementById("pfResult"), mark = document.getElementById("pfMark");
  const calc = () => {
    const b = Math.max(0, +best.value || 0), t = Math.max(0, +today.value || 0);
    if (b < 60) { out.innerHTML = "Informe o seu melhor valor de Peak Flow para ver as zonas."; return; }
    const g = Math.round(b * .8), y = Math.round(b * .5);
    document.getElementById("zG").textContent = "≥ " + g;
    document.getElementById("zY").textContent = y + "–" + (g - 1);
    document.getElementById("zR").textContent = "< " + y;
    const pct = Math.min(100, Math.round(t / b * 100));
    mark.style.left = Math.min(97, Math.max(3, pct)) + "%";
    mark.textContent = "hoje · " + pct + "%";
    if (t >= g) out.innerHTML = "<b>Zona verde.</b> A respiração está sob controle. Siga o plano de sempre.";
    else if (t >= y) out.innerHTML = "<b>Zona amarela.</b> Sinal de atenção. Siga a conduta combinada para essa zona e me avise.";
    else out.innerHTML = "<b>Zona vermelha.</b> Sinal de alerta. Siga o plano de crise e procure atendimento médico.";
  };
  best.addEventListener("input", calc); today.addEventListener("input", calc); calc();

  /* Linha do tempo: progresso pela rolagem, libélula na ponta da linha, etapas acendem */
  const tl = document.getElementById("timeline");
  if (tl) {
    const rail = tl.querySelector(".tl-rail"), items = [...tl.querySelectorAll(".tl-item")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { tl.style.setProperty("--p", 1); items.forEach(i => i.classList.add("on")); }
    else {
      tl.classList.add("js");
      let ticking = false;
      const update = () => {
        ticking = false;
        const r = rail.getBoundingClientRect(), target = window.innerHeight * 0.62;
        const p = Math.min(1, Math.max(0, (target - r.top) / r.height));
        tl.style.setProperty("--p", p.toFixed(4));
        tl.classList.toggle("flying", p > 0.001 && p < 0.999);
        const head = r.top + p * r.height;
        items.forEach(it => {
          const n = it.querySelector(".tl-node").getBoundingClientRect();
          it.classList.toggle("on", p > 0.002 && head >= n.top + n.height / 2 - 2);
        });
      };
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }
})();
