import { IGitHubApi, IGitHub } from '@/interfaces/index';

export const normalizeGitHub = (data: IGitHubApi): Array<IGitHub> => {
  return data?.map((repo: IGitHub) => {
    const { id, name, html_url, description, updated_at, private: is_private, fork } = repo;

    if (!is_private && !fork) {
      return {
        id,
        name,
        html_url,
        description,
        updated_at,
        is_private,
        fork
      };
    }
  });
};
