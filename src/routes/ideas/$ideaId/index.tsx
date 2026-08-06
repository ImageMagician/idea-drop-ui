import { createFileRoute } from '@tanstack/react-router'

const fetchIdea = async (ideaId: string) => {
  const res = await fetch(`/api/ideas/${ideaId}`);
  if (!res.ok) throw new Error('Failed to fetch data.');
  return res.json();
}

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({ params }) => {
    return fetchIdea(params.ideaId)
  }
})

function IdeaDetailsPage() {
  const idea = Route.useLoaderData();
  return <div className={`max-w-4xl mx-auto py-8`}>
    <h1 className={`text-2xl font-bold mb-3`}>
      {idea.title}!
    </h1>
    <div className="mb-3 text-sm uppercase">
      {idea.tags}
    </div>
    <p>
      {idea.description}
    </p>
  </div>
}
