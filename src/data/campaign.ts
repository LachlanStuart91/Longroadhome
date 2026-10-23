/**
 * THE LONG ROAD HOME - single source of truth.
 *
 * Every confirmed fact, approved destination and unresolved value lives here so
 * that factual review happens against one short file rather than by reading
 * markup. Nothing in this file may be invented. Anything not yet confirmed is
 * typed as Pending and renders as a visible pending state, never as a guess.
 */

/** A value that is deliberately not yet known. Never render one as a fact. */
export type Pending = { readonly pending: true; readonly note: string };

export const pending = (note: string): Pending => ({ pending: true, note });

export const isPending = <T>(value: T | Pending): value is Pending =>
  typeof value === 'object' && value !== null && 'pending' in value;

/* ---------------------------------------------------------------- campaign */

const planningQualifier = 'Approximately';
const planningMetric = '4,000 km';
const dailyGoalQualifier = 'Goal';
const dailyGoalMetric = '100 km a day';

const startPlace = 'Scarborough Beach';
const startRegion = 'Western Australia';
const finishPlace = 'Redcliffe Beach';
const finishRegion = 'Queensland';

export const campaign = {
  name: 'The Long Road Home',
  participant: 'Lachlan Stuart',
  headline: "I'm running home across Australia.",
  supporting:
    `In March 2027, I'm planning to run from ${startPlace} in ${startRegion} to ${finishPlace}, ${finishRegion}, with a goal of raising $500,000 for Top Blokes Foundation.`,
  startPlace,
  startRegion,
  finishPlace,
  finishRegion,
  /** Composed from the parts above so the two can never drift apart. */
  start: `${startPlace}, ${startRegion}`,
  finish: `${finishPlace}, ${finishRegion}`,
  /**
   * Split into a quiet qualifier and a complete metric so the hero strip can
   * set the qualifier on its own line and keep the metric unbreakable. The
   * full strings below are COMPOSED from these parts, so the two can never
   * drift apart and every other use of them is unchanged.
   */
  planningQualifier,
  planningMetric,
  dailyGoalQualifier,
  dailyGoalMetric,
  planningDistance: `${planningQualifier} ${planningMetric}`,
  dailyGoal: `${dailyGoalQualifier}: ${dailyGoalMetric}`,
  /** Long form is the hero fact label. Short form is the Challenge fact value. */
  schedule: 'No rest days planned',
  noRestDays: 'No rest days',
  plannedStart: '22 March 2027',
  fundraisingTarget: '$500,000',
  beneficiary: 'Top Blokes Foundation',
  /** The route between the confirmed beach locations is still in planning. */
  detailedRoute: pending('Detailed route still in planning. Do not publish.'),
  exactEndpoints: pending(
    'Exact gathering points within Scarborough Beach and Redcliffe Beach are not yet confirmed.',
  ),
} as const;

/* ------------------------------------------------------------------- event */

export const event = {
  /** Completed. The event and archive components are no longer rendered. */
  active: false,
  soldOut: true,
  soldOutHeading: 'The Long Lunch is sold out.',
  soldOutMessage: "Thanks to everyone who's booked a seat.",
  name: 'The Long Road Home Long Lunch',
  date: 'Thursday 22 October 2026',
  dateShort: 'Thu 22 Oct 2026',
  time: '12:30 pm to 4:00 pm',
  timezone: 'Brisbane time',
  venue: 'Felons Barrel Hall, Howard Smith Wharves',
  venueShort: 'Felons Barrel Hall',
  address: '5 Boundary Street, Brisbane City, Queensland 4000',
  includes: 'Two-course meal and beverage package',
  onTheDay: 'Raffle and auction',
  individualPrice: '$250',
  tablePrice: '$1,440',
  tablePriceDetail: '$240 per person',
  invitation:
    "Before the run begins, we're getting together in Brisbane. Two courses, a beverage package, a raffle and an auction, and a room full of people who want to see this happen. Come on your own or bring a table.",
  bookingLabel: 'Book on TryBooking',
  bookingNote: 'Booking opens the TryBooking event page in a new tab.',
  /**
   * Confirmed by Lachlan: ticket sales support preparation for the run, and
   * raffle AND auction proceeds go to Top Blokes Foundation. This wording must
   * never imply that all ticket or all event revenue goes to the charity.
   */
  fundingNote:
    'Ticket sales support preparation for The Long Road Home. Money raised through the raffle and auction on the day goes to Top Blokes Foundation.',
  /**
   * Machine readable forms of the values already shown on the page, for the
   * Event structured data. Queensland does not observe daylight saving, so
   * Brisbane is +10:00 year round and 22 October 2026 is no exception.
   * These must always describe the same event as the visible copy above.
   */
  startISO: '2026-10-22T12:30:00+10:00',
  endISO: '2026-10-22T16:00:00+10:00',
  streetAddress: '5 Boundary Street',
  addressLocality: 'Brisbane City',
  addressRegion: 'Queensland',
  postalCode: '4000',
  addressCountry: 'AU',
} as const;

