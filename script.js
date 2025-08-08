document.addEventListener("DOMContentLoaded", () => {
  const groupe = document.getElementById("groupe");
  const ligne = document.getElementById("ligne");
  const sousMachine = document.getElementById("sousMachine");
  const btnAjouterPdr = document.getElementById("btnAjouterPdr");
  const zonePdr = document.getElementById("zone-pdr");
  const form = document.getElementById("intervention-form");
  const resultat = document.getElementById("resultat");

  const lignes = {
    "Groupe 1": ["Protos 80E", "Foke"],
    "Groupe 2": ["Protos 80E", "Foke"],
    "Groupe 3": ["Protos 90E", "GD"],
  };

  const sousMachines = {
    "Protos 80E": ["VE", "SE", "MAX", "CHF", "Magomat"],
    "Protos 90E": ["VE", "SE", "MAX", "CHF"],
    "Foke_Groupe 1": ["317", "350", "401", "409", "459"],
    "Foke_Groupe 2": ["317", "401", "407", "459"],
    "GD": ["X3", "C600", "CV", "CT", "Flexlink"],
  };

  // Remplir lignes selon groupe
  groupe.addEventListener("change", () => {
    ligne.innerHTML = '<option value="">Sélectionner</option>';
    sousMachine.innerHTML = '<option value="">Sélectionner</option>';
    if (lignes[groupe.value]) {
      lignes[groupe.value].forEach((l) => {
        ligne.innerHTML += `<option>${l}</option>`;
      });
    }
  });

  // Remplir sous-machine selon ligne & groupe
  ligne.addEventListener("change", () => {
    sousMachine.innerHTML = '<option value="">Sélectionner</option>';
    let key = ligne.value;
    if (ligne.value === "Foke") key += `_Groupe ${groupe.value.split(" ")[1]}`;
    if (sousMachines[key]) {
      sousMachines[key].forEach((sm) => {
        sousMachine.innerHTML += `<option>${sm}</option>`;
      });
    }
  });

  // Ajouter une ligne PDR
  btnAjouterPdr.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "pdr-line";
    div.innerHTML = `
      <input type="number" name="pdr_qte[]" placeholder="Quantité" min="1" required />
      <input type="text" name="pdr_code[]" placeholder="Code" required />
      <input type="text" name="pdr_desc[]" placeholder="Description" required />
      <button type="button" class="btn-suppr" aria-label="Supprimer cette pièce">✕</button>
    `;
    zonePdr.appendChild(div);

    div.querySelector(".btn-suppr").addEventListener("click", () => {
      div.remove();
    });
  });

  // Soumission formulaire + envoi vers Google Apps Script
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultat.textContent = "Envoi en cours...";
    const formData = new FormData(form);

    fetch(
      "https://script.google.com/macros/s/AKfycbxlwFplbmvADIYlzGEDtd3axsdZADk9UaUImOUU46u8oCxRPaWyReJUtp3af57o8DHn-g/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          resultat.textContent = data.message || "Formulaire envoyé avec succès.";
          form.reset();
          zonePdr.innerHTML = "";
        } else {
          resultat.textContent = "Erreur : " + (data.message || "Erreur inconnue");
        }
      })
      .catch((err) => {
        resultat.textContent = "Erreur lors de l'envoi : " + err.message;
      });
  });
});