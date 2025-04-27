import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export function withoutAuthPage<P extends { [key: string]: any } = {}>(
  getServerSidePropsFunc?: GetServerSideProps<P>,
): GetServerSideProps<P> {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (session) {
      return {
        redirect: {
          destination: "/profile",
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      return getServerSidePropsFunc(context);
    }

    return {
      props: {} as P,
    };
  };
}