/* ----------------------------------------------------------- hero copy */

export const hero = {
  connectorActive: 'It starts with lunch in Brisbane on 22 October 2026.',
  connectorArchived: 'Planned start, 22 March 2027.',
  primaryActive: 'Book the Long Lunch',
  secondaryActive: 'Partner With the Campaign',
  primaryArchived: 'Partner With the Campaign',
  secondaryArchived: 'Follow the Journey',
  /**
   * Approved alt text. Location is confirmed as Brisbane and the photograph is
   * owned by Lachlan, so no credit is required. The DATE IS UNKNOWN, so nothing
   * here or in surrounding copy may place the image in time: not recent, not
   * training for the 2027 run, not tied to any dated challenge.
   */
  imageAlt: 'Lachlan Stuart running on a tree lined path in Brisbane.',
} as const;

/* --------------------------------------------------------- video message */

/**
 * Lachlan's piece to camera, supplied by him as a CapCut export and re-encoded
 * for the web. It is self hosted, so no video platform, player script, cookie
 * or third party request is involved, and nothing is requested until a visitor
 * presses play.
 *
 * The duration and the on screen captions are measured from the file itself:
 * 112.76 seconds, with the captions burned into the picture. Nothing here
 * describes what is said beyond the plain subject of the recording.
 */
export const video = {
  eyebrow: 'Watch',
  heading: 'Two minutes from me',
  intro: 'The short version of what I am taking on, and why.',
  /** Verified against the encoded file: 112.76s, captions burned in. */
  helper: '1 minute 53 seconds. Captions are on screen.',
  /** The accessible name for the player itself. */
  label: 'Video: a message from Lachlan Stuart about The Long Road Home',
  /** Shown only if the browser cannot play the file at all. */
  fallback: 'Your browser cannot play this video.',
  fallbackLink: 'Download the video',
  posterAlt: '',
} as const;

/* ------------------------------------------------------- the challenge */

export const challenge = {
  eyebrow: 'The challenge',
  heading: 'Coast to coast, on foot',
  body: [
    `I'll start at ${startPlace} in ${startRegion} and finish at ${finishPlace}, ${finishRegion}. Approximately ${planningMetric}, with a goal of 100 km a day and no rest days planned.`,
    "There will be a support crew and vehicle. The detailed route is still being planned, along with the exact start and finish points, and I won't publish those until they're settled.",
  ],
  /**
   * NO ROUTE ARTWORK. The supplied campaign map is not approved as a route map,
   * so this section is text-first by decision, not by omission. Never draw,
   * derive or substitute a route, publish a town list, or infer a finish date.
   */
} as const;

/* ------------------------------------------------ community challenge */

/**
 * Capable of More is the ongoing community challenge brand. The campaign
 * block is deliberately nested so The Long Road Home can be replaced by a
 * future campaign without rewriting the evergreen participation journey.
 */
