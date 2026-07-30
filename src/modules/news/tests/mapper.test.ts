import { NewsMapper } from '../mapper/news.mapper';
import { NewsPostDto } from '../dto/news.dto';

describe('NewsMapper', () => {
  it('should map NewsPostDto to domain model', () => {
    const dto: NewsPostDto = {
      id: 2,
      title: 'Sample Title',
      notificationtitle: 'Notif Title',
      imagetitel: 'Image Title',
      content: 'Sample Content',
      created: '2026-07-22T05:00:00Z',
      post_name: 'sample-title',
      totalLikes: 10,
      totalViews: 100,
      totalComments: 5,
      image_url: 'http://example.com/image.jpg',
      video_url: 'http://example.com/video.mp4',
      video_platform: 'youtube',
      gallery: ['http://example.com/g1.jpg'],
      type: 'Video',
      totalShares: 3,
      isReporter: true,
      reportedBy: 'John Doe',
      categoryName: ['Cinema', 'Sports'],
      postUrl: 'http://example.com/post/2',
      subType: 'Breaking',
      isStickyPost: true,
      linkURLAndroid: 'app://post/2',
      linkURLIos: 'app://post/2',
      links: 'http://example.com',
      isBookmarked: ['user1'],
      postOrder: 1,
      draft: false,
      trash: false,
      schedule: '2026-07-22T05:00:00Z',
      language_id: 1,
      category_ids: [10, 20],
      location_ids: [5, 6],
      aitag_ids: [0],
      post_type: 'Video',
      is_sticky: true,
      createdAt: '2026-07-22T05:00:00Z',
      updatedAt: '2026-07-22T05:00:00Z',
    };

    const domain = NewsMapper.toDomain(dto);

    expect(domain.id).toBe(2);
    expect(domain.title).toBe('Sample Title');
    expect(domain.postName).toBe('sample-title');
    expect(domain.totalLikes).toBe(10);
    expect(domain.categoryName).toEqual(['Cinema', 'Sports']);
    expect(domain.isReporter).toBe(true);
    expect(domain.languageId).toBe(1);
    expect(domain.categoryIds).toEqual([10, 20]);
    expect(domain.locationIds).toEqual([5, 6]);
    expect(domain.aitagIds).toEqual([0]);
    expect(domain.postType).toBe('Video');
    expect(domain.isSticky).toBe(true);
  });

  it('should map empty NewsPostDto with fallback defaults', () => {
    const domain = NewsMapper.toDomain({});

    expect(domain.id).toBe(0);
    expect(domain.title).toBe('');
    expect(domain.type).toBe('Standard');
    expect(domain.totalLikes).toBe(0);
    expect(domain.categoryName).toEqual([]);
    expect(domain.draft).toBe(false);
    expect(domain.languageId).toBe(0);
    expect(domain.categoryIds).toEqual([]);
    expect(domain.locationIds).toEqual([]);
    expect(domain.isSticky).toBe(false);
  });

  it('should map domain model to CreateNewsPostDto', () => {
    const domainPartial = {
      title: 'Created Title',
      content: 'Created Content',
      categoryName: ['National'],
      imageUrl: 'http://example.com/img.png',
      type: 'Standard',
      draft: true,
      languageId: 2,
      categoryIds: [101],
      locationIds: [201],
      aitagIds: [0],
      postType: 'Standard',
      isSticky: true,
    };

    const createDto = NewsMapper.toCreateDto(domainPartial);

    expect(createDto.title).toBe('Created Title');
    expect(createDto.content).toBe('Created Content');
    expect(createDto.categoryName).toEqual(['National']);
    expect(createDto.image_url).toBe('http://example.com/img.png');
    expect(createDto.post_name).toBe('created-title');
    expect(createDto.draft).toBe(true);
    expect(createDto.language_id).toBe(2);
    expect(createDto.category_ids).toEqual([101]);
    expect(createDto.location_ids).toEqual([201]);
    expect(createDto.post_type).toBe('Standard');
    expect(createDto.is_sticky).toBe(true);
  });

  it('should preserve isWebPost when set to true in CreateNewsPostDto and UpdateNewsPostDto', () => {
    const domainPartial = {
      title: 'Web Post Title',
      isWebPost: true,
      web_post_url: 'https://example.com/news/1',
    };

    const createDto = NewsMapper.toCreateDto(domainPartial as any);
    expect(createDto.isWebPost).toBe(true);
    expect(createDto.is_web_post).toBe(true);
    expect(createDto.web_post_url).toBe('https://example.com/news/1');

    const updateDto = NewsMapper.toUpdateDto(domainPartial as any);
    expect(updateDto.isWebPost).toBe(true);
    expect(updateDto.is_web_post).toBe(true);
    expect(updateDto.web_post_url).toBe('https://example.com/news/1');
  });

  it('should map domain model to UpdateNewsPostDto with all properties', () => {
    const domainPartial = {
      title: 'Updated Title',
      notificationtitle: 'Notif Title',
      imagetitel: 'Img Title',
      content: 'Updated Content',
      created: '2026-07-22T05:00:00Z',
      postName: 'updated-title',
      totalLikes: 15,
      totalViews: 200,
      totalComments: 8,
      imageUrl: 'http://example.com/u.jpg',
      videoUrl: 'http://example.com/v.mp4',
      videoPlatform: 'youtube',
      gallery: ['g1', 'g2'],
      type: 'Video',
      totalShares: 5,
      isReporter: true,
      reportedBy: 'Jane',
      categoryName: ['Tech'],
      postUrl: 'http://example.com/p',
      subType: 'Special',
      isStickyPost: true,
      linkURLAndroid: 'app://a',
      linkURLIos: 'app://i',
      links: 'http://link.com',
      isBookmarked: ['u1'],
      postOrder: 3,
      draft: true,
      trash: false,
      schedule: '2026-07-22T05:07:02.102Z',
      languageId: 3,
      categoryIds: [1, 2],
      locationIds: [4],
      postType: 'Podcast',
      isSticky: true,
      isWebPost: true,
      web_post_url: 'http://example.com/web',
    };

    const updateDto = NewsMapper.toUpdateDto(domainPartial);

    expect(updateDto.title).toBe('Updated Title');
    expect(updateDto.notificationtitle).toBe('Notif Title');
    expect(updateDto.imagetitel).toBe('Img Title');
    expect(updateDto.content).toBe('Updated Content');
    expect(updateDto.created).toBe('2026-07-22T05:00:00Z');
    expect(updateDto.post_name).toBe('updated-title');
    expect(updateDto.totalLikes).toBe(15);
    expect(updateDto.totalViews).toBe(200);
    expect(updateDto.totalComments).toBe(8);
    expect(updateDto.image_url).toBe('http://example.com/u.jpg');
    expect(updateDto.video_url).toBe('http://example.com/v.mp4');
    expect(updateDto.video_platform).toBe('youtube');
    expect(updateDto.gallery).toEqual(['g1', 'g2']);
    expect(updateDto.type).toBe('Video');
    expect(updateDto.totalShares).toBe(5);
    expect(updateDto.isReporter).toBe(true);
    expect(updateDto.reportedBy).toBe('Jane');
    expect(updateDto.categoryName).toEqual(['Tech']);
    expect(updateDto.postUrl).toBe('http://example.com/p');
    expect(updateDto.subType).toBe('Special');
    expect(updateDto.isStickyPost).toBe(true);
    expect(updateDto.linkURLAndroid).toBe('app://a');
    expect(updateDto.linkURLIos).toBe('app://i');
    expect(updateDto.links).toBe('http://link.com');
    expect(updateDto.isBookmarked).toEqual(['u1']);
    expect(updateDto.postOrder).toBe(3);
    expect(updateDto.draft).toBe(true);
    expect(updateDto.trash).toBe(false);
    expect(updateDto.schedule).toBe('2026-07-22T05:07:02.102Z');
    expect(updateDto.language_id).toBe(3);
    expect(updateDto.category_ids).toEqual([1, 2]);
    expect(updateDto.location_ids).toEqual([4]);
    expect(updateDto.post_type).toBe('Podcast');
    expect(updateDto.is_sticky).toBe(true);
    expect(updateDto.isWebPost).toBe(true);
    expect(updateDto.is_web_post).toBe(true);
    expect(updateDto.web_post_url).toBe('http://example.com/web');
  });

  it('should strip HTML tags from title, notificationtitle, imagetitel, and content in toCreateDto and toUpdateDto', () => {
    const rawPartial = {
      title: '<h1>Header Title</h1>',
      notificationtitle: '<b>Notification</b>',
      imagetitel: '<span>Image Title</span>',
      content: '<p>Body text with <a href="#">link</a> and &nbsp;space</p>',
    };

    const createDto = NewsMapper.toCreateDto(rawPartial);
    expect(createDto.title).toBe('Header Title');
    expect(createDto.notificationtitle).toBe('Notification');
    expect(createDto.imagetitel).toBe('Image Title');
    expect(createDto.content).toBe('Body text with link and  space');

    const updateDto = NewsMapper.toUpdateDto(rawPartial);
    expect(updateDto.title).toBe('Header Title');
    expect(updateDto.notificationtitle).toBe('Notification');
    expect(updateDto.imagetitel).toBe('Image Title');
    expect(updateDto.content).toBe('Body text with link and  space');
  });
});

