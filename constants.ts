
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Studio',
    description: 'Clean grey backdrop with soft professional studio lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    prompt: 'A professional high-end corporate headshot, solid soft grey studio backdrop, wearing formal business attire, soft cinematic studio lighting, sharp focus, 8k resolution, professional photography.'
  },
  {
    id: 'tech-office',
    name: 'Modern Tech',
    description: 'Modern glass office background with bright natural light.',
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    prompt: 'A modern professional headshot in a bright tech office with glass partitions and soft bokeh greenery in the background, smart casual attire, natural daytime lighting, modern professional aesthetic.'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Lifestyle',
    description: 'Soft blurred city or park background with warm sunlight.',
    previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    prompt: 'An outdoor professional lifestyle headshot, blurred urban park background, warm golden hour natural lighting, wearing a stylish blazer, friendly and approachable expression, high depth of field.'
  },
  {
    id: 'dark-minimal',
    name: 'Executive Dark',
    description: 'Moody, high-contrast lighting with a dark professional background.',
    previewUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    prompt: 'Executive dramatic headshot, dark charcoal textured background, high contrast Rembrandt lighting, sharp professional focus, wearing a dark suit, powerful and sophisticated atmosphere.'
  }
];
