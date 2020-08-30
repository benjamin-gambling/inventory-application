module.exports = {
  adminLoggedIn: false,
  logInOut: (bool) => (adminLoggedIn = bool),
};

// CHANGES MENU STYLES ON CLICKS
const navbutton = document.getElementById("filter-search");

const handleNavClicks = (() => {
  let navchild = [...navbutton.children];
  navchild.forEach((child) => {
    child.addEventListener("click", () => {
      navchild.forEach((c) => c.classList.remove("active"));
      child.classList.add("active");
    });
  });
})();

const bodyclass = document.body.getAttribute("class");

bodyclass === "admin" || bodyclass === "home"
  ? document.getElementById(`${bodyclass}-link`).classList.add("active")
  : document.getElementById(`shop-link`).classList.add("active");

if (bodyclass === "admin") {
  let deleteButton = document.querySelectorAll(".delete");
  deleteButton.forEach((but) =>
    but.addEventListener("click", (e) => {
      if (!confirm("Are you sure you want to delete this bottle?")) {
        e.preventDefault();
      }
    })
  );
}

// CHANGES IMAGES ON CLICKS && AUTO SELECT ON PAGE LOAD
const randomClick = (colorSelect) => {
  let number = Math.floor(Math.random() * colorSelect.length);
  let random = colorSelect[number];

  if (colorSelect.every((val) => val.getAttribute("data-stock") === "0")) {
    random.click();
  } else {
    random.getAttribute("data-stock") !== "0"
      ? random.click()
      : randomClick(colorSelect);
  }
};

const colorChangeClick = () => {
  const itemDisplay = [...document.getElementById("filter-items").children];
  itemDisplay.forEach((item) => {
    const parts = [...item.children];
    const imgLink = parts[2];
    const img = imgLink.firstElementChild;
    const colorName = parts[3];
    const colorSelect = [...parts[4].children];

    colorSelect.forEach((button) => {
      button.addEventListener("click", () => {
        img.setAttribute("src", `/${button.value}`);
        imgLink.setAttribute("href", `/shop/bottle/${button.id}`);
        button.getAttribute("data-stock") === "0"
          ? (colorName.textContent = "OUT OF STOCK")
          : (colorName.textContent = button.name);
        colorName.textContent === "OUT OF STOCK"
          ? colorName.classList.add("text-danger")
          : colorName.classList.remove("text-danger");
      });
    });

    randomClick(colorSelect);
  });
};

const adjustQuantity = () => {
  let plus = document.querySelector('[data-type="plus"]');
  let minus = document.querySelector('[data-type="minus"]');
  let number = document.querySelector('[data-type="number"]');
  [plus, minus].forEach((but) => {
    but.addEventListener("click", () => {
      but.getAttribute("data-type") === "plus"
        ? number.value++
        : number.value > 1
        ? number.value--
        : (number.value = 1);
    });
  });
};

const pageClass = document.body.classList.value;

if (
  pageClass !== "home" &&
  pageClass !== "admin" &&
  pageClass !== "detail" &&
  pageClass !== "form"
) {
  colorChangeClick();
}

if (pageClass === "detail") {
  adjustQuantity();
}
