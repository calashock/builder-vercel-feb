import { builder, BuilderComponent } from '@builder.io/react';
import { GetServerSideProps } from 'next';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

async function getContent() {
    const content = await builder
        .get('page', { userAttributes: { urlPath: '/' } })
        .toPromise();
    return content;
}

export default async function Page() {
    const content = await getContent();

    return (
        <div>
            {content ? (
                <BuilderComponent model="page" content={content} />
            ) : (
                <h1>Page Not Found</h1>
            )}
        </div>
    );
}
