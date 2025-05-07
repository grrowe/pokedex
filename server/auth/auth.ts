import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.AUTH_PORT;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
interface User {
  id: number;
  username: any;
  password: any;
}

const users: Array<User> = [];

// these need to be stored in a DB, NOT READY for any type of production
let refreshTokens: string[] = [];

interface AuthenticatedRequest extends Request {
  user?: any
}

app.get("/users", async (req: Request, res: Response) => {
  res.status(200).send(users);
});

app.post("/token", async (req: Request, res: Response) => {
  // Read the refresh token from the cookie
  console.log("Cookies received: ", req.cookies);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).send("Refresh token is missing");
    return;
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).send("Forbidden");
    return;
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  // Verify the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) {
        return res.status(403).send("Invalid or expired refresh token");
      }

      // Generate a new access token
      const access_token = generateAccessToken({
        username: user.username,
        password: user.password,
        id: user.id,
      });

      // Return the new access token
      return res.status(200).send({ access_token });
    }
  );
});

// sign up
app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      id: users.length + 1,
      username: req.body.username,
      password: hashedPassword,
    };

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    const access_token = generateAccessToken(user);
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    // const hashed_refresh_token = await bcrypt.hash(refresh_token, 10);

    // These needs to be stored in a DB
    refreshTokens.push(refresh_token);

    users.push(user);

    res
      .cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: false, // Set true in production (HTTPS)
        sameSite: "lax", // lax or local development, strict for prod
        // path: "/token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .send({ ...user, access_token });
  } catch {
    res.status(500).send();
  }
});

app.get("/users/me", authenticateToken, (req: Request, res: Response) => {
  const reqWithUser = req as AuthenticatedRequest;

  console.log('user: ', reqWithUser.user)

  if (!reqWithUser.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const user = users.find((u) => u.id === reqWithUser.user.id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  // Don't expose password in response
  const { password, ...safeUser } = user;

  res.status(200).json(safeUser);
});

// login
app.post("/users/login", async (req: any, res: any) => {
  // replace with find user on DB
  const user = users.find((user) => user.username === req.body.username);

  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
      }

      const access_token = generateAccessToken(user);
      const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      // These needs to be stored in a DB
      refreshTokens.push(refresh_token);

      res
        .cookie("refreshToken", refresh_token, {
          httpOnly: true,
          secure: false, // Set true in production (HTTPS)
          sameSite: "lax", // lax or local development, strict for prod
          //   path: "/token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .send({ ...user, access_token });
    } else {
      res.status(403).send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

function generateAccessToken(user: User) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
}



function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Bearer TOKEN is not present in request headers");
    return;
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401).send("Invalid or expired token");
      return;
    }

    const reqWithUser = req as AuthenticatedRequest;
    reqWithUser.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Auth server is running at http://localhost:${port}`);
});
