import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password, }
    ) => {
      // check if userName and email are unique
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            { userName }, { email }
          ]
        }
      });
      // hash password
      // save and return

    }
  }
}