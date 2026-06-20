export interface IGitHub {
  node_id: string;
  name: string;
  html_url: string;
  description: string;
  updated_at: string;
  is_private?: boolean;
  private?: boolean;
  fork?: boolean;
}

export interface IGitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: License | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export type IGitHubApi = IGitHubRepo[];

interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}
