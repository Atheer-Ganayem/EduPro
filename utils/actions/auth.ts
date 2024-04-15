"use server";

import School from "@/models/School";
import User from "@/models/User";
import { connectDB } from "@/utils/connectDB";
import bcrypt from "bcryptjs";

type Data = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
};

export const signup: (
  values: Data
) => Promise<{ error: boolean; message: string; code: number }> = async values => {
  try {
    if (!validate(values)) {
      return { error: true, message: "Invalid input", code: 422 };
    }

    await connectDB();

    const schoolExists = await School.findOne({ name: values.schoolName }).select("_id");
    const existingUser = await User.findOne({ email: values.email }).select("_id");
    if (existingUser) {
      return { error: true, message: "Email already exists", code: 422 };
    } else if (schoolExists) {
      return { error: true, message: "School name already exists, choose anothe name", code: 422 };
    }

    const hashedPw = await bcrypt.hash(values.password, 12);

    const school = await School.create({
      name: values.schoolName,
      teachers: [],
      students: [],
      subjects: [],
    });
    const user = await User.create({
      name: values.name,
      email: values.email,
      password: hashedPw,
      school: school._id,
    });

    school.teachers.push({
      teacher: user._id,
      role: "admin",
    });
    await school.save();

    return { error: false, message: "Account created successfully", code: 401 };
  } catch (error) {
    console.log(error);

    return { error: true, message: "An error has occurred, please try again later.", code: 500 };
  }
};

function validate({ name, email, password, confirmPassword, schoolName }: Data): boolean {
  if (name.length < 3) {
    return false;
  } else if (!IsEmail(email)) {
    return false;
  } else if (password.length < 6) {
    return false;
  } else if (password !== confirmPassword) {
    return false;
  } else if (schoolName.length < 3) {
    return false;
  }

  return true;
}

function IsEmail(email: string): boolean {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}
