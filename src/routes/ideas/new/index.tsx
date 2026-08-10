import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// import type { Idea } from "@/types";
import {createIdea} from "@/api/ideas";

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
})

function NewIdeaPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({to: '/ideas'})
    }
  })

  const handleSubmit = async(e:React.SubmitEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !description.trim() || !tags.trim()) {
      alert('Please fill in all fields.');
      return
    }

    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.trim() !== ''),
      })
    }
    catch (error) {
      console.error(error);
      alert('There was an error creating new Idea');
    }
  }

  return <div className="space-y-6">
    <h1 className="text-3xl font-bold mb-6">
      Create New Idea
    </h1>

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
               className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
               value={tags}
               onChange={(e) => setTags(e.target.value)}
               className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div>
        <button
            type="submit"
            className={`block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={ isPending }
        >
          { isPending ? "Creating..." : 'Create Idea' }
        </button>
      </div>
    </form>
  </div>
}
