import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { fetchIdea, deleteIdea } from "@/api/ideas.ts";

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

    const navigate = useNavigate();

    const { mutateAsync: deleteMutate, isPending } = useMutation({
        mutationFn: () => deleteIdea(ideaId),
        onSuccess: ()=> {
            navigate({to: '/ideas'})
        }
    });

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this idea?');

        if (confirmDelete) {
            await deleteMutate();
        }
    }

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
        <button
            onClick={ handleDelete }
            disabled={ isPending }
            className="text-sm bg-red-600 hover:bg-red-700 text-white mt-4 px-4 py-2 rounded transition disabled:opacity-50">
            { isPending ? 'Deleting...' : "Delete"}
        </button>
    </div>
}