export const capableOfMore = {
  name: 'The Capable of More Challenge',
  navLabel: 'Community Challenge',
  tagline: 'Your challenge. Your way. A difference worth making.',
  introduction: "I'm running across Australia. You don't have to.",
  invitation:
    'Pick a walk, run, swim or ride that stretches you, and use it to raise funds for Top Blokes Foundation.',
  participation:
    'Do it on your own, with your mates or with your workplace.',
  personalStatement:
    "Through every challenge I’ve done, I’ve realised I’m capable of more than I thought. Now I want to give other people a way to discover that for themselves.",
  movementTypes: ['Walk', 'Run', 'Swim', 'Ride'],
  participationTypes: ['On your own', 'With your mates', 'With your workplace'],
  stepsHeading: 'How it works',
  steps: [
    {
      title: 'Choose your challenge',
      body: 'Decide what you’ll do and the distance you want to achieve.',
    },
    {
      title: 'Create your fundraising page',
      body: 'Sign up, set your fundraising goal and tell people why you’re getting involved.',
    },
    {
      title: 'Get people behind you',
      body: 'Share your personal fundraising link so friends, family and workmates can support you.',
    },
    {
      title: 'Get moving',
      body: 'Take on your challenge and share your progress along the way.',
    },
  ],
  currentCampaign: {
    eyebrow: 'Where it starts',
    heading: 'The Long Road Home',
    body:
      `In March 2027, I’m running across Australia, from ${startPlace} in ${startRegion} to ${finishPlace} in ${finishRegion}, with the goal of raising ${campaign.fundraisingTarget} for ${campaign.beneficiary}.`,
    invitation: "That’s my challenge. I’m asking you to find yours.",
  },
  impactHeading: 'Do something hard. Help a young man back himself.',
  impact:
    'Your fundraising will support Top Blokes Foundation’s work helping boys and young men build confidence, connection and the skills to navigate life’s challenges.',
  closing: 'That is what makes every kilometre mean something.',
  cta: 'Start my challenge',
  qrLabel: 'Scan to sign up',
  qrAlt: 'QR code to sign up for The Capable of More Challenge.',
  pageTitle: 'The Capable of More Challenge | The Long Road Home',
  pageDescription:
    'Choose a movement goal, create your fundraising page and raise funds for Top Blokes Foundation through The Capable of More Challenge.',
} as const;

/* ---------------------------------------------------------------- why */

/**
 * The opening sentence and its question are held separately so the question can
 * be set as a pull quote without the sentence being written out twice. The words
 * and their order are unchanged: only the typographic treatment differs.
 */
const whyOpening =
  "After 58 marathons in 58 days, I was left with a question I still haven't answered.";
const whyQuestion = 'What am I really capable of?';

export const why = {
  eyebrow: "Why I'm doing it",
  heading: "The question I couldn't put down",
  opening: whyOpening,
  question: whyQuestion,
  /** The paragraphs that follow the opening. body[0] is deliberately absent:
   *  it is composed on the page from `opening` and `question`. */
  body: [
    "I grew up in Toowoomba. Brisbane has been home since 2014. It's where my wife and our young family are and where I've built my business. The run will finish at Redcliffe Beach. That's the reason it's called The Long Road Home.",
    "I've got a son who watches what I do far more than he listens to what I say. I can't ask him to chase what he wants if I'm not chasing mine.",
    "I'm not doing this because I have it all worked out. I don't. What I've learned is that you pick something hard, you show up, you stack small wins, and you lean on the people around you when it gets difficult.",
  ],
  linkLabel: 'More About My Story',
} as const;

/* -------------------------------------------------------- top blokes */

/**
 * Reference material behind the two statistics in the Top Blokes section.
 * Every figure shown on the page is attributed to one of these, and none of
 * them may be paraphrased into a stronger claim than the source makes.
 */
export const references = {
  liftTheLoad: 'https://www.lifttheload.org.au/',
  tenToMen:
    'https://aifs.gov.au/tentomen/insights-report/mental-health-australian-males-depression-suicidality-and-loneliness',
  mja: 'https://www.mja.com.au/journal/2021/214/3/suicide-young-australians-2006-2015-cross-sectional-analysis-national-coronial',
} as const;

