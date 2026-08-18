"use strict";
function PwGate({ label, correctPw, onConfirm, onCancel, potvrdText }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (val === correctPw) onConfirm();
    else { setErr(true); setVal(""); }
  };
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modalbox" style=${{ width: "min(380px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <h2>Ověření hesla</h2>
          <p className="hint">Pro potvrzení akce „${label}" zadejte heslo.</p>
          <input type="password" autoFocus value=${val}
            onChange=${(e) => { setVal(e.target.value); setErr(false); }}
            onKeyDown=${(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Heslo" />
          ${err && html`<div className="warnbox">Nesprávné heslo.</div>`}
          <div className="rowline" style=${{ marginTop: 14 }}>
            <button className="btn danger" onClick=${submit}>${potvrdText || "Potvrdit smazání"}</button>
            <button className="btn sec" onClick=${onCancel}>Zrušit</button>
          </div>
        </div>
      </div>
    </div>`;
}

