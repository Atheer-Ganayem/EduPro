"use client";

import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { UserDoc } from "@/types/monggModels";
import { editUser } from "@/utils/actions/admin-add-user";

interface Props {
  initialUser: UserDoc;
}

const formSchema = zod
  .object({
    name: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().optional(),
    confirmPassword: zod.string().optional(),
  })
  .refine(data => !data.password || data.password.length >= 6, {
    message:
      "The new password must be at least 6 characters long. If you want to keep the same password you must leave it empty.",
    path: ["password"],
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const EditUserForm: React.FC<Props> = ({ initialUser }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialUser.name,
      email: initialUser.email,
      password: "",
      confirmPassword: "",
    },
  });

  async function submitHndler() {
    setLoading(true);
    setError("");
    try {
      const values = form.getValues();
      console.log(values);

      const result = await editUser({
        ...values,
        userId: initialUser._id.toString(),
        password: values.password || "",
        confirmPassword: values.password || "",
      });
      if (result.code === 201) {
        closeRef.current!.click();
      } else if (result.error) {
        setError(result.message);
      }
    } catch (error) {
      setError("An error has occurred, please try again later.");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHndler)} className="space-y-4">
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New password" type="password" />
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Confirm new password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {error && <ErrorAlert description={error} />}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Save Changes"
          )}
        </Button>

        <DialogClose asChild className="hidden">
          <Button ref={closeRef} type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default EditUserForm;
