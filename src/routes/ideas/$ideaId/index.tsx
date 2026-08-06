import {createFileRoute, Link} from '@tanstack/react-router'
import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import type {Idea} from "@/types";
import api from "@/lib/axios"

const fetchIdea = async (ideaId: string): Promise<Idea> => {
    const res = await api.get(`/ideas/${ideaId}`)
    return res.data
}

const ideaQueryOptions = (ideaId: string) =>
    queryOptions({
        queryKey: ['idea', ideaId],
        queryFn: () => fetchIdea(ideaId)
    })


export const Route = createFileRoute('/ideas/$ideaId/')({
    component: IdeaDetailsPage,
    loader: async ({params, context: {queryClient}}) => {
        return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId))
    }
})

function IdeaDetailsPage() {
    const {ideaId} = Route.useParams();
    const {data: idea} = useSuspenseQuery(ideaQueryOptions(ideaId));
    return <div className={`max-w-4xl mx-auto p-4`}>
        <Link to={`/ideas`} className={`text-blue-500 underline block mb-4`}>
            Back to Ideas
        </Link>
        <h2 className={`text-2xl font-bold mb-2`}>
            {idea.title}!
        </h2>
        <p className={`mb-3`}>
            {idea.description}
        </p>
        <div className="mb-3 text-sm uppercase">
            {idea.tags}
        </div>
    </div>
}
