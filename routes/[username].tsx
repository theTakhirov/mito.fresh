/** @jsx h */
import { h } from 'preact';
import { tw } from '@twind';
import { Handlers, PageProps } from '$fresh/server.ts';

interface User {
    name: string;
    blog: string;
    location: string;
    bio: string;
    avatar_url: string;
    html_url: string;
}

export const handler: Handlers<User | null> = {
    async GET(_, ctx) {
        const { username } = ctx.params;
        const resp = await fetch(`https://api.github.com/users/${username}`);

        if (resp.status === 404) {
            return ctx.render(null);
        }

        const user: User = await resp.json();
        return ctx.render(user);
    },
};

export default function Home({ data }: PageProps<User | null>) {
    if (!data) {
        return (
            <div className={tw`w-full h-screen flex items-center justify-center`}>
                <h1 className={tw`text-center text-2xl font-semibold`}>User not found!</h1>
            </div>
        );
    }

    return (
        <div
            className={tw`container flex flex-col justify-center items-center space-y-4 pt-6 mx-auto`}
        >
            <figure className={tw`w-48 h-48 object-cover object-center`}>
                <img
                    src={data.avatar_url}
                    alt={data.name}
                    className={tw`rounded-full select-none pointer-events-none`}
                />
            </figure>

            <h4 className={tw`text-2xl font-semibold`}>{data.name}</h4>

            <p className={tw`max-w-[240px] text-lg font-thin`}>{data.bio}</p>

            <ul className={tw`w-[275px]`}>
                <li>Location: {data.location}</li>
                <li>
                    Website:
                    <a className={tw`ml-2 hover:underline`} href={data.blog} target='_blank'>
                        {data.blog}
                    </a>
                </li>
                <li>
                    Github:
                    <a className={tw`ml-2 hover:underline`} href={data.html_url} target='_blank'>
                        {data.html_url}
                    </a>
                </li>
            </ul>
        </div>
    );
}
