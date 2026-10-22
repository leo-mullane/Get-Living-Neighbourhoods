/* ==========================================================================
   tweaks.js — the twelve proposed changes to the Elephant Central page.

   One source of truth for the mockup's tweak panel, the on-page notes and
   the overview page. Each tweak:
     id      number shown on the page and in the notes
     key     used in the URL (?t=hero-cta,card-prices) and in data-t attributes
     round   suggested A/B test round (see the overview page)
     effort  cms | hubspot | check | dev
     title, change, why, measure, effortNote
   ========================================================================== */

window.EC_TWEAKS = [
  {
    id: 1, key: 'hero-cta', round: 1, effort: 'check', anchor: 'hero',
    title: 'Give the hero a next step',
    change: 'Add a <strong>See available homes</strong> button and an <strong>Enquire now</strong> button to the hero, and lift the white wash off the photograph.',
    why: 'Today the hero has a heading, a subheading and no button. On a desktop the only action in the first screen is the small Enquire now button in the sticky bar, and on a phone it is the bar at the foot of the screen. Visitors arriving from search or paid campaigns land here with some intent already, and a clear first step in the hero is a common opening test because it is cheap to make and the effect shows up quickly.',
    measure: 'Clicks on the hero buttons; click-through from this page to the Elephant Central listings; enquiry starts.',
    effortNote: 'If the hero block already has optional button fields, as many page-builder heroes do, this is a CMS edit. If it does not, adding them is a small template change. The white wash is a CSS overlay, so reducing or removing it is a small stylesheet change either way.'
  },
  {
    id: 2, key: 'hero-facts', round: 1, effort: 'check', anchor: 'hero',
    title: 'Put price and availability in the first screen',
    change: 'A short line of facts under the subheading: one and two bed homes from £2,550 pcm, eight homes available, furnished, Wi-Fi included.',
    why: 'Price is the first thing most renters filter on, and at the moment it does not appear anywhere on the page; the only way to find it is to click through to Find a home. Showing a from-price early lets visitors qualify themselves before they invest time in the page. That tends to improve the quality of enquiries even where it does not raise the number, which is worth agreeing as a success measure before the test starts.',
    measure: 'Click-through to listings; enquiry rate; bounce rate; enquiry quality as judged by the lettings team.',
    effortNote: 'As a line of text in the subheading or amenity field, a CMS edit, but someone has to update it when prices or availability change. Pulling the figures from the live listings would be template development and is out of scope for now. The figures shown here come from Find a home on 22 October 2026.'
  },
  {
    id: 3, key: 'homes-up', round: 1, effort: 'check', anchor: 'apartments',
    title: 'Move the homes up the page',
    change: 'Move <strong>Apartments to rent at Elephant Central</strong> from two-thirds of the way down the page to directly below the hero.',
    why: 'On a desktop the apartment cards start roughly 4,500 pixels down the page, after the amenities, the views, transport, community and an enquiry block, and on a phone they are further down still. Visitors who came to look at homes have to scroll past most of the page to find any, and some of them will not.',
    measure: 'Clicks on the apartment card buttons; scroll depth; click-through to listings.',
    effortNote: 'If the page is built from reorderable blocks in WordPress, as most of the site appears to be, this is a drag and drop in the CMS. If the template fixes the order, it is a small template change. We cannot tell which from the outside.'
  },
  {
    id: 4, key: 'card-prices', round: 1, effort: 'check', anchor: 'apartments',
    title: 'Prices and availability on the apartment cards',
    change: 'Each card shows a from-price and how many homes are available, and its button says what it does. Where nothing is available, as with three-bed homes today, the card offers to register interest instead.',
    why: 'All three cards currently end in an identical Find a home button with no price and no sign of whether anything is available. The 3 bedrooms card links to a search that returned 0 properties on 22 October, which is a dead end at the point where intent is highest.',
    measure: 'Card button clicks by home size; exits from the listings page; enquiries for three-bed homes.',
    effortNote: 'Card text and button labels are very likely CMS fields. The catch is keeping the figures current by hand; pulling them from the listings automatically would be development. The register interest button can link to the existing enquiry form, with three bedrooms preselected if the HubSpot form accepts a value from the URL.'
  },
  {
    id: 5, key: 'amenities', round: 3, effort: 'check', anchor: 'intro',
    title: 'Lead with the amenities renters weigh most',
    change: 'Show eight amenities, led by the ones renters weigh most, with a link to show all 14.',
    why: 'Fourteen icons of equal weight ask the visitor to do the sorting, and on a phone they stack into a column more than one and a half screens tall. The HomeViews and Rightmove Build to Rent Report 2026 found that listings mentioning 24-hour maintenance, parking and security attracted the most enquiries, so those lead here alongside Wi-Fi and pets.',
    measure: 'Scroll depth past the section; clicks on the sections that follow it.',
    effortNote: 'Reordering and removing icons is a CMS edit. A Show all link needs the component to support collapsing, which may be a small front-end change; the simpler version of this test just shows the eight.'
  },
  {
    id: 6, key: 'enquiry-open', round: 2, effort: 'check', anchor: 'enquire',
    title: 'Show the enquiry form instead of hiding it',
    change: 'The enquiry block follows the homes and views rather than the community carousel, the form is open on arrival, and a line above it says what happens after you send it.',
    why: 'Today the block\'s heading says enquire now and its button opens the form underneath, so a visitor who has already decided to enquire is asked to click once more before they can start. Saying who will reply and roughly when lowers the hesitation at the last step, provided the promise is one the lettings team can keep.',
    measure: 'Form views; form starts; submissions.',
    effortNote: 'Moving the block is a CMS reorder if blocks are reorderable. Whether the accordion can start open may be a block setting or a small front-end change. The reply time shown is a placeholder for Get Living to confirm.'
  },
  {
    id: 7, key: 'form-fields', round: 2, effort: 'hubspot', anchor: 'enquire',
    title: 'Ask for less before the first conversation',
    change: 'Keep the fields the lettings team needs in order to reply, and make the rest optional: preferred contact method, pets, budget, employment status, how they heard about Get Living, and whether they live in the UK. Required fields fall from 13 to 8.',
    why: 'Every required field is a reason to stop, and the current form asks for 13 before anything is arranged. Questions such as employment status help with qualifying, but they can be asked on the first call, by which point the renter has already committed to a conversation.',
    measure: 'Form completion rate (submissions divided by form starts); lead quality as judged by the lettings team.',
    effortNote: 'Required fields are set in HubSpot\'s form editor rather than in WordPress, so this is a marketing team change with no development. It is worth checking first whether any of these fields drive routing, reporting or automation in the CRM.'
  },
  {
    id: 8, key: 'proof', round: 2, effort: 'cms', anchor: 'apartments',
    title: 'Put the residents\' rating where people decide',
    change: 'A line of social proof beside the apartment cards and above the form: residents rate Get Living 4.42 out of 5 on HomeViews, from 1,357 verified reviews.',
    why: 'There are no reviews or ratings anywhere on the page, although Get Living has a strong record on HomeViews. An independent score near a decision point reassures renters who are comparing operators, and it costs nothing to show.',
    measure: 'Enquiry rate; apartment card clicks.',
    effortNote: 'As a line of text, a CMS edit, updated now and again. The figures are Get Living\'s portfolio-wide score as of September 2026. An Elephant Central score would be more persuasive if HomeViews has enough reviews to give one. Embedding HomeViews\' own widget would be a third-party embed, which counts as new development.'
  },
  {
    id: 9, key: 'transport', round: 3, effort: 'cms', anchor: 'transport',
    title: 'Lead the transport section with journey times',
    change: 'Each line of the transport list starts with the time, the section gets a button to the commute calculator, and the calculator moves up to sit directly beneath it.',
    why: 'The commute is one of the first questions anyone asks about a London home, and the page has good answers buried in sentences. Leading with the number makes the list scannable. The calculator currently sits two sections away from the transport copy, between the apartments and Shop and Eat.',
    measure: 'Commute calculator searches; scroll depth.',
    effortNote: 'Rewriting the list is a CMS edit. Moving the calculator depends on block reordering, as with tweak 3.'
  },
  {
    id: 10, key: 'subnav', round: 1, effort: 'check', anchor: 'subnav',
    title: 'Point the sticky bar at the homes',
    change: 'The sticky Elephant Central bar gets a <strong>View homes</strong> button next to Enquire now, and its links follow the new page order with homes first.',
    why: 'The sticky bar is the only element in view all the way down the page, and its only action is to enquire. Plenty of visitors are not ready to enquire but would look at homes, and offering both catches the earlier stage of intent instead of losing it.',
    measure: 'Sticky bar clicks by button; click-through to listings.',
    effortNote: 'Link labels and order are probably a CMS menu or repeater. A second button is likely a small template change.'
  },
  {
    id: 11, key: 'mobile-bar', round: 2, effort: 'dev', anchor: 'mobilebar',
    title: 'Two actions in the mobile bar, and move the chat bubble',
    change: 'On phones the bottom bar swaps the Elephant Central logo for two buttons, <strong>View homes</strong> and <strong>Enquire</strong>, and the chat bubble becomes a small button inside the bar so it no longer sits over the content.',
    why: 'Today the logo takes up half of the bar, which leaves one action, and the chat bubble covers the right-hand edge of the content just above it. On a phone this bar is the main way to act from anywhere on the page.',
    measure: 'Mobile bar taps by button; mobile click-through to listings; chat opens.',
    effortNote: 'A small front-end change to the bar. Most chat providers can hide their floating bubble and open the chat from a button on the page instead, but that needs checking with whichever provider Get Living uses.'
  },
  {
    id: 12, key: 'section-ctas', round: 3, effort: 'check', anchor: 'community',
    title: 'A next step at the end of each section',
    change: 'Sections that end without an action, community and Shop and Eat, finish with a See available homes link, and the page closes with a short enquiry prompt before the building works notice.',
    why: 'Visitors who read to the bottom of a page are among the most interested, and at the moment the last thing they see before the footer is a notice about building works. A closing prompt gives them something to do and stops the page ending on its least encouraging note.',
    measure: 'Clicks on the new links; enquiries started from the lower half of the page.',
    effortNote: 'Where a block has an optional button field, a CMS edit; where it does not, a small template change. The closing prompt reuses the existing enquiry block.'
  }
];

window.EC_EFFORT = {
  cms: { label: 'CMS edit', tip: 'Very likely a content change in WordPress, with no development.' },
  hubspot: { label: 'HubSpot setting', tip: 'A form setting in HubSpot, with no development.' },
  check: { label: 'Check with developers', tip: 'A CMS edit if the component already supports it, otherwise a small template change. We cannot tell which from the outside.' },
  dev: { label: 'Small front-end change', tip: 'Needs a developer, but no new feature.' }
};

window.EC_ROUNDS = {
  1: { title: 'Round 1: get to the homes sooner', summary: 'Layout and calls to action in the top half of the page.' },
  2: { title: 'Round 2: make enquiring easier', summary: 'The form, the reassurance around it and the mobile bar.' },
  3: { title: 'Round 3: tidy the rest of the page', summary: 'Amenities, transport and the ends of sections.' }
};
