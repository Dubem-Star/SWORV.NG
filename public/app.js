const productGrid = document.getElementById("productGrid");
const body = document.body;
const productImg = document.getElementById("productImg");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productSize = document.getElementById("productSize");
const productPrice = document.getElementById("productPrice");
const detailsImg = document.getElementById("detailsImg");
const atcBtn = document.getElementById("atcBtn");
const imgWrapper = document.getElementById("zoomCont");
const cardImgFront = document.getElementById("cardImgFront");
const cardImgBack = document.getElementById("cardImgBack");
const cartPageheader = document.getElementById("cartPageheader");
const totalContainer = document.getElementById("totalContainer");
const checkoutContainer = document.getElementById("checkoutContainer");
const cartIcon = document.getElementById("cartIcon");

let bodyId = "";
let selectedSize;

const countryStateData = {
  nigeria: [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ],
  unitedStates: [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
  canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
  ],
  southAfrica: [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ],

  india: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Lakshadweep",
    "Puducherry",
  ],
  australia: [
    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
  ],
  germany: [
    "Baden-Württemberg",
    "Bavaria",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse",
    "Lower Saxony",
    "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia",
  ],
};

function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function savetoCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBagde() {
  let cart = loadCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    const bagdeCount = document.getElementById("bagdeCount");
    if (bagdeCount) {
      bagdeCount.style.display = "flex";
      bagdeCount.textContent = totalQuantity;
    }
    if (cartIcon) cartIcon.classList.add("adjust");
  } else {
    bagdeCount.style.display = "none";
    if (cartIcon) cartIcon.classList.remove("adjust");
  }
}

updateCartBagde();

let subTotal;

function updateTotalPrice(cart) {
  const totalPrice = document.getElementById("subTotal");
  const totalPriceCheckout = document.getElementById("totalPrice");
  subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalPrice) totalPrice.textContent = `₦${subTotal.toLocaleString()}`;
  if (totalPriceCheckout)
    totalPriceCheckout.textContent = `₦${subTotal.toLocaleString()}`;
}

//   HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE
//   HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE HOME PAGE
if (body.id === "homePage") {
  bodyId = "homePage";
}

//   SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE
//   SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE SHOP PAGE

if (body.id === "shopPage") {
  bodyId = "shopPage";
}

//   DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE
//   DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE DETAILS PAGE

if (body.id === "detailsPage") {
  bodyId = "detailsPage";

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  //   SWAP IMAGES CODE
  const swap = document.querySelectorAll(".swap");
  for (let img of swap) {
    img.addEventListener("click", () => {
      for (unselect of swap) {
        unselect.classList.remove("selectedPreview");
      }
      productImg.src = img.src;
      img.classList.add("selectedPreview");
    });
  }

  // CAROUSEL CODE CAROUSEL CODE CAROUSEL CODE  CAROUSEL CODE
  const carouselContainer = document.querySelector(
    ".related-products-carousel"
  );

  // ZOOMING CODE
  imgWrapper.addEventListener("mousemove", (e) => {
    const wrapperPosition = imgWrapper.getBoundingClientRect();
    const x =
      ((e.clientX - wrapperPosition.left) / wrapperPosition.width) * 100;
    const y =
      ((e.clientY - wrapperPosition.top) / wrapperPosition.height) * 100;

    productImg.style.setProperty("--mouse-x", x + "%");
    productImg.style.setProperty("--mouse-y", y + "%");
  });

  productImg.addEventListener("mouseover", () => {
    productImg.classList.add("zoom-in");
  });

  productImg.addEventListener("mouseout", () => {
    productImg.classList.remove("zoom-in");
  });

  // ATC HELPER FUNCTIONS

  function addtoCart(product) {
    let cart = loadCart();

    let existing = cart.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, size: selectedSize });
    }

    savetoCart(cart);

    updateCartBagde();

    console.log("Cart updated:", cart);
  }

  atcBtn.addEventListener("click", async () => {
    selectedSize = productSize.value;
    const cautionMsg = document.getElementById("cautionMsg");
    if (!selectedSize) {
      return cautionMsg.classList.add("show");
    } else {
      cautionMsg.classList.remove("show");
    }

    const fetchProduct = await fetch("/fetch-products", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const response = await fetchProduct.json();

    if (response.status) {
      addtoCart(response.product);
    } else {
      alert(response.message);
    }

    atcBtn.textContent = "Added to Cart!";

    setTimeout(() => {
      atcBtn.textContent = "Add to Cart";
    }, 2000);
  });
}

// SHOPPING CART PAGE SHOPPING CART PAGE SHOPPING CART PAGE SHOPPING CART PAGE
// SHOPPING CART PAGE SHOPPING CART PAGE SHOPPING CART PAGE SHOPPING CART PAGE

