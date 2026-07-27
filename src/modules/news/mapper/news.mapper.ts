import { CreateNewsPostDto, NewsPostDto, UpdateNewsPostDto } from '../dto/news.dto';
import { NewsPost } from '../domain/news.model';

export class NewsMapper {
  static toDomain(dto: NewsPostDto): NewsPost {
    return {
      id: dto.id ?? 0,
      title: dto.title || '',
      notificationtitle: dto.notificationtitle || '',
      imagetitel: dto.imagetitel || '',
      content: dto.content || '',
      created: dto.created || new Date().toISOString(),
      postName: dto.post_name || '',
      totalLikes: dto.totalLikes ?? 0,
      totalViews: dto.totalViews ?? 0,
      totalComments: dto.totalComments ?? 0,
      imageUrl: dto.image_url || '',
      videoUrl: dto.video_url || '',
      videoPlatform: dto.video_platform || '',
      gallery: dto.gallery || [],
      type: dto.type || 'Standard',
      totalShares: dto.totalShares ?? 0,
      isReporter: dto.isReporter ?? false,
      reportedBy: dto.reportedBy || '',
      categoryName: dto.categoryName || [],
      postUrl: dto.postUrl || '',
      subType: dto.subType || '',
      isStickyPost: dto.isStickyPost ?? false,
      linkURLAndroid: dto.linkURLAndroid || '',
      linkURLIos: dto.linkURLIos || '',
      links: dto.links || '',
      isBookmarked: dto.isBookmarked || [],
      postOrder: dto.postOrder ?? 0,
      draft: dto.draft ?? false,
      trash: dto.trash ?? false,
      schedule: dto.schedule || new Date().toISOString(),
      languageId: dto.language_id ?? 0,
      categoryIds: dto.category_ids || [],
      locationIds: dto.location_ids || [],
      aitagIds: dto.aitag_ids || [],
      postType: dto.post_type || dto.type || 'Standard',
      isSticky: dto.is_sticky ?? dto.isStickyPost ?? false,
      isWebPost: Boolean(dto.is_web_post || dto.isWebPost),
      is_web_post: Boolean(dto.is_web_post || dto.isWebPost),
      web_post_url: dto.web_post_url || (dto as any).webPostUrl || (dto as any).webUrl || dto.postUrl || '',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toCreateDto(domain: Partial<NewsPost>): CreateNewsPostDto {
    const now = new Date().toISOString();
    return {
      title: domain.title || '',
      notificationtitle: domain.notificationtitle || domain.title || '',
      imagetitel: domain.imagetitel || domain.title || '',
      content: domain.content || '',
      created: domain.created || now,
      post_name: domain.postName || (domain.title ? domain.title.toLowerCase().replace(/\s+/g, '-') : 'news-post'),
      totalLikes: domain.totalLikes ?? 0,
      totalViews: domain.totalViews ?? 0,
      totalComments: domain.totalComments ?? 0,
      image_url: domain.imageUrl || '',
      video_url: domain.videoUrl || '',
      video_platform: domain.videoPlatform || '',
      gallery: domain.gallery || [],
      type: domain.type || 'Standard',
      totalShares: domain.totalShares ?? 0,
      isReporter: domain.isReporter ?? false,
      reportedBy: domain.reportedBy || '',
      categoryName: domain.categoryName || [],
      postUrl: domain.postUrl || '',
      subType: domain.subType || '',
      isStickyPost: domain.isStickyPost ?? false,
      linkURLAndroid: domain.linkURLAndroid || '',
      linkURLIos: domain.linkURLIos || '',
      links: domain.links || '',
      isBookmarked: domain.isBookmarked || [],
      postOrder: domain.postOrder ?? 0,
      draft: domain.draft ?? false,
      trash: domain.trash ?? false,
      schedule: domain.schedule || now,
      language_id: domain.languageId ?? (domain as any).language_id ?? 0,
      language_code: (domain as any).languageCode ?? (domain as any).language_code ?? (domain as any).postLanguage ?? 'en',
      category_ids: (domain.categoryIds ?? (domain as any).category_ids ?? []).filter((id: number) => typeof id === 'number' && id > 0),
      location_ids: (domain.locationIds ?? (domain as any).location_ids ?? []).filter((id: number) => typeof id === 'number' && id > 0),
      aitag_ids: (domain.aitagIds ?? (domain as any).aitag_ids ?? []).filter((id: number) => typeof id === 'number' && id > 0),
      post_type: domain.postType ?? (domain as any).post_type ?? domain.type ?? 'Standard',
      is_sticky: domain.isSticky ?? (domain as any).is_sticky ?? domain.isStickyPost ?? false,
      isWebPost: Boolean((domain as any).isWebPost || (domain as any).is_web_post || (domain as any).isWebpost),
      is_web_post: Boolean((domain as any).isWebPost || (domain as any).is_web_post || (domain as any).isWebpost),
      web_post_url: (domain as any).web_post_url || (domain as any).webPostUrl || (domain as any).webUrl || domain.postUrl || '',
    };
  }

  static toUpdateDto(domain: Partial<NewsPost>): UpdateNewsPostDto {
    const dto: UpdateNewsPostDto = {};
    if (domain.title !== undefined) dto.title = domain.title;
    if (domain.notificationtitle !== undefined) dto.notificationtitle = domain.notificationtitle;
    if (domain.imagetitel !== undefined) dto.imagetitel = domain.imagetitel;
    if (domain.content !== undefined) dto.content = domain.content;
    if (domain.created !== undefined) dto.created = domain.created;
    if (domain.postName !== undefined) dto.post_name = domain.postName;
    if (domain.totalLikes !== undefined) dto.totalLikes = domain.totalLikes;
    if (domain.totalViews !== undefined) dto.totalViews = domain.totalViews;
    if (domain.totalComments !== undefined) dto.totalComments = domain.totalComments;
    if (domain.imageUrl !== undefined) dto.image_url = domain.imageUrl;
    if (domain.videoUrl !== undefined) dto.video_url = domain.videoUrl;
    if (domain.videoPlatform !== undefined) dto.video_platform = domain.videoPlatform;
    if (domain.gallery !== undefined) dto.gallery = domain.gallery;
    if (domain.type !== undefined) dto.type = domain.type;
    if (domain.totalShares !== undefined) dto.totalShares = domain.totalShares;
    if (domain.isReporter !== undefined) dto.isReporter = domain.isReporter;
    if (domain.reportedBy !== undefined) dto.reportedBy = domain.reportedBy;
    if (domain.categoryName !== undefined) dto.categoryName = domain.categoryName;
    if (domain.postUrl !== undefined) dto.postUrl = domain.postUrl;
    if (domain.subType !== undefined) dto.subType = domain.subType;
    if (domain.isStickyPost !== undefined) dto.isStickyPost = domain.isStickyPost;
    if (domain.linkURLAndroid !== undefined) dto.linkURLAndroid = domain.linkURLAndroid;
    if (domain.linkURLIos !== undefined) dto.linkURLIos = domain.linkURLIos;
    if (domain.links !== undefined) dto.links = domain.links;
    if (domain.isBookmarked !== undefined) dto.isBookmarked = domain.isBookmarked;
    if (domain.postOrder !== undefined) dto.postOrder = domain.postOrder;
    if (domain.draft !== undefined) dto.draft = domain.draft;
    if (domain.trash !== undefined) dto.trash = domain.trash;
    if (domain.schedule !== undefined) dto.schedule = domain.schedule;

    const rawDomain = domain as any;
    if (rawDomain.language_code !== undefined || rawDomain.languageCode !== undefined || rawDomain.postLanguage !== undefined) {
      dto.language_code = rawDomain.language_code ?? rawDomain.languageCode ?? rawDomain.postLanguage;
    }
    if (domain.languageId !== undefined || rawDomain.language_id !== undefined) {
      dto.language_id = domain.languageId ?? rawDomain.language_id;
    }
    if (domain.categoryIds !== undefined || rawDomain.category_ids !== undefined) {
      const raw = domain.categoryIds ?? rawDomain.category_ids ?? [];
      dto.category_ids = Array.isArray(raw) ? raw.filter((id: number) => typeof id === 'number' && id > 0) : [];
    }
    if (domain.locationIds !== undefined || rawDomain.location_ids !== undefined) {
      const raw = domain.locationIds ?? rawDomain.location_ids ?? [];
      dto.location_ids = Array.isArray(raw) ? raw.filter((id: number) => typeof id === 'number' && id > 0) : [];
    }
    if (domain.aitagIds !== undefined || rawDomain.aitag_ids !== undefined) {
      const raw = domain.aitagIds ?? rawDomain.aitag_ids ?? [];
      dto.aitag_ids = Array.isArray(raw) ? raw.filter((id: number) => typeof id === 'number' && id > 0) : [];
    }
    if (domain.postType !== undefined || rawDomain.post_type !== undefined) {
      dto.post_type = domain.postType ?? rawDomain.post_type;
    }
    if (domain.isSticky !== undefined || rawDomain.is_sticky !== undefined) {
      dto.is_sticky = domain.isSticky ?? rawDomain.is_sticky;
    }
    if (rawDomain.isWebPost !== undefined || rawDomain.is_web_post !== undefined || rawDomain.isWebpost !== undefined) {
      const webVal = Boolean(rawDomain.isWebPost || rawDomain.is_web_post || rawDomain.isWebpost);
      dto.isWebPost = webVal;
      dto.is_web_post = webVal;
    }
    if (rawDomain.web_post_url !== undefined || rawDomain.webPostUrl !== undefined || rawDomain.webUrl !== undefined) {
      dto.web_post_url = rawDomain.web_post_url || rawDomain.webPostUrl || rawDomain.webUrl;
    }

    return dto;
  }
}
