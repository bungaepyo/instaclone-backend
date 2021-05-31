import client from "../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password, }
    ) => {
      try {
        // check if userName and email are unique
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              { userName }, { email }
            ]
          }
        });

        if (existingUser) {
          throw new Error("The username or email already exists.");
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // save and return
        return client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: hashPassword
          }
        })
      } catch (e) {
        return e;
      }
    },

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