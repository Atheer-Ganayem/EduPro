"use client";

import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import ErrorAlert from "../ui/ErrorAlert";
import { signup } from "@/utils/actions/auth";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const formSchema = zod
  .object({
    name: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(6),
    confirmPassword: zod.string(),
    schoolName: zod.string().min(3),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(data => !data.schoolName.includes(" "), {
    message: "School name cannot have spaces",
    path: ["schoolName"],
  });

const Signup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      schoolName: "",
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      const values = form.getValues();

      const result = await signup(values);

      if (result.error) {
        setError(result.message);
      }
      if (result.code === 401) {
        await signIn("credentials", {
          redirect: false,
          callbackUrl: "/",
          email: values.email,
          password: values.password,
        });
        window.location.href = "/";
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create an EduPro account, and start your own school management.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHndler)}>
          <CardContent className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Confirm password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="schoolName"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="School name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {error && <ErrorAlert description={error} />}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Signup;