/** Crisis support destinations, checked against each service's own page. */
export const support = {
  lifeline: 'https://www.lifeline.org.au/get-help/national-services/lifeline-crisis-support',
  kidsHelpline: 'https://www.kidshelpline.com.au/about/faqs',
} as const;

/**
 * A run of copy that may carry a link. Kept as segments rather than as markup
 * so the sentence stays readable here, the destinations stay in this file, and
 * no HTML can drift into the campaign data.
 */
export type Segment = { readonly text: string; readonly href?: string };

export const topBlokes = {
  eyebrow: 'Top Blokes Foundation',
  heading: 'Where the money goes',
  intro:
    "I came across Top Blokes Foundation after seeing Kieran Foran's work with them online. The more I learned, the more it made sense to me.",
  programHeading: 'What Top Blokes does',
  programBody:
    'Top Blokes Foundation runs long-term mentoring programs for boys and young men aged 10 to 24. Qualified youth workers give them a consistent place to talk, build confidence and learn how to handle the challenges in their lives.',
  evidenceHeading: 'Why this matters',
  /**
   * Two figures, not three. The qualifier is part of the fact: "More than" and
   * "Almost" change what each number means, so neither may be dropped, and
   * neither figure may be restated without it.
   */
  evidence: [
    {
      qualifier: 'More than',
      figure: '2 in 5',
      description: 'young men aged 18 to 24 have recently experienced symptoms of depression.',
    },
    {
      qualifier: 'Almost',
      figure: '3 in 4',
      description: 'young Australians aged 10 to 24 who died by suicide were male.',
    },
  ],
  sourceLine: [
    { text: 'Sources: Top Blokes Foundation, ' },
    { text: 'Lift the Load', href: references.liftTheLoad },
    { text: '; Australian Institute of Family Studies, ' },
    { text: 'Ten to Men Insights', href: references.tenToMen },
    { text: ', 2020; ' },
    { text: 'Medical Journal of Australia', href: references.mja },
    { text: ', 2021, using national coronial data from 2006 to 2015.' },
  ] as readonly Segment[],
  /**
   * Help seeking sits directly beneath the statistics, where someone affected
   * by them actually is, rather than at the foot of the section. Wording for
   * both services was checked against each service's own page.
   */
  supportLine: [
    { text: 'If this content raises anything for you, ' },
    { text: 'Lifeline', href: support.lifeline },
    { text: ' is available 24/7 on ' },
    { text: '13 11 14', href: 'tel:131114' },
    { text: '. ' },
    { text: 'Kids Helpline', href: support.kidsHelpline },
    { text: ' provides free, confidential 24/7 counselling for young people aged 5 to 25 on ' },
    { text: '1800 55 1800', href: 'tel:1800551800' },
    { text: '. If you or someone else is in immediate danger, call ' },
    { text: '000', href: 'tel:000' },
    { text: '.' },
  ] as readonly Segment[],
  /** The section finishes on Lachlan's reason, not on an administrative note. */
  reason:
    "I remember how confusing my teenage years could be, and I didn't always have the right people around me. Now I've got a young boy of my own. That's why I'm supporting Top Blokes.",
  targetLabel: 'Fundraising target',
  aboutLabel: 'About Top Blokes Foundation',
  donateLabel: 'Donate to Top Blokes Foundation',
  /** All donation actions lead directly to the campaign's Raisely homepage. */
  donateNote:
    'Donations made through Raisely go directly to Top Blokes Foundation.',
} as const;

/* -------------------------------------------------------- event archive */

/**
 * Retained for reference only. The completed lunch was removed from the
 * public website on 23 October 2026, without an archive notice.
 */
export const eventArchive = {
  eyebrow: 'Event archive',
  body: 'The Long Road Home Long Lunch was held on Thursday 22 October 2026 at Felons Barrel Hall in Brisbane. Thank you to everyone who came along and supported the campaign.',
  closing: 'The run has a planned start of 22 March 2027.',
} as const;

