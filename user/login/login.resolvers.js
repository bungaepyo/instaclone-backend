import client from "../../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    login: async (
      _,
      { userName, password }
    ) => {
      // find user with args.userName
      const user = await client.user.findFirst({ where: { userName } });
      if (!user) {
        return {
          success: false,
          error: "User not found."
        }
      }

      // check password with args.password
      const passwordSuccess = await bcrypt.compare(password, user.password);
      if (!passwordSuccess) {
        return {
          success: false,
          error: "Invalid password"
        }
      }

      // issue token and return it
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        success: true,
        token
      }
    }
  }
}