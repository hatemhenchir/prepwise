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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot exceed 50 characters."),
});

const SigninForm = () => {
  const router = useRouter();
  // 1. Define a form schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.code === "invalid_credentials") {
      toast.error("Sign-in failed", {
        description: "Invalid email or password. Please try again.",
      });
      return;
    }

    if (error) {
      toast.error("Sign-in failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
      console.log(error.code, error.name);

      return;
    }

    // 3. Redirect to the home page.
    router.push("/");
  }

  return (
    <section className="flex items-center justify-center h-screen w-full ">
      <Card className="max-w-lg w-[90%] ">
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

              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2  text-sm text-white">
          No account yet?{" "}
          <Link className="font-bold " href={"/sign-up"}>
            {" "}
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SigninForm;
