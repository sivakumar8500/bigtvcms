import { CreateNewsPostDto, NewsPostDto, UpdateNewsPostDto } from '../dto/news.dto';
import { NewsPost } from '../domain/news.model';
import { stripAllTagsExceptLinkTags, stripHtml } from '@/shared/utils/html.utils';
import { extractBulletPoints, formatBulletPostContentAndBullets } from '@/shared/utils/bullet.utils';
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
    const rawNotif = domain.notificationtitle || (domain as any).notificationTitle || '';
    const cleanNotificationTitle = rawNotif.trim() ? stripHtml(rawNotif) : cleanTitle;
    const rawImgTitle = domain.imagetitel || (domain as any).imageTitle || '';
    const cleanImageTitle = rawImgTitle.trim() ? stripHtml(rawImgTitle) : cleanTitle;
    let cleanContent = (domain.content || '').trim();
    let rawType = domain.type || (domain as any).post_type || domain.postType || 'Standed';
    let subTypeVal = domain.subType || '';

    if (rawType.toLowerCase() === 'bulletpost' || rawType.toLowerCase() === 'bullet post') {
      rawType = 'Standed';
      subTypeVal = 'BulletPost';
    } else if (rawType.toLowerCase() === 'standardlink' || rawType.toLowerCase() === 'standard link') {
      rawType = 'Standed';
      subTypeVal = 'StandardLink';
    } else if (
      rawType.toLowerCase() === 'bigblackstandard' ||
      rawType.toLowerCase() === 'bigblackstanded' ||
      rawType.toLowerCase() === 'bigblack standard' ||
      rawType.toLowerCase() === 'big black standard' ||
      subTypeVal.toLowerCase() === 'bigblackstandard' ||
      subTypeVal.toLowerCase() === 'bigblackstanded'
    ) {
      rawType = 'Standed';
      subTypeVal = 'BigBlackStandard';
    } else if (rawType.toLowerCase() === 'video') {
      rawType = 'Video';
      subTypeVal = '';
    } else if (
      rawType.toLowerCase() === 'imagead' ||
      rawType.toLowerCase() === 'image ad' ||
      subTypeVal.toLowerCase() === 'imagead' ||
      subTypeVal.toLowerCase() === 'image ad'
    ) {
      rawType = 'Image';
      subTypeVal = 'ImageAd';
    } else if (rawType.toLowerCase() === 'image') {
      rawType = 'Image';
      subTypeVal = subTypeVal || 'Image';
    }

    const isStickyVal = domain.isStickyPost ?? (domain as any).is_sticky ?? domain.isSticky ?? false;
    const webUrlVal = (domain as any).web_post_url || (domain as any).webPostUrl || (domain as any).webUrl || domain.postUrl || '';

    let bulletsVal: string[] = [];
    if (subTypeVal === 'BulletPost') {
      const formatted = formatBulletPostContentAndBullets(domain.content || '', domain.bulletPoints);
      bulletsVal = formatted.bulletPoints;
      cleanContent = formatted.content;
    } else if (
      Array.isArray(domain.bulletPoints) &&
      subTypeVal !== 'StandardLink' &&
      subTypeVal !== 'BigBlackStandard' &&
      subTypeVal !== 'BigBlackStanded' &&
      rawType !== 'Video' &&
      rawType !== 'Image'
    ) {
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

    if (rawType === 'Video' || rawType === 'Image') {
      bulletsVal = [];
      linksVal = [];
    }

    if (subTypeVal === 'StandardLink') {
      cleanContent = stripAllTagsExceptLinkTags(cleanContent);
    } else {
      cleanContent = stripHtml(cleanContent);
    }

    const isWebPostVal = (
      subTypeVal === 'BulletPost' ||
      subTypeVal === 'StandardLink' ||
      subTypeVal === 'BigBlackStandard' ||
      subTypeVal === 'BigBlackStanded' ||
      rawType === 'Video' ||
      rawType === 'Image'
    )
      ? false
      : Boolean((domain as any).isWebPost || (domain as any).is_web_post || (domain as any).isWebpost);

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
      sendNotification: domain.sendNotification ?? (domain as any).sendNotification,
    };
  }

  static toUpdateDto(domain: Partial<NewsPost>): UpdateNewsPostDto {
    const fullDto = NewsMapper.toCreateDto(domain as NewsPost);
    const dto: UpdateNewsPostDto = { ...fullDto };

    const rawDomain = domain as any;
    if (rawDomain.postName !== undefined || rawDomain.post_name !== undefined) {
      dto.post_name = rawDomain.postName ?? rawDomain.post_name;
    }
    if (rawDomain.post_type !== undefined || rawDomain.postType !== undefined) {
      dto.post_type = rawDomain.post_type ?? rawDomain.postType ?? fullDto.type;
    }
    if (rawDomain.is_web_post !== undefined || rawDomain.isWebPost !== undefined) {
      dto.is_web_post = rawDomain.is_web_post ?? rawDomain.isWebPost ?? fullDto.isWebPost;
    }
    if (rawDomain.web_post_url !== undefined || rawDomain.webPostUrl !== undefined) {
      dto.web_post_url = rawDomain.web_post_url ?? rawDomain.webPostUrl ?? fullDto.postUrl;
    }
    if (rawDomain.is_sticky !== undefined || rawDomain.isSticky !== undefined) {
      dto.is_sticky = rawDomain.is_sticky ?? rawDomain.isSticky ?? fullDto.isStickyPost;
    }
    if (domain.content !== undefined && !domain.subType && !rawDomain.sub_type && !domain.type && !rawDomain.post_type) {
      dto.content = stripHtml(domain.content);
    }

    if (domain.subType !== undefined) {
      dto.subType = domain.subType;
    }

    return dto;
  }
}
