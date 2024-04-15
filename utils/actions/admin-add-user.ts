"use server";

import School from "@/models/School";
import User from "@/models/User";
import { SchoolDoc, UserDoc } from "@/types/monggModels";
import { connectDB } from "@/utils/connectDB";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  Res,
  invalidClientInputs,
  notAuthenticated,
  notAuthorized,
  notFound,
  serverSideError,
} from "../http-helpers";
import { authOptions } from "../authOptions";

type Data = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher" | "admin";
};

export const addUser: (values: Data) => Promise<Res> = async values => {
  try {
    if (!addValidate(values)) {
      return invalidClientInputs();
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthenticated();
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id).select("-password")) as UserDoc;

    if (!clientUser || clientUser.schoolRole !== "admin") {
      return notAuthorized();
    }

    const existingUser = await User.findOne({ email: values.email }).select("_id");
    if (existingUser) {
      return { error: true, message: "Email already exists", code: 422 };
    }

    const hashedPw = await bcrypt.hash(values.password, 12);
    const newUser = await User.create({
      name: values.name,
      email: values.email,
      password: hashedPw,
      school: clientUser.school,
      schoolRole: values.role,
    });

    const school = (await School.findById(clientUser.school)) as SchoolDoc;
    if (values.role === "student") {
      school.students.push(newUser._id);
    } else if (values.role === "teacher" || values.role === "admin") {
      school.teachers.push({ teacher: newUser._id, role: values.role });
    }
    await school.save();

    revalidatePath(`/schools/${school.name}/admin/users`);

    return { error: false, message: "User created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return serverSideError();
  }
};

function addValidate({ name, email, password, confirmPassword, role }: Data): boolean {
  if (name.length < 3) {
    return false;
  } else if (!IsEmail(email)) {
    return false;
  } else if (password.length < 6) {
    return false;
  } else if (password !== confirmPassword) {
    return false;
  } else if (!["student", "teacher", "admin"].includes(role)) {
    return false;
  }

  return true;
}

interface EditUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userId: string;
}

export const editUser: (values: EditUserData) => Promise<Res> = async values => {
  try {
    if (!editValidate({ ...values })) {
      return invalidClientInputs();
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return notAuthenticated();
    }

    await connectDB();
    const clientUser = (await User.findById(session.user.id).populate({
      path: "school",
      select: "name",
    })) as UserDoc;

    if (!clientUser || clientUser.schoolRole !== "admin") {
      return notAuthorized();
    }

    const targetUser = (await User.findById(values.userId).select("-password")) as UserDoc;
    if (!targetUser) {
      return notFound();
    } else if (targetUser.school.toString() !== (clientUser.school as SchoolDoc)._id.toString()) {
      return notAuthorized();
    }

    targetUser.name = values.name;
    targetUser.email = values.email;
    if (values.password) {
      const hashedPw = await bcrypt.hash(values.password, 12);
      targetUser.password = hashedPw;
    }
    await targetUser.save();

    revalidatePath(`/schools/${(clientUser.school as SchoolDoc).name}/admin/users`);

    return { error: false, message: "User created an added successfully", code: 201 };
  } catch (error) {
    console.log(error);

    return serverSideError();
  }
};

function editValidate({ email, name, password, confirmPassword }: EditUserData) {
  if (name.length < 3) {
    return false;
  } else if (!IsEmail(email)) {
    return false;
  } else if (password && password.length < 6) {
    return false;
  } else if (password !== confirmPassword) {
    return false;
  }

  return true;
}

function IsEmail(email: string): boolean {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}
