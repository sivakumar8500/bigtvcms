import { validateCreateNewsPost } from '../validators/news.validator';

describe('News Validator - Create Post Validation', () => {
  const validStandardPostBody = {
    title: 'Standard Post Title',
    notificationtitle: 'Breaking News Notification',
    imagetitel: 'News Image Caption',
    content: 'Standard post content body goes here.',
    created: '2026-07-31T09:06:28.905Z',
    totalLikes: 0,
    totalViews: 0,
    totalComments: 0,
    image_url: 'https://example.com/image.jpg',
    video_url: '',
    video_platform: '',
    gallery: [],
    totalShares: 0,
    isReporter: false,
    reportedBy: '',
    categoryName: ['Politics'],
    postUrl: '',
    subType: '',
    isStickyPost: false,
    linkURLAndroid: '',
    linkURLIos: '',
    links: [],
    bulletPoints: [],
    isBookmarked: [],
    postOrder: 0,
    draft: false,
    trash: false,
    schedule: '2026-07-31T09:06:28.905Z',
    language_id: 1,
    language_code: 'en',
    category_ids: [1],
    location_ids: [],
    aitag_ids: [],
    type: 'Standed',
    is_sticky: false,
    isWebPost: false,
  };

  describe('Standard Post ("Standed") - Success Cases', () => {
    it('should successfully validate a valid Standard Post body', () => {
      const validated = validateCreateNewsPost(validStandardPostBody);
      expect(validated.title).toBe('Standard Post Title');
      expect(validated.type).toBe('Standed');
      expect(validated.subType).toBe('');
      expect(validated.isWebPost).toBe(false);
      expect(validated.postUrl).toBe('');
      expect(validated.video_platform).toBe('');
      expect(validated.video_url).toBe('');
      expect(validated.links).toEqual([]);
      expect(validated.bulletPoints).toEqual([]);
      expect(validated.language_id).toBe(1);
      expect(validated.language_code).toBe('en');
      expect(validated.category_ids).toEqual([1]);
    });

    it('should normalize type -> post_type and languageId -> language_id', () => {
      const payload = {
        ...validStandardPostBody,
        type: 'Standed',
        post_type: undefined,
        languageId: 2,
        language_id: undefined,
        languageCode: 'te',
        language_code: undefined,
        categoryIds: [10],
        category_ids: undefined,
      };
      const validated = validateCreateNewsPost(payload);
      expect(validated.type).toBe('Standed');
      expect(validated.language_id).toBe(2);
      expect(validated.language_code).toBe('te');
      expect(validated.category_ids).toEqual([10]);
    });
  });

  describe('Common Required Fields Validation', () => {
    it('should throw validation error when title is missing or empty', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, title: '' })).toThrow(
        /Title is required/
      );
    });

    it('should throw validation error when notificationtitle is missing or empty', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, notificationtitle: '  ' })
      ).toThrow(/Notification title is required/);
    });

    it('should throw validation error when imagetitel is missing or empty', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, imagetitel: '' })).toThrow(
        /Image title is required/
      );
    });

    it('should throw validation error when content is missing or empty', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, content: '' })).toThrow(
        /Content is required/
      );
    });

    it('should throw validation error when image_url is missing or empty', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, image_url: '' })).toThrow(
        /Image URL is required/
      );
    });

    it('should throw validation error when categoryName is empty array', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, categoryName: [] })).toThrow(
        /At least one category name is required/
      );
    });

    it('should throw validation error when language_id is missing or non-positive', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, language_id: 0 })).toThrow(
        /Language ID must be a positive integer/
      );
    });

    it('should throw validation error when language_code is empty', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, language_code: '' })).toThrow(
        /Language code is required/
      );
    });

    it('should throw validation error when category_ids is empty array', () => {
      expect(() => validateCreateNewsPost({ ...validStandardPostBody, category_ids: [] })).toThrow(
        /At least one category ID is required/
      );
    });
  });

  describe('Standard Post Validation Rules ("Standed")', () => {
    it('should throw error when subType is invalid (neither empty nor BulletPost)', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, subType: 'invalidType' })
      ).toThrow(/subType must be empty, 'BulletPost', 'StandardLink', or 'BigBlackStandard' for Standard post/);
    });

    it('should successfully validate BulletPost with explicit bulletPoints', () => {
      const bulletPayload = {
        ...validStandardPostBody,
        type: 'Standed',
        subType: 'BulletPost',
        bulletPoints: [
          'అవకాడో ఉదయం తినడం మంచిది.',
          'జామపండు మధ్యాహ్నం తీసుకోవాలి.',
        ],
      };
      const validated = validateCreateNewsPost(bulletPayload);
      expect(validated.type).toBe('Standed');
      expect(validated.subType).toBe('BulletPost');
      expect(validated.bulletPoints).toEqual([
        'అవకాడో ఉదయం తినడం మంచిది.',
        'జామపండు మధ్యాహ్నం తీసుకోవాలి.',
      ]);
    });

    it('should strip HTML tags from content when subType is BulletPost', () => {
      const htmlBulletPayload = {
        ...validStandardPostBody,
        type: 'Standed',
        subType: 'BulletPost',
        content: '<p>📰 <strong>BREAKING NEWS</strong></p><p>• Point 1<br>• Point 2</p>',
        bulletPoints: ['Point 1', 'Point 2'],
      };
      const validated = validateCreateNewsPost(htmlBulletPayload);
      expect(validated.content).not.toContain('<p>');
      expect(validated.content).not.toContain('<strong>');
      expect(validated.content).toContain('BREAKING NEWS');
    });

    it('should auto-extract bulletPoints from content when subType is BulletPost', () => {
      const bulletContentPayload = {
        ...validStandardPostBody,
        type: 'Standed',
        subType: 'BulletPost',
        bulletPoints: [],
        content: `
[ప్రధాన వార్త శీర్షిక]

• [ముఖ్యమైన విషయం – 1]
• [ముఖ్యమైన విషయం – 2]
• [ముఖ్యమైన విషయం – 3]
• [అధికారుల ప్రకటన / తాజా సమాచారం]
        `,
      };
      const validated = validateCreateNewsPost(bulletContentPayload);
      expect(validated.subType).toBe('BulletPost');
      expect(validated.bulletPoints).toEqual([
        'ముఖ్యమైన విషయం – 1',
        'ముఖ్యమైన విషయం – 2',
        'ముఖ్యమైన విషయం – 3',
        'అధికారుల ప్రకటన / తాజా సమాచారం',
      ]);
    });

    it('should successfully validate StandardLink with links array of objects', () => {
      const linkPayload = {
        ...validStandardPostBody,
        type: 'Standed',
        subType: 'StandardLink',
        links: [
          {
            id: 'link1',
            value: 'https://www.bharatpetroleum.in/index',
          },
        ],
      };
      const validated = validateCreateNewsPost(linkPayload);
      expect(validated.type).toBe('Standed');
      expect(validated.subType).toBe('StandardLink');
      expect(validated.links).toEqual([
        {
          id: 'link1',
          value: 'https://www.bharatpetroleum.in/index',
        },
      ]);
    });

    it('should auto-format string links array into link objects for StandardLink', () => {
      const linkStringPayload = {
        ...validStandardPostBody,
        type: 'StandardLink',
        links: ['https://www.bharatpetroleum.in/index'],
      };
      const validated = validateCreateNewsPost(linkStringPayload);
      expect(validated.type).toBe('Standed');
      expect(validated.subType).toBe('StandardLink');
      expect(validated.links).toEqual([
        {
          id: 'link1',
          value: 'https://www.bharatpetroleum.in/index',
        },
      ]);
    });

    it('should successfully validate BigBlackStandard post type', () => {
      const bigBlackPayload = {
        ...validStandardPostBody,
        type: 'BigBlackStandard',
      };
      const validated = validateCreateNewsPost(bigBlackPayload);
      expect(validated.type).toBe('Standed');
      expect(validated.subType).toBe('BigBlackStandard');
      expect(validated.bulletPoints).toEqual([]);
    });

    it('should successfully validate ImageAd post type with type Image and subType ImageAd', () => {
      const imageAdPayload = {
        ...validStandardPostBody,
        type: 'ImageAd',
      };
      const validated = validateCreateNewsPost(imageAdPayload);
      expect(validated.type).toBe('Image');
      expect(validated.subType).toBe('ImageAd');
      expect(validated.bulletPoints).toEqual([]);
      expect(validated.links).toEqual([]);
      expect(validated.isWebPost).toBe(false);
    });

    it('should successfully validate Video post type with Youtube platform and URL', () => {
      const youtubePayload = {
        ...validStandardPostBody,
        type: 'Video',
        subType: '',
        video_platform: 'Youtube',
        video_url: 'https://www.youtube.com/watch?v=abcdefghijk',
      };
      const validated = validateCreateNewsPost(youtubePayload);
      expect(validated.type).toBe('Video');
      expect(validated.video_platform).toBe('Youtube');
      expect(validated.video_url).toBe('https://www.youtube.com/watch?v=abcdefghijk');
    });

    it('should convert video_platform X or x to Twitter', () => {
      const xPayload = {
        ...validStandardPostBody,
        type: 'Video',
        subType: '',
        video_platform: 'X',
        video_url: 'https://video.twimg.com/amplify_video/sample.mp4',
      };
      const validated = validateCreateNewsPost(xPayload);
      expect(validated.type).toBe('Video');
      expect(validated.video_platform).toBe('Twitter');
    });

    it('should throw error when isWebPost is true for Standard Post', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, isWebPost: true })
      ).toThrow(/isWebPost must be false for Standard post/);
    });

    it('should throw error when postUrl is not empty for Standard Post', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, postUrl: 'https://example.com/post' })
      ).toThrow(/postUrl must be empty for Standard post/);
    });

    it('should throw error when video_platform is not empty for Standard Post', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, video_platform: 'youtube' })
      ).toThrow(/video_platform must be empty for Standard post/);
    });

    it('should throw error when video_url is not empty for Standard Post', () => {
      expect(() =>
        validateCreateNewsPost({
          ...validStandardPostBody,
          video_url: 'https://youtube.com/watch?v=123',
        })
      ).toThrow(/video_url must be empty for Standard post/);
    });

    it('should throw error when bulletPoints is not empty for regular Standard Post (subType empty)', () => {
      expect(() =>
        validateCreateNewsPost({ ...validStandardPostBody, subType: '', bulletPoints: ['Point 1'] })
      ).toThrow(/bulletPoints must be empty for regular Standard post/);
    });
  });

  describe('Optional Fields for Image, ImageAd, and Video Post Types', () => {
    it('should successfully validate Image post type without categories, location_ids, or aitag_ids', () => {
      const payload = {
        ...validStandardPostBody,
        type: 'Image',
        categoryName: [],
        category_ids: [],
        location_ids: [],
        aitag_ids: [],
      };
      const validated = validateCreateNewsPost(payload);
      expect(validated.type).toBe('Image');
      expect(validated.categoryName).toEqual([]);
      expect(validated.category_ids).toEqual([]);
      expect(validated.location_ids).toEqual([]);
      expect(validated.aitag_ids).toEqual([]);
    });

    it('should successfully validate ImageAd post type without categories, location_ids, or aitag_ids', () => {
      const payload = {
        ...validStandardPostBody,
        type: 'ImageAd',
        categoryName: [],
        category_ids: [],
        location_ids: [],
        aitag_ids: [],
      };
      const validated = validateCreateNewsPost(payload);
      expect(validated.type).toBe('Image');
      expect(validated.subType).toBe('ImageAd');
      expect(validated.categoryName).toEqual([]);
      expect(validated.category_ids).toEqual([]);
      expect(validated.location_ids).toEqual([]);
      expect(validated.aitag_ids).toEqual([]);
    });

    it('should successfully validate Video post type without categories, location_ids, or aitag_ids', () => {
      const payload = {
        ...validStandardPostBody,
        type: 'Video',
        subType: '',
        video_platform: 'Youtube',
        video_url: 'https://www.youtube.com/watch?v=abcdefghijk',
        categoryName: [],
        category_ids: [],
        location_ids: [],
        aitag_ids: [],
      };
      const validated = validateCreateNewsPost(payload);
      expect(validated.type).toBe('Video');
      expect(validated.categoryName).toEqual([]);
      expect(validated.category_ids).toEqual([]);
      expect(validated.location_ids).toEqual([]);
      expect(validated.aitag_ids).toEqual([]);
    });

    it('should successfully validate Gallery post type without categories, location_ids, or aitag_ids', () => {
      const payload = {
        ...validStandardPostBody,
        type: 'Gallery',
        categoryName: [],
        category_ids: [],
        location_ids: [],
        aitag_ids: [],
      };
      const validated = validateCreateNewsPost(payload);
      expect(validated.type).toBe('Gallery');
      expect(validated.categoryName).toEqual([]);
      expect(validated.category_ids).toEqual([]);
      expect(validated.location_ids).toEqual([]);
      expect(validated.aitag_ids).toEqual([]);
    });
  });
});
