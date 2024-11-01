import { Request, Response } from "express";
import AdminModel from "../models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    let admin = await AdminModel.getAdmin(req.body.username);
    if (admin) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }
    await AdminModel.addAdmin(req.body);
    res.status(200).json({ message: "Admin Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    let admin = await AdminModel.getAdmin(username);
    if (!admin) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      { id: admin.admin_id, name: admin.name },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge:  3600000, // 1 hour

    });

    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  res.cookie("auth-token", "", {
    expires: new Date(0),
  });
  res.status(200).json({message: "Admin Logged out Seccessfully"});
  res.send();
}

export const checkToken = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId, name: req.name });
}