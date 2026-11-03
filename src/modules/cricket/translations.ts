export interface CricketTranslations {
  pageTitle: string;
  pageSubtitle: string;
  syncButton: string;
  syncing: string;
  statTotal: string;
  statPublished: string;
  statUnpublished: string;
  statLive: string;
  filterAll: string;
  filterLive: string;
  filterUpcoming: string;
  filterRecent: string;
  publishAll: string;
  publishedOnly: string;
  unpublishedOnly: string;
  searchPlaceholder: string;
  bulkSelected: string;
  bulkPublish: string;
  bulkUnpublish: string;
  bulkDeselect: string;
  colMatch: string;
  colTeams: string;
  colFormat: string;
  colState: string;
  colStatus: string;
  colPublished: string;
  colPublishedAt: string;
  colActions: string;
  scorecard: string;
  quickPublish: string;
  quickUnpublish: string;
  published: string;
  unpublished: string;
  neverPublished: string;
  modalTitle: string;
  modalSubtitle: string;
  liveBadge: string;
  recentBadge: string;
  upcomingBadge: string;
  batting: string;
  bowling: string;
  batsman: string;
  bowler: string;
  runs: string;
  balls: string;
  fours: string;
  sixes: string;
  sr: string;
  overs: string;
  maidens: string;
  wickets: string;
  economy: string;
  partnership: string;
  crr: string;
  rrr: string;
  target: string;
  recentOvers: string;
  venue: string;
  startTime: string;
  lastSynced: string;
  publishSwitchLabel: string;
  toastSyncSuccess: string;
  toastSyncError: string;
  toastPublishSuccess: string;
  toastUnpublishSuccess: string;
  toastStatusError: string;
  toastBulkSuccess: string;
  toastBulkError: string;
  noMatchesFound: string;
  refresh: string;
  close: string;
}