if (body.id === "shoppingCartPage") {
  bodyId = "shoppingCartPage";

  let cart = loadCart();
  updateTotalPrice(cart);
  const scMainPage = document.getElementById("scMainPage");

  if (cart.length >= 1) {
    for (let product of cart) {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");

      itemContainer.innerHTML = `
<div class="item-quantity-container" >
          <div class="item-quantity" >x${product.quantity}</div>
        </div>

        <div class="item-image-container">
          <img src="${product.image[0]}" class="item-image" alt=""  />
        </div>

        <div class="item-description-container">
          <p class="item-name" >${product.title}</p>
          <p class="item-size" >Size: <strong>${product.size}</strong></p>
        </div>

        <div class="item-price-container">
          <h5 class="item-price" >₦${product.price.toLocaleString()}</h5>
          <span class="remove-btn" data-product-id = ${
            product.id
          }  data-size = ${product.size} >remove</span>
        </div>
`;
      scMainPage.appendChild(itemContainer);
    }

    function updateCartPage(cart) {
      if (cart.length < 1) {
        cartPageheader.textContent = "NO CART YET";
        checkoutContainer.style.display = "none";
        totalContainer.style.display = "none";
      } else {
        cartPageheader.textContent = "YOUR CART";
        checkoutContainer.style.display = "flex";
        totalContainer.style.display = "flex";
      }
    }

    // This code runs only AFTER all items have been created
    // CODE TO REMOVE AN ITEM FROM CART
    const removeBtn = document.querySelectorAll(".remove-btn");
    for (let btn of removeBtn) {
      btn.addEventListener("click", (event) => {
        const { productId, size } = event.target.dataset;

        const itemWrapperToRemove = event.target.closest(".item-container");
        itemWrapperToRemove.remove();

        let cart = loadCart();
        const newCart = cart.filter(
          (item) => !(item.id == productId && item.size == size)
        );

        savetoCart(newCart);
        updateCartBagde();
        updateCartPage(newCart);
        updateTotalPrice(newCart);
      });
    }
  } else {
    cartPageheader.textContent = "NO CART YET";
    checkoutContainer.style.display = "none";
    totalContainer.style.display = "none";
  }
  // CHECKOUT BTN EVENT LISTENER
  const checkoutBtn = document.getElementById("checkoutBtn");

  checkoutBtn.addEventListener("click", async () => {
    let cart = loadCart();

    try {
      const res = await fetch("/create-order", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = `/checkout?orderId=${data.orderId}`;
      } else {
        console.error("Unable to save user order, try again");
        alert("Unable to checkout");
      }
    } catch (e) {
      console.error("Error fetching user order");
    }
  });
}

//   LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE
//   LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE LOOKBOOK PAGE

if (body.id === "lookbookPage") {
  bodyId = "lookbookPage";
}

document.addEventListener("navbarLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");

  for (let link of navLinks) {
    link.classList.remove("active");
    if (link.getAttribute("id") === bodyId) {
      link.classList.add("active");
    }
  }
});

//   CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE
//   CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE CHECKOUT PAGE

