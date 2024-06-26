//creando selectores

const patientInput = document.querySelector("#patient");
const propietaireInput = document.querySelector("#propietaire");
const emailInput = document.querySelector("#email");
const dateInput = document.querySelector("#date");
const syntomesInput = document.querySelector("#syntomes");

const formulaire = document.querySelector("#form-rdv");
const formulaireInput = document.querySelector("#form-rdv input[type='submit']")//este selector selecciona el input submit del formulario de CSS, asi solo cambio el boton submit.
const contenedorRdvs = document.querySelector("#citas");

let editando = false;

// Events para caprturar la informacion del formulario
patientInput.addEventListener("change", infoRdv);
propietaireInput.addEventListener("change", infoRdv);
emailInput.addEventListener("change", infoRdv);
dateInput.addEventListener("change", infoRdv);
syntomesInput.addEventListener("change", infoRdv);

//para capturar la info del boton submit
formulaire.addEventListener("submit", submitRdv);

// Objet de redez-vous (l'dee c'est de agruparlos valores del paciente)
const rdvObj = {
  id: generarId(),
  patient: "",
  propietaire: "",
  email: "",
  date: "",
  syntomes: "",
};

class Notification {
  constructor({ texte, type }) {
    this.texte = texte;
    this.type = type;
    this.show();
  }
  show() {
    //creer notification ou alert
    const alert = document.createElement("DIV"); //DIV en mayuscula x convencion, cuando se crea un elemento nuevo
    alert.classList.add(
      "text-center",
      "w-full",
      "p-3",
      "text-white",
      "my-5",
      "alert",
      "uppercase",
      "font-bold",
      "text-sm"
    );

    //effacer alerts repetitivas. Hay varias maneras de eliminar la opcion 1 es un poco más larga y la otra es menos codigo
    //opcion 1
    // const alerts = document.querySelectorAll('.alert')
    // alerts.forEach(alert => alert.remove())
    //opcion 2
    const alerts = document.querySelector(".alert");
    alerts?.remove();

    //si es type erreur, add une classe (agregamos el color de fondo que tendra esa alerta, rojo si es error, verde si está bien)
    this.type === "erreur"
      ? alert.classList.add("bg-red-500")
      : alert.classList.add("bg-green-500");

    // Message erreur
    alert.textContent = this.texte;

    //Insert DOM
    formulaire.parentElement.insertBefore(alert, formulaire);

    //effacer alert apres 5 seg
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

class AdminRdv {
  constructor() {
    //cada cita va a ser un objeto, pero tienen que estar todas en una coleccion, dentro de este arreglo
    this.rdvs = [];
  }
  //agregar metodos: agregar(add), mostrar, editar...
  add(rdv) {
    this.rdvs = [...this.rdvs, rdv]; //spread operator
    this.show(); //llamamos al metodo show, se puede llamar desde fuera de la clase o desde dentro de la clase add.
  }

  edit(rdvUpdate) {
    this.rdvs = this.rdvs.map((rdv) =>
      rdv.id === rdvUpdate.id ? rdvUpdate : rdv
    ); //el map itera, se puede modificar y nos da un arreglo nuevo)
    this.show();
  }

  supprimer(id){
    this.rdvs = this.rdvs.filter((rdv) => rdv.id!== id);
    this.show();

  }

  //metodo para mostrar todas las citas
  show() {
    //limpiar el HTML
    while (contenedorRdvs.firstChild) {
      contenedorRdvs.removeChild(contenedorRdvs.firstChild);
    }

        // Comprobar si existen citas si no mostrar no hay pacientes.
        if(this.rdvs.length === 0) {
          contenedorRdvs.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">Pas de patients</p>'
          return
      }


    //generando las citas(iteramos en las rdvs porque son un arreglo)
    this.rdvs.forEach((rdv) => {
      const divRdv = document.createElement("DIV"); //DIV en mayuscula x convencion, cuando se crea un elemento nuevo
      divRdv.classList.add(
        "mx-5",
        "my-10",
        "bg-white",
        "shadow-md",
        "px-5",
        "py-10",
        "rounded-xl",
        "p-3"
      );

      const patient = document.createElement("p");
      patient.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      patient.innerHTML = `<span class="font-bold uppercase">Patient: </span> ${rdv.patient}`;

      const propietaire = document.createElement("p");
      propietaire.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      propietaire.innerHTML = `<span class="font-bold uppercase">Propietaire: </span> ${rdv.propietaire}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${rdv.email}`;

      const date = document.createElement("p");
      date.classList.add("font-normal", "mb-3", "text-gray-700", "normal-case");
      date.innerHTML = `<span class="font-bold uppercase">Date: </span> ${rdv.date}`;

      const syntomes = document.createElement("p");
      syntomes.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      syntomes.innerHTML = `<span class="font-bold uppercase">Syntomes: </span> ${rdv.syntomes}`;

      // Botones de Eliminar y editar
      const btnEdit = document.createElement("button");
      btnEdit.classList.add(
        "py-2",
        "px-10",
        "bg-indigo-600",
        "hover:bg-indigo-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2",
        "btn-edit"
      );
      btnEdit.innerHTML =
        'Edit <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      const clone = structuredClone(rdv); //structuredClone es una funcion nueva de JavaScript, toma una copia completa del objeto
      btnEdit.onclick = () => cargarEdicion(clone);

      const btnSupprimer = document.createElement("button");
      btnSupprimer.classList.add(
        "py-2",
        "px-10",
        "bg-red-600",
        "hover:bg-red-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnSupprimer.innerHTML =
        'Supprimer <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnSupprimer.onclick = () => this.supprimer(rdv.id)

      //crear botones en el DOM
      const contenedorButtons = document.createElement("DIV");
      contenedorButtons.classList.add("flex", "justify-between", "mt-10");

      contenedorButtons.appendChild(btnEdit);
      contenedorButtons.appendChild(btnSupprimer);
      //fin botones

      // Agregar al HTML
      divRdv.appendChild(patient);
      divRdv.appendChild(propietaire);
      divRdv.appendChild(email);
      divRdv.appendChild(date);
      divRdv.appendChild(syntomes);
      divRdv.appendChild(contenedorButtons);

      contenedorRdvs.appendChild(divRdv);
    });
  }
}

//function pour atrapper l'info du formulaire
function infoRdv(e) {
  rdvObj[e.target.name] = e.target.value;
  // console.log(rdvObj)
}

//instancio la clase AdminRdv por fuera de la funcion submitRDV para tenerla disponible
const rdvs = new AdminRdv();

//funtion pour le button submit
function submitRdv(e) {
  e.preventDefault();

  if (Object.values(rdvObj).some((valor) => valor.trim() === "")) {
    new Notification({
      texte: "tous les champs son obligatoires",
      type: "erreur",
    });
    return;
  }

  if (editando) {
    rdvs.edit({ ...rdvObj });
    new Notification({
      texte: "Édité avec succès",
      type: "Succes",
    });
  } else {
    rdvs.add({ ...rdvObj }); //con esta sintaxis {...rdvObj} no reescribe el objeto anterior
    new Notification({
      texte: "Patient enregistré",
      type: "Succes",
    });
  }

  //llamo a la funcion add que agrega las citas
  formulaire.reset();
  remiseObjRdv();
  formulaireInput.value = 'Enregistrer un patient'//con este codigo el boton vuelve a tener el texto de origen una vez que se finalizo la edicion del paciente.
  editando = false;//para que se agreguen nuevos pacientes se debe poner de nuevo editando = false, para que permita el nuevo registro.

}

//function pra reinicializar el formulaire
function remiseObjRdv() {
  // Reiniciar el objeto (esta es una manera de reiniciar)
  // rdvObj.id = generarId()
  // rdvObj.patient = '';
  // rdvObj.propietaire = '';
  // rdvObj.email = '';
  // rdvObj.date = '';
  // rdvObj.syntomes = '';

  //esta es otra manera de reiniciar el formulario, hace lo mismo que la forma anterior
  Object.assign(rdvObj, {
    id: generarId(), //generará ids unicos
    patient: "",
    propietaire: "",
    email: "",
    date: "",
    syntomes: "",
  });
}

//funcion para generar automaticamente IDs, para que funcione se debe colocar en nuestro objeto rdvObj
function generarId() {
  //esta funcion genera ids sin necesidad de instalar librerias y cargar el codigo.
  return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(rdv) {
  Object.assign(rdvObj, rdv);

  patientInput.value = rdv.patient;
  propietaireInput.value = rdv.propietaire;
  emailInput.value = rdv.email;
  dateInput.value = rdv.date;
  syntomesInput.value = rdv.syntomes;

  editando = true;

  formulaireInput.value = 'Enregistrer modifications'
}
