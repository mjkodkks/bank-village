export const jwtConstants = ()=> {
  return {
    secret: process.env.SALT_JWT_SECRET,
  }

};
