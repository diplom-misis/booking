import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getServerSession, Session } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

export function withAuthPage<P extends { [key: string]: any } = {}>(
  getServerSidePropsFunc?: GetServerSideProps<P>,
): GetServerSideProps<P & { session: Session }> {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P & { session: any }>> => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (!session) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);

      if ("props" in result) {
        return {
          ...result,
          props: {
            ...(result.props as P),
            session,
          },
        };
      }

      return result;
    }

    const safeSession = JSON.parse(JSON.stringify(session));

    return {
      props: { session: safeSession } as P & { session: Session },
    };
  };
}
