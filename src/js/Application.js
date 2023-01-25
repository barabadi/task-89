import EventEmitter from "eventemitter3";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.getElementById("loading");

    const button = document.querySelector(".button");
    button.addEventListener("click", () => {
      alert("💣");
    });

    this.emit(Application.events.READY);
  }

  async _load() {
    this._startLoading();
    let nextPage = "/planets";
    let planets = [];
    while (nextPage) {
      let response = await fetch(nextPage);
      let data = await response.json();
      planets = planets.concat(data.results);
      nextPage = data.next;
    }
    this._stopLoading();
    return planets;
  }

  _create(planets) {
    planets.forEach((planet) => {
      let planetDiv = document.createElement("div");
      planetDiv.classList.add("planet-box");
      planetDiv.innerHTML = `
        <h2>${planet.name}</h2>
        <p>Population: ${planet.population}</p>
      `;
      planetContainer.appendChild(planetDiv);
    });
  }

  _startLoading() {
    this._loading.style.display = "block";
  }

  _stopLoading() {
    this._loading.style.display = "none";
  }
}

const app = new Application();

app
  ._load()
  .then((planets) => {
    app._create(planets);
  })
  .catch((error) => {
    console.log(error);
  });
