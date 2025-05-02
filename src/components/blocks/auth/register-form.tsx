"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const supabase = createClient();

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long.")
    .max(50, "Full name cannot exceed 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot exceed 50 characters."),
  profilePicture: z
    .any()
    // .refine(
    //   (file) => file?.length === 1 && file[0]?.type.startsWith("image/"),
    //   {
    //     message: "Please upload a valid image file.",
    //   }
    // )
    .optional(),
  resume: z
    .any()
    // .refine(
    //   (file) => file?.length === 1 && file[0]?.type === "application/pdf",
    //   {
    //     message: "Please upload a PDF file.",
    //   }
    // )
    .optional(),
});

const RegisterForm = () => {
  const router = useRouter();
  // 1. Define a form schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      profilePicture: [],
      resume: [],
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp(
        {
          email: values.email,
          password: values.password,
        }
      );

      if (signupError) throw signupError;
      const user = authData?.user;

      const profilePicture = values.profilePicture[0];
      console.log(values.profilePicture[0]);

      const picPath = `${user?.id}/${profilePicture?.name}`;
      const resumePath = `${user?.id}/${values.resume[0]?.name}`;

      if (profilePicture?.name) {
        const { error: avatarError } = await supabase.storage
          .from("avatars")
          .upload(picPath, profilePicture, {
            upsert: true,
          });

        if (avatarError) throw avatarError;
      }
      if (values.resume[0]?.name) {
        const { error: resumeError } = await supabase.storage
          .from("resumes")
          .upload(resumePath, values.resume[0], {
            upsert: true,
          });

        if (resumeError) {
          // rollback previous upload
          await supabase.storage.from("avatars").remove([picPath]);
          throw resumeError;
        }
      }

      const { error } = await supabase.from("Profiles").insert({
        id: user?.id,
        full_name: values.fullName,
        email: values.email,
        profile_pic_path: profilePicture?.name ? picPath : null,
        resume_path: values.resume[0]?.name ? resumePath : null,
      });

      if (error) {
        // rollback both uploads
        await supabase.storage.from("avatars").remove([picPath]);
        await supabase.storage.from("resumes").remove([resumePath]);
        throw error;
      }

      toast.success("Account created successfully. Please sign in.");
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <section className="flex items-center justify-center h-screen w-full ">
      <Card className="max-w-xl w-[90%] ">
        <CardHeader className="flex flex-col items-center justify-center ">
          <CardTitle className="flex items-center gap-2 font-semibold text-3xl text-primary-100">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            PrepWise
          </CardTitle>
          <CardDescription className="font-semibold text-3xl  text-white text-center">
            Practice job interviews with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        placeholder="Upload an image"
                        ref={field.ref}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        placeholder="Upload a pdf"
                        ref={field.ref}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full "
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-white text-sm">
          Have an account already?{" "}
          <Link className="font-bold " href={"/sign-in"}>
            {" "}
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default RegisterForm;
