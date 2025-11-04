'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldInput, FieldTextarea, FieldBase } from '@/components/form/form-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const testSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().email('Invalid email address').max(100, 'Email must be 100 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional(),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional(),
  customField: z.string().max(30, 'Custom field must be 30 characters or less').optional(),
});

type TestFormData = z.infer<typeof testSchema>;

export default function TestFieldPage() {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
      bio: '',
      phone: '',
      customField: '',
    },
  });

  const onSubmit = (data: TestFormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Field Component Test</h1>
        <p className="text-muted-foreground mt-2">Testing the new FieldInput component with character count inside the input field</p>
      </div>

      <div className="space-y-8">
        {/* FieldInput Examples */}
        <Card>
          <CardHeader>
            <CardTitle>FieldInput Component</CardTitle>
            <CardDescription>New component with character count displayed inside the input on the right side</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldInput
                control={form.control}
                name="name"
                label="Name"
                description="Your full name"
                maxLength={50}
                placeholder="Enter your name..."
              />

              <FieldInput
                control={form.control}
                name="email"
                label="Email"
                description="Your email address"
                type="email"
                maxLength={100}
                placeholder="Enter your email..."
              />

              <FieldInput
                control={form.control}
                name="phone"
                label="Phone Number"
                description="Optional phone number"
                type="tel"
                maxLength={20}
                placeholder="+1 (555) 123-4567"
              />

              <FieldInput
                control={form.control}
                name="customField"
                label="Custom Field"
                maxLength={30}
                placeholder="Short custom text..."
                className="font-mono"
              />

              {/* Example without maxLength */}
              <FieldInput
                control={form.control}
                name="description"
                label="Description (No Character Count)"
                description="This field has no maxLength, so no counter is shown"
                placeholder="Enter description..."
              />

              <Button type="submit" className="w-full">
                Submit Test Form
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FieldTextarea Examples */}
        <Card>
          <CardHeader>
            <CardTitle>FieldTextarea Component</CardTitle>
            <CardDescription>New textarea component with character count displayed inside the textarea on the top right</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldTextarea
              control={form.control}
              name="bio"
              label="Biography"
              description="Tell us about yourself"
              maxLength={300}
              placeholder="Enter your biography..."
              rows={4}
            />

            <FieldTextarea
              control={form.control}
              name="description"
              label="Project Description"
              maxLength={200}
              placeholder="Describe your project in detail..."
              rows={6}
              className="resize-none"
            />

            {/* Example without maxLength */}
            <FieldTextarea
              control={form.control}
              name="customField"
              label="Notes (No Character Count)"
              description="This textarea has no maxLength, so no counter is shown"
              placeholder="Enter any notes..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* FieldBase Examples for comparison */}
        <Card>
          <CardHeader>
            <CardTitle>FieldBase Component (Advanced Usage)</CardTitle>
            <CardDescription>Base component with custom render props - no built-in character count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldBase
              control={form.control}
              name="description"
              label="Description with Textarea"
              description="Using FieldBase with a custom textarea component"
            >
              {({ field }) => <Textarea id={field.name} placeholder="Enter a longer description..." rows={4} {...field} />}
            </FieldBase>

            <FieldBase control={form.control} name="customField" label="Custom Styled Input" description="FieldBase with custom styling and props">
              {({ field }) => (
                <Input id={field.name} placeholder="Custom input with red border..." className="border-red-300 focus:border-red-500" {...field} />
              )}
            </FieldBase>
          </CardContent>
        </Card>

        {/* Features Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Features Demonstration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">FieldInput Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Character count inside input (right side)</li>
                  <li>✅ Supports all HTML input props</li>
                  <li>✅ Type safety with React Hook Form</li>
                  <li>✅ Built-in validation display</li>
                  <li>✅ Automatic padding when counter is shown</li>
                  <li>✅ Optional description text</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">FieldTextarea Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Character count inside textarea (top right)</li>
                  <li>✅ Supports all HTML textarea props</li>
                  <li>✅ Background overlay for better visibility</li>
                  <li>✅ Type safety with React Hook Form</li>
                  <li>✅ Built-in validation display</li>
                  <li>✅ Automatic padding when counter is shown</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">FieldBase Features:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Flexible render props pattern</li>
                  <li>✅ Works with any input component</li>
                  <li>✅ Clean separation of concerns</li>
                  <li>✅ Full control over rendering</li>
                  <li>✅ Consistent field structure</li>
                  <li>✅ Reusable across different inputs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
