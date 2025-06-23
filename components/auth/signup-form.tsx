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
import { LunexisLogo } from "../ui/lunexis-logo"
import { supabase } from "@/lib/supabase"

const formSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

interface SignupFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwitchToLogin?: () => void
}

export default function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values

    // Signup with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("❌ Supabase signup error:", error.message)
      alert(`Signup failed: ${error.message}`)
      return
    }

    console.log("✅ Supabase signup success:", data)

    // Create user profile in 'profiles' table
    if (data.user) {
      const { id } = data.user

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id,
          email,
          username: "", // placeholder
          display_name: "", // placeholder
          is_verified: false,
          followers: 0,
          following: 0,
          total_likes: 0,
        },
      ])

      if (profileError) {
        console.error("❌ Failed to create profile:", profileError.message)
        alert("Signup succeeded, but failed to create profile.")
      } else {
        console.log("✅ Profile created in 'profiles' table")
        alert("✅ Account created! Check your email to confirm.")
      }
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="text-center space-y-6 mb-8">
        <LunexisLogo size="xl" className="justify-center" />
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Join the Universe</h2>
          <p className="text-slate-400">Create your cosmic identity</p>
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
                  <Input placeholder="you@cosmos.dev" {...field} />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                console.log("🔁 Switching to Login form")
                onSwitchToLogin?.()
              }}
              className="text-purple-400 hover:underline"
            >
              Log in
            </button>
          </p>
        </form>
      </Form>
    </div>
  )
}
