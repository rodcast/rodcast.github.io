import { IGitHubApi, IGitHub } from '@/interfaces/index';

export const normalizeGitHub = (data: IGitHubApi): Array<IGitHub> => {
  return data?.map((repo: IGitHub) => {
    const { node_id, name, html_url, description, updated_at, private: is_private, fork } = repo;

    if (!is_private && !fork) {
      return {
        node_id,
        name,
        html_url,
        description,
        is_private,
        fork
      };
    } else {
      return null;
    }
  }).filter(Boolean);
};
