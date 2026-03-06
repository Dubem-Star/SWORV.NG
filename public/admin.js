const loginForm = document.getElementById("loginForm");
const msgBox = document.getElementById("msgBox");
const msg = document.getElementById("msg");
const tabs = document.querySelectorAll(".tabs");
const statusHolder = document.getElementById("statusHolder");
const body = document.body;
const editIcons = document.querySelectorAll(".edit-icon");
const saveIcons = document.querySelectorAll(".save-icon");
const editIcons2 = document.querySelectorAll(".edit-icon2");
const saveIcons2 = document.querySelectorAll(".save-icon2");
let currentTitle;
let editedTitle;
let priceProductName;
let page;

//AUTHENTICATION PAGE AUTHENTICATION PAGE AUTHENTICATION PAGE AUTHENTICATION PAGE
//AUTHENTICATION PAGE AUTHENTICATION PAGE AUTHENTICATION PAGE AUTHENTICATION PAGE
if (body.id === "loginPage") {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const res = await fetch("/admin-login-post", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (response.status) {
      msgBox.style.display = "block";
      msg.style.color = "green";
      msg.innerHTML = `<strong>${response.message}</strong>`;

      setTimeout(() => {
        window.location.href = "/admin-dashboard";
      }, 2000);
    } else {
      msgBox.style.display = "block";
      msg.style.color = "red";
      msg.innerHTML = `<strong>${response.message}</strong>`;
    }
  });
}

