export const allPlans = ['free', 'starter', 'premium', 'pro', 'enterprise'];

const FREE_TIER_FEATURES = [
  'Single User',
  'Design upto 3 templates',
  'Create a custom segment with up to 3000 contacts',
];

const FREE_TIER_BACKGROUND = '#FFFFFF';

const STARTER_TIER_FEATURES = [
  'Unlimited email templates',
  'Add up to 10,000 contacts totally',
  'Configure custom email address',
  'Option to change sender’s name',
  'Access to upcoming features with no added cost',
];

const STARTER_TIER_BACKGROUND = '#F1F1FF';

const PRO_TIER_FEATURES = [
  'Unlimited email templates',
  'Unlimited contacts',
  'Configure custom email address',
  'Option to change sender’s name',
  'Responsive email preview option',
  'Get HTML output for email templates',
  'Get JSON output for email templates',
  'Email tracking details',
  'Import email templates in JSON',
  'Access to upcoming features with no added cost',
];

const PRO_TIER_BACKGROUND = '#FFF1F1';

const ENTERPRISE_TIER_FEATURES = [
  'Additional feature customisations',
  'Unlimited templates and contacts',
  'Configure custom email address',
  'Option to change sender’s name',
  'Responsive email preview option',
  'Get HTML output for email templates',
  'Get JSON output for email templates',
  'Import email templates in JSON',
  'Deployment on custom domain',
  'Access to upcoming features with no added cost',
];

const ENTERPRISE_TIER_BACKGROUND = '#F1FFF1';

export const planFeaturesMap = new Map<string, string[]>();
export const planColorMap = new Map<string, string>();

planFeaturesMap.set('free', FREE_TIER_FEATURES);
planFeaturesMap.set('starter', STARTER_TIER_FEATURES);
planFeaturesMap.set('pro', PRO_TIER_FEATURES);
planFeaturesMap.set('premium', STARTER_TIER_FEATURES);
planFeaturesMap.set('enterprise', ENTERPRISE_TIER_FEATURES);

planColorMap.set('free', FREE_TIER_BACKGROUND);
planColorMap.set('starter', STARTER_TIER_BACKGROUND);
planColorMap.set('pro', PRO_TIER_BACKGROUND);
planColorMap.set('premium', STARTER_TIER_BACKGROUND);
planColorMap.set('enterprise', ENTERPRISE_TIER_BACKGROUND);

export function filterPlans(currentPlan: string) {
  if (currentPlan === 'free') {
    return allPlans.filter((plan) => plan !== 'free');
  }

  if (currentPlan === 'starter' || currentPlan === 'premium') {
    return allPlans.filter((plan) => plan !== 'free' && plan !== 'starter');
  }

  if (currentPlan === 'pro') {
    return ['enterprise'];
  }

  if (currentPlan === 'enterprise') {
    return [];
  }
}
