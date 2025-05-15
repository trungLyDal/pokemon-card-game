// src/components/CardDetails.js
import React from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  if (!card) {
    return null;
  }

  return (
    <div className="card-details-overlay" onClick={onClose}>
      <div className="card-details-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">
          X
        </button>
        <h3>{card.name}</h3>
        <img src={card.images.large} alt={card.name} className="large-image" />
        {card.types && <p>Type: {card.types.join(', ')}</p>}
        {card.rarity && <p>Rarity: {card.rarity}</p>}
        {card.set && <p>Set: {card.set.name} ({card.set.series})</p>}
        {card.hp && <p>HP: {card.hp}</p>}
        {card.attacks && card.attacks.length > 0 && (
          <div className="attacks-section">
            <h4>Attacks:</h4>
            <ul>
              {card.attacks.map((attack, index) => (
                <li key={index}>
                  <strong>{attack.name}</strong> ({attack.cost.join(', ')}) - {attack.damage} {attack.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {card.weaknesses && card.weaknesses.length > 0 && (
          <p>Weakness: {card.weaknesses.map(w => `${w.type} ${w.value}`).join(', ')}</p>
        )}
        {card.resistances && card.resistances.length > 0 && (
          <p>Resistance: {card.resistances.map(r => `${r.type} ${r.value}`).join(', ')}</p>
        )}
        {card.abilities && card.abilities.length > 0 && (
          <div className="abilities-section">
            <h4>Abilities:</h4>
            <ul>
              {card.abilities.map((ability, index) => (
                <li key={index}>
                  <strong>{ability.name}</strong> ({ability.type}): {ability.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Add other relevant details here based on the API response */}
      </div>
    </div>
  );
};

export default CardDetails;