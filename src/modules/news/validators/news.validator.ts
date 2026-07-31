import { z } from 'zod';
import { extractBulletPoints } from '@/shared/utils/bullet.utils';
import { formatLinks, formatLinksAndContent } from '@/shared/utils/link.utils';

export const commonNewsPostSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title is required'),
  notificationtitle: z.string({ required_error: 'Notification title is required' }).trim().min(1, 'Notification title is required'),
  imagetitel: z.string({ required_error: 'Image title is required' }).trim().min(1, 'Image title is required'),
  content: z.string({ required_error: 'Content is required' }).trim().min(1, 'Content is required'),
  image_url: z.string({ required_error: 'Image URL is required' }).trim().min(1, 'Image URL is required'),
  categoryName: z
    .array(z.string().trim().min(1), { required_error: 'Category name is required' })
    .min(1, 'At least one category name is required'),
  language_id: z
    .number({ required_error: 'Language ID is required', invalid_type_error: 'Language ID must be a number' })
    .positive('Language ID must be a positive integer'),
  language_code: z.string({ required_error: 'Language code is required' }).trim().min(1, 'Language code is required'),
  category_ids: z
    .array(z.number().positive(), { required_error: 'Category IDs are required' })
    .min(1, 'At least one category ID is required'),
  type: z.string({ required_error: 'Type is required' }).trim().min(1, 'Type is required'),
  subType: z.string().default(''),

  // Default values
  isStickyPost: z.boolean().default(false),
  draft: z.boolean().default(false),
  trash: z.boolean().default(false),
  isWebPost: z.boolean().default(false),
  video_platform: z.string().default(''),
  video_url: z.string().default(''),
  postUrl: z.string().default(''),
  links: z.union([z.array(z.any()), z.string()]).default([]),
  bulletPoints: z.array(z.string()).default([]),

  // Optional / metadata fields
  created: z.string().optional(),
  totalLikes: z.number().optional().default(0),
  totalViews: z.number().optional().default(0),
  totalComments: z.number().optional().default(0),
  gallery: z.array(z.string()).optional().default([]),
  totalShares: z.number().optional().default(0),
  isReporter: z.boolean().optional().default(false),
  reportedBy: z.string().optional().default(''),
  linkURLAndroid: z.string().optional().default(''),
  linkURLIos: z.string().optional().default(''),
  isBookmarked: z.array(z.string()).optional().default([]),
  postOrder: z.number().optional().default(0),
  schedule: z.string().optional(),
  location_ids: z.array(z.number()).optional().default([]),
  aitag_ids: z.array(z.number()).optional().default([]),
});

