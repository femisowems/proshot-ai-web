
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Studio',
    description: 'Clean grey backdrop with soft professional studio lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    prompt: 'High-end corporate headshot, photorealistic 8k resolution. Subject centered, chest-up. Background: Clean solid neutral grey studio backdrop. Lighting: Soft, diffused professional studio lighting (Rembrandt or butterfly), slight rim light to separate subject from background. Attire: Professional business suit or formal wear. Expression: Confident, approachable, subtle smile. Camera: 85mm portrait lens, f/2.8, sharp focus on eyes, natural skin texture, no airbrushing artifacts.'
  },
  {
    id: 'tech-office',
    name: 'Modern Tech',
    description: 'Modern glass office background with bright natural light.',
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    prompt: 'Modern tech industry headshot, photorealistic 8k. Subject chest-up. Background: Blurred modern open-plan office (bokeh), glass walls, bright and airy, hints of greenery. Lighting: Soft natural window light wrapping around face, high-key. Attire: Smart casual, tech-startup aesthetic (e.g., high-quality t-shirt with blazer, or modern shirt). Expression: Friendly, innovative, relaxed confidence. Camera: 50mm lens, f/1.8, creamy background blur, sharp eyes.'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Lifestyle',
    description: 'Soft blurred city or park background with warm sunlight.',
    previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    prompt: 'Outdoor lifestyle professional headshot, photorealistic 8k. Subject chest-up. Background: Softly blurred urban park or city street, golden hour execution. Lighting: Warm natural sunlight, back-lit with soft reflector fill on face. Attire: Smart casual, approachable yet professional layer. Expression: Genuine, warm smile, engaging. Camera: 85mm lens, f/2.0, beautiful circular bokeh, vibrant but natural color grading.'
  },
  {
    id: 'dark-minimal',
    name: 'Executive Dark',
    description: 'Moody, high-contrast lighting with a dark professional background.',
    previewUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    prompt: 'Dramatic executive portrait, photorealistic 8k. Subject chest-up. Background: Dark charcoal or matte black seamless background. Lighting: Moody, high-contrast lighting (chiaroscuro), strong key light, dramatic shadows, edge lighting to define silhouette. Attire: Dark tailored suit, sophisticated and premium. Expression: Serious, commanding, visionary, intense gaze. Camera: 105mm lens, f/4.0, hyper-sharp focus, cinematic color grading.'
  },
  {
    id: 'studio-minimal',
    name: 'Studio Minimal',
    description: 'Crisp white background with high-key professional lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
    prompt: 'Clean minimalist headshot, photorealistic 8k. Subject chest-up. Background: Pure white or very light off-white seamless cyclorama. Lighting: High-key fashion/beauty lighting, very soft, minimal shadows, ring light or large softbox usage. Attire: Modern minimalist, block colors, sharp lines. Expression: Fresh, energetic, clear. Camera: 50mm lens, f/5.6, deep depth of field, bright and clean aesthetic.'
  },
  {
    id: 'warm-executive',
    name: 'Warm Executive',
    description: 'Blurred bookshelf background with warm, inviting tones.',
    previewUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    prompt: 'Warm executive portrait, photorealistic 8k. Subject chest-up. Background: Softly blurred executive office with mahogany bookshelves, leather books, warm practical lamps. Lighting: Warm ambient indoor lighting, tungsten tones, cozy yet professional. Attire: Business professional, textured fabrics (wool, tweed, or dark suit). Expression: Wise, experienced, trustworthy, calm. Camera: 85mm lens, f/2.0, creamy bokeh, cinematic warmth.'
  },
  {
    id: 'creative-color',
    name: 'Creative Color',
    description: 'Solid bold color background with artistic studio lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400&h=400&fit=crop',
    prompt: 'Artistic creative headshot, photorealistic 8k. Subject chest-up. Background: Solid vibrant paper backdrop (deep blue, mustard yellow, or terracotta). Lighting: Pop-art style studio lighting, hard light or colored gels (optional), distinct shadows. Attire: Creative, bold patterns, or fashion-forward accessories. Expression: Dynamic, quirky, or intense. Camera: 35mm lens, f/4.0, sharp, high contrast, editorial logic.'
  },
  {
    id: 'black-white',
    name: 'Black & White',
    description: 'Timeless high-contrast black and white portrait.',
    previewUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
    prompt: 'Classic monochrome portrait, photorealistic 8k, Black and White. Subject chest-up. Background: Dark grey or black. Lighting: Dramatic Hollywood-style lighting, high contrast, sculpting the face. Attire: Classic formal, turtleneck, or simple solid dark clothing. Expression: Timeless, soulful, strong. Camera: 85mm lens, f/2.8, focus on texture and form, Ansel Adams zone system tonality.'
  }
];
