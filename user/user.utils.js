import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

export const protectedResolver = (resolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      success: false,
      error: "Not Logged In.",
    }
  }
  return resolver(root, args, context, info);
}