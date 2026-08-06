import { createFileRoute, Link } from '@tanstack/react-router'
import {queryOptions, useSuspenseQueries, useSuspenseQuery} from "@tanstack/react-query";

const fetchIdea = async (ideaId: string) => {
  const res = await fetch(`/api/ideas/${ideaId}`);
  if (!res.ok) throw new Error('Failed to fetch data.');
  return res.json();
}

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId)
  })


export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId))
  }
})

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));
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
