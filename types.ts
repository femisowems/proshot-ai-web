
export enum AppStep {
  UPLOAD = 'UPLOAD',
  STYLE = 'STYLE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}

export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  prompt: string;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}
