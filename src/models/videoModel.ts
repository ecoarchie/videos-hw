export type VideoModel = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean; // default false
  minAgeRestriction: number | null; // min 1, max 18, default null (no restriction)
  createdAt: string;
  publicationDate: string; // default +1 day from createdAt
  availableResolutions: Array<string>;
};
