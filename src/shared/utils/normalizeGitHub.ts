import { IGitHub, IGitHubApi } from '@/interfaces/index';

export const normalizeGitHub = (apiResponse: IGitHubApi): IGitHub[] => {
  if (!apiResponse || !Array.isArray(apiResponse)) {
    return [];
  }

  return apiResponse
    .map((repo): IGitHub | null => {
      const {
        node_id,
        name,
        html_url,
        description,
        private: is_private,
        fork,
        updated_at,
      } = repo;

      if (is_private || fork) return null;

      return {
        node_id,
        name,
        html_url,
        description,
        is_private,
        fork,
        updated_at: new Date(updated_at),
      };
    })
    .filter((repo): repo is IGitHub => repo !== null);
};
