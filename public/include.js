// async function includeHTML(id, file, searchCallback, hamburgerCallback) {
//   try {
//     const res = await fetch(file);
//     const content = await res.text();
//     const target = document.getElementById(id);
//     if (target) {
//       target.innerHTML = content;
//       if (searchCallback) searchCallback();
//       if (hamburgerCallback) hamburgerCallback();
//     }
//   } catch (err) {
//     console.error(`Failed to include ${file}`, err);
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   includeHTML("navbarPlaceholder", "navbar.html", searchFunc, hamburgerFunc);
//   includeHTML("footerPlaceholder", "footer.html");
// });

// function searchFunc() {
//   const searchIcon = document.getElementById("searchIcon");
//   const searchInput = document.getElementById("searchInput");

//   if (searchIcon && searchInput) {
//     searchIcon.addEventListener("click", () => {
//       searchIcon.style.display = "none";
//       searchInput.style.display = "flex";
//     });
//   }
// }

// function hamburgerFunc() {
//   const hamburgerBtn = document.querySelector(".hamburger-icon");
//   const navbarContent = document.getElementById("navbarContent");

//   hamburgerBtn.addEventListener("click", () => {
//     navbarContent.classList.toggle("display");
//   });
// }

// A single async function to load all HTML and then run the callbacks
async function includeHTML(id, file) {
  try {
    const res = await fetch(file);
    const content = await res.text();
    const target = document.getElementById(id);
    if (target) {
      target.innerHTML = content;
    }
  } catch (err) {
    console.error(`Failed to include ${file}`, err);
  }
}

// These functions should be called *after* the HTML is loaded.
// Don't call them directly from the global scope.
function setupEventListeners() {
  const searchIcon = document.getElementById("searchIcon");
  const searchInput = document.getElementById("searchInput");

  // The search icon is inside the navbar, so we need to find it here.
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchIcon.style.display = "none";
      searchInput.style.display = "flex";
    });
  }

  const hamburgerBtn = document.querySelector(".hamburger-icon");
  const navbarContent = document.getElementById("navbarContent");

  if (hamburgerBtn && navbarContent) {
    hamburgerBtn.addEventListener("click", () => {
      navbarContent.classList.toggle("display");
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Use await to make sure the navbar is loaded first

  document.dispatchEvent(new Event("navbarLoaded"));

  // Now, call the function to set up the listeners
  setupEventListeners();
});

// inside include.js, after inserting navbar/footer