if (body.id === "checkoutPage") {
  const param = new URLSearchParams(window.location.search);
  orderId = param.get("orderId");

  const billingAddressCheckbox = document.getElementById(
    "billingAddressCheckbox"
  );
  const shippingAddressForm = document.getElementById("shippingAddressForm");

  const bankTransferInput = document.getElementById("bankTransferInput");

  const bankTransferBox = document.getElementById("bankTransferBox");
  const descriptionContainer = document.getElementById("descriptionContainer");

  bankTransferBox.addEventListener("click", () => {
    console.log("clicked");
    if (bankTransferInput.checked) {
      bankTransferInput.checked = false;
      descriptionContainer.classList.add("hidden");
      descriptionContainer.classList.remove("show");
      bankTransferBox.classList.remove("radius-removal");
    } else {
      bankTransferInput.checked = true;
      descriptionContainer.classList.remove("hidden");
      descriptionContainer.classList.add("show");
      bankTransferBox.classList.add("radius-removal");
    }
  });

  const creditCardMode = document.getElementById("creditCardMode");
  const bankTransferMode = document.getElementById("bankTransferMode");
  const creditCardCheckbox = document.getElementById("creditCardCheckbox");
  const bankTransferCheckbox = document.getElementById("bankTransferCheckbox");

  creditCardMode.addEventListener("click", (req, res) => {
    if (bankTransferCheckbox.checked === true) {
      bankTransferCheckbox.checked = false;
      creditCardCheckbox.checked = true;
    } else {
      creditCardCheckbox.checked = true;
    }
  });

  bankTransferMode.addEventListener("click", (req, res) => {
    if (creditCardCheckbox.checked === true) {
      creditCardCheckbox.checked = false;
      bankTransferCheckbox.checked = true;
    } else {
      bankTransferCheckbox.checked = true;
    }
  });

  const region = document.getElementById("region");
  const stateSelection = document.getElementById("state");

  function populateState(countryName) {
    stateSelection.innerHTML =
      "<option value='' class = 'state-placeholder' >--select state--</option>";

    const states = countryStateData[countryName];

    if (states) {
      for (let stateName of states) {
        const option = document.createElement("option");
        option.value = stateName;
        option.textContent = stateName;
        stateSelection.appendChild(option);
      }
    }
  }

  region.addEventListener("change", (e) => {
    const countryName = e.target.value;
    populateState(countryName);
  });

  //JS FOR PRODUCT DETAILS SECTION--- JS FOR PRODUCT DETAILS SECTION
  //JS FOR PRODUCT DETAILS SECTION--- JS FOR PRODUCT DETAILS SECTION

  let cart = loadCart();
  const productBox = document.getElementById("productBox");

  for (let item of cart) {
    const itemWrapperCunt = document.createElement("div");
    itemWrapperCunt.classList.add("item-wrapper-cunt");

    itemWrapperCunt.innerHTML = `

  <div class ="item-wrapper">
    <div class="img-and-discr-cont">

  <div class="item-img-wrapper"> 
  <img class="item-img" src="${item.image[0]}"/>
  <span class="item-qty" id="itemQty">${item.quantity}</span>
  </div>

  <div class="item-info-wrapper">
  <p class="item-name">${item.title}</p>
   <p class="item-size">${item.size}</p>
  </div>
  </div>

  <div class="item-price-wrapper">
  <p class="item-price">₦${item.price.toLocaleString()}<p>
  </div>
  </div>
  
  `;

    productBox.appendChild(itemWrapperCunt);
  }

  updateTotalPrice(cart);
  const fullTotalPrice = document.getElementById("fullTotalPrice");
  const amount = subTotal + 4000;
  fullTotalPrice.textContent = `₦${amount.toLocaleString()}`;

  // 'PAY NOW' SUBMITFORM FUNCTION 'PAY NOW' SUBMITFORM FUNCTION 'PAY NOW' SUBMITFORM FUNCTION
  // 'PAY NOW' SUBMITFORM FUNCTION 'PAY NOW' SUBMITFORM FUNCTION 'PAY NOW' SUBMITFORM FUNCTION

  async function submitForm() {
    const bankTranfer = bankTransferCheckbox.checked;
    const creditCard = creditCardCheckbox.checked;

    if (!bankTranfer && !creditCard) {
      return alert("please select a mode of payment");
    }

    let paymentMethod;
    if (bankTranfer) {
      paymentMethod = "Bank Transfer";
    } else if (creditCard) {
      paymentMethod = "Credit card";
    }

    const form = new FormData(shippingAddressForm);
    const email = form.get("email");

    const userShippingDetails = {
      email: email,
      firstName: form.get("firstname"),
      lastName: form.get("lastname"),
      address: form.get("address"),
      country: form.get("country"),
      city: form.get("city"),
      state: form.get("state"),
      zipCode: form.get("zip-code"),
      phoneNo: form.get("phonenumber"),
      modeOfPayment: paymentMethod,
      orderId,
    };

    if (!email) {
      return alert("email is not allowed to be empty");
    }

    try {
      const res = await fetch("/initialize-payment", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          orderId,
          totalAmount: amount,
          paymentMethod,
          userShippingDetails,
        }),
      });

      const response = await res.json();
      console.log(response);

      if (response.status) {
        window.location.href = response.data.authorization_url;
      } else {
        alert(response.message);
      }
    } catch (e) {
      console.log("Error Initiating Transaction:", e);
    }
  }

  //CLICKING ON "PAY NOW" CLICKING ON "PAY NOW" CLICKING ON "PAY NOW" CLICKING ON "PAY NOW"
  //CLICKING ON "PAY NOW" CLICKING ON "PAY NOW" CLICKING ON "PAY NOW" CLICKING ON "PAY NOW"
  shippingAddressForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitForm();
  });

  const mobilePayBtn = document.getElementById("mobilePayBtn");

  mobilePayBtn.addEventListener("click", (req, res) => {
    submitForm();
  });
}

// TRANSACTION STATUS PAGE TRANSACTION STATUS PAGE TRANSACTION STATUS PAGE

if (body.id === "paymentStausPage") {
  const param = new URLSearchParams(window.location.search);
  const transactionReference = param.get("reference");
  const status = document.getElementById("status");
  const loading = document.getElementById("loading");
  const deliveryMsg = document.getElementById("deliveryMsg");
  if (transactionReference) {
    async function verifyTransaction() {
      try {
        const response = await fetch("/verifyPayment", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: transactionReference }),
        });

        const data = await response.json();

        if (loading) loading.style.display = "none";

        if (data.status === true) {
          status.textContent = "PAYMENT SUCCESSFUL ✅";
          deliveryMsg.textContent =
            "We're getting your order ready! We'll send you an email with the expected delivery date and tracking information within the next 48 hours.";
          status.style.color = "green";
        } else {
          status.textContent = "PAYMENT FAILED, PLEASE TRY AGAIN ❌";
          status.style.color = "red";
        }
      } catch (e) {
        if (loading) loading.style.display = "none";
        status.textContent = "An error occured, please try again later";
        status.style.color = "red";
        console.log(e);
      }
    }

    verifyTransaction();
  } else {
    if (loading) loading.style.display = "none";
    status.textContent = "Invalid transaction, no reference found";
    status.style.color = "red";
  }
}
