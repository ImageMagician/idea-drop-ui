import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient } from "@tanstack/react-query";

import '../styles.css'

type RouterContext = {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
    head:() => ({
        meta: [
            {
                name: 'description',
                content: 'Share, explore, and build the best startup ideas and side hustles.'
            },
            {
                title: 'IdeaDrop - Your Idea Hub'
            }
        ]
    }),
  component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <HeadContent/>
            <Outlet/>
            <TanStackDevtools
                config={{
                    position: 'bottom-right',
                }}
                plugins={[
                    {
                        name: 'TanStack Router',
                        render: <TanStackRouterDevtoolsPanel/>,
                    },
                ]}
            />
        </>
    )
}
