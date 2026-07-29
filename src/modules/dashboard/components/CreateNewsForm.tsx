import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Button,
  MenuItem,
  Alert,
  Switch,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  DeleteOutline,
  AddPhotoAlternate,
  Category as CategoryIcon,
  ThumbUpOutlined,
  ChatBubbleOutline,
  ShareOutlined,
  SyncOutlined,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { apiClient } from '@/core/api/api-client';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';
import { TagsRepository } from '@/modules/tags/repositories/tags.repository';
import { LocationRepository } from '@/modules/location/repositories/location.repository';
import { PostTypeRepository } from '@/modules/post-types/repositories/post-type.repository';
import { LanguageRepository } from '@/modules/language/repositories/language.repository';
import { HtmlEditor } from './HtmlEditor';
import { Loader } from '@/shared/components/Loader';

// Multilingual lists to support strict translation guidelines
const categoriesList = [
  { key: 'Entertainment', labelEn: 'Entertainment', labelTe: 'ఎంటర్టైన్మెంట్', labelHi: 'मनोरंजन', labelMl: 'വിനോദം' },
  { key: 'General', labelEn: 'General', labelTe: 'సాధారణం', labelHi: 'सामान्य', labelMl: 'പൊതുവായത്' },
  { key: 'Cinema', labelEn: 'Cinema', labelTe: 'సినిమా', labelHi: 'സിനിമ', labelMl: 'സിനിമ' },
  { key: 'Sports', labelEn: 'Sports', labelTe: 'స్పోర్ట్స్', labelHi: 'खेल', labelMl: 'കായികം' },
  { key: 'National', labelEn: 'National', labelTe: 'నేషనల్', labelHi: 'राष्ट्रीय', labelMl: 'ദേശീയം' },
  { key: 'Andhra Pradesh', labelEn: 'Andhra Pradesh', labelTe: 'ఆంధ్రప్రదేశ్', labelHi: 'ఆంధ్ర प्रदेश', labelMl: 'ఆంధ്രാప్రദേശ്' },
  { key: 'Telangana', labelEn: 'Telangana', labelTe: 'తెలంగాణ', labelHi: 'तेलंगाना', labelMl: 'തെലങ്കാന' },
  { key: 'Business', labelEn: 'Business', labelTe: 'బిజినెస్', labelHi: 'व्यापार', labelMl: 'బిസിനస్స్' },
];

const tagsList = [
  { key: 'Trending', labelEn: 'Trending', labelTe: 'ట్రెండింగ్', labelHi: 'ट्रेंडिंग', labelMl: 'ട്രെൻഡിംഗ്' },
  { key: 'Hyderabad', labelEn: 'Hyderabad', labelTe: 'హైదరాబాద్', labelHi: 'हैदराबाद', labelMl: 'ഹൈദരാബാദ്' },
  { key: 'Viral', labelEn: 'Viral', labelTe: 'వైరల్', labelHi: 'वायरल', labelMl: 'വൈറൽ' },
  { key: 'Cinema', labelEn: 'Cinema', labelTe: 'సినిమా', labelHi: 'సినిమా', labelMl: 'സിനിമ' },
  { key: 'Cricket', labelEn: 'Cricket', labelTe: 'క్రికెట్', labelHi: 'క్రికెట్', labelMl: 'ക്രിക്കറ്റ്' },
  { key: 'Health', labelEn: 'Health', labelTe: 'ఆరోగ్యం', labelHi: 'स्वास्थ्य', labelMl: 'ఆരോഗ്യം' },
  { key: 'Devotional', labelEn: 'Devotional', labelTe: 'భక్తి', labelHi: 'भक्ति', labelMl: 'ഭക്തി' },
];

const locationsList = [
  { key: 'Telangana', labelEn: 'Telangana', labelTe: 'తెలంగాణ', labelHi: 'तेलंगाना', labelMl: 'തെലങ്കാന' },
  { key: 'Andhra Pradesh', labelEn: 'Andhra Pradesh', labelTe: 'ఆంధ్రప్రదేశ్', labelHi: 'ఆంధ్ర प्रदेश', labelMl: 'ఆంధ്രാప్రദേശ്' },
  { key: 'Kerala', labelEn: 'Kerala', labelTe: 'కేరళ', labelHi: 'केरल', labelMl: 'കേരളം' },
  { key: 'Karnataka', labelEn: 'Karnataka', labelTe: 'കన్నడ', labelHi: 'കన్నడ', labelMl: 'കന്നഡ' },
  { key: 'Tamil Nadu', labelEn: 'Tamil Nadu', labelTe: 'తమిళనాడు', labelHi: 'तमिलनाडु', labelMl: 'തമിഴ്നാട്' },
  { key: 'Delhi', labelEn: 'Delhi', labelTe: 'ఢిల్లీ', labelHi: 'दिल्ली', labelMl: 'ഡൽഹി' },
  { key: 'West Bengal', labelEn: 'West Bengal', labelTe: 'పశ్చిమ బెంగాల్', labelHi: 'पश्चिम बंगाल', labelMl: 'പശ്ചിമ ബംഗാൾ' },
  { key: 'Maharashtra', labelEn: 'Maharashtra', labelTe: 'మహారాష్ట్ర', labelHi: 'महाराष्ट्र', labelMl: 'మഹാരാഷ്ട്ര' },
];

