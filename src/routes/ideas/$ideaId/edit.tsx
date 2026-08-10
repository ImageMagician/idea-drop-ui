import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useSuspenseQuery, queryOptions } from '@tanstack/react-query'
import { fetchIdea, updateIdea } from "#/api/ideas.ts";

const ideaQueryOptions = (id:string) => queryOptions({
    queryKey: ['idea', 'id'],
    queryFn: () => fetchIdea(id),
})

export const Route = createFileRoute('/ideas/$ideaId/edit')({
  component: IdeaEditPage,
    loader: async ({ params, context: { queryClient } }) => {
        return queryClient.ensureQueryData( ideaQueryOptions( params.ideaId ) )
    }
})

function IdeaEditPage() {
    const { ideaId } = Route.useParams()
    const navigate = useNavigate()
    const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId))

    const [title, setTitle]             = useState( idea.title )
    const [summary, setSummary]         = useState( idea.summary )
    const [description, setDescription] = useState( idea.description )
    const [tagsInput, setTagsInput]          = useState( idea.tags.join(', ') )

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => updateIdea(ideaId,  {
            title,
            summary,
            description,
            tags: tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
        }),
        onSuccess: () => {
            navigate({
                to: '/ideas/$ideaId', params: {ideaId}
            })
        }
    })

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        await mutateAsync()
    }

  return (
      <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                  Edit Idea
              </h1>
              <Link to="/ideas/$ideaId"
                    params={{ideaId}}
                    className={`border-gray-300 hover:border-gray-500 text-gray-800 border font-bold px-4 py-1 text-sm rounded transition`}
              >
                  Back
              </Link>
          </div>

          <form className={`space-y-4`}
                onSubmit={ handleSubmit }
          >
              <div className={`mb-4`}>
                  <label htmlFor="title"
                         className="block text-gray-700 font-medium mb-1"
                  >
                      Title
                  </label>
                  <input type="text"
                         id="title"
                         name="title"
                         placeholder="Ender idea title"
                         value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
              </div>
              <div className={`mb-4`}>
                  <label htmlFor="summary"
                         className="block text-gray-700 font-medium mb-1"
                  >
                      Summary
                  </label>
                  <input type="text"
                         id="summary"
                         name="summary"
                         placeholder="Ender idea summary"
                         value={summary}
                         onChange={(e) => setSummary(e.target.value)}
                         className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
              </div>
              <div className={`mb-4`}>
                  <label htmlFor="description"
                         className="block text-gray-700 font-medium mb-1"
                  >
                      Description
                  </label>
                  <textarea
                      id="description"
                      name="description"
                      placeholder="Ender idea summary"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-36`}
                  />
              </div>
              <div className={`mb-4`}>
                  <label htmlFor="tags"
                         className="block text-gray-700 font-medium mb-1"
                  >
                      Tags
                  </label>
                  <input type="text"
                         id="tags"
                         name="tags"
                         placeholder="Optional tags, comma separated"
                         value={ tagsInput }
                         onChange={ (e) => setTagsInput(e.target.value) }
                         className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
              </div>
              <div>
                  <button
                      type="submit"
                      className={`block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isPending}
                  >
                      { isPending ? 'Updating...' : 'Update Idea' }
                  </button>
              </div>
          </form>
      </div>
  )
}
