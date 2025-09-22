
export interface DetectedObject {
  name: string; // e.g., "car", "person", "wall", "stairs"
  distance: 'immediate' | 'near' | 'medium' | 'far'; // ~0-2ft, 2-10ft, 10-30ft, 30ft+
  position: 'left' | 'center' | 'right' | 'full'; // Position in frame
  urgency: 'low' | 'medium' | 'high'; // Urgency level for the alert
}

export interface DetectionResponse {
  objects: DetectedObject[];
  summary: string; // A brief summary, e.g., "Clear path ahead." or "Multiple obstacles detected."
}
