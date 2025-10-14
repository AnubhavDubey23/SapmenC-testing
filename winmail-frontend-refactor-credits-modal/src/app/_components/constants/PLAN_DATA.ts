export type TPlan = {
  rzp_planId: string;
  rzp_plan_name: string;
  rzp_description: string;
  button_segment: string;
  price: string;
  features: string[];
  isRecommended: boolean;
};

export const PLANS_DATA: TPlan[] = [
  {
    rzp_planId: '',
    rzp_plan_name: '',
    rzp_description: '',
    button_segment: 'Free Trial',
    features: [
      'Single User',
      'Design up to 3 templates',
      'Create a customer segment with upto 3000 contacts',
    ],
    price: '',
    isRecommended: false,
  },
  {
    rzp_planId: 'plan_PA8gxuXS8RzNxx',
    rzp_plan_name: '',
    rzp_description: '',
    button_segment: 'Starter',
    features: [
      'Unlimited email templates',
      'Add upto 10,000 contacts totally',
      'Configure custom email address',
      "Option to change sender's name",
      'Access to upcoming features with no added cost',
    ],
    price: '₹699',
    isRecommended: false,
  },
  {
    rzp_planId: 'plan_OwCW1VDSI192Lr',
    rzp_plan_name: '',
    rzp_description: '',
    button_segment: 'Pro',
    features: [
      'Unlimited email templates',
      'Unlimited contacts',
      'Configure custom email address',
      "Option to change sender's name",
      'Responsive email preview option',
      'Get HTML output for email templates',
      'Get JSON output for email templates',
      'Email tracking details',
      'Import email templates in JSON',
      'Access to upcoming features with no added cost',
    ],
    price: '₹2,999',
    isRecommended: false,
  },
  {
    rzp_planId: '',
    rzp_plan_name: '',
    rzp_description: '',
    button_segment: 'Enterprise',
    features: [
      'Additional feature customizations',
      'Unlimited email templates and contacts',
      'Configure custom email address',
      "Option to change sender's name",
      'Responsive email preview option',
      'Get HTML output for email templates',
      'Get JSON output for email templates',
      'Email tracking details',
      'Import email templates in JSON',
      'Access to upcoming features with no added cost',
    ],
    price: "Let's talk",
    isRecommended: false,
  },
];
