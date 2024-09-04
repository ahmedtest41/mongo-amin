const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

/** =============================
  * @desc  Login admin
  * @route  /api/admin/login
  * @method  POST
=============================*/
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // const token = generateToken(admin._id);

    // // Set cookie
    // const cookieOptions = {
    //   httpOnly: false,
    //   maxAge: 90 * 24 * 60 * 60 * 1000,
    //   sameSite: "None",
    //   secure: false,
    // };

    // res.cookie("token", token, cookieOptions);

    res.json({ admin });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginAdmin,
};
