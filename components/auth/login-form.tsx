"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"
import { LunexisLogo } from "../ui/lunexis-logo"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  remember: z.boolean().default(false).optional(),
})

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwitchToSignup?: () => void
}

export const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(
  ({ className, onSwitchToSignup, ...props }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
        remember: false,
      },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log("🔐 Attempting login...", values)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        console.error("❌ Login error:", error.message)
        alert("Login failed: " + error.message)
      } else {
        console.log("✅ Login successful:", data)
        alert("Welcome back! Login successful.")
        // Optional: redirect or update global state
      }
    }

    return (
      <div className={cn("grid gap-6", className)} {...props} ref={ref}>
        <div className="text-center space-y-6 mb-8">
          <LunexisLogo size="xl" className="justify-center" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Enter your cosmic realm</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Link
                href="/auth/forgot-password"
                className="text-sm hover:underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-purple-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </Form>
      </div>
    )
  }
)

LoginForm.displayName = "LoginForm"
