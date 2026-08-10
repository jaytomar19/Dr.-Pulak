import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { AdminLoginSchema } from '@/lib/validators';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = AdminLoginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        
        const user = await prisma.admin_users.findUnique({
          where: { email },
        });
        
        if (!user || !user.is_active) return null;
        
        const passwordsMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordsMatch) return null;

        // Update last login timestamp
        await prisma.admin_users.update({
          where: { user_id: user.user_id },
          data: { last_login_at: new Date() },
        });

        return {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }

  // JWT type extension for Auth.js v5
  interface JWT {
    id: string;
    role: string;
  }
}
