
export enum ContentType {
  Meme = 'meme',
  Poster = 'poster',
}

export interface MemeText {
  id: string;
  text: string;
  position: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
  isDragging: boolean;
  isResizable: boolean;
  fontSize?: number; // percentage of canvas width
  color?: string;
}
