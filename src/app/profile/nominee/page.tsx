
'use client';

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useNominees } from '@/hooks/use-nominees';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  relationship: z.string({ required_error: "Please select a relationship." }),
});

const relationshipOptions = ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"];

export default function NomineePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { nominees, addNominee, removeNominee } = useNominees();
  const [nomineeToRemove, setNomineeToRemove] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      relationship: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNominee({
      id: `nominee_${Date.now()}`,
      ...values,
      share: 100, // Default share for the first nominee, logic to split can be added later
    });

    toast({
      title: "Nominee Added",
      description: `${values.fullName} has been successfully added as a nominee.`,
    });
    form.reset();
  }

  const handleRemoveConfirm = () => {
    if (nomineeToRemove) {
      removeNominee(nomineeToRemove);
      toast({ title: 'Nominee Removed', variant: 'destructive' });
      setNomineeToRemove(null);
    }
  };

  return (
    <>
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Nominee Details</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        <div className="mb-6">
          <p className="text-muted-foreground">Add recipients of your funds in case of your demise.</p>
          <p className="text-muted-foreground text-sm">You can add up to 2 nominees. <a href="#" className="text-primary">Learn more</a></p>
        </div>

        {nominees.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Nominees</h2>
            <div className="space-y-4">
              {nominees.map((nominee, index) => (
                <Card key={nominee.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-lg">Nominee {index + 1}: {nominee.fullName}</p>
                            <p className="text-sm text-muted-foreground">{nominee.relationship}</p>
                            <p className="text-sm text-muted-foreground">Share: {nominee.share}%</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setNomineeToRemove(nominee.id)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {nominees.length < 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Add Nominee {nominees.length + 1}</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee's full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Nominee's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Nominee's DOB</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Nominee's DOB</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee relationship</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-muted-foreground text-sm">
                    After adding first nominee, you can optionally add another nominee & specify share of funds for them.
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                    <Button type="submit" size="lg" className="w-full">Save Nominee Details</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </main>
    </div>
    <AlertDialog open={!!nomineeToRemove} onOpenChange={() => setNomineeToRemove(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently remove this nominee. You cannot undo this action.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setNomineeToRemove(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemoveConfirm} className="bg-destructive hover:bg-destructive/90">
                    Remove
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
