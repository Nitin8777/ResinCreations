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
        const inputId = (credentials?.text || credentials?.email || credentials?.id || credentials?.username || '').trim().toLowerCase();
        const inputPassword = (credentials?.password || '').trim();

        // Environment variables: ADMIN_ID or ADMIN_EMAIL
        const configuredId = (process.env.ADMIN_ID || process.env.ADMIN_EMAIL || 'admin').trim().toLowerCase();
        const configuredPassword = (process.env.ADMIN_PASSWORD || 'nitin').trim();

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

