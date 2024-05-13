interface WantsFeedArgs {
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  limit: number;
  offset: number;
}

export {WantsFeedArgs};
