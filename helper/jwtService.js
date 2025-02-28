import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

class jwtService {
  // to create a new jwt token
  static sign(payload, expiry = "120s", secret = JWT_SECRET) {
    return jwt.sign(payload, secret);
  }

  static verify(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

export default jwtService;