export const createNewsPostSchema = z.preprocess((val: any) => {
  if (!val || typeof val !== 'object') return val;
  const input = { ...val };
  if (!input.post_type && input.type) input.post_type = input.type;
  if (!input.type && input.post_type) input.type = input.post_type;
  if (input.language_id === undefined && input.languageId !== undefined) input.language_id = input.languageId;
  if (input.language_code === undefined && input.languageCode !== undefined) input.language_code = input.languageCode;
  if (input.category_ids === undefined && input.categoryIds !== undefined) input.category_ids = input.categoryIds;
  if (input.is_sticky !== undefined && input.isStickyPost === undefined) input.isStickyPost = input.is_sticky;
  if (input.is_web_post !== undefined && input.isWebPost === undefined) input.isWebPost = input.is_web_post;
  if (input.imageUrl !== undefined && input.image_url === undefined) input.image_url = input.imageUrl;
  if (input.videoUrl !== undefined && input.video_url === undefined) input.video_url = input.videoUrl;
  if (input.videoPlatform !== undefined && input.video_platform === undefined) input.video_platform = input.videoPlatform;

  if (input.video_platform && (String(input.video_platform).toLowerCase() === 'x' || String(input.video_platform).toLowerCase() === 'twitter')) {
    input.video_platform = 'Twitter';
  }
  if (input.videoPlatform && (String(input.videoPlatform).toLowerCase() === 'x' || String(input.videoPlatform).toLowerCase() === 'twitter')) {
    input.videoPlatform = 'Twitter';
    input.video_platform = 'Twitter';
  }

  if (input.type === 'StandardLink' || input.post_type === 'StandardLink' || input.type === 'Standard Link') {
    input.type = 'Standed';
    input.post_type = 'Standed';
    input.subType = 'StandardLink';
  } else if (
    input.type === 'BigBlackStanded' ||
    input.post_type === 'BigBlackStanded' ||
    input.type === 'BigBlack Standed' ||
    input.type === 'Big Black Standed'
  ) {
    input.type = 'Standed';
    input.post_type = 'Standed';
    input.subType = 'BigBlackStanded';
  } else if (input.type === 'Video' || input.post_type === 'Video') {
    input.type = 'Video';
    input.post_type = 'Video';
    input.subType = '';
  }

  if ((input.type === 'Standed' || input.post_type === 'Standed') && input.subType === 'BulletPost') {
    if ((!input.bulletPoints || input.bulletPoints.length === 0) && input.content) {
      input.bulletPoints = extractBulletPoints(input.content);
    }
  }

  if ((input.type === 'Standed' || input.post_type === 'Standed') && input.subType === 'StandardLink') {
    const formatted = formatLinksAndContent(input.links, input.content);
    input.links = formatted.links;
    input.content = formatted.content;
  }

  return input;
}, commonNewsPostSchema.superRefine((data, ctx) => {
  const postType = data.type || (data as any).post_type;
  if (postType === 'Standed') {
    if (data.subType !== '' && data.subType !== 'BulletPost' && data.subType !== 'StandardLink' && data.subType !== 'BigBlackStanded') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subType'],
        message: "subType must be empty, 'BulletPost', 'StandardLink', or 'BigBlackStanded' for Standard post",
      });
    }

    if (data.subType === 'BulletPost') {
      if (!data.bulletPoints || data.bulletPoints.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bulletPoints'],
          message: 'At least one bullet point is required for BulletPost',
        });
      }
    } else if (data.subType === 'StandardLink') {
      if (!Array.isArray(data.links) || data.links.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['links'],
          message: 'At least one valid link object is required for StandardLink',
        });
      }
      if (Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bulletPoints'],
          message: 'bulletPoints must be empty for StandardLink post',
        });
      }
    } else if (data.subType === 'BigBlackStanded') {
      if (Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bulletPoints'],
          message: 'bulletPoints must be empty for BigBlackStanded post',
        });
      }
    } else if (data.subType === '') {
      if (Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bulletPoints'],
          message: 'bulletPoints must be empty for regular Standard post',
        });
      }
    }

    if (data.isWebPost !== false) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['isWebPost'],
        message: 'isWebPost must be false for Standard post',
      });
    }
    if (data.postUrl !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postUrl'],
        message: 'postUrl must be empty for Standard post',
      });
    }
    if (data.video_platform !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video_platform'],
        message: 'video_platform must be empty for Standard post',
      });
    }
    if (data.video_url !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video_url'],
        message: 'video_url must be empty for Standard post',
      });
    }
    if (data.subType !== 'StandardLink') {
      const linksEmpty = Array.isArray(data.links) ? data.links.length === 0 : data.links === '';
      if (!linksEmpty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['links'],
          message: 'links must be empty for Standard post',
        });
      }
    }
  } else if (postType === 'Video') {
    if (!data.video_platform || data.video_platform.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video_platform'],
        message: 'video_platform is required for Video post',
      });
    }
    if (!data.video_url || data.video_url.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video_url'],
        message: 'video_url is required for Video post',
      });
    }
    if (data.subType !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subType'],
        message: 'subType must be empty for Video post',
      });
    }
    if (data.isWebPost !== false) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['isWebPost'],
        message: 'isWebPost must be false for Video post',
      });
    }
    if (data.postUrl !== '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postUrl'],
        message: 'postUrl must be empty for Video post',
      });
    }
    if (Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bulletPoints'],
        message: 'bulletPoints must be empty for Video post',
      });
    }
    const linksEmpty = Array.isArray(data.links) ? data.links.length === 0 : data.links === '';
    if (!linksEmpty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['links'],
        message: 'links must be empty for Video post',
      });
    }
  }
}));

export type CreateNewsPostFormData = z.infer<typeof createNewsPostSchema>;

export function validateCreateNewsPost(data: unknown): CreateNewsPostFormData {
  return createNewsPostSchema.parse(data);
}
