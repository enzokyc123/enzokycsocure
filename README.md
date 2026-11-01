# DocV site on Vercel

1. Upload this folder to a new GitHub repo.
2. vercel.com > Add New > Project > import the repo. Framework preset: Other. Leave build settings empty.
3. Before deploying (or after, then Redeploy): Project > Storage > Marketplace > Upstash Redis (free) > connect to this project.
4. Project > Settings > Environment Variables: add SOCURE_API_KEY, SOCURE_SDK_KEY, SOCURE_WORKFLOW_NAME.
5. Redeploy. Your URL looks like https://your-project.vercel.app
6. In the Socure dashboard, register the webhook: https://your-project.vercel.app/api/webhook (event: evaluation_completed)
7. Test in the sandbox.
