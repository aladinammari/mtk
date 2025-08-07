document.addEventListener("DOMContentLoaded", function() {
  const groupe = document.getElementById("groupe");
  const ligne = document.getElementById("ligne");
  const sousMachine = document.getElementById("sousMachine");
  const zonePdr = document.getElementById("zone-pdr");
  const ajouterPdr = document.getElementById("ajouter-pdr");
  const form = document.getElementById("intervention-form");
  const resultat = document.getElementById("resultat");

  const lignes = {
    "Groupe 1": ["Protos 80E", "Foke"],
    "Groupe 2": ["Protos 80E", "Foke"],
    "Groupe 3": ["Protos 90E", "GD"]
  };

  const sousMachines = {
    "Protos 80E": ["VE", "SE", "MAX", "CHF", "Magomat"],
    "Protos 90E": ["VE", "SE", "MAX", "CHF"], // pas Magomat pour Groupe 1
    "Foke_Groupe 1": ["317", "350", "401", "409", "459"],
    "Foke_Groupe 2": ["317", "401", "407", "459"],
    "GD": ["X3", "C600", "CV", "CT", "Flexlink"]
  };

  groupe.addEventListener("change", () => {
    ligne.innerHTML = "<option value=''>Sélectionner</option>";
    sousMachine.innerHTML = "<option value=''>Sélectionner</option>";
    if (lignes[groupe.value]) {
      lignes[groupe.value].forEach(l => {
        ligne.innerHTML += `<option>${l}</option>`;
      });
    }
  });

  ligne.addEventListener("change", () => {
    sousMachine.innerHTML = "<option value=''>Sélectionner</option>";
    if (!ligne.value) return;

    let key = ligne.value;
    if (ligne.value === "Foke") key += `_Groupe ${groupe.value.split(" ")[1]}`;

    if (sousMachines[key]) {
      sousMachines[key].forEach(sm => {
        sousMachine.innerHTML += `<option>${sm}</option>`;
      });
    }
  });

  ajouterPdr.addEventListener("click", () => {
    const bloc = document.createElement("div");
    bloc.innerHTML = `
      <input type="number" name="pdr_qte[]" placeholder="Quantité" min="1" required />
      <input type="text" name="pdr_code[]" placeholder="Code" required />
      <input type="text" name="pdr_desc[]" placeholder="Description" required />
      <button type="button" class="remove-pdr" title="Supprimer">×</button>
    `;
    zonePdr.appendChild(bloc);

    bloc.querySelector(".remove-pdr").addEventListener("click", () => {
      zonePdr.removeChild(bloc);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    resultat.textContent = "";

    const formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbxn-4VO8woPK-QO7HkbotjkjWkRcSkMiD2OXDEXqBwGZKd7_QsZUa8Y2uVqS7lj5_1FIw/exec", {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(txt => {
      resultat.style.color = "green";
      resultat.textContent = txt;
      form.reset();
      zonePdr.innerHTML = "";
    })
    .catch(err => {
      resultat.style.color = "red";
      resultat.textContent = "Erreur : " + err.message;
    });
  });
});