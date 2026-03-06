require("dotenv").config();
const mongoose = require("mongoose");
const { Product, Admin } = require("./public/usermodels");
const dbUrl = process.env.MONGODB_URL;
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://127.0.0.1:27017/testDB")
  .then(async () => {
    console.log("mongoDb connected");

    const products = [
      {
        title: "State Of Emergency Tee (black)",
        price: 1000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeblk.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeblk.jpg",
        ],
        description:
          "Nollywood-themed boxy T-shirt. The Unisex Essential Cotton T-shirt is made from soft, 100% combed cotton for a breathable, heavyweight feel that's perfect for everyday wear. With a classic crew neckline and a boxy fit, this shirt is designed to look good on everyone and pair effortlessly with your favorite jeans, joggers, or shorts.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeblk.jpg",
      },

      {
        title: "State Of Emergency Tee (white)",
        price: 40000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeyt.png",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeyt.png",
        ],
        description:
          "Nollywood-themed boxy T-shirt. The Unisex Essential Cotton T-shirt is made from soft, 100% combed cotton for a breathable, heavyweight feel that's perfect for everyday wear. With a classic crew neckline and a boxy fit, this shirt is designed to look good on everyone and pair effortlessly with your favorite jeans, joggers, or shorts.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEteeyt.png",
      },

      {
        title: "Adire Star Full Piece",
        price: 50000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adiretop.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adirebottom.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adireshot1.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adireshot2.jpg",
        ],
        description:
          "African textile adire set. This Unisex Set is made with 100% lanin, portraying the richness in African Fashion.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adire_Piece_Green.png",
      },
      {
        title: "Adire Checkers Red Piece",
        price: 50000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/adirecolortop.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/adirecolorshort.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/adireColoredSingle.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/adireclrdsingle2.jpg",
        ],
        description:
          "African textile adire set. This Unisex Set is made with 100% lanin, portraying the richness in African Fashion.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adire_Piece_Red.png",
      },

      {
        title: "Adire Checkers Blue Piece",
        price: 40000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/AdireBlue1.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/AdireBlue2.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/adirefull1.jpg",
        ],
        description:
          "African textile adire set. This Unisex Set is made with 100% lanin, portraying the richness in African Fashion.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Adire_Piece_Blue.png",
      },

      {
        title: " Sworv Patterned Beenie",
        price: 25000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/beeniefront.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/Beeniecoolshot.jpg",
        ],
        description:
          "Stay cozy and stylish with this multicolor wool knit beanie from SWORV Studios. Crafted with a blend of deep red, black, and white tones, this beanie adds a bold yet versatile touch to your look. Soft, warm, and lightweight, it’s perfect for cold days, casual outings, or elevating your streetwear fit. Finished with the signature SWORV logo patch for that unique edge, this beanie is more than just an accessory—it’s a statement",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/beeniefront.jpg",
      },
      {
        title: "State of Emergency Tank Top (white)",
        price: 40000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEwhitetanktop.jpeg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEwhitetanktop.jpeg",
        ],
        description:
          "Monochrome elegance meets rebel energy. This sharp-fit, jet-black top uses contrast piping and precision cuts to echo high fashion. Designed with double side zippers and flat lapel, it's engineered to elevate even the most laid-back look. The kind of piece that doesn’t need loud colors to command the room",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEwhitetanktop.jpeg",
      },

      {
        title: "State of Emergency Tank Top (black)",
        price: 40000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEblacktanktop.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEblacktanktop.jpg",
        ],
        description:
          "Monochrome elegance meets rebel energy. This sharp-fit, jet-black top uses contrast piping and precision cuts to echo high fashion. Designed with double side zippers and flat lapel, it's engineered to elevate even the most laid-back look. The kind of piece that doesn’t need loud colors to command the room",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/SOEblacktanktop.jpg",
      },

      {
        title: "Athletic Department Tee",
        price: 45000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/athleticsDept1.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/athleticsDept1.jpg",
        ],
        description:
          "Our Athletic department jersey is a boxy shaped jersey with a sport like look. Light weight tee with a silicon 3D print This shirt is designed to look colorful and good on everyone and pair effortlessly with your favorite jeans, joggers or shorts.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/athleticsDept1.jpg",
      },
      {
        title: "Explosion Tee",
        price: 40000,
        image: [
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/explosionTee1.jpg",
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/explosionTee1.jpg",
        ],
        description:
          "Dooms day inspired boxy polo tee. Lightweight feet that's perfect for everyday wear. With a classic collar neckline with zip. This shirt is designed to look good on everyone and pair effortlessly with your favorite jeans, joggers, or shorts.",
        adminImg:
          "https://res.cloudinary.com/dirijnb2k/image/upload/sworv/explosionTee1.jpg",
      },
    ];

    const somtoPassword = await bcrypt.hash(process.env.SOMTO_PASSWORD, 10);
    const dubemPassword = await bcrypt.hash(process.env.DUBEM_PASSWORD, 10);

    const admins = [
      { username: "Somto", password: somtoPassword },
      { username: "Dubby", password: dubemPassword },
    ];

    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Product.insertMany(products);
    await Admin.insertMany(admins);
    console.log("insertion successfull");
    mongoose.connection.close();
  })
  .catch((e) => console.log("Error connecting mongoDb:", e));
