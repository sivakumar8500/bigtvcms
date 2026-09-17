export interface AppConfigData {
  id: string;
  key: string;
  webEnable: boolean;
  folkNight: boolean;
  cricket: boolean;
  eventsEnable: boolean;
  bannersEnable: boolean;
  language: boolean;
  aitag: boolean;
  videos: boolean;
  epaper: boolean;
  livetvvideos: boolean;
  extraFlags: {
    betaSearch: boolean;
    maintenanceMode: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AppConfigResponse {
  success: boolean;
  data: AppConfigData[];
  timestamp: string;
}
