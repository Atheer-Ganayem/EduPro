"use client";
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { signIn } from "next-auth/react";
import ErrorAlert from "../ui/ErrorAlert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      const values = form.getValues();

      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
        email: values.email,
        password: values.password,
      });

      if (!result?.ok) {
        setError("Incorrect email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }
    setLoading(false);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Welcome back!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHndler)}>
          <CardContent className="space-y-2">
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
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Login;
