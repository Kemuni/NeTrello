import NextAuth from "next-auth";
import GitLabProvider from "next-auth/providers/gitlab";

const handler = NextAuth({
    providers: [
        GitLabProvider({
            clientId: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "read_user read_api read_repository write_repository api read_api",
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            session.user.id = token.sub;
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.id = user.id;
                token.accessToken = account.access_token
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