const translations = {
  en: {
    tabEn: 'English',
    tabTe: 'Telugu',
    tabHi: 'Hindi',
    tabMl: 'Malayalam',
    lblTitle: 'News Title *',
    lblNotificationTitle: 'Notification Title *',
    lblImageTitle: 'Image Title *',
    lblBody: 'News Body / Content *',
    lblLocation: 'Publish Location *',
    lblType: 'Post Type',
    lblCategories: 'Categories *',
    lblTags: 'AI Mapped Tags *',
    btnCancel: 'Cancel',
    btnSubmit: 'Create News',
    phTitle: 'Enter news headline... (max 10 words)',
    phNotificationTitle: 'Enter notification title... (max 10 words)',
    phImageTitle: 'Enter image/banner title... (max 10 words)',
    phBody: 'Write news body content here... (max 40 words)',
    errCategoryRequired: 'Select at least one Category',
    errLocationRequired: 'Select at least one Location',
    errTagsRequired: 'Select at least one AI Tag',
    errImageRequired: 'Banner image is required',
    errLanguageRequired: 'Please select a Language',
    errNotificationTitleRequired: 'Notification title is required',
    errImageTitleRequired: 'Image title is required',
    errScheduleTimeRequired: 'Please select a schedule time',
    errTitleWordLimit: 'News title must be 10 words or fewer',
    errNotificationTitleWordLimit: 'Notification title must be 10 words or fewer',
    errImageTitleWordLimit: 'Image title must be 10 words or fewer',
    errBodyWordLimit: 'Content must be 40 words or fewer',
    wordCount: (n: number, max: number) => `${n}/${max} words`,
    btnBack: 'Back to Edit',
    btnPublish: 'Confirm & Publish',
    previewTitle: 'News Post Preview',
    lblSummary: 'Publish Summary',
    uploadingImage: 'Uploading banner image...',
    uploadFailed: 'Image upload failed. Please try again.',
    lblIsWebPost: 'Web Post',
    lblIsSticky: 'Sticky Post',
    lblWebUrl: 'Web URL',
    phWebUrl: 'https://example.com/article...',
    errWebUrlInvalid: 'Please enter a valid URL (starting with http:// or https://)',
    lblPostUrl: 'Post URL',
    phPostUrl: 'https://example.com/post-slug...',
    lblVideoSource: 'Video Source',
    lblVideoUrl: 'Video URL',
    phVideoUrl: 'https://youtube.com/watch?v=...',
    errVideoSourceRequired: 'Please select a video source',
    errVideoUrlRequired: 'Video URL is required',
    lblGalleryImages: 'Gallery Images *',
    errGalleryMin: 'Please upload at least 3 images',
    errGalleryMax: 'Maximum 10 images allowed',
    hintGallery: 'Min 3 · Max 10 images',
  },
  te: {
    tabEn: 'ఇంగ్లీష్',
    tabTe: 'తెలుగు',
    tabHi: 'హిందీ',
    tabMl: 'మలయాళం',
    lblTitle: 'వార్తా శీర్షిక *',
    lblNotificationTitle: 'నోటిఫికేషన్ శీర్షిక *',
    lblImageTitle: 'చిత్రం శీర్షిక *',
    lblBody: 'వార్తా కంటెంట్ *',
    lblLocation: 'ప్రచురణ ప్రాంతం *',
    lblType: 'పోస్ట్ రకం',
    lblCategories: 'విభాగాలు *',
    lblTags: 'AI అనుసంధాన ట్యాగ్‌లు *',
    btnCancel: 'రద్దు చేయి',
    btnSubmit: 'వార్తలను సృష్టించండి',
    phTitle: 'వార్తా శీర్షికను ఇక్కడ నమోదు చేయండి... (గరిష్టం 10 పదాలు)',
    phNotificationTitle: 'నోటిఫికేషన్ శీర్షికను నమోదు చేయండి... (గరిష్టం 10 పదాలు)',
    phImageTitle: 'చిత్రం శీర్షికను నమోదు చేయండి... (గరిష్టం 10 పదాలు)',
    phBody: 'వార్తా కంటెంట్‌ను ఇక్కడ రాయండి... (గరిష్టం 40 పదాలు)',
    errCategoryRequired: 'కనీసం ఒక విభాగాన్ని ఎంచుకోండి',
    errLocationRequired: 'కనీసం ఒక ప్రాంతాన్ని ఎంచుకోండి',
    errTagsRequired: 'కనీసం ఒక AI ట్యాగ్‌ను ఎంచుకోండి',
    errImageRequired: 'బ్యానర్ చిత్రం అవసరం',
    errLanguageRequired: 'దయచేసి భాషను ఎంచుకోండి',
    errNotificationTitleRequired: 'నోటిఫికేషన్ శీర్షిక అవసరం',
    errImageTitleRequired: 'చిత్రం శీర్షిక అవసరం',
    errScheduleTimeRequired: 'దయచేసి షెడ్యూల్ సమయాన్ని ఎంచుకోండి',
    errTitleWordLimit: 'వార్తా శీర్షిక 10 పదాలకు మించి ఉండకూడదు',
    errNotificationTitleWordLimit: 'నోటిఫికేషన్ శీర్షిక 10 పదాలకు మించి ఉండకూడదు',
    errImageTitleWordLimit: 'చిత్రం శీర్షిక 10 పదాలకు మించి ఉండకూడదు',
    errBodyWordLimit: 'కంటెంట్ 40 పదాలకు మించి ఉండకూడదు',
    wordCount: (n: number, max: number) => `${n}/${max} పదాలు`,
    btnBack: 'సవరణకు తిరిగి వెళ్లు',
    btnPublish: 'ధృవీకరించి ప్రచురించు',
    previewTitle: 'వార్తా పోస్ట్ ప్రివ్యూ',
    lblSummary: 'ప్రచురణ సారాంశం',
    uploadingImage: 'బ్యానర్ చిత్రాన్ని అప్‌లోడ్ చేస్తోంది...',
    uploadFailed: 'చిత్రం అప్‌లోడ్ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    lblIsWebPost: 'వెబ్ పోస్ట్',
    lblIsSticky: 'స్టికీ పోస్ట్',
    lblWebUrl: 'వెబ్ URL',
    phWebUrl: 'https://example.com/article...',
    errWebUrlInvalid: 'దయచేసి సరైన URL నమోదు చేయండి (http:// లేదా https:// తో మొదలుకావాలి)',
    lblPostUrl: 'పోస్ట్ URL',
    phPostUrl: 'https://example.com/post-slug...',
    lblVideoSource: 'వీడియో మూలం',
    lblVideoUrl: 'వీడియో URL',
    phVideoUrl: 'https://youtube.com/watch?v=...',
    errVideoSourceRequired: 'దయచేసి వీడియో మూలాన్ని ఎంచుకోండి',
    errVideoUrlRequired: 'వీడియో URL అవసరం',
    lblGalleryImages: 'గ్యాలరీ చిత్రాలు *',
    errGalleryMin: 'కనీసం 3 చిత్రాలు అప్లోడ్ చేయండి',
    errGalleryMax: 'గరిష్ఠం 10 చిత్రాలు అనుమతించబడతాయి',
    hintGallery: 'కనీసం 3 · గరిష్ఠం 10 చిత్రాలు',
  },
  hi: {
    tabEn: 'अंग्रेज़ी',
    tabTe: 'तेलुगु',
    tabHi: 'हिन्दी',
    tabMl: 'मलयालम',
    lblTitle: 'समाचार शीर्षक *',
    lblNotificationTitle: 'अधिसूचना शीर्षक *',
    lblImageTitle: 'छवि शीर्षक *',
    lblBody: 'समाचार सामग्री *',
    lblLocation: 'प्रकाशन स्थान *',
    lblType: 'पोस्ट प्रकार',
    lblCategories: 'श्रेणियां *',
    lblTags: 'AI मैप्ड टैग्स *',
    btnCancel: 'रद्द करें',
    btnSubmit: 'समाचार बनाएं',
    phTitle: 'समाचार शीर्षक दर्ज करें... (अधिकतम 10 शब्द)',
    phNotificationTitle: 'अधिसूचना शीर्षक दर्ज करें... (अधिकतम 10 शब्द)',
    phImageTitle: 'छवि शीर्षक दर्ज करें... (अधिकतम 10 शब्द)',
    phBody: 'समाचार मुख्य भाग यहाँ लिखें... (अधिकतम 40 शब्द)',
    errCategoryRequired: 'कम से कम एक श्रेणी चुनें',
    errLocationRequired: 'कम से कम एक स्थान चुनें',
    errTagsRequired: 'कम से कम एक AI टैग चुनें',
    errImageRequired: 'बैनर छवि आवश्यक है',
    errLanguageRequired: 'कृपया एक भाषा चुनें',
    errNotificationTitleRequired: 'अधिसूचना शीर्षक आवश्यक है',
    errImageTitleRequired: 'छवि शीर्षक आवश्यक है',
    errScheduleTimeRequired: 'कृपया एक शेड्यूल समय चुनें',
    errTitleWordLimit: 'समाचार शीर्षक 10 शब्दों से अधिक नहीं होना चाहिए',
    errNotificationTitleWordLimit: 'अधिसूचना शीर्षक 10 शब्दों से अधिक नहीं होना चाहिए',
    errImageTitleWordLimit: 'छवि शीर्षक 10 शब्दों से अधिक नहीं होना चाहिए',
    errBodyWordLimit: 'सामग्री 40 शब्दों से अधिक नहीं होनी चाहिए',
    wordCount: (n: number, max: number) => `${n}/${max} शब्द`,
    btnBack: 'संपादन पर वापस जाएं',
    btnPublish: 'पुष्टि करें और प्रकाशित करें',
    previewTitle: 'समाचार पोस्ट पूर्वावलोकन',
    lblSummary: 'प्रकाशन सारांश',
    uploadingImage: 'बैनर छवि अपलोड की जा रही है...',
    uploadFailed: 'छवि अपलोड विफल रही। कृपया पुनः प्रयास करें।',
    lblIsWebPost: 'वेब पोस्ट',
    lblIsSticky: 'स्टिकी पोस्ट',
    lblWebUrl: 'वेब URL',
    phWebUrl: 'https://example.com/article...',
    errWebUrlInvalid: 'कृपया एक वैध URL दर्ज करें (http:// या https:// से शुरू होना चाहिए)',
    lblPostUrl: 'पोस्ट URL',
    phPostUrl: 'https://example.com/post-slug...',
    lblVideoSource: 'वीडियो स्रोत',
    lblVideoUrl: 'वीडियो URL',
    phVideoUrl: 'https://youtube.com/watch?v=...',
    errVideoSourceRequired: 'कृपया एक वीडियो स्रोत चुनें',
    errVideoUrlRequired: 'वीडियो URL आवश्यक है',
    lblGalleryImages: 'गैलरी चित्र *',
    errGalleryMin: 'कृपया कम से कम 3 चित्र अपलोड करें',
    errGalleryMax: 'अधिकतम 10 चित्र अनुमत हैं',
    hintGallery: 'न्यूनतम 3 · अधिकतम 10 चित्र',
  },
  ml: {
    tabEn: 'ഇംഗ്ലീഷ്',
    tabTe: 'തെലുങ്ക്',
    tabHi: 'ഹിന്ദി',
    tabMl: 'മലയാളം',
    lblTitle: 'വാർത്താ തലക്കെട്ട് *',
    lblNotificationTitle: 'അറിയിപ്പ് തലക്കെട്ട് *',
    lblImageTitle: 'ചിത്രം തലക്കെട്ട് *',
    lblBody: 'വാർത്താ ഉള്ളടക്കം *',
    lblLocation: 'പ്രസിദ്ധീകരണ സ്ഥലം *',
    lblType: 'പോസ്റ്റ് തരം',
    lblCategories: 'വിഭാഗങ്ങൾ *',
    lblTags: 'AI ടാഗുകൾ *',
    btnCancel: 'റദ്ദാക്കുക',
    btnSubmit: 'വാർത്ത സൃഷ്ടിക്കുക',
    phTitle: 'വാർത്താ തലക്കെട്ട് നൽകുക... (പരമാവധി 10 വാക്കുകൾ)',
    phNotificationTitle: 'അറിയിപ്പ് തലക്കെട്ട് നൽകുക... (പരമാവധി 10 വാക്കുകൾ)',
    phImageTitle: 'ചിത്രം തലക്കെട്ട് നൽകുക... (പരമാവധി 10 വാക്കുകൾ)',
    phBody: 'വാർത്താ ഉള്ളടക്കം ഇവിടെ എഴുതുക... (പരമാവധി 40 വാക്കുകൾ)',
    errCategoryRequired: 'കുറഞ്ഞത് ഒരു വിഭാഗമെങ്കിലും തിരഞ്ഞെടുക്കുക',
    errLocationRequired: 'കുറഞ്ഞത് ഒരു സ്ഥലമെങ്കിലും തിരഞ്ഞെടുക്കുക',
    errTagsRequired: 'കുറഞ്ഞത് ഒരു AI ടാഗ് എങ്കിലും തിരഞ്ഞെടുക്കുക',
    errImageRequired: 'ബാനർ ചിത്രം ആവശ്യമാണ്',
    errLanguageRequired: 'ദയവായി ഒരു ഭാഷ തിരഞ്ഞെടുക്കുക',
    errNotificationTitleRequired: 'അറിയിപ്പ് തലക്കെട്ട് ആവശ്യമാണ്',
    errImageTitleRequired: 'ചിത്രം തലക്കെട്ട് ആവശ്യമാണ്',
    errScheduleTimeRequired: 'ദയവായി ഒരു ഷെഡ്യൂൾ സമയം തിരഞ്ഞെടുക്കുക',
    errTitleWordLimit: 'വാർത്താ തലക്കെട്ട് 10 വാക്കുകൾക്കും കൂടുതല്‍ ആകാന്‍ പാടില്ല',
    errNotificationTitleWordLimit: 'അറിയിപ്പ് തലക്കെട്ട് 10 വാക്കുകൾക്കും കൂടുതല്‍ ആകാന്‍ പാടില്ല',
    errImageTitleWordLimit: 'ചിത്രം തലക്കെട്ട് 10 വാക്കുകൾക്കും കൂടുതല്‍ ആകാന്‍ പാടില്ല',
    errBodyWordLimit: 'ഉള്ളടക്കം 40 വാക്കുകൾക്കും കൂടുതല്‍ ആകാന്‍ പാടില്ല',
    wordCount: (n: number, max: number) => `${n}/${max} വാക്കുകൾ`,
    btnBack: 'എഡിറ്റിലേക്ക് മടങ്ങുക',
    btnPublish: 'സ്ഥിരീകരിച്ച് പ്രസിദ്ധീകരികുക',
    previewTitle: 'വാർത്താ പോസ്റ്റ് പ്രിവ്യൂ',
    lblSummary: 'പ്രസിദ്ധീകരണ സംഗ്രഹം',
    uploadingImage: 'ബാനർ ചിത്രം അപ്‌ലോഡ് ചെയ്യുന്നു...',
    uploadFailed: 'ചിത്രം അപ്‌ലോഡ് പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    lblIsWebPost: 'വെബ് പോസ്റ്റ്',
    lblIsSticky: 'സ്റ്റിക്കി പോസ്റ്റ്',
    lblWebUrl: 'വെബ് URL',
    phWebUrl: 'https://example.com/article...',
    errWebUrlInvalid: 'ദയവായി സാധുവായ ഒരു URL നൽകുക (http:// അല്ലെങ്കിൽ https:// കൊണ്ട് തുടങ്ങണം)',
    lblPostUrl: 'പോസ്റ്റ് URL',
    phPostUrl: 'https://example.com/post-slug...',
    lblVideoSource: 'വീഡിയോ ഉറവിടം',
    lblVideoUrl: 'വീഡിയോ URL',
    phVideoUrl: 'https://youtube.com/watch?v=...',
    errVideoSourceRequired: 'ദയവായി ഒരു വീഡിയോ ഉറവിടം തിരഞ്ഞെടുക്കുക',
    errVideoUrlRequired: 'വീഡിയോ URL ആവശ്യമാണ്',
    lblGalleryImages: 'ഗ്യാലറി ചിത്രങ്ങൾ *',
    errGalleryMin: 'ദയവായി കുറഞ്ഞത് 3 ചിത്രങ്ങൾ അപ്ലോഡ് ചെയ്കുക',
    errGalleryMax: 'പരമാവധി 10 ചിത്രങ്ങൾ മാത്രം അനുവദനീയം',
    hintGallery: 'കുറഞ്ഞത് 3 · പരമാവധി 10 ചിത്രങ്ങൾ',
  },
};

