import bcrypt, { hash } from "bcrypt";
import client from "../client";

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
    }
  }
}