export const cricketTranslations: Record<string, CricketTranslations> = {
  en: {
    pageTitle: 'Cricket Matches & Live Scores Management',
    pageSubtitle: 'View real-time scores, search match catalogues, publish to mobile apps, and execute bulk actions',
    syncButton: 'Sync Live Scores',
    syncing: 'Synchronizing...',
    statTotal: 'Total Matches',
    statPublished: 'Published Matches',
    statUnpublished: 'Unpublished Matches',
    statLive: 'Live Matches',
    filterAll: 'All States',
    filterLive: 'Live',
    filterUpcoming: 'Upcoming',
    filterRecent: 'Concluded',
    publishAll: 'All Visibility',
    publishedOnly: 'Published Only',
    unpublishedOnly: 'Unpublished Only',
    searchPlaceholder: 'Search by team, series, or venue...',
    bulkSelected: 'matches selected',
    bulkPublish: 'Publish Selected',
    bulkUnpublish: 'Unpublish Selected',
    bulkDeselect: 'Clear Selection',
    colMatch: 'Match & Series',
    colTeams: 'Teams & Score',
    colFormat: 'Format',
    colState: 'State',
    colStatus: 'Status / Commentary',
    colPublished: 'Publish Status',
    colPublishedAt: 'Published Date',
    colActions: 'Actions',
    scorecard: 'Scorecard',
    quickPublish: 'Publish',
    quickUnpublish: 'Unpublish',
    published: 'Published',
    unpublished: 'Unpublished',
    neverPublished: 'Not Published',
    modalTitle: 'Match Details & Live Scorecard',
    modalSubtitle: 'Real-time score data synced from Cricbuzz poller',
    liveBadge: 'LIVE',
    recentBadge: 'CONCLUDED',
    upcomingBadge: 'UPCOMING',
    batting: 'Batting',
    bowling: 'Bowling',
    batsman: 'Batsman',
    bowler: 'Bowler',
    runs: 'R',
    balls: 'B',
    fours: '4s',
    sixes: '6s',
    sr: 'S/R',
    overs: 'O',
    maidens: 'M',
    wickets: 'W',
    economy: 'Econ',
    partnership: 'Current Partnership',
    crr: 'CRR',
    rrr: 'Req RR',
    target: 'Target',
    recentOvers: 'Recent Overs',
    venue: 'Venue',
    startTime: 'Start Time',
    lastSynced: 'Last Synced',
    publishSwitchLabel: 'Visible on Mobile & Web Apps',
    toastSyncSuccess: 'Live score synchronization completed successfully',
    toastSyncError: 'Failed to synchronize live scores',
    toastPublishSuccess: 'Match published to mobile app successfully',
    toastUnpublishSuccess: 'Match hidden from public mobile app',
    toastStatusError: 'Failed to update match publish status',
    toastBulkSuccess: 'Successfully updated status for matches',
    toastBulkError: 'Bulk update failed',
    noMatchesFound: 'No cricket matches found matching your filters.',
    refresh: 'Refresh',
    close: 'Close',
  },
  te: {
    pageTitle: 'క్రికెట్ మ్యాచ్‌లు & లైవ్ స్కోర్ల నిర్వహణ (Cricket Management)',
    pageSubtitle: 'రియల్-టైమ్ స్కోర్లు, సిరీస్ వివరాలు, మొబైల్ యాప్‌లకు ప్రచురణ మరియు బల్క్ చర్యలు నిర్వహించండి',
    syncButton: 'లైవ్ స్కోర్లు సమకాలీకరించు (Sync)',
    syncing: 'సమకాలీకరిస్తోంది...',
    statTotal: 'మొత్తం మ్యాచ్‌లు',
    statPublished: 'ప్రచురించిన మ్యాచ్‌లు',
    statUnpublished: 'ప్రచురించని మ్యాచ్‌లు',
    statLive: 'లైవ్ మ్యాచ్‌లు',
    filterAll: 'అన్ని మ్యాచ్‌లు',
    filterLive: 'లైవ్',
    filterUpcoming: 'రాబోయేవి',
    filterRecent: 'ముగిసినవి',
    publishAll: 'అన్ని విజిబిలిటీ',
    publishedOnly: 'ప్రచురించినవి మాత్రమే',
    unpublishedOnly: 'దాచినవి మాత్రమే',
    searchPlaceholder: 'జట్టు, సిరీస్ లేదా వేదిక ఆధారంగా శోధించండి...',
    bulkSelected: 'మ్యాచ్‌లు ఎంపిక చేయబడ్డాయి',
    bulkPublish: 'ఎంపిక చేసినవి ప్రచురించు',
    bulkUnpublish: 'ఎంపిక చేసినవి దాచు',
    bulkDeselect: 'ఎంపికను తొలగించు',
    colMatch: 'మ్యాచ్ & సిరీస్',
    colTeams: 'జట్లు & స్కోరు',
    colFormat: 'ఫార్మాట్',
    colState: 'స్థితి',
    colStatus: 'తాజా పరిస్థితి / ఫలితం',
    colPublished: 'ప్రచురణ స్థితి',
    colPublishedAt: 'ప్రచురించిన తేది',
    colActions: 'చర్యలు',
    scorecard: 'స్కోర్‌కార్డ్',
    quickPublish: 'ప్రచురించు',
    quickUnpublish: 'దాచు',
    published: 'ప్రచురించబడింది',
    unpublished: 'ప్రచురించబడలేదు',
    neverPublished: 'ప్రచురించబడలేదు',
    modalTitle: 'మ్యాచ్ వివరాలు & లైవ్ స్కోర్‌కార్డ్',
    modalSubtitle: 'క్రిక్‌బజ్ పోలర్ నుండి రియల్ టైమ్ డేటా సమకాలీకరించబడింది',
    liveBadge: 'లైవ్',
    recentBadge: 'ముగిసింది',
    upcomingBadge: 'రాబోయేది',
    batting: 'బ్యాటింగ్',
    bowling: 'బౌలింగ్',
    batsman: 'బ్యాట్స్‌మన్',
    bowler: 'బౌలర్',
    runs: 'పరుగులు',
    balls: 'బంతులు',
    fours: '4లు',
    sixes: '6లు',
    sr: 'స్ట్రైక్ రేట్',
    overs: 'ఓవర్లు',
    maidens: 'మెయిడెన్లు',
    wickets: 'వికెట్లు',
    economy: 'ఎకానమీ',
    partnership: 'ప్రస్తుత భాగస్వామ్యం',
    crr: 'ప్రస్తుత రన్ రేట్',
    rrr: 'అవసరమైన రన్ రేట్',
    target: 'లక్ష్యం',
    recentOvers: 'ఇటీవలి ఓవర్లు',
    venue: 'వేదిక',
    startTime: 'ప్రారంభ సమయం',
    lastSynced: 'చివరి సమకాలీకరణ',
    publishSwitchLabel: 'మొబైల్ మరియు వెబ్ యాప్‌లలో కనిపిస్తుంది',
    toastSyncSuccess: 'లైవ్ స్కోర్లు విజయవంతంగా సమకాలీకరించబడ్డాయి',
    toastSyncError: 'లైవ్ స్కోర్ల సమకాలీకరణ విఫలమైంది',
    toastPublishSuccess: 'మ్యాచ్ మొబైల్ యాప్‌లో ప్రచురించబడింది',
    toastUnpublishSuccess: 'మ్యాచ్ మొబైల్ యాప్‌లో దాచబడింది',
    toastStatusError: 'మ్యాచ్ ప్రచురణ స్థితి మార్పు విఫలమైంది',
    toastBulkSuccess: 'మ్యాచ్‌ల స్థితి విజయవంతంగా నవీకరించబడింది',
    toastBulkError: 'బల్క్ నవీకరణ విఫలమైంది',
    noMatchesFound: 'మీ శోధనకు తగిన క్రికెట్ మ్యాచ్‌లు కనుగొనబడలేదు.',
    refresh: 'రిఫ్రెష్',
    close: 'మూసివేయి',
  },
  hi: {
    pageTitle: 'क्रिकेट मैच और लाइव स्कोर प्रबंधन (Cricket Management)',
    pageSubtitle: 'रीयल-टाइम स्कोर, मैच कैटलॉग खोजें, मोबाइल ऐप पर प्रकाशित करें और बल्क एक्शन प्रबंधित करें',
    syncButton: 'लाइव स्कोर सिंक करें',
    syncing: 'सिंक हो रहा है...',
    statTotal: 'कुल मैच',
    statPublished: 'प्रकाशित मैच',
    statUnpublished: 'अप्रकाशित मैच',
    statLive: 'लाइव मैच',
    filterAll: 'सभी मैच',
    filterLive: 'लाइव',
    filterUpcoming: 'आगामी',
    filterRecent: 'समाप्त',
    publishAll: 'सभी दृश्यता',
    publishedOnly: 'केवल प्रकाशित',
    unpublishedOnly: 'केवल अप्रकाशित',
    searchPlaceholder: 'टीम, श्रृंखला या स्थल द्वारा खोजें...',
    bulkSelected: 'मैच चयनित',
    bulkPublish: 'चयनित प्रकाशित करें',
    bulkUnpublish: 'चयनित अप्रकाशित करें',
    bulkDeselect: 'चयन रद्द करें',
    colMatch: 'मैच और श्रृंखला',
    colTeams: 'टीमें और स्कोर',
    colFormat: 'प्रारूप',
    colState: 'स्थिति',
    colStatus: 'स्थिति / परिणाम',
    colPublished: 'प्रकाशन स्थिति',
    colPublishedAt: 'प्रकाशन तिथि',
    colActions: 'कार्रवाई',
    scorecard: 'स्कोरकार्ड',
    quickPublish: 'प्रकाशित करें',
    quickUnpublish: 'अप्रकाशित करें',
    published: 'प्रकाशित',
    unpublished: 'अप्रकाशित',
    neverPublished: 'प्रकाशित नहीं',
    modalTitle: 'मैच विवरण और लाइव स्कोरकार्ड',
    modalSubtitle: 'क्रिकबज पोलर से रीयल-टाइम डेटा सिंक किया गया',
    liveBadge: 'लाइव',
    recentBadge: 'समाप्त',
    upcomingBadge: 'आगामी',
    batting: 'बल्लेबाजी',
    bowling: 'गेंदबाजी',
    batsman: 'बल्लेबाज',
    bowler: 'गेंदबाज',
    runs: 'रन',
    balls: 'गेंदें',
    fours: 'चौके',
    sixes: 'छक्के',
    sr: 'स्ट्राइक रेट',
    overs: 'ओवर',
    maidens: 'मैडेन',
    wickets: 'विकेट',
    economy: 'इकोनॉमी',
    partnership: 'वर्तमान साझेदारी',
    crr: 'मौजूदा रन रेट',
    rrr: 'ज़रूरी रन रेट',
    target: 'लक्ष्य',
    recentOvers: 'हालिया ओवर',
    venue: 'स्थान',
    startTime: 'शुरुआत का समय',
    lastSynced: 'अंतिम सिंक',
    publishSwitchLabel: 'मोबाइल और वेब ऐप पर दृश्यमान',
    toastSyncSuccess: 'लाइव स्कोर सफलतापूर्वक सिंक हो गया',
    toastSyncError: 'लाइव स्कोर सिंक करने में विफल',
    toastPublishSuccess: 'मैच मोबाइल ऐप पर प्रकाशित किया गया',
    toastUnpublishSuccess: 'मैच सार्वजनिक मोबाइल ऐप से छिपा दिया गया',
    toastStatusError: 'मैच स्थिति अद्यतन करने में विफल',
    toastBulkSuccess: 'मैचों की स्थिति सफलतापूर्वक अपडेट की गई',
    toastBulkError: 'बल्क अपडेट विफल रहा',
    noMatchesFound: 'कोई मैच नहीं मिला।',
    refresh: 'रिफ्रेश',
    close: 'बंद करें',
  },
  ml: {
    pageTitle: 'ക്രിക്കറ്റ് മത്സരങ്ങളും ലൈവ് സ്കോറുകളും (Cricket Management)',
    pageSubtitle: 'തത്സമയ സ്കോറുകൾ കാണുക, മൊബൈൽ ആപ്പുകളിലേക്ക് പ്രസിദ്ധീകരിക്കുക, ബൾക്ക് പ്രവർത്തനങ്ങൾ കൈകാര്യം ചെയ്യുക',
    syncButton: 'ലൈവ് സ്കോറുകൾ സമന്വയിപ്പിക്കുക',
    syncing: 'സമന്വയിപ്പിക്കുന്നു...',
    statTotal: 'ആകെ മത്സരങ്ങൾ',
    statPublished: 'പ്രസിദ്ധീകരിച്ചവ',
    statUnpublished: 'പ്രസിദ്ധീകരിക്കാത്തവ',
    statLive: 'ലൈവ് മത്സരങ്ങൾ',
    filterAll: 'എല്ലാ അവസ്ഥകളും',
    filterLive: 'ലൈവ്',
    filterUpcoming: 'വരാനിരിക്കുന്നവ',
    filterRecent: 'പൂർത്തിയായവ',
    publishAll: 'എല്ലാം',
    publishedOnly: 'പ്രസിദ്ധീകരിച്ചവ മാത്രം',
    unpublishedOnly: 'പ്രസിദ്ധീകരിക്കാത്തവ മാത്രം',
    searchPlaceholder: 'ടീം, പരമ്പര, സ്റ്റേഡിയം എന്നിവ തിരയുക...',
    bulkSelected: 'മത്സരങ്ങൾ തിരഞ്ഞെടുത്തു',
    bulkPublish: 'തിരഞ്ഞെടുത്തവ പ്രസിദ്ധീകരിക്കുക',
    bulkUnpublish: 'തിരഞ്ഞെടുത്തവ പിൻവലിക്കുക',
    bulkDeselect: 'തിരഞ്ഞെടുപ്പ് ഒഴിവാക്കുക',
    colMatch: 'മത്സരവും പരമ്പരയും',
    colTeams: 'ടീമുകളും സ്കോറും',
    colFormat: 'ഫോർമാറ്റ്',
    colState: 'നില',
    colStatus: 'സ്ഥിതി / ഫലം',
    colPublished: 'പ്രസിദ്ധീകരണ നില',
    colPublishedAt: 'പ്രസിദ്ധീകരിച്ച തീയതി',
    colActions: 'പ്രവർത്തനങ്ങൾ',
    scorecard: 'സ്കോർകാർഡ്',
    quickPublish: 'പ്രസിദ്ധീകരിക്കുക',
    quickUnpublish: 'പിൻവലിക്കുക',
    published: 'പ്രസിദ്ധീകരിച്ചു',
    unpublished: 'പ്രസിദ്ധീകരിച്ചിട്ടില്ല',
    neverPublished: 'പ്രസിദ്ധീകരിച്ചിട്ടില്ല',
    modalTitle: 'മത്സര വിവരങ്ങളും തത്സമയ സ്കോർകാർഡും',
    modalSubtitle: 'തത്സമയ സ്കോറുകൾ ക്രിക്ക്ബസ് പോളർ വഴി ലഭ്യമാക്കുന്നു',
    liveBadge: 'ലൈവ്',
    recentBadge: 'പൂർത്തിയായി',
    upcomingBadge: 'വരാനിരിക്കുന്നത്',
    batting: 'ബാറ്റിംഗ്',
    bowling: 'ബോളിംഗ്',
    batsman: 'ബാറ്റ്സ്മാൻ',
    bowler: 'ബൗളർ',
    runs: 'റൺസ്',
    balls: 'പന്തുകൾ',
    fours: '4കൾ',
    sixes: '6കൾ',
    sr: 'സ്ട്രൈക്ക് റേറ്റ്',
    overs: 'ഓവറുകൾ',
    maidens: 'മെയ്ഡൻ',
    wickets: 'വിക്കറ്റുകൾ',
    economy: 'ഇക്കണോമി',
    partnership: 'പാർട്ണർഷിപ്പ്',
    crr: 'നിലവിലെ റൺ റേറ്റ്',
    rrr: 'ആവശ്യമായ റൺ റേറ്റ്',
    target: 'ലക്ഷ്യം',
    recentOvers: 'അവസാന ഓവറുകൾ',
    venue: 'വേദി',
    startTime: 'ആരംഭ സമയം',
    lastSynced: 'അവസാനം അപ്ഡേറ്റ് ചെയ്തത്',
    publishSwitchLabel: 'മൊബൈൽ/വെബ് ആപ്പുകളിൽ കാണിക്കുക',
    toastSyncSuccess: 'ലൈവ് സ്കോറുകൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു',
    toastSyncError: 'ലൈവ് സ്കോറുകൾ അപ്ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു',
    toastPublishSuccess: 'മത്സരം വിജയകരമായി പ്രസിദ്ധീകരിച്ചു',
    toastUnpublishSuccess: 'മത്സരം ആപ്പിൽ നിന്ന് പിൻവലിച്ചു',
    toastStatusError: 'പ്രസിദ്ധീകരണ നില മാറ്റുന്നതിൽ പരാജയം',
    toastBulkSuccess: 'മത്സരങ്ങളുടെ വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്തു',
    toastBulkError: 'ബൾക്ക് അപ്ഡേറ്റ് പരാജയപ്പെട്ടു',
    noMatchesFound: 'മത്സരങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.',
    refresh: 'പുതുക്കുക',
    close: 'അടയ്ക്കുക',
  },
};
