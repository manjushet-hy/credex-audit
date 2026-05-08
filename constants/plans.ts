import { VendorPricing } from '../types/pricing';

export const cursorPricing: VendorPricing = {
  vendorId: 'cursor',
  vendorName: 'Cursor',
  category: 'coding_assistant',
  supportedUseCases: ['coding'],
  sourceUrl: 'https://cursor.com/pricing',
  plans: [
    {
      id: 'cursor-hobby',
      name: 'Hobby',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'hobbyists', 'evaluators'],
      features: ['Limited Agent requests', 'Limited Tab completions'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'cursor-pro',
      name: 'Pro',
      pricingModel: 'per_seat',
      pricePerUser: 20,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer'],
      features: ['Extended limits on Agent', 'Access to frontier models', 'Cloud agents'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'cursor-pro-plus',
      name: 'Pro+',
      pricingModel: 'per_seat',
      pricePerUser: 60,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['power_user', 'daily_agent_user'],
      features: ['3x usage on all models'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'cursor-ultra',
      name: 'Ultra',
      pricingModel: 'per_seat',
      pricePerUser: 200,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['heavy_power_user', 'ai_researcher'],
      features: ['20x usage on all models', 'Priority access to new features'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'cursor-business',
      name: 'Business',
      pricingModel: 'per_seat',
      pricePerUser: 40,
      billingPeriod: 'monthly',
      targetAudience: 'team',
      isCustomPricing: false,
      recommendedFor: ['startup_team', 'sme', 'agency'],
      features: ['Centralized team billing', 'Shared chats and rules', 'Role-based access control'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: false, // Audit logs are an enterprise feature
      },
    },
    {
      id: 'cursor-enterprise',
      name: 'Enterprise',
      pricingModel: 'custom',
      // pricePerUser is completely omitted here for clean domain modeling
      billingPeriod: 'monthly',
      targetAudience: 'enterprise',
      isCustomPricing: true,
      recommendedFor: ['enterprise', 'high_security_org'],
      features: ['Pooled usage', 'Invoice/PO billing', 'SCIM seat management'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: true, // "AI code tracking API and audit logs"
      },
    },
  ],
  addOns: [
    {
      id: 'cursor-bugbot',
      name: 'Bugbot',
      plans: [
        {
          id: 'bugbot-pro',
          name: 'Pro',
          pricingModel: 'per_seat',
          pricePerUser: 40,
          billingPeriod: 'monthly',
          targetAudience: 'individual',
          isCustomPricing: false,
          features: ['Access to Bugbot rules'],
          usageLimits: {
            type: 'PR Reviews',
            limit: 200,
          },
          securityFlags: {
            hasPrivacyMode: false,
            hasSSO: false,
            hasAuditLogs: false,
          },
        },
        {
          id: 'bugbot-teams',
          name: 'Teams',
          pricingModel: 'per_seat',
          pricePerUser: 40, // Same price as Pro, triggering overlap/upgrade logic
          billingPeriod: 'monthly',
          targetAudience: 'team',
          isCustomPricing: false,
          features: ['Advanced rules and settings', 'Analytics and reporting dashboard'],
          usageLimits: {
            type: 'PR Reviews',
            limit: 'unlimited', // "Code reviews on all PRs"
          },
          securityFlags: {
            hasPrivacyMode: true,
            hasSSO: false,
            hasAuditLogs: false,
          },
        },
      ],
    },
  ],
};

export const chatgptPricing: VendorPricing = {
  vendorId: 'chatgpt',
  vendorName: 'ChatGPT',
  category: 'chat',
  supportedUseCases: ['coding', 'writing', 'data', 'research', 'mixed'],
  sourceUrl: 'https://chatgpt.com/pricing',
  plans: [
    {
      id: 'chatgpt-free',
      name: 'Free',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'casual_users', 'light_tasks'],
      features: ['Basic model access', 'Limited usage'],
      securityFlags: {
        hasPrivacyMode: false, // Training enabled by default
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'chatgpt-plus',
      name: 'Plus',
      pricingModel: 'per_seat',
      pricePerUser: 20,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer', 'power_user'],
      features: ['Early access to new features', 'DALL-E image generation', 'Advanced intelligence'],
      securityFlags: {
        hasPrivacyMode: false, // Training enabled by default
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'chatgpt-pro',
      name: 'Pro',
      pricingModel: 'per_seat',
      pricePerUser: 200,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['researcher', 'heavy_power_user'],
      features: ['Unlimited access to Pro models', 'Highest compute limits'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'chatgpt-business',
      name: 'Team',
      pricingModel: 'per_seat',
      pricePerUser: 30, // Usually  annual,  monthly. Using monthly to match billingPeriod
      billingPeriod: 'monthly',
      targetAudience: 'team',
      isCustomPricing: false,
      minimumSeats: 2, // CRITICAL HEURISTIC
      notes: 'Billed monthly at $30/user. Annual commitment drops price to $25/user/mo.',
      recommendedFor: ['startup_team', 'sme', 'agency'],
      features: ['Collaborative workspace', 'Shared GPTs', 'Admin console'],
      securityFlags: {
        hasPrivacyMode: true, // Data is NOT used for training
        hasSSO: false, // Usually SSO is enterprise, but some basic SAML might exist. Marking false to be safe.
        hasAuditLogs: false,
      },
    },
    {
      id: 'chatgpt-enterprise',
      name: 'Enterprise',
      pricingModel: 'custom',
      billingPeriod: 'monthly',
      targetAudience: 'enterprise',
      isCustomPricing: true,
      recommendedFor: ['enterprise', 'high_security_org'],
      features: ['Unlimited high-speed access', 'Advanced analytics', '24/7 priority support'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: true,
      },
    },
    {
      id: 'openai-api-direct',
      name: 'API Direct',
      pricingModel: 'usage_based',
      billingPeriod: 'usage',
      targetAudience: 'team', // Often used by teams
      isCustomPricing: false,
      recommendedFor: ['developer_team', 'internal_tools', 'product_integration'],
      notes: 'Pay-as-you-go pricing based on exact token usage. Hard to predict exact monthly spend.',
      features: ['Pay-as-you-go tokens', 'No seat minimums'],
      securityFlags: {
        hasPrivacyMode: true, // API data is generally not trained on
        hasSSO: false,
        hasAuditLogs: false,
      },
    }
  ]
};




export const claudePricing: VendorPricing = {
  vendorId: 'claude',
  vendorName: 'Claude (Anthropic)',
  category: 'chat',
  supportedUseCases: ['coding', 'writing', 'data', 'research', 'mixed'],
  sourceUrl: 'https://claude.com/pricing',
  plans: [
    {
      id: 'claude-free',
      name: 'Free',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'casual_users', 'evaluators'],
      features: ['Basic model access', 'Limited usage'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'claude-pro',
      name: 'Pro',
      pricingModel: 'per_seat',
      pricePerUser: 20,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer', 'power_user'],
      features: ['More usage', 'Access to Claude Code', 'Early access to features'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'claude-max',
      name: 'Max',
      pricingModel: 'per_seat',
      pricePerUser: 125, // Based on the "5x or 20x usage" tier inferred from the page
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['researcher', 'heavy_power_user'],
      features: ['5x to 20x more usage than Pro', 'Higher output limits'],
      notes: 'Pricing scales up to $200+ based on 5x/20x multipliers.',
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'claude-team',
      name: 'Team',
      pricingModel: 'per_seat',
      pricePerUser: 25,
      billingPeriod: 'monthly',
      targetAudience: 'team',
      isCustomPricing: false,
      minimumSeats: 5, // Anthropic's standard team minimum
      recommendedFor: ['startup_team', 'sme', 'agency'],
      features: ['Central administration', 'No model training on content', 'SSO'],
      notes: 'Requires a minimum of 5 seats.',
      securityFlags: {
        hasPrivacyMode: true, // "No model training on your content by default"
        hasSSO: true,
        hasAuditLogs: false,
      },
    },
    {
      id: 'claude-enterprise',
      name: 'Enterprise',
      pricingModel: 'custom',
      billingPeriod: 'monthly',
      targetAudience: 'enterprise',
      isCustomPricing: true,
      recommendedFor: ['enterprise', 'high_security_org'],
      features: ['SCIM', 'Audit logs', 'Role-based access'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: true,
      },
    },
    {
      id: 'anthropic-api-direct',
      name: 'API Direct',
      pricingModel: 'usage_based',
      billingPeriod: 'usage',
      targetAudience: 'team',
      isCustomPricing: false,
      recommendedFor: ['developer_team', 'internal_tools', 'product_integration'],
      features: ['Pay-as-you-go tokens', 'No seat minimums'],
      notes: 'Usage-based pricing (per 1M tokens) across Haiku, Sonnet, and Opus.',
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: false,
        hasAuditLogs: false,
      },
    }
  ]
};

export const copilotPricing: VendorPricing = {
  vendorId: 'copilot',
  vendorName: 'GitHub Copilot',
  category: 'coding_assistant',
  supportedUseCases: ['coding'],
  sourceUrl: 'https://github.com/features/copilot/plans',
  plans: [
    {
      id: 'copilot-free',
      name: 'Free',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'casual_users', 'hobbyists'],
      features: ['50 agent requests/mo', '2000 completions/mo', 'IDE integration'],
      notes: 'New free tier with limited completions and chat requests.',
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'copilot-pro',
      name: 'Pro',
      pricingModel: 'per_seat',
      pricePerUser: 10,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer'],
      features: ['Unlimited inline suggestions', '300 premium requests/mo', 'Claude and Codex support'],
      notes: 'Billed monthly at $10. Offers Claude and Codex access.',
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'copilot-business',
      name: 'Business',
      pricingModel: 'per_seat',
      pricePerUser: 19,
      billingPeriod: 'monthly',
      targetAudience: 'team',
      isCustomPricing: false,
      recommendedFor: ['startup_team', 'sme', 'developer_team'],
      features: ['License management', 'Policy management', 'IP indemnity', 'No telemetry training'],
      securityFlags: {
        hasPrivacyMode: true, // "GitHub does not use Business data to train models"
        hasSSO: true,
        hasAuditLogs: false,
      },
    },
    {
      id: 'copilot-enterprise',
      name: 'Enterprise',
      pricingModel: 'per_seat',
      pricePerUser: 39,
      billingPeriod: 'monthly',
      targetAudience: 'enterprise',
      isCustomPricing: false,
      recommendedFor: ['enterprise', 'large_orgs'],
      features: ['Index codebase for deeper context', 'Copilot in GitHub.com', 'Fine-tuned private models'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: true,
      },
    }
  ]
};

export const geminiPricing: VendorPricing = {
  vendorId: 'gemini',
  vendorName: 'Google Gemini',
  category: 'chat',
  supportedUseCases: ['coding', 'writing', 'data', 'research', 'mixed'],
  sourceUrl: 'https://gemini.google/subscriptions',
  plans: [
    {
      id: 'gemini-free',
      name: 'Free',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'casual_users', 'hobbyists'],
      features: ['Gemini Flash', 'Basic image generation', 'Standard workspace features'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'gemini-pro',
      name: 'Google AI Pro',
      pricingModel: 'per_seat',
      pricePerUser: 20, // .99
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer', 'power_user'],
      features: ['Gemini 3.1 Pro', '5 TB Google One storage', 'Gemini in Gmail & Docs', 'Deep Research'],
      notes: 'Bundled with Google One cloud storage ecosystem.',
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'gemini-ultra',
      name: 'Google AI Ultra',
      pricingModel: 'per_seat',
      pricePerUser: 250, // .99
      billingPeriod: 'monthly',
      targetAudience: 'individual', // Marketed heavily as a VIP consumer/prosumer tier
      isCustomPricing: false,
      recommendedFor: ['researcher', 'heavy_power_user', 'video_creator'],
      features: ['30 TB Google One storage', 'Veo 3.1 Video Generation', 'YouTube Premium included', 'Agent Mode'],
      notes: 'Extreme VIP tier. Massive storage and video generation limits.',
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'gemini-api-direct',
      name: 'Google AI Studio / Vertex API',
      pricingModel: 'usage_based',
      billingPeriod: 'usage',
      targetAudience: 'team',
      isCustomPricing: false,
      recommendedFor: ['developer_team', 'internal_tools', 'product_integration'],
      features: ['Pay-as-you-go tokens', 'Enterprise SLA on Vertex', 'No seat minimums'],
      notes: 'Usage-based pricing. Vertex AI provides strict enterprise privacy guarantees.',
      securityFlags: {
        hasPrivacyMode: true, // Vertex AI explicitly does not train on customer data
        hasSSO: true, // Tied to GCP IAM
        hasAuditLogs: true, // GCP Cloud Audit Logs
      },
    }
  ]
};

export const windsurfPricing: VendorPricing = {
  vendorId: 'windsurf',
  vendorName: 'Windsurf',
  category: 'coding_assistant',
  supportedUseCases: ['coding'],
  sourceUrl: 'https://windsurf.com/pricing',
  plans: [
    {
      id: 'windsurf-free',
      name: 'Free',
      pricingModel: 'per_seat',
      pricePerUser: 0,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['students', 'casual_users', 'hobbyists'],
      features: ['Basic AI autocomplete', 'Limited Cascade uses', 'Standard models'],
      securityFlags: {
        hasPrivacyMode: false,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'windsurf-pro',
      name: 'Pro',
      pricingModel: 'per_seat',
      pricePerUser: 20,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['solo_developer', 'freelancer', 'power_user'],
      features: ['Unlimited autocomplete', 'Premium Cascade requests', 'Access to SWE-1.5 / GPT-4o'],
      securityFlags: {
        hasPrivacyMode: true, // Typically Pro tiers allow zero data retention opt-in
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'windsurf-max',
      name: 'Max',
      pricingModel: 'per_seat',
      pricePerUser: 200,
      billingPeriod: 'monthly',
      targetAudience: 'individual',
      isCustomPricing: false,
      recommendedFor: ['researcher', 'heavy_power_user'],
      features: ['10x Premium Cascade requests', 'Priority queue', 'Ultimate limits'],
      notes: 'For extreme power users who max out the  tier.',
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'windsurf-teams',
      name: 'Teams',
      pricingModel: 'per_seat',
      pricePerUser: 40,
      billingPeriod: 'monthly',
      targetAudience: 'team',
      isCustomPricing: false,
      recommendedFor: ['startup_team', 'sme', 'developer_team'],
      features: ['Centralized billing', 'Team policies', 'Enhanced privacy'],
      notes: 'Comparable to Cursor Business ().',
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: false,
        hasAuditLogs: false,
      },
    },
    {
      id: 'windsurf-enterprise',
      name: 'Enterprise',
      pricingModel: 'custom',
      billingPeriod: 'monthly',
      targetAudience: 'enterprise',
      isCustomPricing: true,
      recommendedFor: ['enterprise', 'high_security_org'],
      features: ['SSO/SAML', 'Audit logs', 'Flexible deployments', 'SOC2 Compliance'],
      securityFlags: {
        hasPrivacyMode: true,
        hasSSO: true,
        hasAuditLogs: true,
      },
    }
  ]
};

export const ALL_VENDORS = [
  cursorPricing,
  chatgptPricing,
  claudePricing,
  copilotPricing,
  geminiPricing,
  windsurfPricing,
];
