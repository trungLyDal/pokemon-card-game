import React from "react";
import "./PackOpening.css"; 

const PackToggle = ({ packsToOpen, setPacksToOpen, disabled }) => (
  <div className="switch-button">
    <span className={`active${packsToOpen === 10 ? " right" : ""}`}></span>
    <button
      className={`switch-button-case left${packsToOpen === 1 ? " active-case" : ""}`}
      onClick={() => setPacksToOpen(1)}
      disabled={disabled}
      aria-pressed={packsToOpen === 1}
      type="button"
    >
      Open 1 Pack
    </button>
    <button
      className={`switch-button-case right${packsToOpen === 10 ? " active-case" : ""}`}
      onClick={() => setPacksToOpen(10)}
      disabled={disabled}
      aria-pressed={packsToOpen === 10}
      type="button"
    >
      Open 10 Packs
    </button>
  </div>
);

export default PackToggle;