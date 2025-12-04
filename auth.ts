// auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Define a type matching your database user
interface DbUser {
  id: string;
  email: string;
  name: string;
  password: string;
  account_type: 'artisan' | 'customer';
}

async function getUser(email: string): Promise<DbUser | undefined> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email=${email}
    ` as DbUser[];
    return users[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) {
            console.log('User not found');
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Return user object without password
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accountType: user.account_type,
            };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Add account_type to token on sign in
      if (user) {
        token.accountType = (user as any).accountType;
      }
      return token;
    },
    async session({ session, token }) {
      // Add account_type and id to session
      if (session.user) {
        (session.user as any).accountType = token.accountType;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
});