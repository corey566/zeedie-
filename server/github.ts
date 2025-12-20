import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function getGitHubUsername() {
  try {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.users.getAuthenticated();
    return data.login;
  } catch (error) {
    console.error('Failed to get GitHub username:', error);
    return null;
  }
}

export async function getGitHubContributions(username: string) {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get contribution data for the last 180 days
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
    
    // GitHub GraphQL API query for contribution calendar
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username,
      from: sixMonthsAgo.toISOString(),
      to: today.toISOString()
    };

    const result: any = await octokit.graphql(query, variables);
    
    const contributions = result.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays)
      .map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].indexOf(day.contributionLevel)
      }));

    return contributions;
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return null;
  }
}
