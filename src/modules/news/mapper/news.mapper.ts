import { CreateNewsPostDto, NewsPostDto, UpdateNewsPostDto } from '../dto/news.dto';
import { NewsPost } from '../domain/news.model';
import { stripHtml } from '@/shared/utils/html.utils';
import { extractBulletPoints } from '@/shared/utils/bullet.utils';
import { formatLinks, formatLinksAndContent } from '@/shared/utils/link.utils';

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
    const cleanTitle = stripHtml(domain.title || '');
    const cleanNotificationTitle = stripHtml(domain.notificationtitle || domain.title || '');
    const cleanImageTitle = stripHtml(domain.imagetitel || domain.title || '');
    let cleanContent = (domain.content || '').trim();
    const isWebPostVal = Boolean((domain as any).isWebPost || (domain as any).is_web_post || (domain as any).isWebpost);
    let rawType = domain.type || (domain as any).post_type || domain.postType || 'Standed';
    let subTypeVal = domain.subType || '';

    if (rawType.toLowerCase() === 'bulletpost' || rawType.toLowerCase() === 'bullet post') {
      rawType = 'Standed';
      subTypeVal = 'BulletPost';
    } else if (rawType.toLowerCase() === 'standardlink' || rawType.toLowerCase() === 'standard link') {
      rawType = 'Standed';
      subTypeVal = 'StandardLink';
    } else if (
      rawType.toLowerCase() === 'bigblackstanded' ||
      rawType.toLowerCase() === 'bigblack standed' ||
      rawType.toLowerCase() === 'big black standed'
    ) {
      rawType = 'Standed';
      subTypeVal = 'BigBlackStanded';
    } else if (rawType.toLowerCase() === 'video') {
      rawType = 'Video';
      subTypeVal = '';
    }

    const isStickyVal = domain.isStickyPost ?? (domain as any).is_sticky ?? domain.isSticky ?? false;
    const webUrlVal = (domain as any).web_post_url || (domain as any).webPostUrl || (domain as any).webUrl || domain.postUrl || '';

    let bulletsVal: string[] = [];
    if (subTypeVal === 'BulletPost') {
      if (Array.isArray(domain.bulletPoints) && domain.bulletPoints.length > 0) {
        bulletsVal = domain.bulletPoints.map((pt) => String(pt).replace(/[\[\]]/g, '').trim()).filter(Boolean);
      } else {
        bulletsVal = extractBulletPoints(domain.content || '');
      }
    } else if (Array.isArray(domain.bulletPoints) && subTypeVal !== 'StandardLink' && subTypeVal !== 'BigBlackStanded' && rawType !== 'Video') {
      bulletsVal = domain.bulletPoints.map((pt) => String(pt).replace(/[\[\]]/g, '').trim()).filter(Boolean);
    }

    let linksVal: any = domain.links || [];
    if (subTypeVal === 'StandardLink' || (Array.isArray(domain.links) && domain.links.length > 0) || (typeof domain.links === 'string' && domain.links.trim())) {
      const formatted = formatLinksAndContent(domain.links, cleanContent);
      linksVal = formatted.links;
      cleanContent = formatted.content;
    }

    let rawVideoPlatform = domain.videoPlatform || (domain as any).video_platform || '';
    if (rawVideoPlatform.toLowerCase() === 'x' || rawVideoPlatform.toLowerCase() === 'twitter') {
      rawVideoPlatform = 'Twitter';
    }

    return {
      title: cleanTitle,
      notificationtitle: cleanNotificationTitle,
      imagetitel: cleanImageTitle,
      content: cleanContent,
      created: domain.created || now,
      totalLikes: domain.totalLikes ?? 0,
      totalViews: domain.totalViews ?? 0,
      totalComments: domain.totalComments ?? 0,
      image_url: domain.imageUrl || (domain as any).image_url || '',
      video_url: domain.videoUrl || (domain as any).video_url || '',
      video_platform: rawVideoPlatform,
      gallery: domain.gallery || [],
      type: rawType,
      totalShares: domain.totalShares ?? 0,
      isReporter: domain.isReporter ?? false,
      reportedBy: domain.reportedBy || '',
      categoryName: domain.categoryName || [],
      postUrl: domain.postUrl || webUrlVal,
      subType: subTypeVal,
      isStickyPost: isStickyVal,
      linkURLAndroid: domain.linkURLAndroid || '',
      linkURLIos: domain.linkURLIos || '',
      links: linksVal,
      bulletPoints: bulletsVal,
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
      isWebPost: isWebPostVal,
    };
  }

  static toUpdateDto(domain: Partial<NewsPost>): UpdateNewsPostDto {
    const dto: UpdateNewsPostDto = {};
    if (domain.title !== undefined) dto.title = stripHtml(domain.title);
    if (domain.notificationtitle !== undefined) dto.notificationtitle = stripHtml(domain.notificationtitle);
    if (domain.imagetitel !== undefined) dto.imagetitel = stripHtml(domain.imagetitel);
    if (domain.content !== undefined) dto.content = stripHtml(domain.content);
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
