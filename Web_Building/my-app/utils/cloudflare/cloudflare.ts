import { z } from 'zod';

const config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
};

const CloudflarePageSchema = z.object({
  url: z.string().url(),
  pageId: z.string(),
  projectName: z.string(),
});

export async function deployToCloudflarePages(data: z.infer<typeof CloudflarePageSchema>) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/pages/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.projectName,
      production_branch: 'main',
    }),
  });

  return response.json();
}