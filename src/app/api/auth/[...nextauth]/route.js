import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        text: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
            async authorize(credentials) {
        const inputId = (credentials?.text || credentials?.id || '').trim().toLowerCase();
        const inputPassword = credentials?.password || '';

        // Yahan apni Admin ID aur Password set karein:
        const configuredId = (process.env.ADMIN_ID || 'admin').trim().toLowerCase();
        const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Match check
        if (inputId === configuredId && inputPassword === configuredPassword) {
          return { id: '1', name: 'Admin', role: 'admin' };
        }

        return null;
      
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'khushi-resin-super-secret-jwt-key-999',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

