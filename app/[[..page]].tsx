import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

// Types
interface PageProps {
  page?: string;
}

interface BuilderPage {
  data: {
    page: string;
  };
}

// Your Builder.io API key (replace with your actual key)
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

export default function Page({ page }: PageProps) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();
  
  // Determine the page ID. This handles both static and dynamic routes.
  const pageId = router.asPath === '/' ? 'home' : router.asPath.slice(1); // Adjust as needed for your routing

  if (!BUILDER_API_KEY) {
    return <div>Please set the NEXT_PUBLIC_BUILDER_API_KEY environment variable.</div>;
  }

  return (
    <div>
      <BuilderComponent
        model="page" // Your Builder.io model name
        apiKey={BUILDER_API_KEY}
        contentQuery={{
          // Query Builder for the correct page
          page: pageId, // Assuming you have a 'page' field in your Builder.io content
        }}
        // Optionally pass in a URL to handle A/B testing or other dynamic contexts.
        // url: router.asPath,
        // Handle previewing. This is important for the Builder.io editor to work correctly.
        previewing={isPreviewing}
        // Handle errors gracefully
        onContentError={(error: Error) => {
          console.error('Error fetching Builder.io content:', error);
          // Optionally display a fallback component or message
          return <div>Error loading content.</div>;
        }}
        // Optionally pass in a loading component
        loading={<div>Loading...</div>}
      />
    </div>
  );
}

// This function gets called at build time on server-side.
// For static pages, this generates the HTML at build time.
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all pages from Builder.io (or however you want to generate paths)
  const pages = await fetchPageSlugsFromBuilder();
  
  const paths = pages.map((page) => ({
    params: { page: page === 'home' ? [] : [page] }, // Handle the home page specifically
  }));

  return {
    paths,
    fallback: 'blocking', // or 'false' if you don't want to generate pages on demand
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  // You might fetch additional data here if needed for your pages.
  // For example, you could fetch data based on the 'page' parameter.
  const page = params?.page?.[0] || 'home';

  return {
    props: {
      // Pass any additional props your page needs
      page,
    },
    revalidate: 60, // Optional: revalidate every 60 seconds
  };
};

// Helper function (replace with your actual implementation)
async function fetchPageSlugsFromBuilder(): Promise<string[]> {
  // Example using the Builder.io Content API (you'll need your API key)
  const apiKey = process.env.BUILDER_IO_API_KEY;
  
  try {
    const res = await fetch(
      `https://cdn.builder.io/api/v1/content?apiKey=${apiKey}&query.data.published=true&limit=100&fields=data.page`
    );
    
    const data = await res.json();
    const results = data.results as BuilderPage[];
    
    if (!results) {
      return ['home']; // Default to home page
    }
    
    return results
      .map((item) => item.data.page)
      .filter((page): page is string => Boolean(page));
  } catch (error) {
    console.error('Error fetching pages from Builder.io:', error);
    return ['home']; // Fallback to home page on error
  }
}
