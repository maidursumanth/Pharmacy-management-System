import User from "../models/UserSchema.js";

// GET USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update role
export const updateRole =
  async (req, res) => {

    try {

      const { role } =
        req.body;

      // VALIDATION
      if (
        ![
          "user",
          "admin",
          "superadmin"
        ].includes(role)
      ) {

        return res.status(400).json({
          message:
            "Invalid role"
        });

      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found"
        });

      }

      // PROTECT MAIN SUPERADMIN
      if (
        user.email ===
          "admin@pharma.com" &&
        role !== "superadmin"
      ) {

        return res.status(403).json({
          message:
            "Protected superadmin"
        });

      }

      user.role = role;

      await user.save();

      res.json({
        message:
          "Role updated",
        user
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message
      });

    }
};

export const updateJobRole =
  async (req, res) => {

    try {

      const { jobRole } =
        req.body;

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          { jobRole },
          { returnDocument: "after"}
        );

      res.json(user);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }
};