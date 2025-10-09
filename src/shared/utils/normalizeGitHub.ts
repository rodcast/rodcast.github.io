import { IGitHub, IGitHubApi } from '@/interfaces/index';

export const normalizeGitHub = (repos?: IGitHubApi): IGitHub[] => {
  if (!repos || !Array.isArray(repos)) {
    return [];
  }

  return repos
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
        description: description || '',
        is_private,
        fork,
        updated_at: new Date(updated_at),
      };
    })
    .filter((repo): repo is IGitHub => repo !== null);
};
