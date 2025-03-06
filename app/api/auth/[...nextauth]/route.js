import NextAuth from "next-auth";
import GitLabProvider from "next-auth/providers/gitlab";

const handler = NextAuth({
    providers: [
        GitLabProvider({
            clientId: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // Добавляем информацию о пользователе в сессию
            session.user.id = token.sub;
            session.user.jti = token.jti;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = user.access_token
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
