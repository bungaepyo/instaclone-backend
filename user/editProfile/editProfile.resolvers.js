import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../user.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, userName, email, password: newPassword },
        { loggedInUser }
      ) => {
        protectedResolver(loggedInUser);
        let hashPassword = null;
        if (newPassword) {
          hashPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id
          },
          data: {
            firstName, lastName, userName, email, ...(hashPassword && { password: hashPassword }),
          }
        });
        if (updatedUser.id) {
          return {
            success: true
          }
        } else {
          return {
            success: false,
            error: "Cannot update profile."
          }
        }
      }
    ),
  }
}