//DASHBOARD PAGE DASHBOARD PAGE DASHBOARD PAGE DASHBOARD PAGE
//DASHBOARD PAGE DASHBOARD PAGE DASHBOARD PAGE DASHBOARD PAGE
if (body.id === "dashboardPage") {
  page = body.id;

  const stickyPoint = statusHolder.offsetTop;
  console.log(stickyPoint, scrollY);

  window.addEventListener("scroll", () => {
    if (scrollY >= stickyPoint) {
      statusHolder.classList.add("bg-dark", "text-light");
    } else {
      statusHolder.classList.remove("bg-dark", "text-light");
    }
  });

  //ITEM NAME EDIT CODE  ITEM NAME EDIT CODE ITEM NAME EDIT CODE ITEM NAME EDIT CODE
  //ITEM NAME EDIT CODE  ITEM NAME EDIT CODE ITEM NAME EDIT CODE ITEM NAME EDIT CODE

  for (let editBtn of editIcons) {
    editBtn.addEventListener("click", () => {
      const wrapper = editBtn.closest(".item-name");
      const itemName = wrapper.querySelector(".item");
      const saveIcon = wrapper.querySelector(".save-icon");

      const editInput = document.createElement("input");
      editInput.classList.add("form-control", "edit-input1");
      editInput.type = "text";
      editInput.value = itemName.textContent.trim();

      currentTitle = itemName.textContent.trim();

      editBtn.style.display = "none";
      saveIcon.style.display = "flex";

      wrapper.replaceChild(editInput, itemName);
      editInput.focus();
    });
  }

  for (let saveIcon of saveIcons) {
    saveIcon.addEventListener("click", async () => {
      const wrapper = saveIcon.closest(".item-name");
      const editInput = wrapper.querySelector(".edit-input1");

      if (!editInput) return;

      const newValue = document.createElement("strong");
      newValue.classList.add("item");
      if (!editInput.value) return;
      newValue.textContent = editInput.value.trim();

      editedTitle = newValue.textContent;

      wrapper.replaceChild(newValue, editInput);

      const editIcon = wrapper.querySelector(".edit-icon");
      editIcon.style.display = "flex";

      saveIcon.style.display = "none";

      const response = await fetch("/edit-product-name", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: currentTitle,
          newName: editedTitle,
        }),
      });

      const result = await response.json();

      if (result) {
        console.log(result.message);
      } else {
        alert(result.message);
        console.error(result.message);
      }
    });
  }

  //ITEM PRICE EDIT CODE  ITEM PRICE EDIT CODE ITEM PRICE EDIT CODE ITEM PRICE EDIT CODE
  //ITEM PRICE EDIT CODE  ITEM PRICE EDIT CODE ITEM PRICE EDIT CODE ITEM PRICE EDIT CODE

  for (let editIcon of editIcons2) {
    editIcon.addEventListener("click", () => {
      const wrapper = editIcon.closest(".item-price");
      const itemPrice = wrapper.querySelector(".price");
      const saveIcon = wrapper.querySelector(".save-icon2");

      priceProductName = editIcon.dataset.productName;

      const price = itemPrice.textContent;
      const rawPrice = price.replace("₦", "").replace(",", "");

      const editInput = document.createElement("input");
      editInput.classList.add("form-control", "edit-input2");
      editInput.type = "number";
      editInput.value = rawPrice;

      editIcon.style.display = "none";
      saveIcon.style.display = "flex";

      wrapper.replaceChild(editInput, itemPrice);
      editInput.focus();
    });
  }

  for (let saveIcon of saveIcons2) {
    saveIcon.addEventListener("click", async () => {
      const wrapper = saveIcon.closest(".item-price");
      const editInput = wrapper.querySelector(".edit-input2");
      const editIcon = wrapper.querySelector(".edit-icon2");

      const newValue = document.createElement("strong");
      newValue.classList.add("price");
      if (!editInput.value) return;

      const raw = editInput.value;
      const num = parseFloat(raw);
      newValue.textContent = `₦${num.toLocaleString()}`;

      wrapper.replaceChild(newValue, editInput);

      saveIcon.style.display = "none";
      editIcon.style.display = "flex";

      const fetchResponse = await fetch("/edit-product-price", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: priceProductName,
          updatedPrice: num,
        }),
      });

      const res = await fetchResponse.json();

      if (res.status) {
        console.log(res.message);
      } else {
        alert(res.message);
        console.error(res.message);
      }
    });
  }

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  function renumberProducts() {
    const itemContainers = document.querySelectorAll(".item-container");

    let count = 1;

    for (let itemContainer of itemContainers) {
      const sN = itemContainer.querySelector(".serial-number");

      sN.textContent = count;

      ++count;
    }
  }

  async function getDocLengths() {
    const message = "get me lengths.";

    const fetchResponse = await fetch("/get-lengths", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const res = await fetchResponse.json();

    if (res.status) {
      console.log(res.message);
      return res.totalProducts;
    }
  }

  const rmvBtns = document.querySelectorAll(".rmv-icon");

  for (let btn of rmvBtns) {
    btn.addEventListener("click", async () => {
      const confirmedDelete = confirm(
        "Are you sure you want to delete this product from the database?"
      );

      if (confirmedDelete) {
        const itemContainer = btn.closest(".item-container");
        const productName = btn.dataset.productName;

        const fetchResponse = await fetch("/delete-product", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName }),
        });

        const response = await fetchResponse.json();

        if (response.status) {
          itemContainer.remove();
          renumberProducts();

          const totalProducts = document.getElementById("totalProducts");
          totalProducts.innerHTML = `
         
         <i class="text-primary bi-box"></i>Total Products: ${await getDocLengths()}
         
         `;
        } else {
          alert(response.message);
          console.error(response.message);
        }
      }
    });
  }
}

if (body.id === "orderPage") {
  page = body.id;
  const stickyPoint = statusHolder.offsetTop;
  console.log(stickyPoint, scrollY);

  window.addEventListener("scroll", () => {
    if (scrollY >= stickyPoint) {
      statusHolder.classList.add("bg-dark", "text-light");
    } else {
      statusHolder.classList.remove("bg-dark", "text-light");
    }
  });
}

for (let tab of tabs) {
  tab.classList.remove("sample");
  if (tab.getAttribute("id") === page) {
    tab.classList.add("sample");
  }

  tab.addEventListener("click", () => {
    const a = tab.querySelector(".a");

    if (a) window.location.href = a.href;
  });
}