export interface CreateNewsFormData {
  titleEn: string;
  bodyEn: string;
  titleTe: string;
  bodyTe: string;
  titleHi: string;
  bodyHi: string;
  titleMl: string;
  bodyMl: string;
  categories: string[];
  tags: string[];
  location: string[];
  type: string;
  imageUrl: string | null;
  postLanguage: 'en' | 'te' | 'hi' | 'ml';
  language_code?: string;
  publishMode?: 'now' | 'draft' | 'schedule';
  scheduleTime?: string;
  languageId?: number;
  categoryIds?: number[];
  locationIds?: number[];
  aitagIds?: number[];
  aitag_ids?: number[];
  postType?: string;
  isSticky?: boolean;
  isStickyPost?: boolean;
  isWebPost?: boolean;
  notificationTitle: string;
  imageTitle: string;
  webUrl?: string;
  postUrl?: string;
  videoSource?: string;
  videoUrl?: string;
  video_platform?: string;
  video_url?: string;
  galleryImages?: string[];
}

interface CreateNewsFormProps {
  onClose: () => void;
  onSubmit: (data: CreateNewsFormData) => void;
  isDark: boolean;
  language: 'en' | 'te' | 'hi' | 'ml';
  initialData?: CreateNewsFormData;
}

export const CreateNewsForm: React.FC<CreateNewsFormProps> = ({
  onClose,
  onSubmit,
  isDark,
  language,
  initialData,
}) => {
  const t = translations[language] || translations.en;
  const isEditMode = !!initialData;
  const { 
    activeLanguages, 
    categories, 
    setCategories, 
    tags, 
    setTags, 
    locations, 
    setLocations 
  } = useLanguageStore();

  const [postLanguage, setPostLanguage] = useState<'en' | 'te' | 'hi' | 'ml'>(initialData?.postLanguage || language || 'en');
  const [apiPostTypes, setApiPostTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [apiLanguages, setApiLanguages] = useState<Array<{ code: string; name: string }>>([]);

  // Fetch Languages API on mount
  useEffect(() => {
    LanguageRepository.getAll(0, 100)
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter((item: any) => item.status !== false && item.isSystemActive !== false)
            .map((item: any) => {
              const code = (item.code || '').toLowerCase();
              const nameObj = item.name || {};
              const name = typeof nameObj === 'object'
                ? (nameObj[language] || nameObj.en || item.languageName || item.nameEn || code.toUpperCase())
                : (item.languageName || item.name || code.toUpperCase());
              return { code, name };
            })
            .filter((lang) => lang.code);
          if (mapped.length > 0) {
            setApiLanguages(mapped);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch languages in form', err));
  }, [language]);

  // Fetch Categories API in global UI language
  useEffect(() => {
    CategoryRepository.getAll(language)
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
            categoryId: item.categoryId || item.id,
            nameEn: item.categoryNameTranslations?.en || item.nameEn || item.categoryName || '',
            nameTe: item.categoryNameTranslations?.te || item.nameTe || item.categoryName || '',
            nameHi: item.categoryNameTranslations?.hi || item.nameHi || item.categoryName || '',
            nameMl: item.categoryNameTranslations?.ml || item.nameMl || item.categoryName || '',
            icon: item.icon || '',
            isFollowed: item.isFollowed || false,
          }));
          setCategories(mapped);
        }
      })
      .catch((err) => console.error('Failed to fetch categories in form', err));
  }, [language, setCategories]);

  // Fetch AI Tags API in global UI language
  useEffect(() => {
    TagsRepository.getAll(language)
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
            aitagid: item.aitagid || item.id,
            aitagname: item.aitagname || item.tagName || '',
            tagEn: item.aitagnameTranslations?.en || item.tagEn || item.aitagname || '',
            tagTe: item.aitagnameTranslations?.te || item.tagTe || item.aitagname || '',
            tagHi: item.aitagnameTranslations?.hi || item.tagHi || item.aitagname || '',
            tagMl: item.aitagnameTranslations?.ml || item.tagMl || item.aitagname || '',
            imageUrl: item.imageUrl || '',
            isActive: item.isActive || false,
          }));
          setTags(mapped);
        }
      })
      .catch((err) => console.error('Failed to fetch tags in form', err));
  }, [language, setTags]);

  // Fetch Locations API in global UI language
  useEffect(() => {
    LocationRepository.getAll(language)
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => {
            const rawName = item.stateName || item.state_name || item.locationName || item.location_name || item.name || item.state || '';
            const trans = item.stateNameTranslations || item.statenameTranslations || item.locationNameTranslations || item.translations || item.nameTranslations || {};
            const stateEn = trans.en || item.state_name_en || item.stateEn || (typeof rawName === 'string' ? rawName : '');
            const stateTe = trans.te || item.state_name_te || item.stateTe || stateEn;
            const stateHi = trans.hi || item.state_name_hi || item.stateHi || stateEn;
            const stateMl = trans.ml || item.state_name_ml || item.stateMl || stateEn;

            return {
              stateId: item.stateId || item.state_id || item.locationId || item.location_id || item.id || Math.floor(Math.random() * 10000),
              stateName: rawName || stateEn,
              stateEn,
              stateTe,
              stateHi,
              stateMl,
              isFollowed: item.isFollowed || item.is_followed || false,
            };
          }).filter((l) => l.stateEn || l.stateName);
          if (mapped.length > 0) {
            setLocations(mapped);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch locations in form', err));
  }, [language, setLocations]);

  // Fetch Post Types API on mount
  useEffect(() => {
    PostTypeRepository.getAll(0, 100)
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data
            .map((item: any) => ({
              id: item.typeId || item.id,
              name: item.typename || item.name || '',
            }))
            .filter((pt) => pt.name);
          setApiPostTypes(mapped);

          // Auto-select 'Standard' as default when creating a new post
          if (!initialData && mapped.length > 0) {
            const standard = mapped.find((pt) => pt.name.toLowerCase() === 'standard');
            setType(standard ? standard.name : mapped[0].name);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch post types in form', err));
  }, [initialData]);

  const dynamicCategories = categories && categories.length > 0
    ? categories.map((c) => ({
        id: c.categoryId,
        key: c.nameEn || c.nameTe || `cat-${c.categoryId}`,
        labelEn: c.nameEn,
        labelTe: c.nameTe || c.nameEn,
        labelHi: c.nameHi || c.nameEn,
        labelMl: c.nameMl || c.nameEn,
      }))
    : categoriesList.map((c) => ({ ...c, id: c.key }));

  const dynamicTags = tags && tags.length > 0
    ? tags.map((t) => ({
        id: t.aitagid,
        key: t.tagEn || t.tagTe || `tag-${t.aitagid}`,
        labelEn: t.tagEn,
        labelTe: t.tagTe || t.tagEn,
        labelHi: t.tagHi || t.tagEn,
        labelMl: t.tagMl || t.tagEn,
      }))
    : tagsList.map((t) => ({ ...t, id: t.key }));

  const dynamicLocations = locations && locations.length > 0
    ? locations.map((l, index) => {
        const fallbackName = l.stateName || l.stateEn || l.stateTe || `Location ${l.stateId || index + 1}`;
        const labelEn = l.stateEn || fallbackName;
        const labelTe = l.stateTe || labelEn;
        const labelHi = l.stateHi || labelEn;
        const labelMl = l.stateMl || labelEn;
        const key = labelEn || `loc-${l.stateId || index}`;
        return {
          id: l.stateId || index,
          key,
          labelEn,
          labelTe,
          labelHi,
          labelMl,
        };
      })
    : locationsList.map((l) => ({ ...l, id: l.key }));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Form states  seeded from initialData when editing
  const [title, setTitle] = useState(initialData
    ? (initialData.postLanguage === 'te' ? initialData.titleTe
      : initialData.postLanguage === 'hi' ? initialData.titleHi
      : initialData.postLanguage === 'ml' ? initialData.titleMl
      : initialData.titleEn)
    : '');
  const [body, setBody] = useState(initialData
    ? (initialData.postLanguage === 'te' ? initialData.bodyTe
      : initialData.postLanguage === 'hi' ? initialData.bodyHi
      : initialData.postLanguage === 'ml' ? initialData.bodyMl
      : initialData.bodyEn)
    : '');

  // Reverse-map Telugu category names back to English keys for checkbox preselection
  const teluguToEnglishCategoryMap: Record<string, string> = {
    'ఎంటర టైన మెంట ': 'Entertainment',
    'సాధారణం': 'General',
    'సినిమా': 'Cinema',
    'స పోర ట స ': 'Sports',
    'నేషనల ': 'National',
    'ఆంధ రప రదేశ ': 'Andhra Pradesh',
    'తెలంగాణ': 'Telangana',
    'బిజినిస ': 'Business',
  };
  const mapCategoryToKey = (cat: string) => teluguToEnglishCategoryMap[cat] || cat;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData ? initialData.categories.map(mapCategoryToKey) : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (!initialData) return [];
    const raw = [
      ...(initialData.tags || []),
      ...(initialData.aitagIds || []),
      ...(initialData.aitag_ids || []),
    ];
    return raw.map(String).filter(Boolean);
  });
  const [location, setLocation] = useState<string[]>(initialData?.location || []);
  const [type, setType] = useState(() => {
    const validTypes = ['Standard', 'Video', 'Reel', 'Podcast'];
    if (initialData?.type) {
      const found = validTypes.find(t => t.toLowerCase() === initialData.type.toLowerCase());
      if (found) return found;
      if (initialData.type === 'sivakumar' || initialData.type === 'string') {
        return 'Standard';
      }
      return initialData.type;
    }
    return 'Standard';
  });
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [galleryItems, setGalleryItems] = useState<Array<{ url: string; file?: File }>>(() => {
    const imgs: string[] = (initialData as any)?.galleryImages || [];
    return imgs.map((url) => ({ url }));
  });
  const [isSticky, setIsSticky] = useState<boolean>((initialData as any)?.isStickyPost ?? initialData?.isSticky ?? false);
  const [isWebPost, setIsWebPost] = useState<boolean>(Boolean((initialData as any)?.isWebPost || (initialData as any)?.is_web_post || (initialData as any)?.isWebpost || false));
  const [webUrl, setWebUrl] = useState<string>((initialData as any)?.webUrl || (initialData as any)?.web_post_url || (initialData as any)?.webPostUrl || (initialData as any)?.postUrl || '');
  const [postUrl, setPostUrl] = useState<string>((initialData as any)?.postUrl || (initialData as any)?.webUrl || '');

  const [videoSource, setVideoSource] = useState<string>((initialData as any)?.videoSource || (initialData as any)?.video_platform || '');
  const [videoUrl, setVideoUrl] = useState<string>((initialData as any)?.videoUrl || (initialData as any)?.video_url || '');
  const [notificationTitle, setNotificationTitle] = useState<string>((initialData as any)?.notificationTitle || (initialData as any)?.notificationtitle || '');
  const [imageTitle, setImageTitle] = useState<string>((initialData as any)?.imageTitle || (initialData as any)?.imagetitel || '');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);
  const [publishMode, setPublishMode] = useState<'now' | 'draft' | 'schedule'>('now');
  const [scheduleTime, setScheduleTime] = useState<string>('');

  const isImageOrGalleryType =
    ['image', 'image ad', 'gallery'].includes(type.toLowerCase().trim()) ||
    type.toLowerCase().includes('image') ||
    type.toLowerCase().includes('gallery');

  const langIdMap: Record<string, number> = { en: 1, te: 2, hi: 3, ml: 4 };

  // Sync post language default with workspace language prop (only when NOT editing)
  useEffect(() => {
    if (!initialData && language) {
      setPostLanguage(language);
    }
  }, [language]);

  // Map initial tags/aitagIds to dynamicTags keys so already selected tags are pre-selected in edit mode
  useEffect(() => {
    if (initialData) {
      const rawTags: Array<string | number> = [
        ...(initialData.tags || []),
        ...(initialData.aitagIds || []),
        ...(initialData.aitag_ids || []),
      ];
      if (rawTags.length > 0 && dynamicTags.length > 0) {
        const resolvedKeys: string[] = [];
        rawTags.forEach((raw) => {
          if (raw === undefined || raw === null || raw === '') return;
          const match = dynamicTags.find((dt) => {
            if (dt.key === raw || String(dt.key) === String(raw)) return true;
            if (dt.id === raw || String(dt.id) === String(raw)) return true;
            if (dt.labelEn && dt.labelEn.toLowerCase() === String(raw).toLowerCase()) return true;
            if (dt.labelTe && dt.labelTe === String(raw)) return true;
            if (dt.labelHi && dt.labelHi === String(raw)) return true;
            if (dt.labelMl && dt.labelMl === String(raw)) return true;
            return false;
          });
          if (match) {
            resolvedKeys.push(match.key);
          } else if (typeof raw === 'string') {
            resolvedKeys.push(raw);
          }
        });
        if (resolvedKeys.length > 0) {
          const newSet = Array.from(new Set(resolvedKeys));
          setSelectedTags((prev) => {
            if (prev.length === newSet.length && prev.every((v, i) => v === newSet[i])) {
              return prev;
            }
            return newSet;
          });
        }
      }
    }
  }, [initialData, dynamicTags.map((t) => `${t.id}:${t.key}`).join(',')]);

  // Map initial categories to dynamicCategories keys so already selected categories are checked in edit mode
  useEffect(() => {
    if (initialData && initialData.categories && initialData.categories.length > 0 && dynamicCategories.length > 0) {
      const resolved: string[] = [];
      initialData.categories.forEach((raw: any) => {
        if (raw === undefined || raw === null || raw === '') return;
        const match = dynamicCategories.find((dc) => {
          if (dc.key === raw || String(dc.key) === String(raw)) return true;
          if (dc.id === raw || String(dc.id) === String(raw)) return true;
          if (dc.labelEn && dc.labelEn.toLowerCase() === String(raw).toLowerCase()) return true;
          if (dc.labelTe && dc.labelTe === String(raw)) return true;
          if (dc.labelHi && dc.labelHi === String(raw)) return true;
          if (dc.labelMl && dc.labelMl === String(raw)) return true;
          return false;
        });
        if (match) {
          resolved.push(match.key);
        } else if (typeof raw === 'string') {
          resolved.push(mapCategoryToKey(raw));
        }
      });
      if (resolved.length > 0) {
        const newSet = Array.from(new Set(resolved));
        setSelectedCategories((prev) => {
          if (prev.length === newSet.length && prev.every((v, i) => v === newSet[i])) {
            return prev;
          }
          return newSet;
        });
      }
    }
  }, [initialData, dynamicCategories.map((c) => `${c.id}:${c.key}`).join(',')]);

  // Map initial locations to dynamicLocations keys so already selected locations are checked in edit mode
  useEffect(() => {
    if (initialData && initialData.location && initialData.location.length > 0 && dynamicLocations.length > 0) {
      const resolved: string[] = [];
      initialData.location.forEach((raw: any) => {
        if (raw === undefined || raw === null || raw === '') return;
        const match = dynamicLocations.find((dl) => {
          if (dl.key === raw || String(dl.key) === String(raw)) return true;
          if (dl.id === raw || String(dl.id) === String(raw)) return true;
          if (dl.labelEn && dl.labelEn.toLowerCase() === String(raw).toLowerCase()) return true;
          if (dl.labelTe && dl.labelTe === String(raw)) return true;
          if (dl.labelHi && dl.labelHi === String(raw)) return true;
          if (dl.labelMl && dl.labelMl === String(raw)) return true;
          return false;
        });
        if (match) {
          resolved.push(match.key);
        } else if (typeof raw === 'string') {
          resolved.push(raw);
        }
      });
      if (resolved.length > 0) {
        const newSet = Array.from(new Set(resolved));
        setLocation((prev) => {
          if (prev.length === newSet.length && prev.every((v, i) => v === newSet[i])) {
            return prev;
          }
          return newSet;
        });
      }
    }
  }, [initialData, dynamicLocations.map((l) => `${l.id}:${l.key}`).join(',')]);

  // Sync isWebPost and webUrl when initialData updates (e.g. after async fetch in edit mode)
  useEffect(() => {
    if (initialData) {
      const isWeb = Boolean(
        (initialData as any).isWebPost ||
        (initialData as any).is_web_post ||
        (initialData as any).isWebpost
      );
      if (isWeb) {
        setIsWebPost(true);
      }
      const url =
        (initialData as any).webUrl ||
        (initialData as any).web_post_url ||
        (initialData as any).webPostUrl ||
        (initialData as any).postUrl ||
        (initialData as any).post_url ||
        '';
      if (url) {
        setWebUrl(url);
        setPostUrl(url);
      }
    }
  }, [
    (initialData as any)?.isWebPost,
    (initialData as any)?.is_web_post,
    (initialData as any)?.isWebpost,
    (initialData as any)?.webUrl,
    (initialData as any)?.web_post_url,
    (initialData as any)?.webPostUrl,
    (initialData as any)?.postUrl,
    (initialData as any)?.post_url,
  ]);


  // Reset video/gallery fields when switching post types
  useEffect(() => {
    // Reset video fields when switching away from video types
    if (!type.toLowerCase().includes('video')) {
      setVideoSource('');
      setVideoUrl('');
    }
    // Reset gallery images when switching away from gallery type
    if (!type.toLowerCase().includes('gallery')) {
      setGalleryItems([]);
    }
  }, [type]);

  const handleReset = () => {
    setTitle('');
    setBody('');
    setPostLanguage(language || 'en');
    setSelectedCategories([]);
    setSelectedTags([]);
    setLocation([]);
    setType('Standard');
    setImageUrl(null);
    setGalleryItems([]);
    setImageFile(null);
    setIsUploading(false);
    setUploadError(null);
    setIsSticky(false);
    setIsWebPost(false);
    setWebUrl('');
    setPostUrl('');
    setVideoSource('');
    setVideoUrl('');
    setNotificationTitle('');
    setImageTitle('');
    setErrors({});
    setShowPreviewScreen(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((c) => c !== categoryKey) : [...prev, categoryKey]
    );
  };

  const handleTagsChange = (selected: string[] | string) => {
    const selectedArr = Array.isArray(selected) ? selected : typeof selected === 'string' ? selected.split(',').filter(Boolean) : [];
    if (selectedArr.includes('all')) {
      if (selectedTags.length === dynamicTags.length) {
        setSelectedTags([]);
      } else {
        setSelectedTags(dynamicTags.map((t) => t.key));
      }
    } else {
      setSelectedTags(selectedArr);
    }
  };

  const handleLocationChange = (selected: string[] | string) => {
    const selectedArr = Array.isArray(selected) ? selected : typeof selected === 'string' ? selected.split(',').filter(Boolean) : [];
    if (selectedArr.includes('all')) {
      if (location.length === dynamicLocations.length) {
        setLocation([]);
      } else {
        setLocation(dynamicLocations.map((l) => l.key));
      }
    } else {
      setLocation(selectedArr);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Utility: count words in a plain string (strips HTML tags first)
  const countWords = (text: string): number => {
    const plain = text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    return plain.trim() === '' ? 0 : plain.trim().split(/\s+/).length;
  };

  const handleSave = () => {
    const errMap: Record<string, string> = {};
    const TITLE_WORD_LIMIT = 10;
    const BODY_WORD_LIMIT = 40;

    // Language
    if (!postLanguage) {
      errMap.language = t.errLanguageRequired;
    }

    // AI Tags
    if (selectedTags.length === 0) {
      errMap.tags = t.errTagsRequired;
    }

    // Location
    if (location.length === 0) {
      errMap.location = t.errLocationRequired;
    }

    // Categories
    if (selectedCategories.length === 0) {
      errMap.categories = t.errCategoryRequired;
    }

    // Publish Mode — if schedule is selected, time must be picked
    if (publishMode === 'schedule' && !scheduleTime) {
      errMap.scheduleTime = t.errScheduleTimeRequired;
    }

    // News Title
    if (!title.trim()) {
      errMap.title = 'News title is required';
    } else if (countWords(title) > TITLE_WORD_LIMIT) {
      errMap.title = t.errTitleWordLimit;
    }

    // Notification Title (Optional for Image, Image Ad, Gallery post types)
    if (!isImageOrGalleryType && !notificationTitle.trim()) {
      errMap.notificationTitle = t.errNotificationTitleRequired;
    } else if (notificationTitle.trim() && countWords(notificationTitle) > TITLE_WORD_LIMIT) {
      errMap.notificationTitle = t.errNotificationTitleWordLimit;
    }

    // Image Title (Optional for Image, Image Ad, Gallery post types)
    if (!isImageOrGalleryType && !imageTitle.trim()) {
      errMap.imageTitle = t.errImageTitleRequired;
    } else if (imageTitle.trim() && countWords(imageTitle) > TITLE_WORD_LIMIT) {
      errMap.imageTitle = t.errImageTitleWordLimit;
    }

    // Content
    if (!body.trim()) {
      errMap.body = 'Content/Body is required';
    } else if (countWords(body) > BODY_WORD_LIMIT) {
      errMap.body = t.errBodyWordLimit;
    }

    // Image — skip for gallery type (gallery has its own validation)
    if (!type.toLowerCase().includes('gallery') && !imageUrl) {
      errMap.image = t.errImageRequired;
    }

    // Gallery images (mandatory for gallery post type)
    if (type.toLowerCase().includes('gallery')) {
      if (galleryItems.length < 3) {
        errMap.galleryImages = t.errGalleryMin;
      }
    }

    // Web URL (mandatory when Web Post is enabled)
    if (isWebPost && !webUrl.trim()) {
      errMap.webUrl = t.errWebUrlInvalid;
    }

    // Video Source + Video URL (mandatory for video post types)
    if (type.toLowerCase().includes('video')) {
      if (!videoSource) {
        errMap.videoSource = t.errVideoSourceRequired;
      }
      if (!videoUrl.trim()) {
        errMap.videoUrl = t.errVideoUrlRequired;
      }
    }

    if (Object.keys(errMap).length > 0) {
      setErrors(errMap);
      return;
    }

    // Toggle preview screen to show phone frame
    setShowPreviewScreen(true);
  };

  const handleFinalPublish = async () => {
    let finalImageUrl = imageUrl;
    let finalGalleryUrls: string[] = [];

    setIsUploading(true);
    setUploadError(null);

    try {
      const { UploadService } = await import('@/modules/media/services/upload.service');

      if (imageFile && !type.toLowerCase().includes('gallery')) {
        finalImageUrl = await UploadService.uploadImage(imageFile);
      }

      if (type.toLowerCase().includes('gallery') && galleryItems.length > 0) {
        finalGalleryUrls = await Promise.all(
          galleryItems.map(async (item) => {
            if (item.file) {
              return await UploadService.uploadImage(item.file);
            }
            return item.url;
          })
        );
      }
    } catch (err: any) {
      console.error('Image upload failed', err);
      setUploadError(t.uploadFailed || 'Image upload failed. Please try again.');
      setIsUploading(false);
      return;
    }

    const languageId = initialData?.languageId || langIdMap[postLanguage] || 1;
    const categoryIds = selectedCategories
      .map((catKey) => {
        const found = dynamicCategories.find(
          (dc) =>
            dc.key === catKey ||
            dc.id === catKey ||
            String(dc.id) === String(catKey) ||
            dc.labelEn === catKey ||
            dc.labelTe === catKey ||
            dc.labelHi === catKey ||
            dc.labelMl === catKey
        );
        const rawId = found?.id ?? (typeof catKey === 'number' ? catKey : parseInt(String(catKey), 10));
        return typeof rawId === 'number' && !isNaN(rawId) && rawId > 0 ? rawId : null;
      })
      .filter((id): id is number => id !== null && id > 0);

    const locationIds = location
      .map((locKey) => {
        const found = dynamicLocations.find(
          (dl) =>
            dl.key === locKey ||
            dl.id === locKey ||
            String(dl.id) === String(locKey) ||
            dl.labelEn === locKey ||
            dl.labelTe === locKey ||
            dl.labelHi === locKey ||
            dl.labelMl === locKey
        );
        const rawId = found?.id ?? (typeof locKey === 'number' ? locKey : parseInt(String(locKey), 10));
        return typeof rawId === 'number' && !isNaN(rawId) && rawId > 0 ? rawId : null;
      })
      .filter((id): id is number => id !== null && id > 0);

    const parsedAitagIds = selectedTags
      .map((tagKey) => {
        const found = dynamicTags.find(
          (dt) =>
            dt.key === tagKey ||
            dt.id === tagKey ||
            String(dt.id) === String(tagKey) ||
            dt.labelEn === tagKey ||
            dt.labelTe === tagKey ||
            dt.labelHi === tagKey ||
            dt.labelMl === tagKey
        );
        const rawId = found?.id ?? (typeof tagKey === 'number' ? tagKey : parseInt(String(tagKey), 10));
        return typeof rawId === 'number' && !isNaN(rawId) && rawId > 0 ? rawId : null;
      })
      .filter((id): id is number => id !== null && id > 0);

    const aitagIds = parsedAitagIds;

    onSubmit({
      titleEn: postLanguage === 'en' ? title : '',
      bodyEn: postLanguage === 'en' ? body : '',
      titleTe: postLanguage === 'te' ? title : '',
      bodyTe: postLanguage === 'te' ? body : '',
      titleHi: postLanguage === 'hi' ? title : '',
      bodyHi: postLanguage === 'hi' ? body : '',
      titleMl: postLanguage === 'ml' ? title : '',
      bodyMl: postLanguage === 'ml' ? body : '',
      categories: selectedCategories,
      tags: selectedTags,
      location,
      type,
      imageUrl: finalImageUrl || (finalGalleryUrls.length > 0 ? finalGalleryUrls[0] : null),
      galleryImages: finalGalleryUrls,
      postLanguage,
      language_code: postLanguage,
      publishMode,
      scheduleTime,
      languageId,
      categoryIds,
      locationIds,
      aitagIds,
      aitag_ids: aitagIds,
      postType: type,
      isSticky,
      isStickyPost: isSticky,
      isWebPost,
      webUrl,
      postUrl: webUrl,
      videoSource,
      videoUrl,
      video_platform: videoSource,
      video_url: videoUrl,
      notificationTitle,
      imageTitle,
    });
    setIsUploading(false);
    handleReset();
  };

  // Schedule time helpers (computed fresh each render)
  const nowForSchedule = new Date();
  const padZ = (n: number) => String(n).padStart(2, '0');
  const minScheduleTime = `${padZ(nowForSchedule.getHours())}:${padZ(nowForSchedule.getMinutes())}`;
  const todayDate = `${nowForSchedule.getFullYear()}-${padZ(nowForSchedule.getMonth() + 1)}-${padZ(nowForSchedule.getDate())}`;

  if (showPreviewScreen) {
    if (isUploading) {
      return (
        <Box
          sx={{
            backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '82vh',
          }}
        >
          <Loader message={t.uploadingImage} minHeight="200px" />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 3, py: 1.5, flexShrink: 0,
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#f4f3f8',
          }}
        >
          <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1rem' }}>
            {isEditMode ? 'Edit News Preview' : t.previewTitle}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ overflowY: 'auto', flex: 1, p: 2.5 }}>
          <Grid container spacing={3} alignItems="stretch">

            {/* Left: Summary + Publish Mode */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: 2.5, height: '100%', borderRadius: '12px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fbfbfb', display: 'flex', flexDirection: 'column', gap: 2 }}>

                <Typography variant="subtitle2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700 }}>{t.lblSummary}</Typography>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

                {/* Headline */}
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>Headline / Title</Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#fff' : '#1c1445', fontWeight: 600, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: title }} />
                </Box>

                {/* Body */}
                <Box sx={{ maxHeight: '90px', overflowY: 'auto', pr: 0.5 }}>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>News Body Content</Typography>
                  <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(28,20,69,0.8)', lineHeight: 1.6, display: 'block' }} dangerouslySetInnerHTML={{ __html: body }} />
                </Box>

                {/* Lang & Type */}
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.3 }}>Language</Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#fff' : '#1c1445', fontWeight: 600, fontSize: '0.82rem' }}>
                      {postLanguage === 'te' ? 'Telugu' : postLanguage === 'hi' ? 'Hindi' : postLanguage === 'ml' ? 'Malayalam' : 'English'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.3 }}>Post Type</Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#fff' : '#1c1445', fontWeight: 600, fontSize: '0.82rem' }}>{type}</Typography>
                  </Grid>
                </Grid>

                {/* Locations */}
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>Publish Locations</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {location.map((l, idx) => <Chip key={`${l}-${idx}`} label={l} size="small" sx={{ borderRadius: '6px', height: '22px', fontSize: '0.72rem', backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.06)', color: isDark ? '#a6e2f5' : '#1c1445' }} />)}
                  </Box>
                </Box>

                {/* Categories */}
                <Box>
                  <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>Categories</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedCategories.map((c, idx) => <Chip key={`${c}-${idx}`} label={c} size="small" sx={{ borderRadius: '6px', height: '22px', fontSize: '0.72rem', backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1c1445' }} />)}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right: Mobile Phone Simulator */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Box sx={{ width: '255px', height: '420px', borderRadius: '30px', border: '8px solid #222222', boxShadow: '0 16px 36px rgba(0,0,0,0.28)', overflow: 'hidden', position: 'relative', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                {/* Notch */}
                <Box sx={{ width: '50px', height: '12px', backgroundColor: '#222222', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
                {/* Status Bar */}
                <Box sx={{ height: '22px', px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#181818', pt: 1.5, zIndex: 9 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.58rem', fontWeight: 600, color: '#ffffff' }}>4:27</Typography>
                  <Box sx={{ display: 'flex', gap: 0.4 }}>
                    <Box component="span" sx={{ fontSize: '0.52rem', color: '#fff' }}>VoWiFi</Box>
                    <Box component="span" sx={{ fontSize: '0.52rem', color: '#fff' }}>4G</Box>
                    <Box component="span" sx={{ fontSize: '0.52rem', color: '#fff' }}>= 44</Box>
                  </Box>
                </Box>
                {/* BIG TV App Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.2, py: 0.8, backgroundColor: '#181818', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ backgroundColor: '#e53935', px: 0.7, py: 0.25, borderRadius: '2px' }}>
                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '0.3px', lineHeight: 1 }}>BIG TV</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', flexGrow: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {selectedTags.map((tag, idx) => {
                      const tagObj = dynamicTags.find((t) => t.key === tag);
                      const label = postLanguage === 'te' ? tagObj?.labelTe : postLanguage === 'hi' ? tagObj?.labelHi : postLanguage === 'ml' ? tagObj?.labelMl : tagObj?.labelEn;
                      return <Typography key={`${tag}-${idx}`} variant="caption" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.62rem', whiteSpace: 'nowrap' }}>{label}</Typography>;
                    })}
                  </Box>
                </Box>
                {/* Phone Body */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative', width: '100%', height: '130px', overflow: 'hidden' }}>
                    {imageUrl ? (
                      <Box component="img" src={imageUrl} alt="Banner" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.62rem' }}>No Image</Typography>
                      </Box>
                    )}
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(229,57,53,0.95)', py: 0.5, px: 1.2 }}>
                      <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.65rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} dangerouslySetInnerHTML={{ __html: title || '6@0M7?  2G&A' }} />
                    </Box>
                  </Box>
                  <Box sx={{ height: '2.5px', backgroundColor: '#e53935' }} />
                  <Box sx={{ p: 1.2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.8 }}>
                      <Typography sx={{ color: '#e53935', fontWeight: 800, fontSize: '0.78rem', lineHeight: 1.3, flexGrow: 1 }} dangerouslySetInnerHTML={{ __html: title || 'శీర్షిక లేదు' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, border: '1px solid #e53935', borderRadius: '16px', px: 0.7, py: 0.15, flexShrink: 0, backgroundColor: '#ffffff' }}>
                        <ThumbUpOutlined sx={{ fontSize: '0.62rem', color: '#e53935' }} />
                        <ChatBubbleOutline sx={{ fontSize: '0.62rem', color: '#e53935' }} />
                        <ShareOutlined sx={{ fontSize: '0.62rem', color: '#e53935' }} />
                        <SyncOutlined sx={{ fontSize: '0.62rem', color: '#e53935' }} />
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#333333', fontSize: '0.68rem', lineHeight: 1.6, display: 'block' }} dangerouslySetInnerHTML={{ __html: body || 'కంటెంట్ లేదు' }} />
                    <Typography variant="caption" sx={{ color: '#777777', fontSize: '0.58rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                      =R {publishMode === 'schedule' && scheduleTime ? `Scheduled ${scheduleTime}` : 'Just now'}
                    </Typography>
                  </Box>
                </Box>
                {/* Home Indicator */}
                <Box sx={{ width: '80px', height: '3px', backgroundColor: '#999999', borderRadius: '2px', position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexShrink: 0,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#fafafa',
          }}
        >
          {uploadError && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {uploadError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={() => setShowPreviewScreen(false)}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: isDark ? '#d0caeb' : '#5c548a', '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' } }}
          >
            {t.btnBack}
          </Button>
          <Button fullWidth variant="contained"
            disabled={publishMode === 'schedule' && !scheduleTime}
            onClick={handleFinalPublish}
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 700, boxShadow: 'none',
              backgroundColor: publishMode === 'draft' ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : (isDark ? '#a6e2f5' : '#1c1445'),
              color: publishMode === 'draft' ? (isDark ? '#d0caeb' : '#5c548a') : (isDark ? '#1c1445' : '#ffffff'),
              '&:hover': { boxShadow: 'none', opacity: 0.9 },
              '&.Mui-disabled': { opacity: 0.4 },
            }}
          >
            {publishMode === 'draft'
              ? '=ݝ Save as Draft'
              : publishMode === 'schedule'
                ? (scheduleTime ? `=P� Schedule for ${scheduleTime}` : '=P� Select a time first')
                : (isEditMode ? 'Save Changes' : t.btnPublish)}
          </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Form Workspace */}
      <Box sx={{ p: 3 }}>
        {/* Top Dropdowns Grid */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {/* Language Selection (Single Select Dropdown) */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Language *"
                value={postLanguage}
                onChange={(e) => {
                  setPostLanguage(e.target.value as any);
                  if (errors.language) setErrors((prev) => { const n = { ...prev }; delete n.language; return n; });
                }}
                error={!!errors.language}
                helperText={errors.language || ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: errors.language ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                    '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: errors.language ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                  },
                  '& .MuiInputLabel-root': { color: errors.language ? '#f44336' : (isDark ? '#d0caeb' : '#5c548a') },
                  '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                }}
              >
                {apiLanguages.length > 0 ? (
                  apiLanguages.map((lang, idx) => (
                    <MenuItem key={`${lang.code}-${idx}`} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))
                ) : (
                  (['en', 'te', 'hi', 'ml'] as const).map((langCode) => {
                    const labelKey = `tab${langCode.charAt(0).toUpperCase()}${langCode.slice(1)}` as keyof typeof t;
                    const label = t[labelKey];
                    const labelStr = typeof label === 'string' ? label : langCode.toUpperCase();
                    return (
                      <MenuItem key={langCode} value={langCode}>
                        {labelStr}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            </Box>
          </Grid>

          {/* AI Tags Multiselect Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label={t.lblTags}
              SelectProps={{
                multiple: true,
                value: selectedTags,
                onChange: (e) => handleTagsChange(e.target.value as string[]),
                renderValue: (selected) => {
                  const selectedArr = selected as string[];
                  if (selectedArr.length === dynamicTags.length) {
                    return <Chip label="All Tags" size="small" sx={{ borderRadius: '6px' }} />;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedArr.map((val, idx) => {
                        const tag = dynamicTags.find((t) => t.key === val);
                        const label = language === 'te' ? tag?.labelTe : language === 'hi' ? tag?.labelHi : language === 'ml' ? tag?.labelMl : tag?.labelEn;
                        return (
                          <Chip
                            key={`${val}-${idx}`}
                            label={label}
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              height: '20px',
                              fontSize: '0.72rem',
                              backgroundColor: isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.1)',
                              color: isDark ? '#a6e2f5' : '#1c1445',
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                },
              }}
              error={!!errors.tags}
              helperText={errors.tags || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.tags ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
            >
              <MenuItem value="all">
                <Checkbox checked={selectedTags.length === dynamicTags.length} size="small" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Select All</Typography>
              </MenuItem>
              {dynamicTags.map((tag, idx) => {
                const label = language === 'te' ? tag.labelTe : language === 'hi' ? tag.labelHi : language === 'ml' ? tag.labelMl : tag.labelEn;
                return (
                  <MenuItem key={`tag-${tag.id ?? tag.key}-${idx}`} value={tag.key}>
                    <Checkbox checked={selectedTags.includes(tag.key)} size="small" />
                    {label}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          {/* Publish Location Select Dropdown (Multiselect) */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label={t.lblLocation}
              SelectProps={{
                multiple: true,
                value: location,
                onChange: (e) => handleLocationChange(e.target.value as string[]),
                renderValue: (selected) => {
                  const selectedArr = selected as string[];
                  if (selectedArr.length === dynamicLocations.length) {
                    return <Chip label="All Locations" size="small" sx={{ borderRadius: '6px' }} />;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedArr.map((val, idx) => {
                        const loc = dynamicLocations.find((l) => l.key === val);
                        const label = language === 'te' ? loc?.labelTe : language === 'hi' ? loc?.labelHi : language === 'ml' ? loc?.labelMl : loc?.labelEn;
                        return (
                          <Chip
                            key={`${val}-${idx}`}
                            label={label}
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              height: '20px',
                              fontSize: '0.72rem',
                              backgroundColor: isDark ? 'rgba(166,226,245,0.25)' : 'rgba(28,20,69,0.1)',
                              color: isDark ? '#a6e2f5' : '#1c1445',
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                },
              }}
              error={!!errors.location}
              helperText={errors.location || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: errors.location ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                },
                '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
              }}
            >
              <MenuItem value="all">
                <Checkbox checked={location.length === dynamicLocations.length} size="small" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Select All</Typography>
              </MenuItem>
              {dynamicLocations.map((loc, idx) => {
                const label = (language === 'te' ? loc.labelTe : language === 'hi' ? loc.labelHi : language === 'ml' ? loc.labelMl : loc.labelEn) || loc.labelEn || loc.key || `Location ${idx + 1}`;
                return (
                  <MenuItem key={`loc-${loc.id ?? loc.key}-${idx}`} value={loc.key}>
                    <Checkbox checked={location.includes(loc.key)} size="small" />
                    {label}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          {/* Post Type Select Dropdown (Single Select) + Top Right Close button */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                select
                fullWidth
                size="small"
                label={t.lblType}
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDark ? '#ffffff' : '#1c1445',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' },
                    '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: isDark ? '#a6e2f5' : '#1c1445' },
                  },
                  '& .MuiInputLabel-root': { color: isDark ? '#d0caeb' : '#5c548a' },
                }}
              >
                {apiPostTypes.length > 0 ? (
                  apiPostTypes.map((pt, idx) => (
                    <MenuItem key={`pt-${pt.id ?? pt.name}-${idx}`} value={pt.name}>
                      {pt.name}
                    </MenuItem>
                  ))
                ) : (
                  ['Standard', 'Video', 'Reel', 'Podcast'].map((ptName) => (
                    <MenuItem key={`ptName-${ptName}`} value={ptName}>
                      {ptName} Post
                    </MenuItem>
                  ))
                )}
              </TextField>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: isDark ? '#d0caeb' : '#5c548a',
                  border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  p: '8px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

        {/* Main 2-column Grid Split */}
        <Grid container spacing={3}>
          {/* Left Column: Categories List */}
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#fbfbfb',
                height: 'auto',
              }}
            >
              <Typography variant="body2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ fontSize: '1.1rem' }} /> {t.lblCategories}
              </Typography>
              <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
              
              {errors.categories && (
                <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block', mb: 1 }}>
                  {errors.categories}
                </Typography>
              )}

              <Box sx={{ maxHeight: '180px', overflowY: 'auto', pr: 0.5 }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.length === dynamicCategories.length}
                        indeterminate={selectedCategories.length > 0 && selectedCategories.length < dynamicCategories.length}
                        onChange={() => {
                          if (selectedCategories.length === dynamicCategories.length) {
                            setSelectedCategories([]);
                          } else {
                            setSelectedCategories(dynamicCategories.map((c) => c.key));
                          }
                        }}
                        size="small"
                        sx={{
                          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                          '&.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' },
                          '&.MuiCheckbox-indeterminate': { color: isDark ? '#a6e2f5' : '#1c1445' },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#1c1445', fontWeight: 700, fontSize: '0.82rem' }}>
                        Select All
                      </Typography>
                    }
                    sx={{ mb: 0.5 }}
                  />
                  <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' }} />
                  {dynamicCategories.map((cat, idx) => {
                    const label = language === 'te' ? cat.labelTe : language === 'hi' ? cat.labelHi : language === 'ml' ? cat.labelMl : cat.labelEn;
                    return (
                      <FormControlLabel
                        key={`cat-${cat.id ?? cat.key}-${idx}`}
                        control={
                          <Checkbox
                            inputProps={{ 'aria-label': label }}
                            checked={selectedCategories.includes(cat.key)}
                            onChange={() => handleCategoryToggle(cat.key)}
                            size="small"
                            sx={{
                              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                              '&.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#1c1445', fontWeight: 500, fontSize: '0.82rem' }}>
                            {label}
                          </Typography>
                        }
                        sx={{ mb: 0.5 }}
                      />
                    );
                  })}
                </FormGroup>
              </Box>

              {/*    Publish Mode Selector    */}
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                <Typography variant="body2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  Publish Mode
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  {(['now', 'draft', 'schedule'] as const).map((mode) => {
                    const labels = { now: '=� Publish Now', draft: '=� Save as Draft', schedule: '=P Schedule' };
                    const isSelected = publishMode === mode;
                    return (
                      <Box
                        key={mode}
                        onClick={() => setPublishMode(mode)}
                        sx={{
                          px: 1.2, py: 0.7, borderRadius: '10px', cursor: 'pointer',
                          border: isSelected
                            ? `2px solid ${isDark ? '#a6e2f5' : '#1c1445'}`
                            : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                          backgroundColor: isSelected
                            ? (isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.06)')
                            : (isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'),
                          color: isSelected ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? '#d0caeb' : '#5c548a'),
                          fontSize: '0.8rem', fontWeight: isSelected ? 700 : 500,
                          transition: 'all 0.18s ease', userSelect: 'none',
                          display: 'flex', alignItems: 'center', gap: 0.8,
                          '&:hover': {
                            borderColor: isDark ? 'rgba(166,226,245,0.4)' : 'rgba(28,20,69,0.35)',
                            backgroundColor: isDark ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.03)',
                          },
                        }}
                      >
                        {labels[mode]}
                        {mode === 'now' && (
                          <Box component="span" sx={{ ml: 'auto', fontSize: '0.65rem', backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.08)', color: isDark ? '#a6e2f5' : '#1c1445', px: 0.8, py: 0.2, borderRadius: '4px', fontWeight: 700 }}>
                            DEFAULT
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Schedule time picker */}
                {publishMode === 'schedule' && (
                  <Box sx={{ mt: 1.5, p: 1.5, borderRadius: '10px', backgroundColor: isDark ? 'rgba(166,226,245,0.05)' : 'rgba(28,20,69,0.03)', border: isDark ? '1px solid rgba(166,226,245,0.15)' : '1px solid rgba(28,20,69,0.1)' }}>
                    <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600, display: 'block', mb: 0.8, fontSize: '0.74rem' }}>
                      Today only � {todayDate}
                    </Typography>
                    <Box
                      component="input"
                      type="time"
                      value={scheduleTime}
                      min={minScheduleTime}
                      max="23:59"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (val >= minScheduleTime && val <= '23:59') setScheduleTime(val);
                      }}
                      sx={{
                        width: '100%', padding: '7px 10px', borderRadius: '8px',
                        border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.18)',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        color: isDark ? '#ffffff' : '#1c1445', fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
                        colorScheme: isDark ? 'dark' : 'light',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        '&::-webkit-calendar-picker-indicator': { filter: isDark ? 'invert(1)' : 'none', cursor: 'pointer' },
                      }}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.6, fontSize: '0.7rem', color: scheduleTime ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? '#d0caeb' : '#5c548a') }}>
                      {scheduleTime ? ` Will publish at ${scheduleTime}` : `� Pick a time: ${minScheduleTime} � 23:59`}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Is Sticky Post Toggle */}
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.2,
                    borderRadius: '10px',
                    backgroundColor: isSticky
                      ? (isDark ? 'rgba(166,226,245,0.08)' : 'rgba(28,20,69,0.06)')
                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                    border: isSticky
                      ? (isDark ? '1px solid rgba(166,226,245,0.25)' : '1px solid rgba(28,20,69,0.2)')
                      : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)'),
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#d0caeb' : '#1c1445' }}>
                      📌 {t.lblIsSticky}
                    </Typography>
                  </Box>
                  <Switch
                    checked={isSticky}
                    onChange={(e) => setIsSticky(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: isDark ? '#a6e2f5' : '#1c1445',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Is Web Post Toggle */}
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.2,
                    borderRadius: '10px',
                    backgroundColor: isWebPost
                      ? (isDark ? 'rgba(166,226,245,0.08)' : 'rgba(28,20,69,0.06)')
                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                    border: isWebPost
                      ? (isDark ? '1px solid rgba(166,226,245,0.25)' : '1px solid rgba(28,20,69,0.2)')
                      : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)'),
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#d0caeb' : '#1c1445' }}>
                      🌐 {t.lblIsWebPost}
                    </Typography>
                  </Box>
                  <Switch
                    checked={isWebPost}
                    onChange={(e) => setIsWebPost(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: isDark ? '#a6e2f5' : '#1c1445',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Web URL — shown only when Web Post is ON */}
              {isWebPost && (
                <Box sx={{ mt: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t.lblWebUrl}
                    placeholder={t.phWebUrl}
                    value={webUrl}
                    onChange={(e) => {
                      setWebUrl(e.target.value);
                      if (errors.webUrl) setErrors((prev) => { const n = { ...prev }; delete n.webUrl; return n; });
                    }}
                    error={!!errors.webUrl}
                    helperText={errors.webUrl || ''}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ color: isDark ? '#a6e2f5' : '#5c548a', mr: 0.5, fontSize: '0.9rem' }}>🔗</Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: errors.webUrl ? '#f44336' : (isDark ? 'rgba(166,226,245,0.3)' : 'rgba(28,20,69,0.25)') },
                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(28,20,69,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: errors.webUrl ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                      },
                      '& .MuiInputLabel-root': { color: errors.webUrl ? '#f44336' : (isDark ? '#a6e2f5' : '#5c548a') },
                      '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                    }}
                  />
                </Box>
              )}

              {/* Video Source + Video URL — shown only for video post types */}
              {type.toLowerCase().includes('video') && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                  <Typography variant="body2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, mb: 1.2, fontSize: '0.82rem' }}>
                    🎬 {t.lblVideoSource}
                  </Typography>

                  {/* Source Tiles */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {[
                      {
                        id: 'youtube',
                        label: 'YouTube',
                        logo: (
                          <Box sx={{ width: 22, height: 16, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: 22, height: 16, borderRadius: '4px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Box sx={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #ffffff', ml: 0.3 }} />
                            </Box>
                          </Box>
                        ),
                        selectedBg: 'rgba(255,0,0,0.1)',
                        selectedBorder: '#FF0000',
                        selectedColor: '#FF0000',
                      },
                      {
                        id: 'x',
                        label: 'X',
                        logo: (
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: isDark ? '#ffffff' : '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ color: isDark ? '#000000' : '#ffffff', fontSize: '0.65rem', fontWeight: 900, lineHeight: 1, fontFamily: 'Arial Black, sans-serif' }}>𝕏</Typography>
                          </Box>
                        ),
                        selectedBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                        selectedBorder: isDark ? '#ffffff' : '#000000',
                        selectedColor: isDark ? '#ffffff' : '#000000',
                      },
                      {
                        id: 'bigtv',
                        label: 'BigTV',
                        logo: (
                          <Box sx={{ width: 22, height: 22, borderRadius: '6px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ color: '#ffffff', fontSize: '0.55rem', fontWeight: 900, lineHeight: 1 }}>BIG</Typography>
                          </Box>
                        ),
                        selectedBg: 'rgba(124,58,237,0.12)',
                        selectedBorder: '#7c3aed',
                        selectedColor: '#7c3aed',
                      },
                    ].map((src) => {
                      const isSelected = videoSource === src.id;
                      return (
                        <Box
                          key={src.id}
                          onClick={() => {
                            setVideoSource(isSelected ? '' : src.id);
                            if (errors.videoSource) setErrors((prev) => { const n = { ...prev }; delete n.videoSource; return n; });
                          }}
                          sx={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.6,
                            py: 1.2, px: 0.5, borderRadius: '10px', cursor: 'pointer',
                            border: isSelected ? `2px solid ${src.selectedBorder}` : (isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'),
                            backgroundColor: isSelected ? src.selectedBg : (isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'),
                            transition: 'all 0.18s ease',
                            '&:hover': { borderColor: src.selectedBorder, backgroundColor: src.selectedBg },
                          }}
                        >
                          {src.logo}
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? src.selectedColor : (isDark ? '#d0caeb' : '#5c548a') }}>
                            {src.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  {errors.videoSource && (
                    <Typography variant="caption" sx={{ color: '#f44336', fontSize: '0.72rem', display: 'block', mt: -1, mb: 1 }}>
                      {errors.videoSource}
                    </Typography>
                  )}

                  {/* Video URL */}
                  <TextField
                    fullWidth
                    size="small"
                    label={t.lblVideoUrl}
                    placeholder={t.phVideoUrl}
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      if (errors.videoUrl) setErrors((prev) => { const n = { ...prev }; delete n.videoUrl; return n; });
                    }}
                    error={!!errors.videoUrl}
                    helperText={errors.videoUrl || ''}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ color: isDark ? '#a6e2f5' : '#5c548a', mr: 0.5, fontSize: '0.9rem' }}>🎬</Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: errors.videoUrl ? '#f44336' : (isDark ? 'rgba(166,226,245,0.3)' : 'rgba(28,20,69,0.25)') },
                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(28,20,69,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: errors.videoUrl ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                      },
                      '& .MuiInputLabel-root': { color: errors.videoUrl ? '#f44336' : (isDark ? '#a6e2f5' : '#5c548a') },
                      '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>


          {/* Right Column: Content Editor and Banner */}
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* News Title — plain TextField */}
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label={t.lblTitle}
                    placeholder={t.phTitle}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => { const n = { ...prev }; delete n.title; return n; });
                    }}
                    error={!!errors.title}
                    helperText={errors.title || ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: errors.title ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                        '&.Mui-focused fieldset': { borderColor: errors.title ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                      },
                      '& .MuiInputLabel-root': { color: errors.title ? '#f44336' : (isDark ? '#d0caeb' : '#5c548a') },
                      '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: countWords(title) > 10 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                      display: 'block', mt: 0.3, textAlign: 'right', fontSize: '0.7rem', fontWeight: countWords(title) > 10 ? 700 : 400,
                    }}
                  >
                    {t.wordCount(countWords(title), 10)}
                  </Typography>
                </Box>

                {/* Notification Title */}
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label={isImageOrGalleryType ? t.lblNotificationTitle.replace('*', '').trim() : t.lblNotificationTitle}
                    placeholder={t.phNotificationTitle}
                    value={notificationTitle}
                    onChange={(e) => {
                      setNotificationTitle(e.target.value);
                      if (errors.notificationTitle) setErrors((prev) => { const n = { ...prev }; delete n.notificationTitle; return n; });
                    }}
                    error={!!errors.notificationTitle}
                    helperText={errors.notificationTitle || ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: errors.notificationTitle ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                        '&.Mui-focused fieldset': { borderColor: errors.notificationTitle ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                      },
                      '& .MuiInputLabel-root': { color: errors.notificationTitle ? '#f44336' : (isDark ? '#d0caeb' : '#5c548a') },
                      '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: countWords(notificationTitle) > 10 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                      display: 'block', mt: 0.3, textAlign: 'right', fontSize: '0.7rem', fontWeight: countWords(notificationTitle) > 10 ? 700 : 400,
                    }}
                  >
                    {t.wordCount(countWords(notificationTitle), 10)}
                  </Typography>
                </Box>

                {/* Image Title */}
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label={isImageOrGalleryType ? t.lblImageTitle.replace('*', '').trim() : t.lblImageTitle}
                    placeholder={t.phImageTitle}
                    value={imageTitle}
                    onChange={(e) => {
                      setImageTitle(e.target.value);
                      if (errors.imageTitle) setErrors((prev) => { const n = { ...prev }; delete n.imageTitle; return n; });
                    }}
                    error={!!errors.imageTitle}
                    helperText={errors.imageTitle || ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderRadius: '10px',
                        '& fieldset': { borderColor: errors.imageTitle ? '#f44336' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)') },
                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(28,20,69,0.4)' },
                        '&.Mui-focused fieldset': { borderColor: errors.imageTitle ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                      },
                      '& .MuiInputLabel-root': { color: errors.imageTitle ? '#f44336' : (isDark ? '#d0caeb' : '#5c548a') },
                      '& .MuiFormHelperText-root': { color: '#f44336', mx: 0 },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: countWords(imageTitle) > 10 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                      display: 'block', mt: 0.3, textAlign: 'right', fontSize: '0.7rem', fontWeight: countWords(imageTitle) > 10 ? 700 : 400,
                    }}
                  >
                    {t.wordCount(countWords(imageTitle), 10)}
                  </Typography>
                </Box>

                <HtmlEditor
                  label={t.lblBody}
                  placeholder={t.phBody}
                  value={body}
                  onChange={(val) => {
                    setBody(val);
                    if (errors.body) setErrors((prev) => { const n = { ...prev }; delete n.body; return n; });
                  }}
                  error={errors.body}
                  isDark={isDark}
                  minHeight="220px"
                />
                {/* Body word counter */}
                <Typography
                  variant="caption"
                  sx={{
                    color: countWords(body) > 40 ? '#f44336' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'),
                    display: 'block', mt: -1.5, textAlign: 'right', fontSize: '0.7rem', fontWeight: countWords(body) > 40 ? 700 : 400,
                  }}
                >
                  {t.wordCount(countWords(body), 40)}
                </Typography>
              </Box>

              {/* Image Uploader — single for regular types, gallery grid for Gallery type */}
              <Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }}
                />

                {type.toLowerCase().includes('gallery') ? (
                  /* ===== GALLERY MULTI-IMAGE UPLOADER ===== */
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: errors.galleryImages ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445'), fontSize: '0.82rem' }}>
                        🖼️ {t.lblGalleryImages}
                      </Typography>
                      <Typography variant="caption" sx={{ color: galleryItems.length < 3 ? '#f44336' : galleryItems.length >= 10 ? '#ff9800' : (isDark ? '#a6e2f5' : '#1c1445'), fontWeight: 600, fontSize: '0.72rem' }}>
                        {galleryItems.length}/10 &bull; {t.hintGallery}
                      </Typography>
                    </Box>

                    {/* Gallery Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 1 }}>
                      {galleryItems.map((item, idx) => (
                        <Box key={`gallery-item-${idx}`} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', aspectRatio: '1' }}>
                          <Box component="img" src={item.url} alt={`gallery-${idx}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <IconButton
                            size="small"
                            onClick={() => setGalleryItems((prev) => prev.filter((_, i) => i !== idx))}
                            sx={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(244,67,54,0.85)', color: '#fff', p: 0.3, '&:hover': { backgroundColor: '#f44336' } }}
                          >
                            <DeleteOutline sx={{ fontSize: '0.8rem' }} />
                          </IconButton>
                          {idx < 3 && (
                            <Box sx={{ position: 'absolute', bottom: 2, left: 2, backgroundColor: 'rgba(28,20,69,0.75)', borderRadius: '4px', px: 0.5, py: 0.1 }}>
                              <Typography sx={{ color: '#fff', fontSize: '0.55rem', fontWeight: 700 }}>{idx + 1}</Typography>
                            </Box>
                          )}
                        </Box>
                      ))}

                      {/* Add button — shown until max 10 */}
                      {galleryItems.length < 10 && (
                        <Box
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.multiple = true;
                            input.onchange = (e: any) => {
                              const files: File[] = Array.from(e.target.files || []);
                              const remaining = 10 - galleryItems.length;
                              const toProcess = files.slice(0, remaining);
                              toProcess.forEach((file) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const dataUrl = ev.target?.result as string;
                                  setGalleryItems((prev) => {
                                    if (prev.length >= 10) return prev;
                                    return [...prev, { url: dataUrl, file }];
                                  });
                                };
                                reader.readAsDataURL(file);
                              });
                            };
                            input.click();
                          }}
                          sx={{
                            borderRadius: '8px', border: `2px dashed ${errors.galleryImages ? '#f44336' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')}`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', aspectRatio: '1', minHeight: '90px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(28,20,69,0.02)',
                            '&:hover': { borderColor: isDark ? '#a6e2f5' : '#1c1445', backgroundColor: isDark ? 'rgba(166,226,245,0.05)' : 'rgba(28,20,69,0.04)' },
                          }}
                        >
                          <AddPhotoAlternate sx={{ fontSize: '1.6rem', color: isDark ? '#d0caeb' : '#9e9e9e', mb: 0.3 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: isDark ? '#d0caeb' : '#9e9e9e', textAlign: 'center' }}>Add Photo</Typography>
                        </Box>
                      )}
                    </Box>

                    {errors.galleryImages && (
                      <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block', mt: 1 }}>
                        {errors.galleryImages}
                      </Typography>
                    )}
                  </Box>
                ) : imageUrl ? (
                  <Box sx={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                    <Box
                      component="img"
                      src={imageUrl}
                      alt="Banner Preview"
                      sx={{ width: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block' }}
                    />
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2,
                    }}>
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                        ✓ Banner Uploaded
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setImageUrl(null);
                          setImageFile(null);
                        }}
                        sx={{ color: '#fff', backgroundColor: 'rgba(244,67,54,0.8)', '&:hover': { backgroundColor: '#f44336' }, p: 0.4 }}
                      >
                        <DeleteOutline sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: `2px dashed ${errors.image ? '#f44336' : (dragOver ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'))}`,
                      borderRadius: '10px', p: 5, textAlign: 'center', cursor: 'pointer',
                      backgroundColor: dragOver ? 'rgba(166,226,245,0.06)' : 'rgba(28,20,69,0.02)',
                      '&:hover': { borderColor: errors.image ? '#f44336' : (isDark ? '#a6e2f5' : '#1c1445') },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: '3rem', color: isDark ? '#d0caeb' : '#9e9e9e', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, display: 'block', fontSize: '0.85rem' }}>
                      Drag and drop banner photo or click to upload
                    </Typography>
                  </Box>
                )}
                {errors.image && (
                  <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block', mt: 1 }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer controls */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          gap: 2,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? 'rgba(38, 28, 86, 0.3)' : '#fafafa',
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: isDark ? '#d0caeb' : '#5c548a',
            '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' },
          }}
        >
          {t.btnCancel}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
            color: isDark ? '#1c1445' : '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270', boxShadow: 'none' },
          }}
        >
          {isEditMode ? 'Update News' : t.btnSubmit}
        </Button>
      </Box>
    </Box>
  );
};
