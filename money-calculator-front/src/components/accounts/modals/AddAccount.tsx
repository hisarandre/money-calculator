import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DialogCustom from '@/components/DialogCustom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const AddAccount = () => {

    const formSchema = z.object({
        label: z.string().min(1, { message: "Label is required" }),
        fee: z.number({ required_error: "Fee is required" }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            fee:0,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <DialogCustom
            buttonText="Add" 
            title="Add a new account" 
        >
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Add</Button>
        </form>
        </Form>
            
        </DialogCustom>
      )
}

export default AddAccount
