'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Review } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ------------------------------
// INVOICE SCHEMA DEFINITIONS
// ------------------------------
const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoiceSchema = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoiceSchema = InvoiceFormSchema.omit({ id: true, date: true });

// ------------------------------
// CREATE INVOICE
// ------------------------------
export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: InvoiceState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// ------------------------------
// UPDATE INVOICE
// ------------------------------
export async function updateInvoice(
  id: string,
  prevState: InvoiceState,
  formData: FormData,
) {
  const validatedFields = UpdateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// ------------------------------
// DELETE INVOICE
// ------------------------------

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// ------------------------------
// DEFINE FORM SCHEMA
// ------------------------------
const ProductFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Please enter a product name.' }),

  description: z
    .string()
    .min(1, { message: 'Please enter a product description.' }),

  image_url: z
    .string()
    .min(1, 'Please enter an image URL.')
    .refine(
      (val) => /^\/|^https?:\/\//.test(val),
      'Use a relative path like /products/product.jpg or a full URL.'
    ),

  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter a price greater than $0.' }),
});


// Derived schemas
const CreateProductSchema = ProductFormSchema.omit({ id: true });
const UpdateProductSchema = ProductFormSchema.pick({
  name: true,
  image_url: true,
  price: true,
  description: true,
});

// ------------------------------
// CREATE PRODUCT
// ------------------------------
export type ProductState = {
  errors?: {
    name?: string[];
    image_url?: string[];
    price?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: ProductState, formData: FormData) {
  const validatedFields = CreateProductSchema.safeParse({
    name: formData.get('name'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, image_url, price, description } = validatedFields.data;

  try {
    await sql`
      INSERT INTO products (name, image_url, price, description)
      VALUES (${name}, ${image_url}, ${price}, ${description})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Product.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

// ------------------------------
// UPDATE PRODUCT
// ------------------------------
export async function updateProduct(
  id: string,
  prevState: ProductState,
  formData: FormData,
) {
  const validatedFields = UpdateProductSchema.safeParse({
    name: formData.get('name'),
    image_url: formData.get('image_url'),
    price: formData.get('price'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { name, image_url, price, description } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET name = ${name}, image_url = ${image_url}, price = ${price}, description = ${description}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

// ------------------------------
// DELETE PRODUCT
// ------------------------------
export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Database Error: Failed to Delete Product.');
  }
  revalidatePath('/dashboard/products');
}

// ------------------------------
// AUTHENTICATE
// ------------------------------

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: formData.get('redirectTo') as string || '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// ------------------------------
// SUBMIT REVIEW
// ------------------------------

export async function submitReview(
  productId: string,
  content: string,
  userId: string
): Promise<Review & { user_name: string }> {
  try {
    // Insert the review
    const [review] = await sql<Review[]>`
      INSERT INTO reviews (product_id, user_id, content)
      VALUES (${productId}, ${userId}, ${content})
      RETURNING id, product_id, user_id, content;
    `;

    // Fetch the user's name
    const [user] = await sql<{ name: string }[]>`
      SELECT name FROM users WHERE id = ${userId};
    `;

    return {
      ...review,
      user_name: user?.name || `User ${userId}`,
    };
  } catch (error) {
    console.error('Failed to submit review:', error);
    throw new Error('Database Error: Failed to submit review.');
  }
}