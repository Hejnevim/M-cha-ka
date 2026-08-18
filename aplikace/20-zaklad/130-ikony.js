"use strict";
function Img({ src, srcs, alt, className, fallback = null, errFallback = null }) {
  const list = (srcs && srcs.length ? srcs : (src ? [src] : [])).filter(Boolean);
  const key = list.join("|");
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [key]);
  if (!list.length) return fallback;
  if (idx >= list.length) return errFallback != null ? errFallback : fallback;
  return html`<img className=${className} src=${list[idx]} alt=${alt || ""} loading="lazy" onError=${() => setIdx((i) => i + 1)} />`;
}

/* Zámek u technologie, která ještě není odemčená. Kreslený stejně jako ostatní
   ikony aplikace — čtyřiadvacítková mřížka, jen obrys, barva z textu, tloušťka
   tahu i zakončení z proměnných vzhledu. Stojí uvnitř věty, proto má třídu
   ikona-radek: velikost si bere z písma, ve kterém je vysázený. */
function IkonaZamek({ otevreny = false }) {
  return html`
    <svg viewBox="0 0 24 24" className="ikona-radek" fill="none" aria-hidden="true">
      <path d="M5 11h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor" />
      <path d=${otevreny ? "M7 11V7a5 5 0 0 1 9.9-1" : "M7 11V7a5 5 0 0 1 10 0v4"}
        stroke="currentColor" />
    </svg>`;
}

const fixTech = (ps) => (ps || []).map((p) => Object.assign({}, p, {
  positions: (p.positions || []).map((x) => Object.assign({}, x, { tech: x.tech === "TRF" ? "TRS" : x.tech })),
}));