/* ------------------------------------------------------- shared labels */

export const ui = {
  /** Every outbound ticket action carries this for assistive technology. */
  newTab: 'opens in a new tab',
} as const;

/* --------------------------------------------------------- track record */

export const trackRecord = {
  rowing2022: 'In 2022 I rowed 30 marathon distances in 30 days.',
  running2025:
    'In 2025 I ran 58 marathons in 58 consecutive days, across all 50 United States in winter and all eight Australian states and territories.',
  distance2025: '2,447 km',
  /** Supersedes all earlier amounts. The qualifier "over" is required. */
  raised2025: 'Over $162,000 raised',
  raisedContext: 'Covered on foot, 2025',
  statesOfMind: 'States of Mind',
  statesOfMindContext: 'Book and documentary',
  linkLabel: 'Read the Full Story at States of Mind',
  heading: "What's come before",
  eyebrow: 'Track record',
  year2022: '2022',
  year2025: '2025',
  raisedFor2025: 'Mental Awareness Foundation',
} as const;

/* -------------------------------------------------------- partnership */

export const partnership = {
  eyebrow: 'Partnership',
  heading: 'Partner with the campaign',
  body: [
    "If your business would like to support the run, I'd love to hear from you.",
    'Talk to Jason at Front Office Agency about getting involved.',
  ],
  /** Jason's email is the ONLY sponsorship contact. No phone number, no
   *  packages, no sponsor levels, no deliverables. */
  buttonLabel: 'Email Jason Greenhalgh',
} as const;

/*
 * The Strava copy block that lived here described the Strava invitation in the
 * Follow section. That section is email only now, and the club is reached from
 * a plain text link in the footer, so the copy has no renderer and is removed
 * rather than left to drift. The destination itself is kept in links.strava.
 */

/* ------------------------------------------------------------ destinations */

export const links = {
  tickets: 'https://www.trybooking.com/au/event/1636486',
  topBlokes: 'https://www.topblokes.org.au/',
  statesOfMind: 'https://www.statesofmind.au/',
  lachlanStuart: 'https://www.lachlanstuart.com.au/',
  instagram: 'https://www.instagram.com/lachlanstuart',
  strava: 'https://www.strava.com/clubs/capable-of-more',
  partnerEmail: 'mailto:jason@FrontOfficeAgency.com.au',
  /**
   * The Raisely campaign homepage for The Long Road Home, confirmed by Lachlan
   * on 16 September 2026 as the single external donation destination. Top Blokes
   * Foundation controls that campaign and receives the donor information. Use
   * this URL exactly for every donation action. No donation form is embedded.
   *
   * It REPLACES the earlier direct Raisely form URL, which is retired and must
   * not be reintroduced anywhere on the website.
   */
  fundraising: 'https://the-long-road-home.raiselysite.com/',
  /** Registration for The Capable of More Challenge. */
  challengeSignup: 'https://the-long-road-home.raiselysite.com/signup',
  communityChallenge: '/capable-of-more',
  privacy: '/privacy',
} as const;

export const partner = {
  name: 'Jason Greenhalgh',
  organisation: 'Front Office Agency',
  email: 'jason@FrontOfficeAgency.com.au',
} as const;

/* ------------------------------------------------------------ newsletter */

export const newsletter = {
  promise:
    'Follow the journey with weekly updates, announcements, event invitations and ways to get involved.',
  /** The embed is supplied and sufficient: form q8HCNv, account 2595519. */
  eyebrow: 'Follow the journey',
  heading: 'Join my email list.',
  /** MailerLite renders the fields, button and messages. Nothing here overrides
   *  what the account is configured to show. */
  configuration: pending(
    'MailerLite embed supplied (form q8HCNv, account 2595519). Connection, actual fields, confirmation behaviour and subscriber destination are verified in Stage 7.',
  ),
} as const;

/* --------------------------------------------------------------- privacy */

/**
 * Privacy page content. Approved wording, held here so the page reads from the
 * same single source of truth as everything else. The owner and the contact
 * address are confirmed. Nothing here asserts that the Privacy Act or the
 * Australian Privacy Principles apply, because the business structure and
 * statutory threshold have not been established.
 */
export const privacy = {
  title: 'Privacy | The Long Road Home',
  heading: 'Privacy',
  description:
    'How The Long Road Home handles your information, who else is involved, and how to unsubscribe or ask about your details.',
  updated: 'Last updated 23 October 2026',
  owner: 'Lachlan Stuart',
  contactEmail: 'lachie@themanthatcanproject.com',
  intro:
    'This page explains what happens to your information when you use thelongroadhome.com.au. It is written to be read, not to be waded through.',
  /** Shown beneath the signup form. Must always describe the live form. */
  collectionNotice:
    'Lachlan Stuart collects your name and email address to send you updates, announcements and invitations for The Long Road Home. MailerLite manages the list and will send you a confirmation email. Your subscription starts only after you confirm it. You can unsubscribe at any time using the link in any email. See the',
  collectionNoticeLink: 'Privacy Policy',
  collectionNoticeTail: 'for details.',
} as const;

export const providerPolicies = {
  mailerlite: 'https://www.mailerlite.com/legal/privacy-policy',
  vercel: 'https://vercel.com/legal/privacy-notice',
  trybooking: 'https://www.trybooking.com/info/privacy',
  /**
   * Donations are handled by Top Blokes Foundation on the separate Raisely
   * campaign site, so both of those policies are linked rather than
   * described second hand here.
   */
  topBlokes: 'https://www.topblokes.org.au/privacy-policy/',
  raisely: 'https://www.raisely.com/privacy',
} as const;

/* -------------------------------------------------------------- metadata */

export const meta = {
  /**
   * Search title and description are third person, because they describe the
   * project to someone who has not arrived yet. Everything visible on the page
   * stays in Lachlan's first person voice, deliberately.
   */
  title: "Lachlan Stuart's Run Across Australia | The Long Road Home",
  description:
    `Follow Lachlan Stuart's planned ${planningMetric} run across Australia, starting 22 March 2027, with a $500,000 fundraising goal for Top Blokes Foundation.`,
  siteName: 'The Long Road Home',
  socialTitle: 'The Long Road Home | Lachlan Stuart',
  socialDescription:
    `${startPlace} to ${finishPlace}, ${finishRegion}. Approximately ${planningMetric}, planned start 22 March 2027. Fundraising goal of $500,000 for Top Blokes Foundation.`,
  /**
   * Approved by Lachlan: social card option B, the Deep Terrain Green panel
   * beside the Brisbane photograph. Served from public/ unprocessed so the
   * approved file is published byte for byte. Dimensions are declared because
   * several platforms use them before they have fetched the file.
   */
  socialImage: '/social-card-the-long-road-home.png',
  socialImageType: 'image/png',
  socialImageWidth: '1200',
  socialImageHeight: '630',
  socialImageAlt:
    'The Long Road Home. Lachlan Stuart running on a tree lined path in Brisbane.',
} as const;

/* ------------------------------------------------------- page navigation */

export type NavItem = { readonly label: string; readonly href: string };

export const navigation: readonly NavItem[] = [
  { label: 'The Run', href: '#the-run' },
  { label: 'Capable of More', href: links.communityChallenge },
  { label: 'My Story', href: '#why' },
  { label: 'Top Blokes', href: '#top-blokes' },
  { label: 'Email updates', href: '#follow' },
];

/** Navigation with the event anchor removed, for the post-event state. */
export const navigationAfterEvent: readonly NavItem[] = navigation.filter(
  (item) => item.href !== '#long-lunch',
);

/*
 * Outstanding dependencies are tracked in review/DEPENDENCY-REGISTER.txt only.
 * They are project-management notes and must never be exported for rendering.
 */
